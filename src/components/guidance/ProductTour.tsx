import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { cn } from '@/utils/cn';

interface TourStepDef {
  id: string;
  targetSelector?: string;
  title: string;
  description: string;
  route?: string;
  preferredPlacement?: 'top' | 'bottom' | 'center';
}

const TOUR_STEPS: TourStepDef[] = [
  {
    id: 'welcome',
    title: 'Welcome to ROMEfind',
    description: "Discover curated fellowships, internships, grants, and research positions with verified criteria and transparent funding.",
    route: '/discover',
    preferredPlacement: 'center'
  },
  {
    id: 'for-you',
    targetSelector: '#for-you',
    title: 'Personalized For You',
    description: "Opportunities scored and ranked against your active skills, experience level, and preferred destinations.",
    route: '/discover',
    preferredPlacement: 'bottom'
  },
  {
    id: 'search',
    targetSelector: '#home-search',
    title: 'Search & Quick Filters',
    description: "Search by title, organization, or domain, or use quick filters like Remote and Fully Funded.",
    route: '/discover',
    preferredPlacement: 'bottom'
  },
  {
    id: 'explore',
    targetSelector: '#nav-explore',
    title: 'Explore Catalog',
    description: "Intentionally browse all opportunities by taxonomy, eligibility, deadline urgency, and stipend levels.",
    route: '/discover',
    preferredPlacement: 'bottom'
  },
  {
    id: 'details-actions',
    targetSelector: '#tour-card',
    title: 'Details, Save & Compare',
    description: "Open any card to inspect match breakdown, save for later, or compare options side-by-side.",
    route: '/discover',
    preferredPlacement: 'top'
  },
  {
    id: 'workspace',
    targetSelector: '#nav-my-opps',
    title: 'Track & Prepare',
    description: "Manage checklist milestones, draft essays, and track deadlines in your personal workspace.",
    route: '/discover',
    preferredPlacement: 'bottom'
  }
];

