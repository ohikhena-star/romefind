import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

type DateRange = '7d' | '30d' | '90d' | 'all';

function getDateRangeFilter(range: DateRange): Date | null {
  const now = new Date();
  switch (range) {
    case '7d':  return new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:    return null;
  }
}

// GET /api/admin/analytics/share?range=7d|30d|90d|all
export const getShareAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const range = (['7d', '30d', '90d', 'all'].includes(req.query.range as string)
      ? req.query.range as DateRange
      : '30d');

    const since = getDateRangeFilter(range);
    const dateFilter = since ? { createdAt: { gte: since } } : {};

    const EVENT_TYPES = ['share_action', 'shared_link_visit', 'application_link_clicked'];

    // Overall totals by event type
    const [totalShares, totalVisits, totalAppClicks] = await Promise.all([
      prisma.behaviourSignal.count({ where: { eventType: 'share_action', ...dateFilter } }),
      prisma.behaviourSignal.count({ where: { eventType: 'shared_link_visit', ...dateFilter } }),
      prisma.behaviourSignal.count({ where: { eventType: 'application_link_clicked', ...dateFilter } }),
    ]);

    // Shares broken down by method (metadata.shareMethod)
    const shareEvents = await prisma.behaviourSignal.findMany({
      where: { eventType: 'share_action', opportunityId: { not: null }, ...dateFilter },
      select: { opportunityId: true, metadata: true }
    });

    const sharesByMethod: Record<string, number> = {};
    for (const ev of shareEvents) {
      try {
        const meta = JSON.parse(ev.metadata ?? '{}');
        const method = meta.shareMethod ?? 'unknown';
        sharesByMethod[method] = (sharesByMethod[method] ?? 0) + 1;
      } catch { /* ignore malformed metadata */ }
    }

    // Top 10 most-shared opportunities
    const sharesByOpportunity = await prisma.behaviourSignal.groupBy({
      by: ['opportunityId'],
      where: { eventType: 'share_action', opportunityId: { not: null }, ...dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    // Top 10 most app-link-clicked opportunities
    const clicksByOpportunity = await prisma.behaviourSignal.groupBy({
      by: ['opportunityId'],
      where: { eventType: 'application_link_clicked', opportunityId: { not: null }, ...dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    // Enrich with opportunity titles
    const topShareOppIds = sharesByOpportunity.map(r => r.opportunityId!);
    const topClickOppIds = clicksByOpportunity.map(r => r.opportunityId!);
    const allOppIds = [...new Set([...topShareOppIds, ...topClickOppIds])];

    const opportunities = allOppIds.length > 0
      ? await prisma.opportunity.findMany({
          where: { id: { in: allOppIds } },
          select: { id: true, title: true, organization: { select: { name: true } } }
        })
      : [];

    const oppById = Object.fromEntries(opportunities.map(o => [o.id, o]));

    const topShared = sharesByOpportunity.map(r => ({
      opportunityId: r.opportunityId,
      title: oppById[r.opportunityId!]?.title ?? 'Unknown',
      organization: oppById[r.opportunityId!]?.organization?.name ?? '',
      count: r._count.id
    }));

    const topClicked = clicksByOpportunity.map(r => ({
      opportunityId: r.opportunityId,
      title: oppById[r.opportunityId!]?.title ?? 'Unknown',
      organization: oppById[r.opportunityId!]?.organization?.name ?? '',
      count: r._count.id
    }));

    // First event timestamp (collection start date)
    const firstEvent = await prisma.behaviourSignal.findFirst({
      where: { eventType: { in: EVENT_TYPES } },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true }
    });

    res.json({
      success: true,
      data: {
        range,
        totals: {
          shares: totalShares,
          sharedLinkVisits: totalVisits,
          applicationLinkClicks: totalAppClicks
        },
        sharesByMethod,
        topShared,
        topClicked,
        collectionStartedAt: firstEvent?.createdAt ?? null
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/analytics/share/:opportunityId?range=...
export const getOpportunityShareAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { opportunityId } = req.params;
    const range = (['7d', '30d', '90d', 'all'].includes(req.query.range as string)
      ? req.query.range as DateRange
      : '30d');

    const since = getDateRangeFilter(range);
    const dateFilter = since ? { createdAt: { gte: since } } : {};
    const where = { opportunityId, ...dateFilter };

    const opp = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { id: true, title: true, organization: { select: { name: true } } }
    });

    if (!opp) {
      res.status(404).json({ success: false, message: 'Opportunity not found' });
      return;
    }

    const [shares, visits, clicks, views] = await Promise.all([
      prisma.behaviourSignal.count({ where: { ...where, eventType: 'share_action' } }),
      prisma.behaviourSignal.count({ where: { ...where, eventType: 'shared_link_visit' } }),
      prisma.behaviourSignal.count({ where: { ...where, eventType: 'application_link_clicked' } }),
      prisma.behaviourSignal.count({ where: { ...where, eventType: 'opportunity_viewed' } }),
    ]);

    // Share methods breakdown
    const shareEvents = await prisma.behaviourSignal.findMany({
      where: { ...where, eventType: 'share_action' },
      select: { metadata: true }
    });

    const sharesByMethod: Record<string, number> = {};
    for (const ev of shareEvents) {
      try {
        const meta = JSON.parse(ev.metadata ?? '{}');
        const method = meta.shareMethod ?? 'unknown';
        sharesByMethod[method] = (sharesByMethod[method] ?? 0) + 1;
      } catch { /* ignore */ }
    }

    res.json({
      success: true,
      data: {
        opportunity: { id: opp.id, title: opp.title, organization: opp.organization?.name ?? '' },
        range,
        totals: { shares, sharedLinkVisits: visits, applicationLinkClicks: clicks, views },
        sharesByMethod
      }
    });
  } catch (error) {
    next(error);
  }
};
