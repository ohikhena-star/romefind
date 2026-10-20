import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Button } from '@/components/ui/Button';
import { setPendingAction, executePendingAction } from '@/utils/pendingAction';
import { useAuthStore } from '@/store/authStore';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export type ContextualPromptType = 'save' | 'track' | 'personalize';

export interface ContextualSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ContextualPromptType;
  opportunityId?: string;
  returnUrl?: string;
}

export const ContextualSignupModal: React.FC<ContextualSignupModalProps> = ({
  isOpen,
  onClose,
  type,
  opportunityId,
  returnUrl
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const { loginWithGoogle } = useAuthStore();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleSuccess = async (idToken: string) => {
    setGoogleError('');
    setGoogleLoading(true);
    try {
      if (opportunityId && (type === 'save' || type === 'track')) {
        setPendingAction({
          type,
          opportunityId,
          returnUrl: returnUrl || window.location.pathname
        });
      }
      await loginWithGoogle(idToken);
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.onboardingCompleted) {
        const resumed = await executePendingAction();
        onClose();
        if (resumed?.executed && resumed.returnUrl) {
          navigate(resumed.returnUrl);
        }
      } else {
        onClose();
        navigate('/onboarding');
      }
    } catch (err: any) {
      setGoogleError(err?.message || 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Autofocus primary button on open
    setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const contentMap: Record<ContextualPromptType, {
    heading: string;
    body: string;
    icon: string;
    badge: string;
  }> = {
    save: {
      heading: "Keep this opportunity within reach.",
      body: "Create a free account to save opportunities, track application deadlines, and manage your next steps.",
      icon: "heart-bold",
      badge: "Save Opportunity"
    },
    track: {
      heading: "Keep this opportunity within reach.",
      body: "Create a free account to save opportunities, track application deadlines, and manage your next steps.",
      icon: "case-linear",
      badge: "Application Tracker"
    },
    personalize: {
      heading: "Keep this opportunity within reach.",
      body: "Create a free account to save opportunities, track application deadlines, and manage your next steps.",
      icon: "magic-stick-linear",
      badge: "Tailored Matches"
    }
  };

  const current = contentMap[type] || contentMap.save;

  const handleCreateAccount = () => {
    if (opportunityId && (type === 'save' || type === 'track')) {
      setPendingAction({
        type,
        opportunityId,
        returnUrl: returnUrl || window.location.pathname
      });
    }
    onClose();
    navigate('/signup');
  };

  const handleLogin = () => {
    if (opportunityId && (type === 'save' || type === 'track')) {
      setPendingAction({
        type,
        opportunityId,
        returnUrl: returnUrl || window.location.pathname
      });
    }
    onClose();
    navigate('/login', {
      state: { from: { pathname: returnUrl || window.location.pathname } }
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contextual-prompt-heading"
      aria-describedby="contextual-prompt-body"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header bar with icon and close button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rome-50 dark:bg-rome-950/40 border border-rome-200/60 dark:border-rome-800/40 text-rome-600 dark:text-rome-400 text-xs font-semibold">
            <SolarIcon name={current.icon} size={13} />
            <span>{current.badge}</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
          >
            <SolarIcon name="close-circle-linear" size={20} />
          </button>
        </div>

        {/* Modal content body */}
        <div className="px-6 py-4 space-y-3 text-left">
          <h3 
            id="contextual-prompt-heading"
            className="text-xl sm:text-2xl font-bold text-surface-950 dark:text-surface-50 leading-snug tracking-tight"
          >
            {current.heading}
          </h3>
          <p 
            id="contextual-prompt-body"
            className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed"
          >
            {current.body}
          </p>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 pt-2 space-y-3">
          {/* Quick Google Sign-In */}
          {googleError && (
            <p className="text-xs text-red-500 text-center">{googleError}</p>
          )}
          <div className="flex justify-center">
            <GoogleSignInButton
              text="continue_with"
              disabled={googleLoading}
              onSuccess={handleGoogleSuccess}
              onError={(msg) => setGoogleError(msg)}
            />
          </div>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200 dark:border-surface-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-surface-900 px-2 text-surface-400">
                Or with email
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <Button
              ref={primaryButtonRef}
              variant="default"
              size="default"
              onClick={handleCreateAccount}
              className="flex-1 h-11 min-h-[44px] justify-center bg-rome-500 hover:bg-rome-600 text-white font-semibold text-sm rounded-xl shadow-xs"
            >
              <span>Create free account</span>
              <SolarIcon name="alt-arrow-right-linear" size={16} />
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={onClose}
              className="h-11 min-h-[44px] justify-center text-xs font-semibold rounded-xl text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white"
            >
              Maybe Later
            </Button>
          </div>

          {/* Login fallback link */}
          <div className="pt-1 text-center">
            <button
              onClick={handleLogin}
              className="text-xs font-medium text-surface-500 dark:text-surface-400 hover:text-rome-600 dark:hover:text-rome-400 transition-colors cursor-pointer"
            >
              Already have an account? <span className="underline font-semibold">Log in</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
