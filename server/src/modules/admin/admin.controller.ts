import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { formatOpportunityResponse } from '../../utils/helpers.js';

// GET /api/admin/metrics
export const getAdminMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers,
      totalOpportunities,
      totalTrackedApplications,
      totalPendingSubmissions,
      recentSignals
    ] = await Promise.all([
      prisma.user.count(),
      prisma.opportunity.count(),
      prisma.trackedApplication.count(),
      prisma.providerSubmission.count({ where: { status: 'PENDING' } }),
      prisma.behaviourSignal.count()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOpportunities,
        totalTrackedApplications,
        totalPendingSubmissions,
        totalBehaviourSignals: recentSignals
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/submissions
export const getPendingSubmissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await prisma.providerSubmission.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const parsed = submissions.map(s => ({
      id: s.id,
      provider: s.user,
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

// POST /api/admin/submissions/:id/approve
export const approveSubmission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.body;

    const submission = await prisma.providerSubmission.findUnique({ where: { id } });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const data = JSON.parse(submission.opportunityData);

    // Pick or create organization
    let orgId = organizationId;
    if (!orgId) {
      const defaultOrg = await prisma.organization.findFirst();
      orgId = defaultOrg?.id;
    }

    const createdOpp = await prisma.opportunity.create({
      data: {
        title: data.title,
        organizationId: orgId,
        opportunityType: data.type || data.opportunityType || 'Fellowship',
        description: data.description || '',
        shortDescription: data.shortDescription || null,
        field: JSON.stringify(data.field || ['Technology']),
        subfields: JSON.stringify(data.subfields || []),
        location: data.location || 'Global',
        country: data.country || 'Global',
        remoteStatus: data.remoteStatus || 'Remote',
        eligibility: JSON.stringify(data.eligibility || []),
        educationRequirements: JSON.stringify(data.educationRequirements || ['Any']),
        experienceRequirements: data.experienceRequirements || 'Intermediate',
        funding: data.funding || null,
        fundingType: data.fundingType || 'Fully-Funded',
        benefits: JSON.stringify(data.benefits || []),
        duration: data.duration || null,
        deadline: data.deadline || null,
        applicationUrl: data.applicationUrl,
        officialSource: data.officialSource || data.applicationUrl,
        sourceName: data.sourceName || 'Provider Submission',
        verificationStatus: 'VERIFIED',
        status: 'OPEN',
        requirements: JSON.stringify(data.requirements || []),
        applicationSteps: JSON.stringify(data.applicationSteps || []),
        tags: JSON.stringify(data.tags || [])
      }
    });

    await prisma.providerSubmission.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewNotes: `Approved and published as opportunity ${createdOpp.id}`
      }
    });

    res.json({
      success: true,
      message: 'Submission approved and published',
      data: createdOpp
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/submissions/:id/reject
export const rejectSubmission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const submission = await prisma.providerSubmission.findUnique({ where: { id } });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const updated = await prisma.providerSubmission.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewNotes: reason || 'Does not meet verification and trust criteria'
      }
    });

    res.json({
      success: true,
      message: 'Submission rejected',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/opportunities/:id
export const updateAdminOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const current = await prisma.opportunity.findUnique({ where: { id } });
    if (!current) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    // Record change history for audit trail
    if (updateData.deadline && updateData.deadline !== current.deadline) {
      await prisma.opportunityChangeHistory.create({
        data: {
          opportunityId: id,
          fieldChanged: 'deadline',
          oldValue: current.deadline,
          newValue: updateData.deadline
        }
      });
    }

    if (updateData.status && updateData.status !== current.status) {
      await prisma.opportunityChangeHistory.create({
        data: {
          opportunityId: id,
          fieldChanged: 'status',
          oldValue: current.status,
          newValue: updateData.status
        }
      });
    }

    const payload: any = { ...updateData };
    if (updateData.field) payload.field = JSON.stringify(updateData.field);
    if (updateData.subfields) payload.subfields = JSON.stringify(updateData.subfields);
    if (updateData.benefits) payload.benefits = JSON.stringify(updateData.benefits);
    if (updateData.eligibility) payload.eligibility = JSON.stringify(updateData.eligibility);
    if (updateData.requirements) payload.requirements = JSON.stringify(updateData.requirements);
    if (updateData.tags) payload.tags = JSON.stringify(updateData.tags);

    const updated = await prisma.opportunity.update({
      where: { id },
      data: payload,
      include: { organization: true }
    });

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      data: formatOpportunityResponse(updated)
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/audit-logs
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const changes = await prisma.opportunityChangeHistory.findMany({
      include: {
        opportunity: {
          select: { id: true, title: true }
        }
      },
      orderBy: { detectedAt: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: changes
    });
  } catch (error) {
    next(error);
  }
};
