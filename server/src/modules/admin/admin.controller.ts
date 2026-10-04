import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { formatOpportunityResponse } from '../../utils/helpers.js';

// Canonical field list mirroring src/utils/constants.ts
const CANONICAL_FIELDS = [
  'Customer Experience', 'Customer Success', 'UX Research',
  'Project Management', 'Operations', 'Business Development', 'Strategy', 'Human Resources',
  'Finance', 'Investment', 'Fintech', 'Venture Capital',
  'Software Engineering', 'Cloud', 'Cybersecurity', 'AI', 'Machine Learning', 'Data Science', 'Engineering',
  'Product Design', 'UX/UI', 'Product Management',
  'Digital Marketing', 'Content Marketing', 'Communications', 'Journalism', 'Media',
  'Climate & Sustainability', 'Clean Energy', 'Life Sciences', 'Biotechnology', 'Environmental Science', 'Agriculture',
  'Public Health', 'Healthcare Administration',
  'Education', 'Teaching', 'Academic Research',
  'Law', 'Human Rights', 'Public Policy', 'Governance', 'International Relations', 'Social Impact',
  'Entrepreneurship', 'Startups', 'Innovation',
];

// ─── Existing Handlers (preserved) ───────────────────────────────────────────

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

    res.json({ success: true, data: parsed });
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

    res.json({ success: true, message: 'Submission approved and published', data: createdOpp });
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

    res.json({ success: true, message: 'Submission rejected', data: updated });
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

    if (updateData.deadline && updateData.deadline !== current.deadline) {
      await prisma.opportunityChangeHistory.create({
        data: { opportunityId: id, fieldChanged: 'deadline', oldValue: current.deadline, newValue: updateData.deadline }
      });
    }

    if (updateData.status && updateData.status !== current.status) {
      await prisma.opportunityChangeHistory.create({
        data: { opportunityId: id, fieldChanged: 'status', oldValue: current.status, newValue: updateData.status }
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

    res.json({ success: true, message: 'Opportunity updated successfully', data: formatOpportunityResponse(updated) });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/audit-logs
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const changes = await prisma.opportunityChangeHistory.findMany({
      include: { opportunity: { select: { id: true, title: true } } },
      orderBy: { detectedAt: 'desc' },
      take: 50
    });

    res.json({ success: true, data: changes });
  } catch (error) {
    next(error);
  }
};

// ─── New Admin Dashboard Endpoints ───────────────────────────────────────────

// GET /api/admin/overview
export const getAdminOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const todayStr = now.toISOString().split('T')[0];
    const in14DaysStr = fourteenDaysFromNow.toISOString().split('T')[0];

    const [
      totalUsers,
      newUsersLast7Days,
      newUsersLast30Days,
      onboardedUsers,
      totalOpportunities,
      activeOpportunities,
      expiredOpportunities,
      needsReviewOpportunities,
      pendingVerification,
      totalSaves,
      totalTracked,
      submittedApplications,
      acceptedApplications,
      totalCommunityAdvice,
      pendingReports,
      behaviourSignalCount,
      pendingSubmissions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { onboardingCompleted: true } }),
      prisma.opportunity.count(),
      prisma.opportunity.count({ where: { status: 'OPEN' } }),
      prisma.opportunity.count({ where: { status: 'EXPIRED' } }),
      prisma.opportunity.count({ where: { verificationStatus: 'NEEDS_REVIEW' } }),
      prisma.opportunity.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.savedOpportunity.count(),
      prisma.trackedApplication.count(),
      prisma.trackedApplication.count({ where: { status: 'SUBMITTED' } }),
      prisma.trackedApplication.count({ where: { status: 'ACCEPTED' } }),
      prisma.communityAdvice.count(),
      prisma.opportunityReport.count({ where: { status: 'PENDING' } }),
      prisma.behaviourSignal.count(),
      prisma.providerSubmission.count({ where: { status: 'PENDING' } }),
    ]);

    // Expiring in 14 days: status OPEN and deadline between today and 14 days from now
    const expiringIn14Days = await prisma.opportunity.count({
      where: {
        status: 'OPEN',
        deadline: { not: null, gte: todayStr, lte: in14DaysStr }
      }
    });

    const onboardingRate = totalUsers > 0 ? Math.round((onboardedUsers / totalUsers) * 100) : 0;

    res.json({
      success: true,
      data: {
        users: { totalUsers, newUsersLast7Days, newUsersLast30Days, onboardedUsers, onboardingRate },
        opportunities: { totalOpportunities, activeOpportunities, expiredOpportunities, expiringIn14Days, needsReviewOpportunities, pendingVerification },
        engagement: { totalSaves, totalTracked, submittedApplications, acceptedApplications, totalCommunityAdvice, pendingReports, pendingSubmissions },
        instrumentation: {
          behaviourSignalCount,
          eventTrackingActive: false,
          note: 'BehaviourSignal.create() is not called anywhere in the current server codebase. Views, searches, CTR, view→save rate, and active-user metrics require server-side event instrumentation before they can be displayed.'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search = '', page = '1', limit = '20', onboarded, role } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (onboarded === 'true') where.onboardingCompleted = true;
    if (onboarded === 'false') where.onboardingCompleted = false;
    if (role) where.role = role;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          onboardingCompleted: true,
          createdAt: true,
          updatedAt: true,
          profile: {
            select: {
              completeness: true,
              currentStatus: true,
              experienceLevel: true,
              interests: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      })
    ]);

    const formatted = users.map(u => {
      let interests: string[] = [];
      try { interests = u.profile?.interests ? JSON.parse(u.profile.interests) : []; } catch {}
      return {
        ...u,
        profile: u.profile ? { ...u.profile, interests } : null
      };
    });

    res.json({
      success: true,
      data: formatted,
      pagination: { total, page: pageNum, limit: limitNum, hasMore: offset + limitNum < total }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/opportunities
export const getAdminOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search = '', page = '1', limit = '20', status, type, verificationStatus } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { organization: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status) where.status = status;
    if (type) where.opportunityType = type;
    if (verificationStatus) where.verificationStatus = verificationStatus;

    const [total, opportunities] = await Promise.all([
      prisma.opportunity.count({ where }),
      prisma.opportunity.findMany({
        where,
        select: {
          id: true,
          title: true,
          opportunityType: true,
          field: true,
          location: true,
          deadline: true,
          status: true,
          verificationStatus: true,
          isFeatured: true,
          applicationUrl: true,
          createdAt: true,
          updatedAt: true,
          organization: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      })
    ]);

    const formatted = opportunities.map(o => {
      let fields: string[] = [];
      try { fields = JSON.parse(o.field || '[]'); } catch {}
      return {
        ...o,
        field: fields,
        missingUrl: !o.applicationUrl,
        missingDeadline: !o.deadline,
        missingField: fields.length === 0,
      };
    });

    res.json({
      success: true,
      data: formatted,
      pagination: { total, page: pageNum, limit: limitNum, hasMore: offset + limitNum < total }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/opportunities/quality
export const getOpportunityQuality = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [missingUrl, missingDeadline, needsReview, expiredStillOpen] = await Promise.all([
      prisma.opportunity.findMany({
        where: { applicationUrl: '' },
        select: { id: true, title: true, status: true, verificationStatus: true }
      }),
      prisma.opportunity.findMany({
        where: { deadline: null },
        select: { id: true, title: true, status: true, verificationStatus: true }
      }),
      prisma.opportunity.findMany({
        where: { verificationStatus: 'NEEDS_REVIEW' },
        select: { id: true, title: true, status: true, deadline: true }
      }),
      prisma.opportunity.findMany({
        where: { status: 'OPEN', deadline: { not: null, lt: today } },
        select: { id: true, title: true, deadline: true, status: true }
      }),
    ]);

    // Missing field: field column is '[]' or empty
    const allOpps = await prisma.opportunity.findMany({ select: { id: true, title: true, field: true, status: true } });
    const missingField = allOpps.filter(o => {
      try { return JSON.parse(o.field || '[]').length === 0; } catch { return true; }
    });

    // Unique opportunity IDs across all issues
    const allIssueIds = new Set([
      ...missingUrl.map(o => o.id),
      ...missingDeadline.map(o => o.id),
      ...missingField.map(o => o.id),
      ...expiredStillOpen.map(o => o.id),
      ...needsReview.map(o => o.id),
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          total: allIssueIds.size,
          missingUrl: missingUrl.length,
          missingDeadline: missingDeadline.length,
          missingField: missingField.length,
          expiredStillOpen: expiredStillOpen.length,
          needsReview: needsReview.length,
        },
        missingUrl,
        missingDeadline,
        missingField,
        expiredStillOpen,
        needsReview,
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/fields
export const getAdminFields = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allOpps = await prisma.opportunity.findMany({
      select: { id: true, field: true, status: true, opportunityType: true }
    });

    const fieldResults = await Promise.all(CANONICAL_FIELDS.map(async (fieldName) => {
      // Match opportunities that contain this field name in their JSON array
      const matching = allOpps.filter(o => {
        try {
          const fields: string[] = JSON.parse(o.field || '[]');
          return fields.includes(fieldName);
        } catch { return false; }
      });

      const totalCount = matching.length;
      const activeCount = matching.filter(o => o.status === 'OPEN').length;
      const types = [...new Set(matching.map(o => o.opportunityType))];

      // Saves count for this field
      const saves = await prisma.savedOpportunity.count({
        where: { opportunity: { field: { contains: fieldName } } }
      });

      let coverage: 'Healthy' | 'Limited' | 'Very Limited' | 'Zero';
      if (activeCount >= 3) coverage = 'Healthy';
      else if (activeCount >= 1) coverage = 'Limited';
      else if (totalCount > 0) coverage = 'Very Limited';
      else coverage = 'Zero';

      return { fieldName, totalCount, activeCount, saves, types, coverage };
    }));

    // Sort: Zero first, then Very Limited, Limited, Healthy
    const order = { Zero: 0, 'Very Limited': 1, Limited: 2, Healthy: 3 };
    fieldResults.sort((a, b) => order[a.coverage] - order[b.coverage]);

    res.json({ success: true, data: fieldResults });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/analytics
export const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalSaves,
      savesLast7Days,
      savesLast30Days,
      totalTracked,
      trackedLast7Days,
      trackedLast30Days,
      totalTasks,
      completedTasks,
      applicationStatuses,
      adviceByOutcome,
      reportsByReason,
    ] = await Promise.all([
      prisma.savedOpportunity.count(),
      prisma.savedOpportunity.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.savedOpportunity.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.trackedApplication.count(),
      prisma.trackedApplication.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.trackedApplication.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.applicationTask.count(),
      prisma.applicationTask.count({ where: { completed: true } }),
      prisma.trackedApplication.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.communityAdvice.groupBy({ by: ['outcomeStatus'], _count: { id: true } }),
      prisma.opportunityReport.groupBy({ by: ['reason'], _count: { id: true } }),
    ]);

    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : null;

    const statusMap = Object.fromEntries(
      applicationStatuses.map(s => [s.status, s._count.id])
    );

    const adviceMap = Object.fromEntries(
      adviceByOutcome.map(a => [a.outcomeStatus ?? 'Unknown', a._count.id])
    );

    const reportMap = Object.fromEntries(
      reportsByReason.map(r => [r.reason, r._count.id])
    );

    res.json({
      success: true,
      data: {
        saves: { total: totalSaves, last7Days: savesLast7Days, last30Days: savesLast30Days },
        tracked: { total: totalTracked, last7Days: trackedLast7Days, last30Days: trackedLast30Days },
        applicationsByStatus: statusMap,
        tasks: { total: totalTasks, completed: completedTasks, completionRate: taskCompletionRate },
        communityAdviceByOutcome: adviceMap,
        reportsByReason: reportMap,
        // Not available — no event instrumentation
        unavailable: {
          views: null,
          searches: null,
          ctaClickThroughRate: null,
          viewToSaveRate: null,
          viewToTrackRate: null,
          activeUsers: null,
          note: 'These metrics require BehaviourSignal event instrumentation, which is not currently active.'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reviews
export const getAdminReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', search = '' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { authorName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, reviews] = await Promise.all([
      prisma.communityAdvice.count({ where }),
      prisma.communityAdvice.findMany({
        where,
        include: {
          opportunity: { select: { id: true, title: true } },
          user: { select: { id: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      })
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: { total, page: pageNum, limit: limitNum, hasMore: offset + limitNum < total }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reports
export const getAdminReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', status } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;

    const [total, reports] = await Promise.all([
      prisma.opportunityReport.count({ where }),
      prisma.opportunityReport.findMany({
        where,
        include: {
          opportunity: { select: { id: true, title: true } },
          user: { select: { id: true, email: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limitNum,
      })
    ]);

    res.json({
      success: true,
      data: reports,
      pagination: { total, page: pageNum, limit: limitNum, hasMore: offset + limitNum < total }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/reports/:id
export const updateReportStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['REVIEWED', 'RESOLVED', 'DISMISSED'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowed.join(', ')}` });
    }

    const report = await prisma.opportunityReport.findUnique({ where: { id } });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const updated = await prisma.opportunityReport.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/system-health
export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let dbStatus: { status: string; message: string } = { status: 'ok', message: 'Connected' };
    let dbUserCount = 0;

    try {
      dbUserCount = await prisma.user.count();
    } catch (dbErr: any) {
      dbStatus = { status: 'error', message: dbErr?.message || 'Database connection failed' };
    }

    const [activeOpps, expiredOpps, needsReviewOpps, behaviourSignalCount] = await Promise.all([
      prisma.opportunity.count({ where: { status: 'OPEN' } }).catch(() => -1),
      prisma.opportunity.count({ where: { status: 'EXPIRED' } }).catch(() => -1),
      prisma.opportunity.count({ where: { verificationStatus: 'NEEDS_REVIEW' } }).catch(() => -1),
      prisma.behaviourSignal.count().catch(() => 0),
    ]);

    res.json({
      success: true,
      data: {
        api: { status: 'ok', timestamp: new Date().toISOString() },
        database: dbStatus,
        opportunities: { active: activeOpps, expired: expiredOpps, needsReview: needsReviewOpps },
        eventInstrumentation: {
          status: 'not_active',
          behaviourSignalCount,
          note: 'BehaviourSignal.create() is not called anywhere in the server codebase. Event tracking must be implemented before analytics can populate.'
        },
        version: '1.0.0'
      }
    });
  } catch (error) {
    next(error);
  }
};
