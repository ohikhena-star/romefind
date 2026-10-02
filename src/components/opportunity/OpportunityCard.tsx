import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Opportunity, SearchResult } from '@/types/models';
import { Card, Tag, DeadlineIndicator } from '@/components/ui';
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

  return (
    <Card 
      hoverable
      onClick={handleCardClick}
      padding="none"
      className={cn(
        "flex flex-col h-full relative group transition-all duration-200 border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900",
        isComparing && "ring-2 ring-rome-500/70 dark:ring-rome-400 bg-rome-50/20 dark:bg-rome-950/20",
        className
      )}
    >
      {/* ─── Ticket Header Band ─── */}
      <div className="bg-surface-50 dark:bg-surface-800/50 px-4 py-3 rounded-t-2xl border-b border-surface-100 dark:border-surface-800 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Tag label={opportunity.type} size="sm" />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {opportunity.deadline ? (
            <DeadlineIndicator deadline={opportunity.deadline} />
          ) : (
            <span className="flex items-center gap-1 text-xs text-surface-500">
              <SolarIcon name="calendar-linear" size={12} /> Rolling
            </span>
          )}
          
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleShare}
                className={cn(
                  "p-1.5 rounded-lg transition-colors z-10 cursor-pointer border text-xs",
                  copied
                    ? "text-emerald-600 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                    : "text-surface-400 bg-surface-50 dark:bg-surface-800/80 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 border-surface-200 dark:border-surface-700"
                )}
                title={copied ? "Link Copied!" : "Share Opportunity"}
                aria-label="Share opportunity"
              >
                {copied ? <SolarIcon name="check-circle-linear" size={14} className="text-emerald-500" /> : <SolarIcon name="share-linear" size={14} />}
              </button>

              {showCompareButton && (
                <button
                  onClick={handleCompareToggle}
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-semibold flex items-center transition-all z-10 cursor-pointer border",
                    isComparing
                      ? "bg-rome-500 text-white border-rome-600 dark:bg-rome-600 dark:border-rome-500 shadow-2xs"
                      : "bg-surface-50 dark:bg-surface-800/80 text-surface-400 hover:text-rome-600 border-surface-200 dark:border-surface-700 dark:hover:bg-surface-700"
                  )}
                  title={isComparing ? "Remove from Compare" : "Add to Compare"}
                  aria-label="Toggle comparison"
                >
                  <SolarIcon name="scale-linear" size={14} className={isComparing ? "text-white" : ""} />
                </button>
              )}
            </div>

            {showSaveButton && (
              <button
                onClick={handleSaveToggle}
                className={cn(
                  "p-1.5 rounded-lg transition-colors z-10 cursor-pointer border",
                  isSaved 
                    ? "text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60" 
                    : "text-surface-400 bg-surface-50 dark:bg-surface-800/80 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 border-surface-200 dark:border-surface-700"
                )}
                aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
                title={isSaved ? "Saved" : "Save opportunity"}
              >
                <SolarIcon name={isSaved ? "heart-bold" : "heart-linear"} size={14} className={isSaved ? "text-rose-500" : ""} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Card Body ─── */}
      <div className={cn("flex flex-col flex-1", compact ? "px-4 pb-4" : "px-5 pb-5")}>
        <div className="text-xs text-surface-500 dark:text-surface-400 mt-3 mb-1 truncate" title={orgName}>
          {orgName}
        </div>
        
        <h3 className={cn(
          "font-bold text-surface-900 dark:text-white mb-2 leading-snug line-clamp-2",
          compact ? "text-sm" : "text-base"
        )}>
          {opportunity.title}
        </h3>
        
        <p className="text-xs text-surface-500 dark:text-surface-400 mb-4 line-clamp-2 leading-relaxed">
          {opportunity.shortDescription || opportunity.description}
        </p>

        {relevanceScore !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center min-w-0">
                <span className="text-xs text-surface-500 truncate" title={relevanceReasons?.join(' · ')}>
                  {relevanceScore}% match{relevanceReasons && relevanceReasons.length > 0 ? ` · ${relevanceReasons[0]}` : ''}
                </span>
              </div>

              {showDebugSignals && matchSignals && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setDebugExpanded(!debugExpanded); }}
                  className="text-xs text-surface-500 hover:text-rome-500 shrink-0 flex items-center gap-0.5"
                  title="Inspect matching criteria"
                >
                  <span>debug</span>
                  <SolarIcon name={debugExpanded ? "alt-arrow-up-linear" : "alt-arrow-down-linear"} size={12} />
                </button>
              )}
            </div>

            {showDebugSignals && debugExpanded && matchSignals && (
              <div className="mt-1.5 p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-xs font-mono space-y-1 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700">
                <div className="flex justify-between">
                  <span>Field/Interest Match:</span>
                  <span className={matchSignals.interestMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-500"}>
                    {matchSignals.interestMatch ? `✓ (+${matchSignals.fieldMatchScore})` : '✗ (0)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Skill Overlap:</span>
                  <span className={matchSignals.skillMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-500"}>
                    {matchSignals.skillMatch ? `✓ (+${matchSignals.skillMatchScore})` : '✗ (0)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Goal/Intent Match:</span>
                  <span className={matchSignals.goalMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-500"}>
                    {matchSignals.goalMatch ? `✓ (+${matchSignals.goalMatchScore})` : '✗ (0)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Opportunity Type Match:</span>
                  <span className={matchSignals.typeMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-500"}>
                    {matchSignals.typeMatch ? `✓ (+${matchSignals.typeMatchScore})` : 'neutral'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Eligibility / Experience:</span>
                  <span className={matchSignals.eligibilityMatch && matchSignals.experienceMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-amber-500"}>
                    {matchSignals.eligibilityMatch ? `✓ (+${matchSignals.eligibilityScore})` : 'restricted'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location / Remote:</span>
                  <span className={matchSignals.locationMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-500"}>
                    {matchSignals.locationMatch ? `✓ (+${matchSignals.locationScore})` : 'neutral'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Footer: Location + Funding ─── */}
        <div className="mt-auto pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center text-xs text-surface-500 gap-3">
          {opportunity.location && (
            <span className="flex items-center gap-1 truncate max-w-[150px]" title={opportunity.location}>
              <SolarIcon name="map-point-linear" size={14} className="shrink-0" />
              <span className="truncate">{opportunity.location}</span>
            </span>
          )}

          {opportunity.funding && (
            <span 
              className="flex items-center gap-1 shrink-0 max-w-[140px] truncate"
              title={opportunity.funding}
            >
              <SolarIcon name="dollar-minimalistic-linear" size={14} className="shrink-0" />
              $<span className="truncate">{opportunity.funding}</span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
