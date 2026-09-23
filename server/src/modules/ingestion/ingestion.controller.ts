import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

// POST /api/ingestion/submit
export const submitOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const opportunityData = req.body;

    if (!opportunityData.title || !opportunityData.applicationUrl) {
      return res.status(400).json({
        success: false,
        message: 'Title and applicationUrl are required'
      });
    }

    // Deduplication check: check if an opportunity with similar title & url exists
    const existing = await prisma.opportunity.findFirst({
      where: {
        OR: [
          { applicationUrl: opportunityData.applicationUrl },
          { title: { equals: opportunityData.title } }
        ]
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An opportunity with this title or application URL is already listed or in review.'
      });
    }

    const submission = await prisma.providerSubmission.create({
      data: {
        providerUserId: userId,
        opportunityData: JSON.stringify(opportunityData),
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity submitted for review. Our curation team will verify and publish it within 48 hours.',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/ingestion/my-submissions
export const getMySubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    const submissions = await prisma.providerSubmission.findMany({
      where: { providerUserId: userId },
      orderBy: { createdAt: 'desc' }
    });

    const parsed = submissions.map(s => ({
      id: s.id,
      status: s.status,
      reviewNotes: s.reviewNotes,
      createdAt: s.createdAt,
      opportunityData: JSON.parse(s.opportunityData)
    }));

    res.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    next(error);
  }
};
