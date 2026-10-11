require('dotenv').config({ path: 'server/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testOverview() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().split('T')[0];
  const in14DaysStr = fourteenDaysFromNow.toISOString().split('T')[0];

  try {
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

    const expiringIn14Days = await prisma.opportunity.count({
      where: {
        status: 'OPEN',
        deadline: { not: null, gte: todayStr, lte: in14DaysStr }
      }
    });

    console.log('Admin Overview Queries SUCCESS:', {
      totalUsers,
      totalOpportunities,
      activeOpportunities,
      expiringIn14Days,
      totalSaves,
      totalTracked
    });
  } catch (err) {
    console.error('Admin Overview Queries FAILED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testOverview();
