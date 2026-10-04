import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { searchOpportunities, sortByRelevance } from '@/services/search.service';
import { SearchInput, Chip, OpportunityList, EmptyState, Button, OpportunityGridSkeleton } from '@/components/ui';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { categories } from '@/data/categories';
import { OpportunityType, RemoteStatus, Opportunity, SearchResult } from '@/types/models';
import { Briefcase, DollarSign, GraduationCap, Target, Layers, Users, Microscope, TrendingUp, Globe, Rocket, Compass, X } from 'lucide-react';
import { FIELDS, LOCATIONS } from '@/utils/constants';
import { cn } from '@/utils/cn';

const GOAL_ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  DollarSign,
  GraduationCap,
  Target,
  Layers,
  Users,
  Microscope,
  TrendingUp,
  Globe,
  Rocket,
  Compass,
};

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { opportunities, isLoading } = useOpportunityStore();
  const { isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();
  const { user } = useAuthStore();
  const { addRecentSearch } = useUIStore();

  
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>(() => {
    const typeParam = searchParams.get('type');
    if (!typeParam) return [];
    return typeParam.split(',').map(s => s.trim()).filter(Boolean) as OpportunityType[];
  });
  
  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    const fieldParam = searchParams.get('field');
    if (!fieldParam) return [];
    return fieldParam.split(',').map(s => s.trim()).filter(Boolean);
  });
  
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    const locParam = searchParams.get('location');
    if (!locParam) return [];
    return locParam.split(',').map(s => s.trim()).filter(Boolean);
  });
  
  const [fundedOnly, setFundedOnly] = useState<boolean>(() => {
    return searchParams.get('funded') === 'true';
  });
  
  const [remoteOnly, setRemoteOnly] = useState<boolean>(() => {
    return searchParams.get('remote') === 'true';
  });
  
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Sync state from URL parameters
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) setQuery(qParam);

    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedTypes(typeParam.split(',').map(s => s.trim()).filter(Boolean) as OpportunityType[]);
    } else {
      setSelectedTypes([]);
    }

    const fieldParam = searchParams.get('field');
    if (fieldParam) {
      setSelectedFields(fieldParam.split(',').map(s => s.trim()).filter(Boolean));
    } else {
      setSelectedFields([]);
    }

    const locParam = searchParams.get('location');
    if (locParam) {
      setSelectedLocations(locParam.split(',').map(s => s.trim()).filter(Boolean));
    } else {
      setSelectedLocations([]);
    }

    const fundedParam = searchParams.get('funded');
    if (fundedParam !== null) {
      setFundedOnly(fundedParam === 'true');
    }

    const remoteParam = searchParams.get('remote');
    if (remoteParam !== null) {
      setRemoteOnly(remoteParam === 'true');
    }
  }, [searchParams]);

  const updateUrlParams = (updates: {
    q?: string;
    types?: OpportunityType[];
    fields?: string[];
    locations?: string[];
    funded?: boolean;
    remote?: boolean;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (updates.q !== undefined) {
      if (updates.q.trim()) newParams.set('q', updates.q.trim());
      else newParams.delete('q');
    }
    
    if (updates.types !== undefined) {
      if (updates.types.length > 0) newParams.set('type', updates.types.join(','));
      else newParams.delete('type');
    }

    if (updates.fields !== undefined) {
      if (updates.fields.length > 0) newParams.set('field', updates.fields.join(','));
      else newParams.delete('field');
    }

    if (updates.locations !== undefined) {
      if (updates.locations.length > 0) newParams.set('location', updates.locations.join(','));
      else newParams.delete('location');
    }

    if (updates.funded !== undefined) {
      if (updates.funded) newParams.set('funded', 'true');
      else newParams.delete('funded');
    }

    if (updates.remote !== undefined) {
      if (updates.remote) newParams.set('remote', 'true');
      else newParams.delete('remote');
    }

    setSearchParams(newParams);
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery && newQuery.trim().length > 1) {
      addRecentSearch(newQuery.trim());
    }
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
    selectedTypes.length + 
    selectedFields.length + 
    selectedLocations.length + 
    (fundedOnly ? 1 : 0) + 
    (remoteOnly ? 1 : 0);

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

  if (isLoading && opportunities.length === 0) {
    return <OpportunityGridSkeleton count={6} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" />;
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full min-h-screen">
      {/* ─── 1. Header & Search ─── */}
      <header className="mb-6 md:mb-8 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50 mb-2">
          Explore Possibilities
        </h1>
        <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400 mb-5 max-w-2xl leading-relaxed">
          Find and evaluate opportunities across different fields, formats, and pathways.
        </p>

        <div className="w-full">
          <SearchInput 
            value={query}
            onChange={(e: any) => handleSearch(typeof e === 'string' ? e : (e?.target?.value ?? ''))}
            onClear={() => handleSearch('')}
            placeholder="Search by title, organization, field, or keywords..." 
            className="w-full text-sm sm:text-base h-12 min-h-[48px] rounded-xl shadow-xs"
          />
        </div>
      </header>

      {/* ─── 2. Main Layout (Sidebar Desktop / Slide-over Mobile) ─── */}
      <div className="flex flex-col md:flex-row gap-8 flex-1 w-full">
        {/* Mobile Backdrop */}
        {showMobileFilters && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
            onClick={() => setShowMobileFilters(false)}
            aria-hidden="true"
          />
        )}

        {/* Filters Panel (Desktop Sticky Sidebar / Mobile Slide-over Drawer) */}
        <aside 
          aria-label="Filters"
          className={cn(
            "w-full md:w-64 flex-shrink-0",
            showMobileFilters 
              ? "fixed inset-y-0 right-0 z-50 w-full max-w-[320px] sm:max-w-sm bg-white dark:bg-surface-900 p-4 sm:p-6 overflow-y-auto shadow-2xl border-l border-surface-200 dark:border-surface-800 animate-in slide-in-from-right duration-200 flex flex-col justify-between" 
              : "hidden md:block"
          )}
        >
          <div className="space-y-5 sm:space-y-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-200 dark:border-surface-800">
              <h2 className="font-bold text-base text-surface-900 dark:text-surface-50">Filters</h2>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline cursor-pointer"
                  >
                    Reset all ({activeFiltersCount})
                  </button>
                )}
                {/* Mobile Close Button */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="md:hidden p-2 rounded-xl text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-label="Close filters"
                >
                  <SolarIcon name="close-circle-linear" size={22} />
                </button>
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2 block">
                Opportunity Type
              </span>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by opportunity type">
                {Object.values(OpportunityType).map((type: OpportunityType) => (
                  <Chip
                    key={type}
                    label={type}
                    selected={selectedTypes.includes(type)}
                    onClick={() => toggleType(type)}
                    size="sm"
                    className={selectedTypes.includes(type) ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900" : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-800"}
                  />
                ))}
              </div>
            </div>

            {/* Conditions (Funded, Remote) */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2 block">
                Conditions & Funding
              </span>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-3 text-sm text-surface-700 dark:text-surface-300 cursor-pointer min-h-[40px] p-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors">
                  <input 
                    type="checkbox"
                    checked={fundedOnly}
                    onChange={(e) => {
                      setFundedOnly(e.target.checked);
                      updateUrlParams({ funded: e.target.checked });
                    }}
                    className="w-4 h-4 rounded border-surface-300 text-rome-500 focus:ring-rome-500 cursor-pointer"
                  />
                  <span className="font-medium text-xs sm:text-sm">Funded / Paid Only</span>
                </label>
                <label className="flex items-center gap-3 text-sm text-surface-700 dark:text-surface-300 cursor-pointer min-h-[40px] p-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-colors">
                  <input 
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => {
                      setRemoteOnly(e.target.checked);
                      updateUrlParams({ remote: e.target.checked });
                    }}
                    className="w-4 h-4 rounded border-surface-300 text-rome-500 focus:ring-rome-500 cursor-pointer"
                  />
                  <span className="font-medium text-xs sm:text-sm">Remote / Flexible Only</span>
                </label>
              </div>
            </div>

            {/* Fields */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2 block">
                Field of Focus
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto pr-1">
                {FIELDS.map((field: string) => (
                  <Chip
                    key={field}
                    label={field}
                    selected={selectedFields.includes(field)}
                    onClick={() => toggleField(field)}
                    size="sm"
                    className={selectedFields.includes(field) ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900" : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-800"}
                  />
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2 block">
                Location
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                {LOCATIONS.map((loc: string) => (
                  <Chip
                    key={loc}
                    label={loc}
                    selected={selectedLocations.includes(loc)}
                    onClick={() => toggleLocation(loc)}
                    size="sm"
                    className={selectedLocations.includes(loc) ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900" : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-800"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Drawer Bottom Action */}
          {showMobileFilters && (
            <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-800 flex gap-2.5">
              <Button
                variant="outline"
                size="default"
                className="flex-1 h-11 min-h-[44px] text-sm font-semibold"
                onClick={clearAllFilters}
              >
                Reset
              </Button>
              <Button
                variant="default"
                size="default"
                className="flex-[2] h-11 min-h-[44px] text-sm font-semibold justify-center"
                onClick={() => setShowMobileFilters(false)}
              >
                Show Results ({results.length})
              </Button>
            </div>
          )}
        </aside>

        {/* ─── 3. Content Area ─── */}
        <main className="flex-1 flex flex-col min-w-0 w-full">
          {/* Mobile Filter & Sort Action Bar */}
          <div className="md:hidden mb-4 flex items-center justify-between gap-2.5 w-full">
            <Button 
              variant="outline"
              size="default"
              className="flex-1 h-11 min-h-[44px] justify-center gap-2 text-sm font-semibold"
              onClick={() => setShowMobileFilters(true)}
            >
              <SolarIcon name="filter-linear" size={16} />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </Button>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 min-h-[44px] px-3.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-xs font-semibold rounded-xl outline-none"
              aria-label="Sort opportunities"
            >
              <option value="relevance">Relevance Match</option>
              <option value="deadline">Deadline (Soonest)</option>
              <option value="newest">Newest Added</option>
            </select>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 p-2.5 sm:p-3 bg-surface-50 dark:bg-surface-850/60 rounded-xl border border-surface-200 dark:border-surface-800 w-full">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-semibold text-surface-500 shrink-0 mr-1">Active:</span>
                {selectedTypes.map((t: OpportunityType) => (
                  <Chip key={t} label={t} selected onRemove={() => toggleType(t)} size="sm" className="bg-surface-900 dark:bg-white text-white dark:text-surface-900 shrink-0" />
                ))}
                {selectedFields.map((f: string) => (
                  <Chip key={f} label={f} selected onRemove={() => toggleField(f)} size="sm" className="bg-surface-900 dark:bg-white text-white dark:text-surface-900 shrink-0" />
                ))}
                {selectedLocations.map((loc: string) => (
                  <Chip key={loc} label={loc} selected onRemove={() => toggleLocation(loc)} size="sm" className="bg-surface-900 dark:bg-white text-white dark:text-surface-900 shrink-0" />
                ))}
                {fundedOnly && (
                  <Chip label="Funded Only" selected onRemove={() => { setFundedOnly(false); updateUrlParams({ funded: false }); }} size="sm" className="bg-surface-900 dark:bg-white text-white dark:text-surface-900 shrink-0" />
                )}
                {remoteOnly && (
                  <Chip label="Remote Only" selected onRemove={() => { setRemoteOnly(false); updateUrlParams({ remote: false }); }} size="sm" className="bg-surface-900 dark:bg-white text-white dark:text-surface-900 shrink-0" />
                )}
                <button 
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline ml-1 cursor-pointer py-1 px-1.5"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-surface-100 dark:border-surface-800">
            <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100">
              {query || activeFiltersCount > 0 ? (
                <span>Found {results.length} opportunit{results.length === 1 ? 'y' : 'ies'}</span>
              ) : (
                <span>Explore by Possibility & Goals</span>
              )}
            </h2>
            <div className="hidden md:flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
              <SolarIcon name="sort-from-bottom-to-top-linear" size={16} />
              <span className="font-medium">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:ring-0 cursor-pointer font-semibold text-surface-900 dark:text-surface-100 py-1"
              >
                <option value="relevance">Relevance Match</option>
                <option value="deadline">Deadline (Soonest)</option>
                <option value="newest">Newest Added</option>
              </select>
            </div>
          </div>

          {/* Goal Exploration Cards when no query/filters */}
          {!query && activeFiltersCount === 0 ? (
            opportunities.length === 0 ? (
              <div className="py-12 flex justify-center" aria-live="polite">
                <EmptyState 
                  icon="compass-linear"
                  title="Nothing here yet"
                  description="New opportunities are added regularly. Check back soon."
                />
              </div>
            ) : (
              <div className="space-y-10" aria-live="polite" aria-label={`${opportunities.length} opportunities found`}>
                {/* ── Goal exploration grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.goals.map((goal) => {
                    const IconComp = GOAL_ICON_MAP[goal.icon] || Compass;
                    return (
                      <div 
                        key={goal.id}
                        onClick={() => {
                          setSelectedTypes(goal.relatedTypes);
                          updateUrlParams({ types: goal.relatedTypes });
                        }}
                        className="group cursor-pointer rounded-2xl bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-850 p-5 sm:p-6 transition-all border border-surface-200 dark:border-surface-800 hover:border-rome-300 dark:hover:border-rome-700 shadow-card hover:shadow-card-hover flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 mb-1.5 group-hover:text-rome-600 transition-colors">
                            {goal.label}
                          </h3>
                          <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                            {goal.description}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1">
                          {goal.relatedTypes.slice(0, 3).map((t: OpportunityType) => (
                            <span key={t} className="text-xs bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 px-2 py-0.5 rounded-lg font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── Active Opportunities Feed ── */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">
                        All Active Opportunities ({opportunities.length})
                      </h3>
                      <p className="text-xs text-surface-500">Curated opportunities across programs, fellowships, and jobs.</p>
                    </div>
                  </div>
                  <OpportunityList 
                    opportunities={opportunities} 
                    loading={false} 
                    showSaveButton
                    isOpportunitySaved={(id: string) => isSaved(id)}
                    onSaveOpportunity={(id: string) => saveOpportunity(id)}
                    onUnsaveOpportunity={(id: string) => unsaveOpportunity(id)}
                    onOpportunityClick={(id: string) => navigate(`/opportunity/${id}`)}
                  />
                </div>
              </div>
            )
          ) : results.length > 0 ? (
            <div aria-live="polite" aria-label={`${results.length} opportunities found`}>
              <OpportunityList 
                opportunities={results} 
                loading={false} 
                showSaveButton
                isOpportunitySaved={(id: string) => isSaved(id)}
                onSaveOpportunity={(id: string) => saveOpportunity(id)}
                onUnsaveOpportunity={(id: string) => unsaveOpportunity(id)}
                onOpportunityClick={(id: string) => navigate(`/opportunity/${id}`)}
              />
            </div>
          ) : (
            <div className="py-12 flex justify-center w-full" aria-live="polite">
              <EmptyState 
                icon="magnifer-linear"
                title="No opportunities match your current filters."
                description="Try removing a filter or exploring a related field to discover opportunities."
                actionLabel="Clear filters"
                onAction={clearAllFilters}
                secondaryActionLabel="Explore all opportunities"
                onSecondaryAction={clearAllFilters}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
