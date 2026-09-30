import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Heart, MapPin, DollarSign, Scale, Check, Share2, Calendar, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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
      padding={compact ? 'sm' : 'md'}
      className={cn(
        "flex flex-col h-full relative group transition-all duration-200 border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900/90",
        isComparing && "ring-2 ring-rome-500/70 dark:ring-rome-400 bg-rome-50/20 dark:bg-rome-950/20",
        className
      )}
    >
      {/* ─── Top Header: Type + Organization + Quick Actions ─── */}
      <div className="flex justify-between items-start mb-2.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Tag label={opportunity.type} size="sm" />
        </div>
        
        {/* Actions: Clean Icon Row */}
        <div className="flex items-center gap-1 shrink-0">
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
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[3]" /> : <Share2 className="h-3.5 w-3.5" />}
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
                <Scale className={cn("h-3.5 w-3.5", isComparing ? "text-white" : "")} />
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
              <Heart className={cn("h-3.5 w-3.5", isSaved && "fill-current text-rose-500")} />
            </button>
          )}
        </div>
      </div>

      {/* ─── Opportunity Title ─── */}
      <h3 className={cn(
        "font-semibold text-surface-900 dark:text-white mb-1.5 leading-snug group-hover:text-rome-500 transition-colors line-clamp-2",
        compact ? "text-sm" : "text-base"
      )}>
        {opportunity.title}
      </h3>
      
      <div className="text-xs text-surface-400 dark:text-surface-500 mb-2 truncate" title={orgName}>
        {orgName}
      </div>
      
      {/* ─── Short Description (Tight 2 lines) ─── */}
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2 leading-relaxed">
        {opportunity.shortDescription || opportunity.description}
      </p>

      {/* ─── Compact Fit / Match Indicator Pill ─── */}
      {relevanceScore !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0">
              <span className="text-xs text-surface-400 truncate" title={relevanceReasons?.join(' · ')}>
                {relevanceScore}% match{relevanceReasons && relevanceReasons.length > 0 ? ` · ${relevanceReasons[0]}` : ''}
              </span>
            </div>

            {/* Optional debug mode toggle */}
            {showDebugSignals && matchSignals && (
              <button 
                onClick={(e) => { e.stopPropagation(); setDebugExpanded(!debugExpanded); }}
                className="text-[10px] text-surface-400 hover:text-rome-500 shrink-0 flex items-center gap-0.5"
                title="Inspect matching criteria"
              >
                <span>debug</span>
                {debugExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>

          {/* Collapsible Debug Signals Tray */}
          {showDebugSignals && debugExpanded && matchSignals && (
            <div className="mt-1.5 p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-[10px] font-mono space-y-1 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700">
              <div className="flex justify-between">
                <span>Field/Interest Match:</span>
                <span className={matchSignals.interestMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-400"}>
                  {matchSignals.interestMatch ? `✓ (+${matchSignals.fieldMatchScore})` : '✗ (0)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Skill Overlap:</span>
                <span className={matchSignals.skillMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-400"}>
                  {matchSignals.skillMatch ? `✓ (+${matchSignals.skillMatchScore})` : '✗ (0)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Goal/Intent Match:</span>
                <span className={matchSignals.goalMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-400"}>
                  {matchSignals.goalMatch ? `✓ (+${matchSignals.goalMatchScore})` : '✗ (0)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Opportunity Type Match:</span>
                <span className={matchSignals.typeMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-400"}>
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
                <span className={matchSignals.locationMatch ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-surface-400"}>
                  {matchSignals.locationMatch ? `✓ (+${matchSignals.locationScore})` : 'neutral'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Footer: Deadline + Location + Funding Badge ─── */}
      <div className="mt-auto pt-2.5 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between text-xs text-surface-500 dark:text-surface-400 gap-2">
        <div className="flex items-center gap-3 truncate">
          {opportunity.deadline ? (
            <DeadlineIndicator deadline={opportunity.deadline} />
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-surface-400">
              <Calendar className="h-3 w-3" /> Rolling
            </span>
          )}
          
          {opportunity.location && (
            <span className="flex items-center gap-1 text-[11px] truncate max-w-[110px]" title={opportunity.location}>
              <MapPin className="h-3 w-3 shrink-0 text-surface-400" />
              <span className="truncate">{opportunity.location}</span>
            </span>
          )}
        </div>

        {opportunity.funding && (
          <span 
            className="inline-flex items-center text-xs text-surface-500 dark:text-surface-400 shrink-0 max-w-[140px] truncate"
            title={opportunity.funding}
          >
            $<span className="truncate">{opportunity.funding}</span>
          </span>
        )}
      </div>
    </Card>
  );
};
