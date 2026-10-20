import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Opportunity, SearchResult, RemoteStatus } from '@/types/models';
import { Button, DeadlineIndicator } from '@/components/ui';
import { useApplicationStore } from '@/store/applicationStore';

export interface OpportunityCardProps {
  id?: string;
  opportunity: Opportunity;
  relevanceScore?: number;
  relevanceReasons?: string[];
  matchSignals?: SearchResult['matchSignals'];
  showDebugSignals?: boolean;
  compact?: boolean;
  showSaveButton?: boolean;
  showCompareButton?: boolean;
  isSaved?: boolean;
  isComparing?: boolean;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
  onToggleCompare?: (id: string) => void;
  onClick?: (id: string) => void;
  primaryAction?: 'view' | 'compare';
  className?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  id,
  opportunity,
  relevanceScore,
  relevanceReasons,
  matchSignals,
  showDebugSignals = false,
  compact = false,
  primaryAction = 'view',
  showSaveButton = true,
  showCompareButton = true,
  isSaved: propIsSaved,
  isComparing: propIsComparing,
  onSave: propOnSave,
  onUnsave: propOnUnsave,
  onToggleCompare: propOnToggleCompare,
  onClick,
  className
}) => {
  const navigate = useNavigate();


  const { 
    isSaved: storeIsSaved, 
    saveOpportunity, 
    unsaveOpportunity, 
    comparisons, 
    addToCompare, 
    removeFromCompare 
  } = useApplicationStore();

  const isSaved = propIsSaved !== undefined ? propIsSaved : storeIsSaved(opportunity.id);
  const isComparing = propIsComparing !== undefined ? propIsComparing : comparisons.includes(opportunity.id);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      if (propOnUnsave) propOnUnsave(opportunity.id);
      else unsaveOpportunity(opportunity.id);
    } else {
      if (propOnSave) propOnSave(opportunity.id);
      else saveOpportunity(opportunity.id);
    }
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (propOnToggleCompare) {
      propOnToggleCompare(opportunity.id);
    } else {
      if (isComparing) {
        removeFromCompare(opportunity.id);
      } else {
        addToCompare(opportunity.id);
      }
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(opportunity.id);
    } else {
      navigate(`/opportunity/${opportunity.id}`);
    }
  };

  const orgName = typeof opportunity.organization === 'object'
    ? opportunity.organization?.name
    : String(opportunity.organization || '');

  const primaryField = opportunity.field?.[0] || 'General';

  const displayLocation = opportunity.remoteStatus === RemoteStatus.Remote
    ? 'Remote'
    : (opportunity.location || 'Global');

  return (
    <article
      id={id}
      aria-label={`${opportunity.title} by ${orgName}`}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
      className={cn(
        "flex flex-col h-full relative group cursor-pointer transition-all duration-200 text-left",
        "rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-4 sm:p-5",
        "hover:border-surface-300 dark:hover:border-surface-700 hover:shadow-card-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500 focus-visible:ring-offset-2",
        isComparing && "ring-2 ring-rome-500/80 bg-rome-50/20 dark:bg-rome-950/20 border-rome-300 dark:border-rome-700",
        className
      )}
    >
      {/* ─── 1. Header: Organization (Left) & Sibling Save/Compare Actions (Right) ─── */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 flex items-center justify-center shrink-0">
            <SolarIcon name="buildings-2-linear" size={13} />
          </div>
          <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 truncate tracking-wide uppercase" title={orgName}>
            {orgName}
          </p>
        </div>

        {/* Action icons (Save & Compare siblings) */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {showSaveButton && (
            <button
              onClick={handleSaveToggle}
              className={cn(
                "w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl transition-all cursor-pointer border flex items-center justify-center",
                isSaved
                  ? "text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60 shadow-2xs"
                  : "text-surface-400 bg-surface-50 dark:bg-surface-800 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-surface-100 dark:hover:bg-surface-700 border-surface-200 dark:border-surface-700"
              )}
              title={isSaved ? "Saved in My Opportunities" : "Save opportunity"}
              aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
            >
              <SolarIcon 
                name={isSaved ? "heart-bold" : "heart-linear"} 
                size={17} 
                className={isSaved ? "text-rose-500" : ""} 
              />
            </button>
          )}

          {showCompareButton && (
            <button
              onClick={handleCompareToggle}
              className={cn(
                "w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl transition-all cursor-pointer border flex items-center justify-center",
                isComparing
                  ? "bg-rome-500 text-white border-rome-600 shadow-2xs"
                  : "bg-surface-50 dark:bg-surface-800 text-surface-400 hover:text-rome-600 dark:hover:text-rome-400 hover:bg-surface-100 dark:hover:bg-surface-700 border-surface-200 dark:border-surface-700"
              )}
              title={isComparing ? "Remove from Compare" : "Compare opportunity"}
              aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
            >
              <SolarIcon name="scale-linear" size={17} className={isComparing ? "text-white" : ""} />
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. Title & Type/Field Badges ─── */}
      <h3 className={cn(
        "font-bold text-surface-950 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-rome-600 dark:group-hover:text-rome-400 transition-colors",
        compact ? "text-sm sm:text-base" : "text-base sm:text-lg"
      )}>
        {opportunity.title}
      </h3>

      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700">
          {opportunity.type}
        </span>
        {primaryField && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-100/60 dark:bg-surface-800/60 text-surface-600 dark:text-surface-400">
            {primaryField}
          </span>
        )}
      </div>

      {/* ─── 3. Description (Omitted in compact mode) ─── */}
      {!compact && (
        <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2 leading-relaxed">
          {opportunity.shortDescription || opportunity.description}
        </p>
      )}

      {/* ─── 4. Structured Metadata: Location, Deadline, Funding ─── */}
      <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-surface-100 dark:border-surface-800/80 mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-surface-400 dark:text-surface-500 font-medium block mb-0.5">Location</span>
          <span className="font-semibold text-surface-800 dark:text-surface-200 truncate block text-xs" title={opportunity.location}>
            {displayLocation}
          </span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-surface-400 dark:text-surface-500 font-medium block mb-0.5">Deadline</span>
          {opportunity.deadline ? (
            <DeadlineIndicator deadline={opportunity.deadline} />
          ) : (
            <span className="font-semibold text-surface-700 dark:text-surface-300 text-xs">Rolling</span>
          )}
        </div>

        {opportunity.funding && (
          <div className="col-span-2 pt-1.5 border-t border-surface-100 dark:border-surface-800/60 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-surface-400 dark:text-surface-500 font-medium">Funding</span>
            <span className="font-semibold text-surface-900 dark:text-surface-100 truncate max-w-[200px] text-xs" title={opportunity.funding}>
              {opportunity.funding}
            </span>
          </div>
        )}
      </div>

      {/* ─── 6. Action Button (Compare Mode vs Standard View Mode) ─── */}
      <div 
        id={id ? "tour-actions" : undefined}
        className="mt-auto pt-2 flex items-center w-full"
      >
        {primaryAction === 'compare' ? (
          <div className="flex items-center justify-between gap-2 w-full" onClick={(e) => e.stopPropagation()}>
            <Button 
              variant={isComparing ? "outline" : "default"}
              size="default"
              className={cn(
                "flex-1 text-xs font-bold justify-center h-10 min-h-[40px] transition-all",
                isComparing 
                  ? "border-rome-500 text-rome-600 dark:text-rome-400 bg-rome-50 dark:bg-rome-950/60 shadow-2xs" 
                  : "bg-rome-500 hover:bg-rome-600 text-white shadow-xs"
              )}
              onClick={handleCompareToggle}
            >
              <SolarIcon name={isComparing ? "check-circle-linear" : "add-circle-linear"} size={16} />
              <span>{isComparing ? "Added to Compare" : "+ Add to Compare"}</span>
            </Button>

            <button
              onClick={handleCardClick}
              className="px-2.5 py-2 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors cursor-pointer"
              title="View full opportunity details"
            >
              Details ↗
            </button>
          </div>
        ) : (
          <Button 
            variant="default"
            size="default"
            className="w-full text-sm font-semibold justify-center h-11 min-h-[44px]"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <span>View opportunity</span>
            <SolarIcon name="alt-arrow-right-linear" size={15} />
          </Button>
        )}
      </div>
    </article>
  );
};
