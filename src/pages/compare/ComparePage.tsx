import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { getAlternativeDiscoveries } from '@/services/personalization.service';
import { Button, Tag, DeadlineIndicator, Badge } from '@/components/ui';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { X, ArrowRight, Lightbulb, Scale, Plus, Sparkles, DollarSign } from 'lucide-react';
import { Opportunity, AlternativeDiscovery } from '@/types/models';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rome-100 dark:bg-rome-900/40 text-rome-600 dark:text-rome-400">
              <Scale className="w-5 h-5" />
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
                  <th className="p-6 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50 text-left w-52 align-bottom">
                    <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Parameters</span>
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <th key={opp.id} className="p-6 border-b border-surface-200 dark:border-surface-800 align-top min-w-[280px] w-[300px] bg-white dark:bg-surface-900 relative group">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <div className="text-left">
                          <p className="text-xs font-semibold text-rome-600 dark:text-rome-400 mb-1">
                            {typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
                          </p>
                          <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 line-clamp-2">{opp.title}</h3>
                          
                          {/* Prominent Value Badge in Header */}
                          <div className="mt-2.5">
                            {opp.funding ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <DollarSign className="w-3.5 h-3.5" />
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
                <tr className="bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 transition-colors">
                  <td className="p-4 pl-6 font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100/40 dark:bg-emerald-900/20">
                    Financial Value & Stipend
                  </td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      {opp.funding ? (
                        <div className="space-y-1">
                          <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 block">
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
                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 bg-surface-50/30 dark:bg-surface-900/10 align-top pt-4">
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
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 bg-surface-50/30 dark:bg-surface-900/10">Type & Fields</td>
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
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 bg-surface-50/30 dark:bg-surface-900/10">Deadline</td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      {opp.deadline ? <DeadlineIndicator deadline={opp.deadline} /> : 'No deadline'}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 bg-surface-50/30 dark:bg-surface-900/10">Duration & Setup</td>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4">
                      <div className="font-medium text-surface-900 dark:text-surface-100">{opp.duration || 'Flexible'}</div>
                      <div className="text-xs text-surface-500 mt-0.5">{opp.location} • {opp.remoteStatus}</div>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-surface-50/50 dark:hover:bg-surface-900/20 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 bg-surface-50/30 dark:bg-surface-900/10">Eligibility Level</td>
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
                  <td className="p-4 pl-6 font-semibold text-surface-600 dark:text-surface-400 bg-surface-50/30 dark:bg-surface-900/10 align-top pt-5">Key Requirements</td>
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
                      <Button variant="primary" fullWidth size="sm" onClick={() => navigate(`/opportunity/${opp.id}`)}>
                        View Details
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked View */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-8 gap-4">
            {compareOpps.map((opp: Opportunity) => (
              <div key={opp.id} className="min-w-[85vw] snap-center bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-5 flex flex-col shadow-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-semibold text-rome-600 mb-1">
                      {typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
                    </p>
                    <h3 className="text-base font-bold text-surface-900 dark:text-surface-50">{opp.title}</h3>
                  </div>
                  <button onClick={() => removeFromCompare(opp.id)} className="p-1.5 bg-surface-100 rounded-md text-surface-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4 flex-1 text-sm border-t border-surface-100 dark:border-surface-800 pt-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                    <span className="text-surface-500 text-xs font-medium block mb-0.5">Value / Funding</span>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{opp.funding || 'Unfunded / Not specified'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-surface-500 text-xs font-medium">Type</span>
                    <Tag label={opp.type} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-surface-500 text-xs font-medium">Deadline</span>
                    {opp.deadline ? <DeadlineIndicator deadline={opp.deadline} /> : 'No deadline'}
                  </div>
                  <div>
                    <span className="text-surface-500 text-xs font-medium block mb-1">Location</span>
                    <p className="text-xs font-medium text-surface-800 dark:text-surface-200">{opp.location} ({opp.remoteStatus})</p>
                  </div>
                  <div>
                    <span className="text-surface-500 text-xs font-medium block mb-1">Key Requirements</span>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-surface-700 dark:text-surface-300">
                      {opp.requirements?.slice(0, 3).map((req: string, i: number) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button variant="primary" fullWidth size="sm" className="mt-6" onClick={() => navigate(`/opportunity/${opp.id}`)}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 rounded-2xl p-6 sm:p-8 mb-10 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <span className="inline-flex p-3 rounded-2xl bg-rome-100 dark:bg-rome-900/40 text-rome-600 dark:text-rome-400">
              <Scale className="w-8 h-8" />
            </span>
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">
              {compareOpps.length === 1 ? 'Select 1 more opportunity to compare' : 'Select opportunities to compare side-by-side'}
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableOpps.slice(0, 9).map((opp: Opportunity) => {
            const isComparing = comparisons.includes(opp.id);
            return (
              <div key={opp.id} className="h-full flex flex-col">
                <OpportunityCard
                  opportunity={opp}
                  showCompareButton={true}
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
