import React from 'react';
import { cn } from '@/utils/cn';
import { Heart, MapPin, DollarSign, Scale, Check } from 'lucide-react';
import { Opportunity } from '@/types/models';
import { Card, Tag, DeadlineIndicator, MatchIndicator } from '@/components/ui';
import { useApplicationStore } from '@/store/applicationStore';

export interface OpportunityCardProps {
  opportunity: Opportunity;
  relevanceScore?: number;
  relevanceReasons?: string[];
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
    if (onClick) onClick(opportunity.id);
  };

  return (
    <Card 
      hoverable={!!onClick}
      onClick={handleCardClick}
      padding={compact ? 'sm' : 'md'}
      className={cn(
        "flex flex-col h-full relative group transition-all duration-200",
        isComparing && "ring-2 ring-rome-500/70 dark:ring-rome-400 bg-rome-50/20 dark:bg-rome-950/10",
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag label={opportunity.type} size="sm" />
          <span className="text-xs font-medium text-surface-500 dark:text-surface-400 truncate max-w-[150px]">
            {typeof opportunity.organization === 'object' ? opportunity.organization.name : opportunity.organization}
          </span>
        </div>
        
        {/* Top Actions: Compare & Save */}
        <div className="flex items-center gap-1.5 shrink-0">
          {showCompareButton && (
            <button
              onClick={handleCompareToggle}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all z-10 cursor-pointer border shadow-2xs",
                isComparing
                  ? "bg-rome-500 text-white border-rome-600 dark:bg-rome-600 dark:border-rome-500 shadow-sm"
                  : "bg-surface-100 dark:bg-surface-800/90 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-rome-50 hover:text-rome-600 hover:border-rome-300 dark:hover:bg-surface-700"
              )}
              title={isComparing ? "Remove from Compare" : "Add to Compare"}
              aria-label="Toggle comparison"
            >
              {isComparing ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Comparing</span>
                </>
              ) : (
                <>
                  <Scale className="h-3.5 w-3.5 text-surface-500 group-hover:text-rome-500" />
                  <span>+ Compare</span>
                </>
              )}
            </button>
          )}

          {showSaveButton && (
            <button
              onClick={handleSaveToggle}
              className={cn(
                "p-1.5 rounded-lg transition-colors z-10 cursor-pointer",
                isSaved 
                  ? "text-rome-500 bg-rome-50 dark:bg-rome-900/30" 
                  : "text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 dark:hover:text-surface-300"
              )}
              aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
              title={isSaved ? "Saved" : "Save opportunity"}
            >
              <Heart className={cn("h-4 w-4", isSaved && "fill-current text-rome-500")} />
            </button>
          )}
        </div>
      </div>

      <h3 className={cn(
        "font-semibold text-surface-900 dark:text-white mb-2 leading-tight group-hover:text-rome-600 dark:group-hover:text-rome-400 transition-colors",
        compact ? "text-base line-clamp-2" : "text-lg"
      )}>
        {opportunity.title}
      </h3>
      
      <p className={cn(
        "text-sm text-surface-600 dark:text-surface-300 mb-4",
        compact ? "line-clamp-2" : "line-clamp-3"
      )}>
        {opportunity.shortDescription || opportunity.description}
      </p>

      {relevanceScore !== undefined && (
        <div className="mb-4 bg-surface-50 dark:bg-surface-800/50 p-3 rounded-lg border border-surface-100 dark:border-surface-700">
          <MatchIndicator 
            score={relevanceScore} 
            reasons={relevanceReasons} 
            compact={compact} 
          />
        </div>
      )}

      {/* Footer Info Row */}
      <div className="mt-auto pt-4 border-t border-surface-100 dark:border-surface-800/50 flex flex-wrap items-center gap-y-2 gap-x-4">
        {opportunity.deadline && (
          <DeadlineIndicator deadline={opportunity.deadline} />
        )}
        
        {opportunity.location && (
          <div className="flex items-center text-xs text-surface-600 dark:text-surface-400">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{opportunity.location}</span>
          </div>
        )}
        
        {opportunity.funding && (
          <div className="flex items-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full ml-auto max-w-[160px] truncate" title={opportunity.funding}>
            <DollarSign className="h-3 w-3 mr-0.5 shrink-0" />
            <span className="truncate">{opportunity.funding}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