export const ProductTour: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const { tourOpen, tourStep, endTour, nextTourStep, prevTourStep, setTourStep } = useUiStore();
  
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; placement: 'top' | 'bottom' | 'center' }>({
    top: 0,
    left: 0,
    placement: 'center'
  });

  const currentStep = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const isLastStep = tourStep === TOUR_STEPS.length - 1;
  const isFirstStep = tourStep === 0;

  // STRICT RULE: Tour is authenticated-only. If auth is loading or user is not logged in, NEVER show.
  const isUserAuthenticated = !authLoading && isAuthenticated && Boolean(user);

  // Navigate to target route if needed
  useEffect(() => {
    if (!tourOpen || !isUserAuthenticated) return;
    if (currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [tourOpen, isUserAuthenticated, tourStep, currentStep.route, location.pathname, navigate]);

  // Measure target bounding rect & calculate tooltip coordinates
  useEffect(() => {
    if (!tourOpen || !isUserAuthenticated) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      if (!currentStep.targetSelector) {
        setTargetRect(null);
        setTooltipPos({
          top: Math.max(80, window.innerHeight / 2 - 120),
          left: Math.max(16, (window.innerWidth - 380) / 2),
          placement: 'center'
        });
        return;
      }

      // Try desktop selector or mobile fallback
      let el = document.querySelector(currentStep.targetSelector);
      if (!el && currentStep.targetSelector === '#nav-explore') {
        el = document.querySelector('#nav-explore-mobile') || document.querySelector('a[href="/explore"]');
      }
      if (!el && currentStep.targetSelector === '#nav-my-opps') {
        el = document.querySelector('#nav-my-opps-mobile') || document.querySelector('a[href="/my-opportunities"]');
      }
      if (!el && currentStep.targetSelector === '#home-search') {
        el = document.querySelector('#nav-search') || document.querySelector('form[role="search"]');
      }

      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);

        // Scroll into view if out of viewport
        if (rect.top < 70 || rect.bottom > window.innerHeight - 80) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const isMobile = window.innerWidth < 640;
        const tooltipWidth = isMobile ? Math.min(window.innerWidth - 32, 380) : 360;
        const tooltipHeight = 210;

        let placement = currentStep.preferredPlacement || 'bottom';
        let top = 0;
        let left = 0;

        if (isMobile) {
          left = 16;
          // Position above or below depending on vertical space
          if (rect.bottom + tooltipHeight + 80 < window.innerHeight) {
            top = rect.bottom + 12;
            placement = 'bottom';
          } else if (rect.top - tooltipHeight > 70) {
            top = Math.max(70, rect.top - tooltipHeight - 12);
            placement = 'top';
          } else {
            top = Math.max(70, window.innerHeight - tooltipHeight - 80);
            placement = 'bottom';
          }
        } else {
          // Desktop positioning
          left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, rect.left + (rect.width - tooltipWidth) / 2));

          if (placement === 'bottom') {
            if (rect.bottom + tooltipHeight + 20 < window.innerHeight) {
              top = rect.bottom + 12;
            } else if (rect.top - tooltipHeight > 20) {
              top = rect.top - tooltipHeight - 12;
              placement = 'top';
            } else {
              top = Math.max(80, (window.innerHeight - tooltipHeight) / 2);
              placement = 'center';
            }
          } else if (placement === 'top') {
            if (rect.top - tooltipHeight > 20) {
              top = rect.top - tooltipHeight - 12;
            } else if (rect.bottom + tooltipHeight + 20 < window.innerHeight) {
              top = rect.bottom + 12;
              placement = 'bottom';
            } else {
              top = Math.max(80, (window.innerHeight - tooltipHeight) / 2);
              placement = 'center';
            }
          }
        }

        setTooltipPos({ top, left, placement });
      } else {
        setTargetRect(null);
        setTooltipPos({
          top: Math.max(80, window.innerHeight / 2 - 120),
          left: Math.max(16, (window.innerWidth - 380) / 2),
          placement: 'center'
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    const timer = setTimeout(updatePosition, 250);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      clearTimeout(timer);
    };
  }, [tourOpen, isUserAuthenticated, tourStep, currentStep.targetSelector, location.pathname]);

  if (!tourOpen || !isUserAuthenticated) return null;

  return (
    <>
      {/* Subtle Focus Ring Highlight around Target (Zero backdrop blur or screen darkening) */}
      {targetRect && (
        <div
          className="fixed rounded-2xl ring-2 ring-rome-500 ring-offset-4 ring-offset-transparent pointer-events-none z-40 transition-all duration-300 animate-pulse"
          style={{
            top: Math.max(0, targetRect.top - 2),
            left: Math.max(0, targetRect.left - 2),
            width: targetRect.width + 4,
            height: targetRect.height + 4,
          }}
        />
      )}

      {/* Lightweight Floating Tooltip Popover (Page remains completely visible and usable) */}
      <div
        role="dialog"
        aria-labelledby="tour-tooltip-title"
        aria-describedby="tour-tooltip-desc"
        className={cn(
          "fixed z-50 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-750 rounded-2xl shadow-elevated p-4 sm:p-5 text-left transition-all duration-300 animate-in fade-in zoom-in-95",
          "w-[calc(100vw-32px)] sm:w-[360px] max-w-[380px]"
        )}
        style={{
          top: `${tooltipPos.top}px`,
          left: `${tooltipPos.left}px`,
        }}
      >
        {/* Header row: Step pill & Close button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase bg-rome-100 dark:bg-rome-950 text-rome-700 dark:text-rome-300 border border-rome-200/60 dark:border-rome-800/60">
            Step {tourStep + 1} of {TOUR_STEPS.length}
          </span>

          <button
            onClick={endTour}
            className="p-1 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
            aria-label="Skip tour"
            title="Skip tour"
          >
            <SolarIcon name="close-circle-linear" size={18} />
          </button>
        </div>

        {/* Title */}
        <h3 id="tour-tooltip-title" className="text-base font-bold text-surface-950 dark:text-surface-50 mb-1 leading-snug">
          {currentStep.title}
        </h3>

        {/* Description */}
        <p id="tour-tooltip-desc" className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed mb-4">
          {currentStep.description}
        </p>

        {/* Footer controls: Skip / Back / Next / Finish */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-800 gap-2">
          <button
            onClick={endTour}
            className="text-xs font-semibold text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200 transition-colors cursor-pointer py-1 px-1.5"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-1.5">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 min-h-[36px] px-3 text-xs font-semibold"
                onClick={prevTourStep}
              >
                Back
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              className="h-9 min-h-[36px] px-4 text-xs font-semibold bg-rome-500 hover:bg-rome-600 text-white shadow-xs"
              onClick={isLastStep ? endTour : nextTourStep}
            >
              <span>{isLastStep ? 'Finish' : 'Next'}</span>
              {!isLastStep && <SolarIcon name="alt-arrow-right-linear" size={14} />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
