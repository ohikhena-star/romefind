import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { cn } from '@/utils/cn';

interface TourStepDef {
  id: string;
  targetSelector?: string;
  title: string;
  description: string;
  route?: string;
  placement?: 'bottom' | 'top' | 'center';
}

const TOUR_STEPS: TourStepDef[] = [
  {
    id: 'welcome',
    title: 'Welcome to ROMEfind',
    description: "Here’s a quick look at how to find, explore, and keep track of opportunities across different paths.",
    route: '/discover',
    placement: 'center'
  },
  {
    id: 'for-you',
    targetSelector: '#for-you',
    title: 'For You',
    description: "This is where ROMEfind surfaces opportunities based on your interests, goals, experience, and preferences.",
    route: '/discover',
    placement: 'bottom'
  },
  {
    id: 'explore',
    targetSelector: '#nav-explore',
    title: 'Explore',
    description: "Use Explore when you want to intentionally browse opportunities by field, goal, type, location, or funding.",
    route: '/discover',
    placement: 'bottom'
  },
  {
    id: 'search',
    targetSelector: '#nav-search',
    title: 'Search',
    description: "Looking for something specific? Search by opportunity, organization, field, skill, or location.",
    route: '/discover',
    placement: 'bottom'
  },
  {
    id: 'details',
    targetSelector: '#tour-card',
    title: 'Opportunity details',
    description: "Open an opportunity to see eligibility, funding, deadlines, requirements, and the official application source.",
    route: '/discover',
    placement: 'top'
  },
  {
    id: 'save-compare',
    targetSelector: '#tour-actions',
    title: 'Save & compare',
    description: "Save opportunities you’re considering and compare options before deciding where to focus.",
    route: '/discover',
    placement: 'top'
  },
  {
    id: 'track',
    targetSelector: '#nav-my-opps',
    title: 'Keep track',
    description: "Once you find something worth pursuing, track it in My Opportunities as you prepare and apply.",
    route: '/discover',
    placement: 'bottom'
  }
];

import { useAuthStore } from '@/store/authStore';

export const ProductTour: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, isLoading: authLoading } = useAuthStore();
  const { tourOpen, tourStep, endTour, nextTourStep, prevTourStep, setTourStep } = useUiStore();
  
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const currentStep = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const isFirstStep = tourStep === 0;
  const isLastStep = tourStep === TOUR_STEPS.length - 1;

  // STRICT RULE: Tour is authenticated-only. If auth is loading or user is not logged in, NEVER show.
  const isUserAuthenticated = !authLoading && isAuthenticated && Boolean(user);

  // Navigate to target route if needed
  useEffect(() => {
    if (!tourOpen || !isUserAuthenticated) return;
    if (currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route);
    }
  }, [tourOpen, isUserAuthenticated, tourStep, currentStep.route, location.pathname, navigate]);

  // Measure target bounding rect
  useEffect(() => {
    if (!tourOpen) {
      setTargetRect(null);
      return;
    }

    if (!currentStep.targetSelector) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      // Try desktop selector or mobile fallback
      let el = document.querySelector(currentStep.targetSelector!);
      if (!el && currentStep.targetSelector === '#nav-explore') {
        el = document.querySelector('#nav-explore-mobile') || document.querySelector('a[href="/explore"]');
      }
      if (!el && currentStep.targetSelector === '#nav-search') {
        el = document.querySelector('#nav-search-mobile') || document.querySelector('button[aria-label="Search"]');
      }
      if (!el && currentStep.targetSelector === '#nav-my-opps') {
        el = document.querySelector('#nav-my-opps-mobile') || document.querySelector('a[href="/my-opportunities"]');
      }

      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
        // Scroll into view if not in viewport
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    const timer = setTimeout(updateRect, 300);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      clearTimeout(timer);
    };
  }, [tourOpen, tourStep, currentStep.targetSelector, location.pathname]);

  if (!tourOpen || !isUserAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto animate-in fade-in duration-200">
      {/* Semi-transparent Backdrop */}
      <div 
        className="fixed inset-0 bg-surface-950/60 dark:bg-black/75 backdrop-blur-[2px] transition-all duration-300"
        onClick={endTour}
      />

      {/* Target Highlight Spotlight Ring */}
      {targetRect && (
        <div 
          className="fixed rounded-2xl border-2 border-rome-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] pointer-events-none transition-all duration-300 z-50 animate-pulse"
          style={{
            top: Math.max(0, targetRect.top - 6),
            left: Math.max(0, targetRect.left - 6),
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      )}

      {/* Tour Dialog Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          role="dialog"
          aria-labelledby="tour-heading"
          aria-describedby="tour-desc"
          className={cn(
            "pointer-events-auto w-full max-w-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-left transition-all duration-300",
            "animate-in zoom-in-95 fade-in duration-200"
          )}
        >
          {/* Header row: Progress & Close */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 bg-rome-50 dark:bg-rome-950/50 px-2.5 py-1 rounded-lg border border-rome-200/60 dark:border-rome-800/40">
              <span>Step {tourStep === 0 ? 'Intro' : `${tourStep} of 6`}</span>
            </span>

            <button
              onClick={endTour}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Skip tour"
              title="Skip tour"
            >
              <SolarIcon name="close-circle-linear" size={20} />
            </button>
          </div>

          {/* Title & Description */}
          <h2 id="tour-heading" className="text-xl sm:text-2xl font-bold text-surface-950 dark:text-surface-50 mb-2 leading-tight">
            {currentStep.title}
          </h2>
          <p id="tour-desc" className="text-sm sm:text-base text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
            {currentStep.description}
          </p>

          {/* Step Progress Dots */}
          <div className="flex items-center justify-between pt-4 border-t border-surface-100 dark:border-surface-800 gap-4">
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setTourStep(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all cursor-pointer",
                    idx === tourStep 
                      ? "w-6 bg-rome-500" 
                      : "w-2 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
                  )}
                  aria-label={`Go to step ${idx + 1}: ${step.title}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isFirstStep ? (
                <>
                  <Button
                    variant="ghost"
                    size="default"
                    className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 text-sm font-semibold h-11 min-h-[44px] px-4"
                    onClick={endTour}
                  >
                    Skip
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    className="bg-rome-500 hover:bg-rome-600 text-white text-sm font-semibold h-11 min-h-[44px] px-5 shadow-xs"
                    onClick={nextTourStep}
                  >
                    <span>Show me around</span>
                    <SolarIcon name="alt-arrow-right-linear" size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="default"
                    className="text-sm font-semibold h-11 min-h-[44px] px-4"
                    onClick={prevTourStep}
                  >
                    Back
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    className="bg-rome-500 hover:bg-rome-600 text-white text-sm font-semibold h-11 min-h-[44px] px-5 shadow-xs"
                    onClick={isLastStep ? endTour : nextTourStep}
                  >
                    <span>{isLastStep ? 'Finish' : 'Next'}</span>
                    {!isLastStep && <SolarIcon name="alt-arrow-right-linear" size={16} />}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
