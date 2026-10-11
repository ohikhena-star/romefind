import { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

// The anonymous system user created to absorb guest events (userId FK is NOT NULL).
const GUEST_USER_ID = 'usr-guest-anonymous';

const VALID_EVENT_TYPES = new Set([
  'share_action',
  'shared_link_visit',
  'application_link_clicked',
]);

const VALID_SHARE_METHODS = new Set(['copy_link', 'whatsapp', 'twitter', 'native']);

// POST /api/analytics/event
export const ingestEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventType, opportunityId, metadata } = req.body as {
      eventType?: string;
      opportunityId?: string;
      metadata?: Record<string, unknown>;
    };

    // Validate event type
    if (!eventType || !VALID_EVENT_TYPES.has(eventType)) {
      res.status(400).json({
        success: false,
        message: `Invalid eventType. Must be one of: ${[...VALID_EVENT_TYPES].join(', ')}`
      });
      return;
    }

    // Validate shareMethod if present
    if (
      eventType === 'share_action' &&
      metadata?.shareMethod &&
      !VALID_SHARE_METHODS.has(metadata.shareMethod as string)
    ) {
      res.status(400).json({
        success: false,
        message: `Invalid shareMethod. Must be one of: ${[...VALID_SHARE_METHODS].join(', ')}`
      });
      return;
    }

    // Validate opportunityId if provided
    if (opportunityId) {
      const opp = await prisma.opportunity.findUnique({
        where: { id: opportunityId },
        select: { id: true }
      });
      if (!opp) {
        // Don't fail hard — tracking failures must not block users
        res.json({ success: true, recorded: false, reason: 'opportunity_not_found' });
        return;
      }
    }

    // Authenticated user or the guest sentinel
    const userId = req.user?.id ?? GUEST_USER_ID;

    await prisma.behaviourSignal.create({
      data: {
        userId,
        opportunityId: opportunityId ?? null,
        eventType,
        metadata: JSON.stringify(metadata ?? {})
      }
    });

    res.json({ success: true, recorded: true });
  } catch (error) {
    // Never surface tracking errors to the client — just log
    console.error('[analytics] ingestEvent error:', error);
    res.json({ success: true, recorded: false, reason: 'internal_error' });
  }
};
