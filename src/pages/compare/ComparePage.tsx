import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { getAlternativeDiscoveries } from '@/services/personalization.service';
import { Button, Tag, DeadlineIndicator, Badge, SolarIcon } from '@/components/ui';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { X, ArrowRight, Lightbulb, Plus, Sparkles, DollarSign } from 'lucide-react';
import { Opportunity, AlternativeDiscovery, RemoteStatus } from '@/types/models';

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
    <div className="w-full py-8 md:py-12 animate-in fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rome-100 dark:bg-rome-900/40 text-rome-600 dark:text-rome-400">
              <SolarIcon name="transfer-horizontal-linear" size={20} />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-950 dark:text-surface-50">
              Path & Opportunity Comparison
            </h1>
          </div>
          <p className="text-sm text-surface-500">
            Compare duration, funding, commitments, and requirements to choose your best next step ({comparisons.length}/4 selected).
          </p>
        </div>

        {comparisons.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => comparisons.forEach(id => removeFromCompare(id))}
            >
              Clear Comparison
            </Button>
          </div>
        )}
      </div>

      {/* When 2+ opportunities are selected: Full Comparison Table */}
      {compareOpps.length >= 2 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto pb-8 relative">
            <table className="w-full min-w-[800px] border-collapse bg-white dark:bg-surface-950 rounded-xl overflow-hidden shadow-card border border-surface-200 dark:border-surface-800">
              <thead>
                <tr>
                  <th className="p-6 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 text-left w-52 align-bottom">
                    <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Parameters</span>
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <th key={opp.id} className="p-6 border-b border-surface-200 dark:border-surface-800 align-top min-w-[280px] w-[300px] bg-surface-50 dark:bg-surface-900 relative group">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="text-left">
                          <p className="text-xs font-semibold text-rome-600 dark:text-rome-400 mb-1">
                            {typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
                          </p>
                          <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 line-clamp-2">{opp.title}</h3>
                          
                          {/* Prominent Value Badge in Header */}
                          <div className="mt-2.5">
                            {opp.funding ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 border border-surface-200 dark:border-surface-700">
                                <DollarSign className="w-3.5 h-3.5 text-surface-400" />
                                {opp.funding}
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded text-xs text-surface-500 bg-surface-100 dark:bg-surface-800">
                                Unfunded / Self-supported
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCompare(opp.id)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0 cursor-pointer"
                          aria-label="Remove from comparison"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800/50 text-sm">
                {/* Financial Value Row - Highlighted */}
                <tr className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-bold text-surface-900 dark:text-surface-100">
                    Financial Value & Stipend
                  </td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      {opp.funding ? (
                        <div className="space-y-1">
                          <span className="text-base font-bold text-surface-900 dark:text-surface-100 block">
                            {opp.funding}
                          </span>
                          <span className="text-xs text-surface-500">Includes direct funding / stipend</span>
                        </div>
                      ) : (
                        <span className="text-surface-400 font-medium">Unfunded / Not specified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Benefits & Support Package */}
                <tr className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400  align-top pt-4">
                    Benefits & Perks
                  </td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 align-top">
                      {opp.benefits && opp.benefits.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-1 text-xs text-surface-700 dark:text-surface-300">
                          {opp.benefits.map((benefit: string, idx: number) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs text-surface-400 italic">No extra perks listed</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 ">Type & Fields</td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Tag label={opp.type} />
                        {opp.field?.map((f: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 ">Deadline</td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      {opp.deadline ? <DeadlineIndicator deadline={opp.deadline} /> : 'No deadline'}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 ">Duration & Setup</td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      <div className="font-medium text-surface-900 dark:text-surface-100">{opp.duration || 'Flexible'}</div>
                      <div className="text-xs text-surface-500 mt-0.5">{opp.location} • {opp.remoteStatus}</div>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 ">Eligibility Level</td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      <div className="text-xs font-medium text-surface-800 dark:text-surface-200">
                        {opp.educationRequirements?.join(', ') || 'Any Education'}
                      </div>
                      <div className="text-[11px] text-surface-500 mt-0.5">
                        Experience: {opp.experienceRequirements || 'All Levels'}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400  align-top pt-5">Key Requirements</td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 align-top">
                      <ul className="list-disc pl-4 space-y-1.5 text-xs text-surface-700 dark:text-surface-300">
                        {opp.requirements?.slice(0, 3).map((req: string, i: number) => (
                          <li key={i}>{req}</li>
                        ))}
                        {(opp.requirements?.length || 0) > 3 && (
                          <li className="text-surface-400 list-none text-xs mt-1 italic">+{(opp.requirements?.length || 0) - 3} more</li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 border-b-0"></td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-6 border-b-0">
                      <Button variant="default" size="default" className="w-full h-11 min-h-[44px] text-sm font-semibold" onClick={() => navigate(`/opportunity/${opp.id}`)}>
                        View Details
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Comparison View (Ultra-Compact & Scannable Mobile Comparison Cards) */}
          <div className="md:hidden flex flex-col w-full space-y-2.5 mb-8">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500">
                Comparing {compareOpps.length} opportunities
              </span>
            </div>

            {compareOpps.map((opp: Opportunity) => {
              // Determine one concise useful comparison signal
              const comparisonSignal = opp.funding && opp.funding.toLowerCase() !== 'unfunded'
                ? { label: 'Funding', value: opp.funding }
                : opp.duration
                  ? { label: 'Duration', value: opp.duration }
                  : opp.experienceRequirements
                    ? { label: 'Eligibility', value: opp.experienceRequirements }
                    : { label: 'Format', value: opp.type };

              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;

              return (
                <div 
                  key={opp.id} 
                  className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-3.5 shadow-2xs space-y-2.5"
                >
                  {/* Row 1: Org + Title + Remove */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-rome-600 dark:text-rome-400 uppercase tracking-wider truncate">
                        {orgName}
                      </p>
                      <h3 className="text-sm font-bold text-surface-950 dark:text-white truncate">
                        {opp.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeFromCompare(opp.id)}
                      className="p-1 text-surface-400 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-md transition-colors shrink-0"
                      aria-label={`Remove ${opp.title} from comparison`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Row 2: Core parameters in a concise scannable grid */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 py-2 px-2.5 bg-surface-50 dark:bg-surface-800/50 rounded-lg text-xs">
                    <div>
                      <span className="text-surface-400 text-[11px] block">Type</span>
                      <span className="font-semibold text-surface-900 dark:text-white truncate block">{opp.type}</span>
                    </div>
                    <div>
                      <span className="text-surface-400 text-[11px] block">Deadline</span>
                      <span className="font-semibold text-surface-900 dark:text-white truncate block">
                        {opp.deadline ? <DeadlineIndicator deadline={opp.deadline} /> : 'Rolling'}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-surface-400 text-[11px] block">Location</span>
                      <span className="font-semibold text-surface-900 dark:text-white truncate block">
                        {opp.remoteStatus === RemoteStatus.Remote ? 'Remote' : (opp.location || 'Global')}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-surface-400 text-[11px] block">{comparisonSignal.label}</span>
                      <span className="font-semibold text-rome-600 dark:text-rome-400 truncate block">
                        {comparisonSignal.value}
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Action */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center h-8 text-xs font-semibold"
                    onClick={() => navigate(`/opportunity/${opp.id}`)}
                  >
                    <span>View Details</span>
                    <SolarIcon name="alt-arrow-right-linear" size={13} />
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      ) : compareOpps.length === 1 ? (
        /* 1 Opportunity Selected - Show first card + Invite second slot */
        <div className="mb-10 bg-white dark:bg-surface-900 border border-rome-200 dark:border-rome-900/60 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-100 dark:border-surface-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rome-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-bold text-surface-900 dark:text-surface-100">
                1 of 2 Opportunities Selected
              </h2>
            </div>
            <span className="text-xs text-surface-500 dark:text-surface-400">
              Select 1 more below to compare
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slot 1: Selected Opportunity */}
            {compareOpps.map((opp: Opportunity) => {
              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
              return (
                <div key={opp.id} className="p-3.5 bg-surface-50 dark:bg-surface-800/60 rounded-xl border border-surface-200 dark:border-surface-700 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-rome-600 dark:text-rome-400 uppercase tracking-wider block">
                      {orgName}
                    </span>
                    <h3 className="text-sm font-bold text-surface-900 dark:text-white truncate">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-surface-500">
                      <span>{opp.type}</span>
                      <span>•</span>
                      <span>{opp.remoteStatus === RemoteStatus.Remote ? 'Remote' : (opp.location || 'Global')}</span>
                      {opp.funding && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-surface-800 dark:text-surface-200">{opp.funding}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCompare(opp.id)}
                    className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-lg transition-colors shrink-0"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {/* Slot 2: Placeholder Invitation */}
            <div className="p-4 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 flex items-center justify-center text-center">
              <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
                Tap <strong className="text-rome-600 dark:text-rome-400">+ Add to Compare</strong> on any opportunity below to complete comparison
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 0 Opportunities Selected */
        <div className="bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 sm:p-8 mb-10 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <span className="inline-flex p-3 rounded-2xl bg-rome-100 dark:bg-rome-900/40 text-rome-600 dark:text-rome-400">
              <SolarIcon name="transfer-horizontal-linear" size={32} />
            </span>
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">
              Select opportunities to compare side-by-side
            </h2>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Click <strong className="text-rome-600 dark:text-rome-400">+ Add to Compare</strong> on any 2 to 4 opportunities below to evaluate deadlines, funding, and eligibility.
            </p>
          </div>
        </div>
      )}

      {/* Quick Add Opportunities Catalog */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rome-500" />
            Available Opportunities to Compare
          </h2>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {allTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === type
                    ? 'bg-rome-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 hover:bg-surface-200'
                }`}
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
      </div>

      {/* Sticky Mobile Comparison Dock */}
      {comparisons.length > 0 && (
        <div className="md:hidden fixed bottom-4 inset-x-4 z-40 bg-surface-900/95 dark:bg-surface-800/95 text-white p-3 rounded-2xl shadow-elevated backdrop-blur-md border border-surface-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rome-400 animate-pulse shrink-0" />
              <p className="text-xs font-bold truncate">
                {comparisons.length} of 4 selected to compare
              </p>
            </div>
            <p className="text-[11px] text-surface-400 truncate">
              {comparisons.length < 2 ? 'Select 1 more to compare' : 'Ready to compare side-by-side'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {comparisons.length >= 2 && (
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3 py-1.5 rounded-xl bg-rome-500 hover:bg-rome-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                View Comparison ↑
              </button>
            )}
            <button
              onClick={() => comparisons.forEach(id => removeFromCompare(id))}
              className="p-1.5 rounded-xl text-surface-400 hover:text-white transition-colors cursor-pointer"
              title="Clear all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Alternative Paths Discovery Section */}
      {alternatives.length > 0 && (
        <div className="mt-14 pt-10 border-t border-surface-200 dark:border-surface-800">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-rome-500" />
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Alternative Pathways you might have overlooked
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alternatives.slice(0, 4).map((alt: AlternativeDiscovery, i: number) => (
              <div 
                key={i} 
                className="group bg-rome-50/50 dark:bg-rome-950/20 border border-rome-200 dark:border-rome-900/40 rounded-xl p-6 cursor-pointer hover:shadow-card-hover transition-all"
                onClick={() => navigate(`/explore?type=${encodeURIComponent(alt.alternativeType)}`)}
              >
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-2">
                  Consider <span className="text-rome-600 dark:text-rome-400">{alt.alternativeType}</span> instead of {alt.sourceType}
                </h3>
                <p className="text-sm text-surface-600 dark:text-surface-300 mb-4 leading-relaxed">
                  {alt.reason}
                </p>
                <span className="text-xs font-bold text-rome-600 dark:text-rome-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore {alt.alternativeType} ({alt.count} matching) <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
