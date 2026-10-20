import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { searchOpportunities, sortByRelevance } from '@/services/search.service';
import { Chip, OpportunityList, EmptyState, Button, OpportunityGridSkeleton } from '@/components/ui';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { ContextualSignupModal, ContextualPromptType } from '@/components/auth/ContextualSignupModal';
import { categories } from '@/data/categories';
import { OpportunityType, RemoteStatus, Opportunity, SearchResult } from '@/types/models';
import { FIELDS, LOCATIONS } from '@/utils/constants';
import { cn } from '@/utils/cn';

// ─── Goal pill icon mapping (Solar icons) ───────────────────────────────────
const GOAL_ICON_MAP: Record<string, string> = {
  Briefcase:    'case-linear',
  DollarSign:   'dollar-minimalistic-linear',
  GraduationCap:'graduation-cap-linear',
  Target:       'target-linear',
  Layers:       'layers-minimalistic-linear',
  Users:        'users-group-rounded-linear',
  Microscope:   'test-tube-linear',
  TrendingUp:   'graph-up-linear',
  Globe:        'global-linear',
  Rocket:       'rocket-linear',
  Compass:      'compass-linear',
};

// ─── Filter section component (used inside the collapsible panel) ────────────
function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-2.5 block">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { opportunities, isLoading } = useOpportunityStore();
  const { isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addRecentSearch } = useUIStore();

  const [contextualPrompt, setContextualPrompt] = useState<{
    isOpen: boolean;
    type: ContextualPromptType;
    opportunityId?: string;
  }>({ isOpen: false, type: 'save' });

  // ── Filter state ─────────────────────────────────────────────────────────
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>(() => {
    const p = searchParams.get('type');
    return p ? (p.split(',').map(s => s.trim()).filter(Boolean) as OpportunityType[]) : [];
  });
  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    const p = searchParams.get('field');
    return p ? p.split(',').map(s => s.trim()).filter(Boolean) : [];
  });
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    const p = searchParams.get('location');
    return p ? p.split(',').map(s => s.trim()).filter(Boolean) : [];
  });
  const [fundedOnly, setFundedOnly] = useState<boolean>(() => searchParams.get('funded') === 'true');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(() => searchParams.get('remote') === 'true');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // ── UI state ─────────────────────────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  // Close filter panel on outside click
  useEffect(() => {
    if (!filtersOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [filtersOpen]);

  // Sync state from URL parameters
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) setQuery(qParam);
    const typeParam = searchParams.get('type');
    setSelectedTypes(typeParam ? (typeParam.split(',').map(s => s.trim()).filter(Boolean) as OpportunityType[]) : []);
    const fieldParam = searchParams.get('field');
    setSelectedFields(fieldParam ? fieldParam.split(',').map(s => s.trim()).filter(Boolean) : []);
    const locParam = searchParams.get('location');
    setSelectedLocations(locParam ? locParam.split(',').map(s => s.trim()).filter(Boolean) : []);
    const fundedParam = searchParams.get('funded');
    if (fundedParam !== null) setFundedOnly(fundedParam === 'true');
    const remoteParam = searchParams.get('remote');
    if (remoteParam !== null) setRemoteOnly(remoteParam === 'true');
  }, [searchParams]);

  // ── URL param sync ────────────────────────────────────────────────────────
  const updateUrlParams = (updates: {
    q?: string; types?: OpportunityType[]; fields?: string[];
    locations?: string[]; funded?: boolean; remote?: boolean;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    if (updates.q !== undefined) { if (updates.q.trim()) newParams.set('q', updates.q.trim()); else newParams.delete('q'); }
    if (updates.types !== undefined) { if (updates.types.length > 0) newParams.set('type', updates.types.join(',')); else newParams.delete('type'); }
    if (updates.fields !== undefined) { if (updates.fields.length > 0) newParams.set('field', updates.fields.join(',')); else newParams.delete('field'); }
    if (updates.locations !== undefined) { if (updates.locations.length > 0) newParams.set('location', updates.locations.join(',')); else newParams.delete('location'); }
    if (updates.funded !== undefined) { if (updates.funded) newParams.set('funded', 'true'); else newParams.delete('funded'); }
    if (updates.remote !== undefined) { if (updates.remote) newParams.set('remote', 'true'); else newParams.delete('remote'); }
    setSearchParams(newParams);
  };

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery && newQuery.trim().length > 1) addRecentSearch(newQuery.trim());
    updateUrlParams({ q: newQuery });
  };

  const toggleType = (t: OpportunityType) => {
    const updated = selectedTypes.includes(t) ? selectedTypes.filter(x => x !== t) : [...selectedTypes, t];
    setSelectedTypes(updated);
    updateUrlParams({ types: updated });
  };

  const toggleField = (f: string) => {
    const updated = selectedFields.includes(f) ? selectedFields.filter(x => x !== f) : [...selectedFields, f];
    setSelectedFields(updated);
    updateUrlParams({ fields: updated });
  };

  const toggleLocation = (loc: string) => {
    const updated = selectedLocations.includes(loc) ? selectedLocations.filter(x => x !== loc) : [...selectedLocations, loc];
    setSelectedLocations(updated);
    updateUrlParams({ locations: updated });
  };

  const clearAllFilters = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedFields([]);
    setSelectedLocations([]);
    setFundedOnly(false);
    setRemoteOnly(false);
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount =
    selectedTypes.length + selectedFields.length + selectedLocations.length +
    (fundedOnly ? 1 : 0) + (remoteOnly ? 1 : 0);

  const isFiltering = !!query || activeFiltersCount > 0;

  // ── Results computation ───────────────────────────────────────────────────
  const results: Opportunity[] = useMemo(() => {
    let filtered = searchOpportunities(query, opportunities, {
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      fields: selectedFields.length > 0 ? selectedFields : undefined,
      locations: selectedLocations.length > 0 ? selectedLocations : undefined,
      funded: fundedOnly ? true : null,
      remoteStatus: remoteOnly ? [RemoteStatus.Remote, RemoteStatus.Flexible] : undefined,
    });
    if (sortBy === 'deadline') {
      filtered = [...filtered].sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sortBy === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'relevance' && user?.profile && user?.preferences) {
      const scored: SearchResult[] = sortByRelevance(filtered, user.profile, user.preferences);
      return scored.map(s => s.opportunity);
    }
    return filtered;
  }, [query, opportunities, selectedTypes, selectedFields, selectedLocations, fundedOnly, remoteOnly, sortBy, user]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading && opportunities.length === 0) {
    return <OpportunityGridSkeleton count={6} className="py-8" />;
  }

  // ── Opportunity list to display ───────────────────────────────────────────
  const displayOpportunities = isFiltering ? results : opportunities;

  return (
    <div className="flex flex-col py-6 md:py-8 w-full min-h-screen gap-6">

      {/* ─── 1. Header ──────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50 mb-1">
          Explore
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Browse {opportunities.length} opportunities across fellowships, scholarships, jobs, and more.
        </p>
      </div>

      {/* ─── 2. Search + Filter controls ─────────────────────────────────── */}
      <div className="space-y-3">
        {/* Search row */}
        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1 min-w-0">
            <SolarIcon
              name="magnifer-linear"
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
            />
            <input
              type="search"
              role="searchbox"
              aria-label="Search opportunities"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by title, field, or organisation…"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/50 focus:border-rome-500 transition-all shadow-xs min-h-[44px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors p-1"
              >
                <SolarIcon name="close-circle-linear" size={16} />
              </button>
            )}
          </div>

          {/* Filters toggle button */}
          <div className="relative" ref={filterPanelRef}>
            <button
              type="button"
              onClick={() => setFiltersOpen(prev => !prev)}
              aria-expanded={filtersOpen}
              aria-controls="filter-panel"
              className={cn(
                "h-11 min-h-[44px] px-3.5 sm:px-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 shadow-xs cursor-pointer",
                filtersOpen || activeFiltersCount > 0
                  ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-surface-900 dark:border-white"
                  : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700"
              )}
            >
              <SolarIcon name="filter-linear" size={16} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className={cn(
                  "text-xs font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center",
                  filtersOpen || activeFiltersCount > 0
                    ? "bg-white/20 dark:bg-black/20"
                    : "bg-rome-500 text-white"
                )}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* ── Desktop Filter panel (popover) ────────────────────────────────── */}
            {filtersOpen && (
              <div
                id="filter-panel"
                role="dialog"
                aria-label="Filter opportunities"
                className="hidden sm:block absolute right-0 top-[calc(100%+8px)] z-50 w-[min(560px,calc(100vw-2rem))] bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-elevated p-5 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Panel header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-surface-900 dark:text-surface-50">Filter opportunities</h2>
                  <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={() => { clearAllFilters(); setFiltersOpen(false); }}
                        className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline cursor-pointer"
                      >
                        Clear all ({activeFiltersCount})
                      </button>
                    )}
                    <button
                      onClick={() => setFiltersOpen(false)}
                      aria-label="Close filters"
                      className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                      <SolarIcon name="close-circle-linear" size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Type */}
                  <FilterSection label="Opportunity type">
                    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
                      {Object.values(OpportunityType).map((type: OpportunityType) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleType(type)}
                          aria-pressed={selectedTypes.includes(type)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer min-h-[32px]",
                            selectedTypes.includes(type)
                              ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                              : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-400 dark:hover:border-surface-600"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Conditions */}
                  <FilterSection label="Conditions">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => { setFundedOnly(!fundedOnly); updateUrlParams({ funded: !fundedOnly }); }}
                        aria-pressed={fundedOnly}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer min-h-[32px]",
                          fundedOnly
                            ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                            : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-400 dark:hover:border-surface-600"
                        )}
                      >
                        Funded / Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRemoteOnly(!remoteOnly); updateUrlParams({ remote: !remoteOnly }); }}
                        aria-pressed={remoteOnly}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer min-h-[32px]",
                          remoteOnly
                            ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                            : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-400 dark:hover:border-surface-600"
                        )}
                      >
                        Remote / Flexible
                      </button>
                    </div>
                  </FilterSection>

                  {/* Field */}
                  <FilterSection label="Field of focus">
                    <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                      {FIELDS.map((field: string) => (
                        <button
                          key={field}
                          type="button"
                          onClick={() => toggleField(field)}
                          aria-pressed={selectedFields.includes(field)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer min-h-[32px]",
                            selectedFields.includes(field)
                              ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                              : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-400 dark:hover:border-surface-600"
                          )}
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Location */}
                  <FilterSection label="Location">
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {LOCATIONS.map((loc: string) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => toggleLocation(loc)}
                          aria-pressed={selectedLocations.includes(loc)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer min-h-[32px]",
                            selectedLocations.includes(loc)
                              ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                              : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-400 dark:hover:border-surface-600"
                          )}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </FilterSection>
                </div>

                {/* Apply button */}
                <div className="mt-5 pt-4 border-t border-surface-100 dark:border-surface-800">
                  <Button
                    variant="default"
                    size="default"
                    className="w-full h-11 justify-center bg-rome-500 hover:bg-rome-600 text-white font-semibold text-sm"
                    onClick={() => setFiltersOpen(false)}
                  >
                    {isFiltering
                      ? `Show ${results.length} result${results.length !== 1 ? 's' : ''}`
                      : `Browse all ${opportunities.length} opportunities`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sort — mobile and desktop consistent trigger */}
          <div className="flex items-center gap-1.5 h-11 min-h-[44px] px-2.5 sm:px-3 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl shadow-xs shrink-0">
            <SolarIcon name="sort-from-bottom-to-top-linear" size={14} className="text-surface-400 shrink-0 hidden sm:block" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort opportunities"
              className="bg-transparent border-none focus:ring-0 text-xs font-semibold text-surface-700 dark:text-surface-300 outline-none cursor-pointer pr-1"
            >
              <option value="relevance">Relevance</option>
              <option value="deadline">Deadline</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* ── Mobile Filter Drawer (Sheet on bottom/right) ────────────────── */}
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetContent side="bottom" className="sm:hidden max-h-[85vh] rounded-t-3xl p-5 overflow-y-auto bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800">
            <div className="flex items-center justify-between pb-3 border-b border-surface-100 dark:border-surface-800 mb-4">
              <div>
                <SheetTitle className="text-base font-bold text-surface-950 dark:text-white">Filter opportunities</SheetTitle>
                <SheetDescription className="text-xs text-surface-500 dark:text-surface-400">Refine by type, focus area, location, or funding</SheetDescription>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={() => clearAllFilters()}
                  className="text-xs font-bold text-rome-600 dark:text-rome-400 hover:underline px-2 py-1 min-h-[36px]"
                >
                  Clear all ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="space-y-5 pb-6">
              {/* Type */}
              <FilterSection label="Opportunity type">
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
                  {Object.values(OpportunityType).map((type: OpportunityType) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      aria-pressed={selectedTypes.includes(type)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer min-h-[38px]",
                        selectedTypes.includes(type)
                          ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                          : "bg-surface-50 dark:bg-surface-800/60 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Conditions */}
              <FilterSection label="Conditions">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setFundedOnly(!fundedOnly); updateUrlParams({ funded: !fundedOnly }); }}
                    aria-pressed={fundedOnly}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer min-h-[38px]",
                      fundedOnly
                        ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                        : "bg-surface-50 dark:bg-surface-800/60 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700"
                    )}
                  >
                    Funded / Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRemoteOnly(!remoteOnly); updateUrlParams({ remote: !remoteOnly }); }}
                    aria-pressed={remoteOnly}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer min-h-[38px]",
                      remoteOnly
                        ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                        : "bg-surface-50 dark:bg-surface-800/60 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700"
                    )}
                  >
                    Remote / Flexible
                  </button>
                </div>
              </FilterSection>

              {/* Field */}
              <FilterSection label="Field of focus">
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {FIELDS.map((field: string) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleField(field)}
                      aria-pressed={selectedFields.includes(field)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-medium transition-colors border cursor-pointer min-h-[38px]",
                        selectedFields.includes(field)
                          ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                          : "bg-surface-50 dark:bg-surface-800/60 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700"
                      )}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Location */}
              <FilterSection label="Location">
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {LOCATIONS.map((loc: string) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      aria-pressed={selectedLocations.includes(loc)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-medium transition-colors border cursor-pointer min-h-[38px]",
                        selectedLocations.includes(loc)
                          ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent"
                          : "bg-surface-50 dark:bg-surface-800/60 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700"
                      )}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Mobile Sheet Apply Footer */}
            <div className="sticky bottom-0 pt-3 pb-2 bg-white dark:bg-surface-900 border-t border-surface-100 dark:border-surface-800">
              <Button
                variant="default"
                size="default"
                className="w-full h-12 justify-center bg-rome-500 hover:bg-rome-600 text-white font-semibold text-sm rounded-xl min-h-[48px]"
                onClick={() => setFiltersOpen(false)}
              >
                {isFiltering
                  ? `Show ${results.length} result${results.length !== 1 ? 's' : ''}`
                  : `Browse all ${opportunities.length} opportunities`}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Active filter chips — only shown when filters are active */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5" aria-live="polite" aria-atomic="false">
            {selectedTypes.map((t: OpportunityType) => (
              <Chip key={t} label={t} selected size="sm" onRemove={() => toggleType(t)} />
            ))}
            {selectedFields.map((f: string) => (
              <Chip key={f} label={f} selected size="sm" onRemove={() => toggleField(f)} />
            ))}
            {selectedLocations.map((loc: string) => (
              <Chip key={loc} label={loc} selected size="sm" onRemove={() => toggleLocation(loc)} />
            ))}
            {fundedOnly && (
              <Chip label="Funded only" selected size="sm" onRemove={() => { setFundedOnly(false); updateUrlParams({ funded: false }); }} />
            )}
            {remoteOnly && (
              <Chip label="Remote only" selected size="sm" onRemove={() => { setRemoteOnly(false); updateUrlParams({ remote: false }); }} />
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline transition-colors px-2 py-1 cursor-pointer min-h-[32px] inline-flex items-center"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ─── 3. Goal category pills — shown when not actively searching ─── */}
      {!isFiltering && opportunities.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-2.5">
            Browse by goal
          </p>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Browse by goal">
            {categories.goals.map(goal => {
              const iconName = GOAL_ICON_MAP[goal.icon] || 'compass-linear';
              return (
                <button
                  key={goal.id}
                  type="button"
                  role="listitem"
                  onClick={() => {
                    setSelectedTypes(goal.relatedTypes);
                    updateUrlParams({ types: goal.relatedTypes });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-xs font-medium text-surface-700 dark:text-surface-300 hover:border-rome-300 dark:hover:border-rome-700 hover:text-rome-600 dark:hover:text-rome-400 hover:bg-rome-50/30 dark:hover:bg-rome-950/20 transition-all cursor-pointer min-h-[36px] shadow-xs"
                >
                  <SolarIcon name={iconName} size={14} className="shrink-0" />
                  {goal.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 4. Results ──────────────────────────────────────────────────── */}
      <main aria-live="polite" aria-label={isFiltering ? `${results.length} results` : `${opportunities.length} opportunities`}>
        {/* Result count — only shown when filtering */}
        {isFiltering && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {results.length === 0
                ? 'No results'
                : `${results.length} opportunit${results.length === 1 ? 'y' : 'ies'} found`}
            </p>
          </div>
        )}

        {/* Result list */}
        {displayOpportunities.length > 0 ? (
          <OpportunityList
            opportunities={displayOpportunities}
            loading={false}
            showSaveButton
            isOpportunitySaved={(id: string) => isSaved(id)}
            onSaveOpportunity={(id: string) => {
              if (!isAuthenticated) {
                setContextualPrompt({ isOpen: true, type: 'save', opportunityId: id });
                return;
              }
              saveOpportunity(id);
            }}
            onUnsaveOpportunity={(id: string) => unsaveOpportunity(id)}
            onOpportunityClick={(id: string) => navigate(`/opportunity/${id}`)}
          />
        ) : isFiltering ? (
          <div className="py-16 flex justify-center">
            <EmptyState
              icon="magnifer-linear"
              title="No opportunities match your filters"
              description="Try removing a filter or broadening your search."
              actionLabel="Clear filters"
              onAction={clearAllFilters}
            />
          </div>
        ) : (
          <div className="py-16 flex justify-center">
            <EmptyState
              icon="compass-linear"
              title="Nothing here yet"
              description="New opportunities are added regularly. Check back soon."
            />
          </div>
        )}
      </main>

      <ContextualSignupModal
        isOpen={contextualPrompt.isOpen}
        onClose={() => setContextualPrompt(prev => ({ ...prev, isOpen: false }))}
        type={contextualPrompt.type}
        opportunityId={contextualPrompt.opportunityId}
        returnUrl={contextualPrompt.opportunityId ? `/opportunity/${contextualPrompt.opportunityId}` : '/explore'}
      />
    </div>
  );
}
