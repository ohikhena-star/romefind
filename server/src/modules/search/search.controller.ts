import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { RecommendationEngine } from '../recommendations/recommendation.service.js';
import { formatOpportunityResponse } from '../../utils/helpers.js';

// GET /api/search
export const searchOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      q,
      type,
      location,
      remoteStatus,
      fundingType,
      experienceLevel,
      educationLevel,
      sortBy = 'relevance',
      limit = '30',
      offset = '0'
    } = req.query;

    const queryStr = q ? String(q).trim().toLowerCase() : '';
    const userId = (req as any).user?.id;

    // Get user profile if authenticated for personalized scoring
    let userProfile = null;
    let savedIds = new Set<string>();
    let rejectedIds: string[] = [];

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          savedOpportunities: { select: { opportunityId: true } },
          rejectedOpportunities: { select: { opportunityId: true } }
        }
      });
      userProfile = user?.profile;
      savedIds = new Set(user?.savedOpportunities.map(s => s.opportunityId) || []);
      rejectedIds = user?.rejectedOpportunities.map(r => r.opportunityId) || [];

      // Record search behavioral signal if query provided
      if (queryStr) {
        await prisma.behaviourSignal.create({
          data: {
            userId,
            eventType: 'search_performed',
            metadata: JSON.stringify({ query: queryStr, filters: req.query })
          }
        });
      }
    }

    const where: any = {
      status: 'OPEN'
    };

    if (rejectedIds.length > 0) {
      where.id = { notIn: rejectedIds };
    }

    if (type) {
      const types = Array.isArray(type) ? type : [type];
      where.opportunityType = { in: types };
    }

    if (remoteStatus) {
      const statuses = Array.isArray(remoteStatus) ? remoteStatus : [remoteStatus];
      where.remoteStatus = { in: statuses };
    }

    if (fundingType) {
      const fundings = Array.isArray(fundingType) ? fundingType : [fundingType];
      where.fundingType = { in: fundings };
    }

    if (experienceLevel) {
      where.experienceRequirements = String(experienceLevel);
    }

    const rawOpps = await prisma.opportunity.findMany({
      where,
      include: { organization: true }
    });

    // In-memory filter for text match if query string exists
    let filtered = rawOpps;
    if (queryStr) {
      filtered = rawOpps.filter(opp => {
        const titleMatch = opp.title.toLowerCase().includes(queryStr);
        const orgMatch = opp.organization.name.toLowerCase().includes(queryStr);
        const descMatch = opp.description.toLowerCase().includes(queryStr);
        const tagsMatch = opp.tags.toLowerCase().includes(queryStr);
        const fieldMatch = opp.field.toLowerCase().includes(queryStr);
        const locationMatch = opp.location.toLowerCase().includes(queryStr);
        return titleMatch || orgMatch || descMatch || tagsMatch || fieldMatch || locationMatch;
      });
    }

    if (location) {
      const locStr = String(location).toLowerCase();
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(locStr) || 
        (opp.country && opp.country.toLowerCase().includes(locStr))
      );
    }

    // Score results
    const scoredResults = filtered.map(opp => {
      const { score, reasons } = RecommendationEngine.calculateRelevance(userProfile, opp);
      return {
        opportunity: {
          ...formatOpportunityResponse(opp),
          isSaved: savedIds.has(opp.id)
        },
        relevanceScore: score,
        relevanceReasons: reasons
      };
    });

    // Sort results
    if (sortBy === 'deadline') {
      scoredResults.sort((a, b) => {
        if (!a.opportunity.deadline) return 1;
        if (!b.opportunity.deadline) return -1;
        return new Date(a.opportunity.deadline).getTime() - new Date(b.opportunity.deadline).getTime();
      });
    } else if (sortBy === 'newest') {
      scoredResults.sort((a, b) => new Date(b.opportunity.createdAt).getTime() - new Date(a.opportunity.createdAt).getTime());
    } else {
      // Default: relevance score descending
      scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    const take = parseInt(String(limit), 10) || 30;
    const skip = parseInt(String(offset), 10) || 0;
    const paginated = scoredResults.slice(skip, skip + take);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total: scoredResults.length,
        limit: take,
        offset: skip,
        hasMore: skip + take < scoredResults.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/search/suggestions
export const getSearchSuggestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    if (!q || String(q).trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const queryStr = String(q).trim().toLowerCase();

    const [opps, orgs] = await Promise.all([
      prisma.opportunity.findMany({
        where: {
          OR: [
            { title: { contains: queryStr } },
            { field: { contains: queryStr } },
            { tags: { contains: queryStr } }
          ]
        },
        select: { id: true, title: true, opportunityType: true },
        take: 5
      }),
      prisma.organization.findMany({
        where: { name: { contains: queryStr } },
        select: { id: true, name: true },
        take: 3
      })
    ]);

    const suggestions = [
      ...opps.map(o => ({ type: 'opportunity', id: o.id, title: o.title, subtitle: o.opportunityType })),
      ...orgs.map(org => ({ type: 'organization', id: org.id, title: org.name, subtitle: 'Organization' }))
    ];

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
};
