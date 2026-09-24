import React from 'react';
import { Opportunity } from '@/types/models';
import { OpportunityCard } from './OpportunityCard';
import { LoadingSkeleton, EmptyState, OpportunityCardSkeleton } from '@/components/ui';
import { cn } from '@/utils/cn';
import { Search } from 'lucide-react';

export interface OpportunityListProps {
  opportunities: Opportunity[];
  loading?: boolean;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  columns?: 1 | 2 | 3;
  onItemClick?: (id: string) => void;
  onOpportunityClick?: (id: string) => void;
  savedIds?: Set<string>;
  isOpportunitySaved?: (id: string) => boolean;
  onSave?: (id: string) => void;
  onSaveOpportunity?: (id: string) => void;
  onUnsave?: (id: string) => void;
  onUnsaveOpportunity?: (id: string) => void;
  showSaveButton?: boolean;
  className?: string;
}

export const OpportunityList: React.FC<OpportunityListProps> = ({
  opportunities,
  loading = false,
  emptyMessage = "No opportunities found",
  emptyActionLabel,
  onEmptyAction,
  columns = 3,
  onItemClick,
  onOpportunityClick,
  savedIds = new Set(),
  isOpportunitySaved,
  onSave,
  onSaveOpportunity,
  onUnsave,
  onUnsaveOpportunity,
  showSaveButton = true,
  className
}) => {
  const handleClick = onOpportunityClick || onItemClick;
  const handleSave = onSaveOpportunity || onSave;
  const handleUnsave = onUnsaveOpportunity || onUnsave;

  if (loading) {
    return (
      <div className={cn(
        "grid gap-6",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}>
        {Array.from({ length: 6 }).map((_, i) => (
          <OpportunityCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={emptyMessage}
        description="Try adjusting your filters or search terms."
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        className={className}
      />
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {opportunities.map(opportunity => {
        const isItemSaved = isOpportunitySaved 
          ? isOpportunitySaved(opportunity.id) 
          : savedIds.has(opportunity.id);

        return (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            isSaved={isItemSaved}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onClick={handleClick}
            showSaveButton={showSaveButton}
            compact={columns > 1}
          />
        );
      })}
    </div>
  );
};

export default OpportunityList;
