import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';

export interface PendingAction {
  type: 'save' | 'track';
  opportunityId: string;
  returnUrl?: string;
  createdAt?: number;
}

const STORAGE_KEY = 'romefind_pending_action';

/**
 * Validates and sanitizes a return URL to prevent open redirect vulnerabilities.
 * Ensures the destination is a safe relative internal route starting with a single '/'
 */
export function sanitizeReturnUrl(url?: string): string {
  if (!url) return '/discover';
  // Must start with a single slash and not '//' or '/\'
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
    // Avoid redirect loops to auth screens
    if (url.startsWith('/login') || url.startsWith('/signup') || url.startsWith('/forgot-password')) {
      return '/discover';
    }
    return url;
  }
  return '/discover';
}

/**
 * Stores a user's pending action before redirecting to registration or login.
 */
export function setPendingAction(action: PendingAction): void {
  try {
    const payload: PendingAction = {
      type: action.type,
      opportunityId: action.opportunityId,
      returnUrl: sanitizeReturnUrl(action.returnUrl),
      createdAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to store pending action', e);
  }
}

/**
 * Retrieves the stored pending action if one exists and is still valid (< 24h old).
 */
export function getPendingAction(): PendingAction | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingAction;
    if (!parsed || !parsed.type || !parsed.opportunityId) {
      clearPendingAction();
      return null;
    }
    // Expire after 24 hours
    if (parsed.createdAt && Date.now() - parsed.createdAt > 24 * 60 * 60 * 1000) {
      clearPendingAction();
      return null;
    }
    return {
      type: parsed.type,
      opportunityId: parsed.opportunityId,
      returnUrl: sanitizeReturnUrl(parsed.returnUrl),
      createdAt: parsed.createdAt
    };
  } catch {
    clearPendingAction();
    return null;
  }
}

/**
 * Clears any pending action from storage.
 */
export function clearPendingAction(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/**
 * Resumes and executes the user's pending action after authentication.
 * Prevents duplicates, clears the pending state, and returns the target navigation destination.
 */
export async function executePendingAction(): Promise<{
  executed: boolean;
  type?: 'save' | 'track';
  opportunityId?: string;
  returnUrl: string;
  message?: string;
} | null> {
  const pending = getPendingAction();
  if (!pending) return null;

  const appStore = useApplicationStore.getState();
  const oppStore = useOpportunityStore.getState();
  const returnUrl = pending.returnUrl || `/opportunity/${pending.opportunityId}`;

  try {
    if (pending.type === 'save') {
      if (!appStore.isSaved(pending.opportunityId)) {
        await appStore.saveOpportunity(pending.opportunityId);
      }
      clearPendingAction();
      return {
        executed: true,
        type: 'save',
        opportunityId: pending.opportunityId,
        returnUrl,
        message: 'Opportunity saved to your workspace'
      };
    } else if (pending.type === 'track') {
      const opp = oppStore.getOpportunityById(pending.opportunityId);
      const existing = appStore.trackedApplications.find(a => a.opportunityId === pending.opportunityId);
      if (!existing) {
        await appStore.createApplication(pending.opportunityId, opp);
      }
      clearPendingAction();
      return {
        executed: true,
        type: 'track',
        opportunityId: pending.opportunityId,
        returnUrl: `/my-opportunities/${pending.opportunityId}/workspace`,
        message: 'Application workspace created'
      };
    }
  } catch (e) {
    console.warn('Failed executing pending action', e);
  }

  clearPendingAction();
  return {
    executed: false,
    returnUrl
  };
}
