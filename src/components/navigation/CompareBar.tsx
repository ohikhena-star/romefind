import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { Button } from '@/components/ui/Button';
import { Scale, X, ArrowRight, DollarSign } from 'lucide-react';
import { Opportunity } from '@/types/models';

export const CompareBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { comparisons, removeFromCompare } = useApplicationStore();
  const { opportunities } = useOpportunityStore();

  // Don't show compare bar on the compare page itself
  if (location.pathname === '/compare' || comparisons.length === 0) {
    return null;
  }

  const selectedOpps = comparisons
    .map((id: string) => opportunities.find((o: Opportunity) => o.id === id))
    .filter(Boolean) as Opportunity[];

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl animate-in slide-in-from-bottom duration-300 pointer-events-auto">
      <div className="bg-surface-900/95 dark:bg-surface-950/95 backdrop-blur-md text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl border border-surface-700/80 dark:border-surface-700 flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rome-400 shrink-0">
            <Scale className="w-4 h-4 text-rome-400" />
            <span className="hidden sm:inline">Compare</span>
            <span className="bg-rome-500/20 text-rome-300 px-1.5 py-0.5 rounded text-[11px]">
              {comparisons.length}/4
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedOpps.map((opp) => (
              <div 
                key={opp.id}
                className="flex items-center gap-1.5 bg-surface-800/90 px-2.5 py-1 rounded-lg text-xs font-medium border border-surface-700 max-w-[160px] shrink-0"
              >
                <div className="flex flex-col truncate">
                  <span className="truncate font-semibold text-[11px]">{opp.title}</span>
                  {opp.funding && (
                    <span className="text-[10px] text-emerald-400 truncate flex items-center gap-0.5 font-bold">
                      <DollarSign className="w-2.5 h-2.5 inline shrink-0" />
                      {opp.funding}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeFromCompare(opp.id)}
                  className="text-surface-400 hover:text-white transition-colors p-0.5 ml-1 cursor-pointer"
                  aria-label={`Remove ${opp.title} from comparison`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/compare')}
            className="text-xs font-bold shadow-md whitespace-nowrap"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {comparisons.length >= 2 ? 'Compare Matrix' : 'Compare'}
          </Button>
        </div>
      </div>
    </div>
  );
};
