import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { parseJsonArray } from '../../utils/helpers.js';

// GET /api/learning
export const getLearningResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { skill, free, type } = req.query;

    const resources = await prisma.learningResource.findMany({
      orderBy: { createdAt: 'desc' }
    });

    let filtered = resources.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      provider: r.provider,
      url: r.url,
      topic: r.topic,
      skills: parseJsonArray(r.skills),
      difficulty: r.difficulty,
      duration: r.duration,
      free: r.free,
      relatedOpportunityTypes: parseJsonArray(r.relatedOpportunityTypes),
      source: r.source
    }));

    if (free === 'true') {
      filtered = filtered.filter(r => r.free);
    }

    if (skill) {
      const skillStr = String(skill).toLowerCase();
      filtered = filtered.filter(r => r.skills.some(s => s.toLowerCase().includes(skillStr)));
    }

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/learning/recommendations
export const getLearningRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    let userInterests: string[] = [];
    let userSkills: string[] = [];

    if (userId) {
      const profile = await prisma.profile.findUnique({ where: { userId } });
      if (profile) {
        userInterests = parseJsonArray(profile.interests).map(i => i.toLowerCase());
        userSkills = parseJsonArray(profile.skills).map(s => s.toLowerCase());
      }
    }

    const resources = await prisma.learningResource.findMany();
    const formatted = resources.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      provider: r.provider,
      url: r.url,
      skills: parseJsonArray(r.skills),
      duration: r.duration,
      free: r.free,
      relatedOpportunityTypes: parseJsonArray(r.relatedOpportunityTypes)
    }));

    // Score learning resources based on match with user's skills and interests
    const scored = formatted.map(r => {
      let score = 50;
      const reasons: string[] = [];

      const skillMatch = r.skills.some(s => userSkills.includes(s.toLowerCase()));
      if (skillMatch) {
        score += 25;
        reasons.push('Builds directly on your current skill set');
      }

      const interestMatch = r.skills.some(s => userInterests.some(i => i.includes(s.toLowerCase()) || s.toLowerCase().includes(i)));
      if (interestMatch) {
        score += 20;
        reasons.push('Aligned with your career interests');
      }

      if (r.free) {
        score += 10;
        reasons.push('Free high-quality certification course');
      }

      return {
        resource: r,
        score: Math.min(99, score),
        relevanceReasons: reasons.length > 0 ? reasons : ['Recommended for high-impact application preparation']
      };
    });

    scored.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      data: scored
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/learning/progress
export const getUserLearningProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    const progress = await prisma.userLearningProgress.findMany({
      where: { userId },
      include: { resource: true },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/learning/progress
export const updateUserLearningProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { resourceId, status, notes } = req.body;

    if (!resourceId) {
      return res.status(400).json({ success: false, message: 'resourceId is required' });
    }

    const validStatuses = ['WANT_TO_LEARN', 'LEARNING', 'COMPLETED'];
    const normalizedStatus = String(status || 'WANT_TO_LEARN').toUpperCase();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const record = await prisma.userLearningProgress.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      create: {
        userId,
        resourceId,
        status: normalizedStatus,
        notes: notes || null
      },
      update: {
        status: normalizedStatus,
        notes: notes !== undefined ? notes : undefined
      },
      include: { resource: true }
    });

    // Record behavioral signal
    await prisma.behaviourSignal.create({
      data: {
        userId,
        eventType: normalizedStatus === 'COMPLETED' ? 'learning_completed' : 'learning_started',
        metadata: JSON.stringify({ resourceId, status: normalizedStatus })
      }
    }).catch(() => {});

    res.json({
      success: true,
      message: 'Learning progress updated',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

