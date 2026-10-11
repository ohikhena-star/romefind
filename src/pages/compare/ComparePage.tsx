import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { getAlternativeDiscoveries } from '@/services/personalization.service';
import { Button, Tag, DeadlineIndicator, SolarIcon } from '@/components/ui';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { Opportunity, AlternativeDiscovery, RemoteStatus } from '@/types/models';
import { cn } from '@/utils/cn';

export default function ComparePage() {
  const navigate = useNavigate();
  const { comparisons, addToCompare, removeFromCompare, isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();
  const { opportunities } = useOpportunityStore();
  const { user } = useAuthStore();
  const [filterType, setFilterType] = useState<string>('All');

  const compareOpps: Opportunity[] = useMemo(() => {
    return comparisons
      .map((id: string) => opportunities.find((o: Opportunity) => o.id === id))
      .filter(Boolean) as Opportunity[];
  }, [comparisons, opportunities]);

  const uniqueTypes = useMemo(() => Array.from(new Set(compareOpps.map(o => o.type))), [compareOpps]);

  const alternatives: AlternativeDiscovery[] = useMemo(() => {
    if (!user?.profile || !user?.preferences || uniqueTypes.length === 0) return [];
    return uniqueTypes.flatMap(type => getAlternativeDiscoveries(type, opportunities, user.profile, user.preferences));
  }, [uniqueTypes, opportunities, user]);

  const availableOpps = useMemo(() => {
    return opportunities
      .filter(o => !comparisons.includes(o.id))
      .filter(o => filterType === 'All' || o.type === filterType);
  }, [opportunities, comparisons, filterType]);

  const allTypes = useMemo(() => ['All', 'Fellowship', 'Scholarship', 'Internship', 'Research', 'Grant', 'Competition', 'Programme'], []);

  return (
    <div className="w-full py-6 md:py-10 animate-in fade-in">
      {/* ─── Header & Comparison Status ─── */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rome-50 dark:bg-rome-950/40 text-rome-600 dark:text-rome-400 border border-rome-200/60 dark:border-rome-900/40">
              <SolarIcon name="scale-linear" size={18} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50">
              Compare Opportunities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Evaluate funding, deadlines, location, and requirements side-by-side ({compareOpps.length}/4 selected).
          </p>
        </div>

        {compareOpps.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold h-9 px-3 rounded-xl border-surface-200 dark:border-surface-700"
              onClick={() => comparisons.forEach(id => removeFromCompare(id))}
            >
              Clear Comparison
            </Button>
          </div>
        )}
      </header>

      {/* ─── Side-by-Side Comparison Section (When 2+ selected) ─── */}
      {compareOpps.length >= 2 ? (
        <section aria-label="Comparison Table" className="mb-12">
          {/* Desktop Matrix View */}
          <div className="hidden md:block overflow-x-auto pb-4">
            <table className="w-full min-w-[760px] border-collapse bg-white dark:bg-surface-900 rounded-2xl overflow-hidden shadow-xs border border-surface-200 dark:border-surface-800 text-left">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-850/60">
                  <th scope="col" className="p-5 text-xs font-bold uppercase tracking-wider text-surface-500 w-48 align-bottom">
                    Attributes
                  </th>
                  {compareOpps.map((opp: Opportunity) => {
                    const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
                    return (
                      <th key={opp.id} scope="col" className="p-5 align-top min-w-[260px] w-1/3 border-l border-surface-200/80 dark:border-surface-800 relative">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 truncate uppercase tracking-wider">
                              {orgName}
                            </p>
                            <h2 className="text-base font-bold text-surface-950 dark:text-white line-clamp-2 leading-snug mt-0.5">
                              {opp.title}
                            </h2>
                          </div>
                          <button
                            onClick={() => removeFromCompare(opp.id)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0 cursor-pointer"
                            aria-label={`Remove ${opp.title} from comparison`}
                            title="Remove"
                          >
                            <SolarIcon name="close-circle-linear" size={18} />
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800 text-xs sm:text-sm">
                {/* 1. Type & Field */}
                <tr>
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400">
                    Category & Field
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Tag label={opp.type} />
                        {opp.field?.slice(0, 2).map((f: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 2. Funding / Stipend */}
                <tr className="bg-surface-50/50 dark:bg-surface-850/20">
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400">
                    Funding / Value
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800">
                      {opp.funding ? (
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">
                          {opp.funding}
                        </span>
                      ) : (
                        <span className="text-surface-400 text-xs">Unfunded / Not specified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 3. Deadline */}
                <tr>
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400">
                    Deadline
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800">
                      {opp.deadline ? (
                        <DeadlineIndicator deadline={opp.deadline} />
                      ) : (
                        <span className="text-surface-600 dark:text-surface-400 text-xs">Rolling / Ongoing</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 4. Format & Location */}
                <tr className="bg-surface-50/50 dark:bg-surface-850/20">
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400">
                    Location & Work Setup
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800">
                      <div className="font-medium text-surface-900 dark:text-surface-100 text-xs">
                        {opp.remoteStatus === RemoteStatus.Remote ? 'Remote' : (opp.location || 'Global / Flexible')}
                      </div>
                      <div className="text-xs text-surface-500 mt-0.5">
                        Duration: {opp.duration || 'Flexible'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. Requirements & Eligibility */}
                <tr>
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Eligibility & Requirements
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 align-top border-l border-surface-100 dark:border-surface-800">
                      <div className="space-y-2 text-xs">
                        {opp.educationRequirements && opp.educationRequirements.length > 0 && (
                          <p className="text-surface-700 dark:text-surface-300">
                            <strong>Education:</strong> {opp.educationRequirements.join(', ')}
                          </p>
                        )}
                        {opp.experienceRequirements && (
                          <p className="text-surface-700 dark:text-surface-300">
                            <strong>Experience:</strong> {opp.experienceRequirements}
                          </p>
                        )}
                        {opp.requirements && opp.requirements.length > 0 && (
                          <ul className="list-disc pl-4 space-y-1 text-surface-600 dark:text-surface-400">
                            {opp.requirements.slice(0, 2).map((req: string, i: number) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 6. Action Row */}
                <tr className="bg-surface-50 dark:bg-surface-850/50">
                  <td className="p-4"></td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-200/80 dark:border-surface-800">
                      <Button
                        variant="default"
                        size="default"
                        className="w-full h-11 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs"
                        onClick={() => navigate(`/opportunity/${opp.id}`)}
                      >
                        <span>View Opportunity</span>
                        <SolarIcon name="alt-arrow-right-linear" size={14} />
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="md:hidden flex flex-col w-full space-y-4">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider px-1">
              Comparing {compareOpps.length} opportunities side-by-side
            </p>

            {compareOpps.map((opp: Opportunity) => {
              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
              return (
                <article
                  key={opp.id}
                  className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-surface-100 dark:border-surface-800 pb-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider truncate block">
                        {orgName}
                      </span>
                      <h2 className="text-sm font-bold text-surface-950 dark:text-white line-clamp-2 mt-0.5">
                        {opp.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => removeFromCompare(opp.id)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0"
                      aria-label={`Remove ${opp.title} from comparison`}
                    >
                      <SolarIcon name="close-circle-linear" size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-surface-400 block">Category</span>
                      <span className="font-semibold text-surface-900 dark:text-white truncate block">{opp.type}</span>
                    </div>
                    <div>
                      <span className="text-surface-400 block">Funding</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate block">
                        {opp.funding || 'Unfunded'}
                      </span>
                    </div>
                    <div>
                      <span className="text-surface-400 block">Deadline</span>
                      <span className="font-semibold text-surface-900 dark:text-white truncate block">
                        {opp.deadline ? <DeadlineIndicator deadline={opp.deadline} /> : 'Rolling'}
                      </span>
                    </div>
                    <div>
                      <span className="text-surface-400 block">Location</span>
                      <span className="font-semibold text-surface-900 dark:text-white truncate block">
                        {opp.remoteStatus === RemoteStatus.Remote ? 'Remote' : (opp.location || 'Global')}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="default"
                    size="default"
                    className="w-full justify-center h-11 min-h-[44px] text-xs font-semibold rounded-xl bg-rome-500 hover:bg-rome-600 text-white"
                    onClick={() => navigate(`/opportunity/${opp.id}`)}
                  >
                    <span>View Opportunity</span>
                    <SolarIcon name="alt-arrow-right-linear" size={14} />
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      ) : compareOpps.length === 1 ? (
        /* ─── 1 Opportunity Selected State (Prompt for 2nd) ─── */
        <div className="mb-10 bg-surface-50 dark:bg-surface-900 border border-rome-200/80 dark:border-rome-900/60 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-200/80 dark:border-surface-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rome-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-bold text-surface-900 dark:text-surface-100">
                1 of 2 opportunities selected
              </h2>
            </div>
            <span className="text-xs text-surface-500">
              Select 1 more opportunity below to unlock comparison
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compareOpps.map((opp: Opportunity) => {
              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
              return (
                <div key={opp.id} className="p-4 bg-white dark:bg-surface-850 rounded-xl border border-surface-200 dark:border-surface-700 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider block">
                      {orgName}
                    </span>
                    <h3 className="text-sm font-bold text-surface-900 dark:text-white truncate">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-surface-500">
                      <span>{opp.type}</span>
                      <span>•</span>
                      <span>{opp.funding || 'Unfunded'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCompare(opp.id)}
                    className="p-1.5 text-surface-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                    title="Remove from comparison"
                  >
                    <SolarIcon name="close-circle-linear" size={18} />
                  </button>
                </div>
              );
            })}

            {/* Second Slot Invitation */}
            <div className="p-4 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 flex items-center justify-center text-center">
              <p className="text-xs font-medium text-surface-500">
                Click <strong className="text-rome-600 dark:text-rome-400">+ Add to Compare</strong> on an opportunity below
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ─── 0 Selected Empty State ─── */
        <div className="bg-surface-50 dark:bg-surface-900/40 border border-surface-200 dark:border-surface-800 rounded-2xl p-8 sm:p-10 mb-10 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <span className="inline-flex p-3 rounded-2xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
              <SolarIcon name="scale-linear" size={28} />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-50">
              No opportunities selected to compare
            </h2>
            <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              Add 2 to 4 opportunities from the list below to compare funding packages, deadlines, and eligibility side-by-side.
            </p>
          </div>
        </div>
      )}

      {/* ─── Available Opportunities to Compare ─── */}
      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-50">
              Available Opportunities to Add
            </h2>
            <p className="text-xs text-surface-500">
              Browse options and add to your active comparison dock.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {allTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[32px]",
                  filterType === type
                    ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900"
                    : "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-200/60 dark:border-surface-700"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {availableOpps.slice(0, 9).map((opp: Opportunity) => {
            const isComparing = comparisons.includes(opp.id);
            return (
              <div key={opp.id} className="h-full flex flex-col">
                <OpportunityCard
                  opportunity={opp}
                  showCompareButton={true}
                  primaryAction="compare"
                  compact={true}
                  isComparing={isComparing}
                  onToggleCompare={() => {
                    if (isComparing) {
                      removeFromCompare(opp.id);
                    } else {
                      addToCompare(opp.id);
                    }
                  }}
                  showSaveButton
                  isSaved={isSaved(opp.id)}
                  onSave={() => saveOpportunity(opp.id)}
                  onUnsave={() => unsaveOpportunity(opp.id)}
                  onClick={() => navigate(`/opportunity/${opp.id}`)}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Alternative Pathways Section ─── */}
      {alternatives.length > 0 && (
        <aside aria-label="Alternative pathways" className="mt-14 pt-8 border-t border-surface-200 dark:border-surface-800">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-1 flex items-center gap-2">
            <SolarIcon name="magic-stick-linear" size={18} className="text-rome-500" />
            Alternative Pathways
          </h2>
          <p className="text-xs text-surface-500 mb-6">
            Parallel formats that advance the same goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {alternatives.slice(0, 4).map((alt: AlternativeDiscovery, i: number) => (
              <div
                key={i}
                className="group bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 cursor-pointer hover:border-rome-300 dark:hover:border-rome-700 hover:shadow-card transition-all"
                onClick={() => navigate(`/explore?type=${encodeURIComponent(alt.alternativeType)}`)}
              >
                <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 mb-1.5 group-hover:text-rome-600 transition-colors">
                  Consider {alt.alternativeType} instead of {alt.sourceType}
                </h3>
                <p className="text-xs text-surface-600 dark:text-surface-300 mb-3 leading-relaxed">
                  {alt.reason}
                </p>
                <span className="text-xs font-semibold text-rome-600 dark:text-rome-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Explore {alt.alternativeType} ({alt.count} available)
                  <SolarIcon name="alt-arrow-right-linear" size={13} />
                </span>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
