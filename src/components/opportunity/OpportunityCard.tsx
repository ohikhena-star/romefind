import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Opportunity, SearchResult } from '@/types/models';
import { Button, DeadlineIndicator } from '@/components/ui';
import { useApplicationStore } from '@/store/applicationStore';

export interface OpportunityCardProps {
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
  className?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  relevanceScore,
  relevanceReasons,
  matchSignals,
  showDebugSignals = false,
  compact = false,
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

  const [copied, setCopied] = useState(false);
  const [debugExpanded, setDebugExpanded] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== 'undefined' 
      ? `${window.location.origin}/opportunity/${opportunity.id}` 
      : `https://romefind.vercel.app/opportunity/${opportunity.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: opportunity.title,
          text: `Check out ${opportunity.title} on ROMEfind`,
          url
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    }
  };

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

  return (
    <article
      aria-label={`${opportunity.title} by ${orgName}`}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
      className={cn(
        "flex flex-col h-full relative group cursor-pointer transition-all duration-200 text-left",
        "rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5",
        "hover:border-surface-300 dark:hover:border-surface-700 hover:shadow-card-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rome-500 focus-visible:ring-offset-2",
        isComparing && "ring-2 ring-rome-500/80 bg-rome-50/20 dark:bg-rome-950/20 border-rome-300 dark:border-rome-700",
        className
      )}
    >
      {/* ─── 1. Header: Organization & Meta Actions ─── */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 truncate tracking-wide" title={orgName}>
            {orgName}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Share & Compare on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleShare}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer border text-xs",
                copied
                  ? "text-emerald-600 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                  : "text-surface-400 bg-surface-50 dark:bg-surface-800 hover:text-surface-700 dark:hover:text-surface-200 border-surface-200 dark:border-surface-700"
              )}
              title={copied ? "Link Copied!" : "Share Opportunity"}
              aria-label="Share opportunity"
            >
              {copied ? <SolarIcon name="check-circle-linear" size={13} className="text-emerald-500" /> : <SolarIcon name="share-linear" size={13} />}
            </button>

            {showCompareButton && (
              <button
                onClick={handleCompareToggle}
                className={cn(
                  "p-1.5 rounded-lg text-xs font-semibold flex items-center transition-all cursor-pointer border",
                  isComparing
                    ? "bg-rome-500 text-white border-rome-600 shadow-2xs"
                    : "bg-surface-50 dark:bg-surface-800 text-surface-400 hover:text-rome-600 border-surface-200 dark:border-surface-700"
                )}
                title={isComparing ? "Remove from Compare" : "Compare with other opportunities"}
                aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
              >
                <SolarIcon name="scale-linear" size={13} className={isComparing ? "text-white" : ""} />
              </button>
            )}
          </div>

          {/* Save Button */}
          {showSaveButton && (
            <button
              onClick={handleSaveToggle}
              className={cn(
                "p-1.5 rounded-lg transition-colors cursor-pointer border",
                isSaved 
                  ? "text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60 shadow-2xs" 
                  : "text-surface-400 bg-surface-50 dark:bg-surface-800 hover:text-rose-500 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 border-surface-200 dark:border-surface-700"
              )}
              aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
              title={isSaved ? "Saved in My Opportunities" : "Save opportunity"}
            >
              <SolarIcon name={isSaved ? "heart-bold" : "heart-linear"} size={14} className={isSaved ? "text-rose-500" : ""} />
            </button>
          )}
        </div>
      </div>

      {/* ─── 2. Title & Type/Field Badges ─── */}
      <h3 className={cn(
        "font-bold text-surface-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-rome-600 dark:group-hover:text-rome-400 transition-colors",
        compact ? "text-sm" : "text-base"
      )}>
        {opportunity.title}
      </h3>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700">
          {opportunity.type}
        </span>
        {primaryField && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-100/60 dark:bg-surface-800/60 text-surface-600 dark:text-surface-400">
            {primaryField}
          </span>
        )}
      </div>

      {/* ─── 3. Description ─── */}
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-4 line-clamp-2 leading-relaxed">
        {opportunity.shortDescription || opportunity.description}
      </p>

      {/* ─── 4. Structured Metadata: Location, Deadline, Funding ─── */}
      <div className="grid grid-cols-2 gap-2 text-xs text-surface-600 dark:text-surface-400 py-3 border-y border-surface-100 dark:border-surface-800 mb-3 bg-surface-50/40 dark:bg-surface-850/40 rounded-xl px-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-surface-400 font-semibold block mb-0.5">Location</span>
          <span className="font-medium text-surface-800 dark:text-surface-200 truncate block" title={opportunity.location}>
            {opportunity.location || 'Remote / Worldwide'}
          </span>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wider text-surface-400 font-semibold block mb-0.5">Deadline</span>
          {opportunity.deadline ? (
            <DeadlineIndicator deadline={opportunity.deadline} />
          ) : (
            <span className="font-medium text-surface-700 dark:text-surface-300">Rolling</span>
          )}
        </div>

        {opportunity.funding && (
          <div className="col-span-2 pt-1 border-t border-surface-100/80 dark:border-surface-800/80 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-surface-400 font-semibold">Funding</span>
            <span className="font-semibold text-surface-900 dark:text-surface-100 truncate max-w-[200px]" title={opportunity.funding}>
              {opportunity.funding}
            </span>
          </div>
        )}
      </div>

      {/* ─── 5. Contextual "Why this is here" ─── */}
      {(relevanceReasons && relevanceReasons.length > 0) && (
        <div className="mb-4 text-xs text-surface-500 dark:text-surface-400 bg-surface-50/80 dark:bg-surface-800/50 p-2 rounded-lg border border-surface-100 dark:border-surface-800">
          <p className="line-clamp-2">
            <span className="font-semibold text-surface-700 dark:text-surface-300">Why this is here: </span>
            {relevanceReasons[0]}
          </p>
        </div>
      )}

      {/* ─── 6. Primary Action Buttons ─── */}
      <div className="mt-auto pt-2 flex items-center gap-2">
        <Button 
          variant="default"
          size="sm"
          className="flex-1 text-xs font-semibold"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          <span>View opportunity</span>
          <SolarIcon name="alt-arrow-right-linear" size={13} />
        </Button>

        <Button
          variant={isSaved ? "secondary" : "outline"}
          size="sm"
          className={cn("px-3 text-xs", isSaved && "text-rose-600 dark:text-rose-400")}
          onClick={handleSaveToggle}
          title={isSaved ? "Saved" : "Save"}
        >
          <SolarIcon name={isSaved ? "heart-bold" : "heart-linear"} size={13} />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </Button>
      </div>
    </article>
  );
};
