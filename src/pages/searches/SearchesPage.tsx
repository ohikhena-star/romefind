import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useApplicationStore } from '@/store/applicationStore';
import { OpportunityCard } from '@/components/opportunity';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { searchOpportunities } from '@/services/search.service';
import { resolveFieldContext, getTrendingOpportunitiesForContext } from '@/services/trending.service';
import { Opportunity } from '@/types/models';
import { FIELDS } from '@/utils/constants';
import { cn } from '@/utils/cn';

const POPULAR_FIELDS = [
  'Product Design',
  'Data Science',
  'Agriculture',
  'Customer Experience',
  'Software Engineering',
  'Finance',
  'Climate & Sustainability',
  'Journalism',
  'Teaching'
] as const;

export default function SearchesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { opportunities, isLoading } = useOpportunityStore();
  const { user } = useAuthStore();
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useUIStore();
  const { isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();

  const initialQuery = searchParams.get('q') || '';
  const initialField = searchParams.get('field') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeFieldOverride, setActiveFieldOverride] = useState<string | null>(initialField || null);

  // Sync state if URL search parameters change
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) setQuery(qParam);
    const fParam = searchParams.get('field');
    if (fParam !== null) setActiveFieldOverride(fParam);
  }, [searchParams]);

  // Handle Search Submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery) {
      addRecentSearch(cleanQuery);
      setSearchParams({ q: cleanQuery });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams);
    }
  };

  const handleSelectRecentSearch = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    setSearchParams({ q: term });
  };

  const handleSelectField = (field: string) => {
    if (activeFieldOverride === field) {
      setActiveFieldOverride(null);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('field');
      setSearchParams(newParams);
    } else {
      setActiveFieldOverride(field);
      setSearchParams({ field });
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    setSearchParams(newParams);
  };

  // Search Results for active query
  const searchResults: Opportunity[] = useMemo(() => {
    if (!query.trim()) return [];
    return searchOpportunities(query.trim(), opportunities);
  }, [query, opportunities]);

  // Resolve Field Context following strict hierarchy
  const resolvedContext = useMemo(() => {
    return resolveFieldContext({
      currentQuery: query,
      explicitField: activeFieldOverride || undefined,
      exploreFilterField: searchParams.get('field') || undefined,
      preferences: user?.preferences,
      profile: user?.profile,
      recentSearches: recentSearches || []
    });
  }, [query, activeFieldOverride, searchParams, user, recentSearches]);

  // Compute genuine Field-Based Trending Opportunities
  const trendingData = useMemo(() => {
    return getTrendingOpportunitiesForContext(
      opportunities,
      resolvedContext.fieldContext,
      6
    );
  }, [opportunities, resolvedContext.fieldContext]);

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      {/* ─── Page Header ─── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rome-50 dark:bg-rome-950/60 border border-rome-200/60 dark:border-rome-800/40 flex items-center justify-center text-rome-500">
            <SolarIcon name="magnifer-linear" size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-white">
              Searches & Trends
            </h1>
            <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
              Explore your search history, discover relevant opportunities, and see what's trending by field.
            </p>
          </div>
        </div>

        {/* ─── Main Search Input Bar ─── */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
              <SolarIcon name="magnifer-linear" size={18} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role, skills, field (e.g. Product Design, Agriculture, Customer Experience)..."
              className="w-full pl-11 pr-24 py-3.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500 shadow-xs transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1.5 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                  aria-label="Clear search query"
                >
                  <SolarIcon name="close-circle-linear" size={16} />
                </button>
              )}
              <button
                type="submit"
                className="px-3.5 py-2 bg-rome-500 hover:bg-rome-600 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ─── Section 1: Recent Searches ─── */}
      <section className="space-y-4 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SolarIcon name="clock-circle-linear" size={18} className="text-surface-500" />
            <h2 className="text-sm sm:text-base font-bold text-surface-950 dark:text-white">
              Recent Searches
            </h2>
            {recentSearches && recentSearches.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 font-medium">
                {recentSearches.length}
              </span>
            )}
          </div>
          {recentSearches && recentSearches.length > 0 && (
            <button
              onClick={clearRecentSearches}
              className="text-xs font-semibold text-surface-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {recentSearches && recentSearches.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {recentSearches.map((term) => (
              <div
                key={term}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800/80 border border-surface-200/80 dark:border-surface-700/60 text-xs text-surface-800 dark:text-surface-200 hover:border-surface-300 dark:hover:border-surface-600 transition-all group"
              >
                <button
                  onClick={() => handleSelectRecentSearch(term)}
                  className="flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <SolarIcon name="magnifer-linear" size={13} className="text-surface-400 group-hover:text-rome-500" />
                  <span>{term}</span>
                </button>
                <button
                  onClick={() => removeRecentSearch(term)}
                  className="text-surface-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
                  aria-label={`Remove recent search for ${term}`}
                >
                  <SolarIcon name="close-circle-linear" size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 text-center rounded-xl bg-surface-50 dark:bg-surface-800/30 border border-dashed border-surface-200 dark:border-surface-800">
            <SolarIcon name="magnifer-linear" size={24} className="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
            <p className="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-300">
              No recent searches yet
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
              Your search history will appear here as you look for roles, organizations, or fields.
            </p>
          </div>
        )}
      </section>

      {/* ─── Section 2: Search Results (when active) ─── */}
      {query.trim() && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-950 dark:text-white">
                Results for "{query.trim()}"
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {searchResults.length} {searchResults.length === 1 ? 'opportunity' : 'opportunities'} found
              </p>
            </div>
            <button
              onClick={() => navigate(`/explore?q=${encodeURIComponent(query.trim())}`)}
              className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline flex items-center gap-1"
            >
              <span>Explore full filters</span>
              <SolarIcon name="alt-arrow-right-linear" size={14} />
            </button>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isSaved={isSaved(opp.id)}
                  onSave={saveOpportunity}
                  onUnsave={unsaveOpportunity}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-2">
              <SolarIcon name="danger-circle-linear" size={28} className="mx-auto text-surface-400" />
              <h3 className="text-sm font-bold text-surface-900 dark:text-white">No direct matches found</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
                Try searching for related skills, exploring trending opportunities below, or broadening your keywords.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ─── Section 3: Field-Based Trending Opportunities ─── */}
      <section className="space-y-5">
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-rome-500">
                <SolarIcon name="graph-up-linear" size={16} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-surface-950 dark:text-white">
                Trending in {resolvedContext.fieldContext}
              </h2>
            </div>
            
            {/* Context Origin Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-rome-500"></span>
              {resolvedContext.sourceDescription}
            </span>
          </div>

          {/* Quick Context Switcher Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-surface-400 mr-1">Switch field:</span>
            {POPULAR_FIELDS.map((field) => {
              const isSelected = resolvedContext.fieldContext.toLowerCase() === field.toLowerCase();
              return (
                <button
                  key={field}
                  onClick={() => handleSelectField(field)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                    isSelected
                      ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 shadow-xs"
                      : "bg-surface-100 dark:bg-surface-800/80 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200/60"
                  )}
                >
                  {field}
                </button>
              );
            })}
          </div>
        </div>

        {/* Low inventory honest note */}
        {trendingData.isLowInventory && (
          <div className="px-4 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 text-xs text-surface-600 dark:text-surface-400 flex items-center gap-2">
            <SolarIcon name="info-circle-linear" size={15} className="text-surface-400 flex-shrink-0" />
            <span>Showing all {trendingData.totalMatching} available opportunities in {resolvedContext.fieldContext}.</span>
          </div>
        )}

        {/* Trending Cards Grid */}
        {trendingData.opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingData.opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isSaved={isSaved(opp.id)}
                onSave={saveOpportunity}
                onUnsave={unsaveOpportunity}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-2">
            <SolarIcon name="info-circle-linear" size={24} className="mx-auto text-surface-400" />
            <h3 className="text-sm font-bold text-surface-900 dark:text-white">
              No active opportunities currently in {resolvedContext.fieldContext}
            </h3>
            <p className="text-xs text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
              Select another field above or check back as new opportunities are verified.
            </p>
          </div>
        )}
      </section>

      {/* ─── Section 4: Browse by All Canonical Fields ─── */}
      <section className="space-y-4 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <SolarIcon name="layers-minimalistic-linear" size={18} className="text-surface-500" />
          <h2 className="text-sm sm:text-base font-bold text-surface-950 dark:text-white">
            Explore All Fields
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FIELDS.map((f) => (
            <button
              key={f}
              onClick={() => handleSelectField(f)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer",
                resolvedContext.fieldContext.toLowerCase() === f.toLowerCase()
                  ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 font-semibold"
                  : "bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-150 dark:hover:bg-surface-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
