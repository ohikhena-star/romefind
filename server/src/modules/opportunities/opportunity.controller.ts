import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { parseJsonArray, formatOpportunityResponse } from '../../utils/helpers.js';

// GET /api/opportunities
export const getOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      type,
      remoteStatus,
      fundingType,
      experienceLevel,
      featured,
      status,
      limit = '50',
      offset = '0'
    } = req.query;

    const where: any = {};

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

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (status) {
      where.status = String(status).toUpperCase();
    }

    // Exclude rejected opportunities if user is logged in
    const userId = (req as any).user?.id;
    if (userId) {
      const rejected = await prisma.rejectedOpportunity.findMany({
        where: { userId },
        select: { opportunityId: true }
      });
      const rejectedIds = rejected.map(r => r.opportunityId);
      if (rejectedIds.length > 0) {
        where.id = { notIn: rejectedIds };
      }
    }

    const take = parseInt(String(limit), 10) || 50;
    const skip = parseInt(String(offset), 10) || 0;

    const [total, rawOpps] = await Promise.all([
      prisma.opportunity.count({ where }),
      prisma.opportunity.findMany({
        where,
        include: {
          organization: true
        },
        take,
        skip,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Check saved status for user if logged in
    let savedIds = new Set<string>();
    if (userId) {
      const saved = await prisma.savedOpportunity.findMany({
        where: { userId },
        select: { opportunityId: true }
      });
      savedIds = new Set(saved.map(s => s.opportunityId));
    }

    const formatted = rawOpps.map(opp => ({
      ...formatOpportunityResponse(opp),
      isSaved: savedIds.has(opp.id)
    }));

    res.json({
      success: true,
      data: formatted,
      pagination: {
        total,
        limit: take,
        offset: skip,
        hasMore: skip + take < total
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/opportunities/:id
export const getOpportunityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const opp = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
        changeHistory: {
          orderBy: { detectedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    let isSaved = false;
    let isTracked = false;
    let trackedStatus = null;

    if (userId) {
      const [saved, tracked] = await Promise.all([
        prisma.savedOpportunity.findUnique({
          where: { userId_opportunityId: { userId, opportunityId: id } }
        }),
        prisma.trackedApplication.findUnique({
          where: { userId_opportunityId: { userId, opportunityId: id } }
        })
      ]);
      isSaved = !!saved;
      isTracked = !!tracked;
      trackedStatus = tracked?.status || null;

      // Record view signal
      await prisma.behaviourSignal.create({
        data: {
          userId,
          opportunityId: id,
          eventType: 'opportunity_viewed',
          metadata: JSON.stringify({ title: opp.title, type: opp.opportunityType })
        }
      });
    }

    res.json({
      success: true,
      data: {
        ...formatOpportunityResponse(opp),
        isSaved,
        isTracked,
        trackedStatus,
        changeHistory: opp.changeHistory
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/opportunities/:id/related
export const getRelatedOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const target = await prisma.opportunity.findUnique({
      where: { id },
      include: { organization: true }
    });

    if (!target) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const fields = parseJsonArray(target.field);

    // Find opportunities with same type or overlapping fields
    const related = await prisma.opportunity.findMany({
      where: {
        id: { not: id },
        OR: [
          { opportunityType: target.opportunityType },
          { organizationId: target.organizationId }
        ]
      },
      include: { organization: true },
      take: 4
    });

    res.json({
      success: true,
      data: related.map(formatOpportunityResponse)
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/opportunities/:id/save
export const saveOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const saved = await prisma.savedOpportunity.upsert({
      where: { userId_opportunityId: { userId, opportunityId: id } },
      create: { userId, opportunityId: id },
      update: {}
    });

    // Also create or link to tracked applications with SAVED status if not present
    await prisma.trackedApplication.upsert({
      where: { userId_opportunityId: { userId, opportunityId: id } },
      create: {
        userId,
        opportunityId: id,
        status: 'SAVED',
        tasks: {
          create: [
            { label: 'Review eligibility and deadlines', completed: false, order: 1 },
            { label: 'Prepare required application materials', completed: false, order: 2 },
            { label: 'Submit application on official portal', completed: false, order: 3 }
          ]
        }
      },
      update: {}
    });

    // Record behavioral signal
    await prisma.behaviourSignal.create({
      data: {
        userId,
        opportunityId: id,
        eventType: 'opportunity_saved',
        metadata: JSON.stringify({ title: opp.title, type: opp.opportunityType })
      }
    });

    res.json({
      success: true,
      message: 'Opportunity saved successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/opportunities/:id/save
export const unsaveOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await prisma.savedOpportunity.deleteMany({
      where: { userId, opportunityId: id }
    });

    // Record behavioral signal
    await prisma.behaviourSignal.create({
      data: {
        userId,
        opportunityId: id,
        eventType: 'opportunity_unsaved'
      }
    });

    res.json({
      success: true,
      message: 'Opportunity removed from saved list'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/opportunities/:id/reject
export const rejectOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { reason, notes } = req.body;

    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const rejection = await prisma.rejectedOpportunity.upsert({
      where: { userId_opportunityId: { userId, opportunityId: id } },
      create: {
        userId,
        opportunityId: id,
        reason: reason || 'Not interested',
        notes: notes || null
      },
      update: {
        reason: reason || 'Not interested',
        notes: notes || null
      }
    });

    // Record behavioral signal to adjust future personalization
    await prisma.behaviourSignal.create({
      data: {
        userId,
        opportunityId: id,
        eventType: 'opportunity_rejected',
        metadata: JSON.stringify({ reason, title: opp.title, type: opp.opportunityType })
      }
    });

    res.json({
      success: true,
      message: 'Opportunity dismissed and recommendation tuned',
      data: rejection
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/opportunities/:id/report
export const reportOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || null;
    const { id } = req.params;
    const { reason, details } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Report reason is required' });
    }

    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const report = await prisma.opportunityReport.create({
      data: {
        opportunityId: id,
        userId,
        reason,
        details: details || null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reporting. Our verification team has been notified.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/opportunities/:id/advice
export const getOpportunityAdvice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const adviceList = await prisma.communityAdvice.findMany({
      where: { opportunityId: id },
      orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }]
    });

    res.json({
      success: true,
      data: adviceList
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/opportunities/:id/advice
export const addOpportunityAdvice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { authorName, authorRole, outcomeStatus, adviceType, title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const opp = await prisma.opportunity.findUnique({ where: { id } });
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const advice = await prisma.communityAdvice.create({
      data: {
        opportunityId: id,
        userId,
        authorName: authorName || 'Anonymous Applicant',
        authorRole: authorRole || 'Past Applicant',
        outcomeStatus: outcomeStatus || 'Applied',
        adviceType: adviceType || 'General',
        title: String(title).trim(),
        content: String(content).trim(),
        isVerified: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Advice shared with the community successfully!',
      data: advice
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/opportunities/:id/advice/:adviceId
export const deleteOpportunityAdvice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { adviceId } = req.params;

    const advice = await prisma.communityAdvice.findUnique({ where: { id: adviceId } });
    if (!advice) {
      return res.status(404).json({ success: false, message: 'Advice not found' });
    }
    if (advice.userId !== userId) {
      return res.status(403).json({ success: false, message: 'You can only remove your own posts' });
    }

    await prisma.communityAdvice.delete({ where: { id: adviceId } });

    res.json({ success: true, message: 'Your review has been removed.' });
  } catch (error) {
    next(error);
  }
};
