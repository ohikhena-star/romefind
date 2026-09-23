import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useAuthStore } from '@/store/authStore';
import { searchOpportunities, sortByRelevance } from '@/services/search.service';
import { SearchInput, Chip, OpportunityList, EmptyState, Button } from '@/components/ui';
import { categories } from '@/data/categories';
import { OpportunityType, RemoteStatus, Opportunity, SearchResult } from '@/types/models';
import { Filter, ArrowDownWideNarrow, Briefcase, DollarSign, GraduationCap, Target, Layers, Users, Microscope, TrendingUp, Globe, Rocket, Compass } from 'lucide-react';
import { FIELDS, LOCATIONS } from '@/utils/constants';

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
  const { opportunities } = useOpportunityStore();
  const { isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();
  const { user } = useAuthStore();
  
  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const initialType = searchParams.get('type');
  
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>(
    initialType ? [initialType as OpportunityType] : []
  );
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [fundedOnly, setFundedOnly] = useState<boolean>(false);
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) setQuery(qParam);
    
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedTypes([typeParam as OpportunityType]);
    }
  }, [searchParams]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    const newParams = new URLSearchParams(searchParams);
    if (newQuery) {
      newParams.set('q', newQuery);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const toggleType = (t: OpportunityType) => {
    setSelectedTypes(prev => 
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const toggleField = (f: string) => {
    setSelectedFields(prev => 
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev => 
      prev.includes(loc) ? prev.filter(x => x !== loc) : [...prev, loc]
    );
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

  return (
    <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full min-h-screen">
      {/* Search Header */}
      <div className="mb-8 w-full">
        <h1 className="text-3xl font-bold text-surface-950 dark:text-surface-50 mb-4">
          Explore Possibilities
        </h1>
        <SearchInput 
          value={query}
          onChange={(e: any) => handleSearch(typeof e === 'string' ? e : (e?.target?.value ?? ''))}
          onClear={() => handleSearch('')}
          placeholder="Search by keywords, organization, skills (e.g. Design, Fellowship, Stanford, AI)..." 
          className="w-full text-base shadow-sm"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Sidebar Filters */}
        <div className={`w-full md:w-64 space-y-6 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center justify-between pb-2 border-b border-surface-200 dark:border-surface-800">
            <h3 className="font-bold text-base text-surface-900 dark:text-surface-50">Filters</h3>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:text-rome-700"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {/* Type Filter */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2.5 block">
                Opportunity Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(OpportunityType).map((type: OpportunityType) => (
                  <Chip
                    key={type}
                    label={type}
                    selected={selectedTypes.includes(type)}
                    onClick={() => toggleType(type)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2.5 block">
                Conditions
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={fundedOnly}
                    onChange={(e) => setFundedOnly(e.target.checked)}
                    className="rounded border-surface-300 text-rome-500 focus:ring-rome-500"
                  />
                  <span>Funded / Paid Only</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="rounded border-surface-300 text-rome-500 focus:ring-rome-500"
                  />
                  <span>Remote / Flexible Only</span>
                </label>
              </div>
            </div>

            {/* Fields */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2.5 block">
                Field of Focus
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {FIELDS.map((field: string) => (
                  <Chip
                    key={field}
                    label={field}
                    selected={selectedFields.includes(field)}
                    onClick={() => toggleField(field)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Locations */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2.5 block">
                Location
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {LOCATIONS.map((loc: string) => (
                  <Chip
                    key={loc}
                    label={loc}
                    selected={selectedLocations.includes(loc)}
                    onClick={() => toggleLocation(loc)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Filter & Sort Bar */}
          <div className="md:hidden mb-4 flex items-center justify-between gap-3">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-100 dark:bg-surface-800 text-xs font-medium px-3 py-2 rounded-lg border-none"
            >
              <option value="relevance">Relevance</option>
              <option value="deadline">Deadline (Soonest)</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-surface-50 dark:bg-surface-800/40 rounded-xl border border-surface-200 dark:border-surface-700/50">
              <span className="text-xs font-medium text-surface-500">Active:</span>
              {selectedTypes.map((t: OpportunityType) => (
                <Chip key={t} label={t} selected onRemove={() => toggleType(t)} size="sm" />
              ))}
              {selectedFields.map((f: string) => (
                <Chip key={f} label={f} selected onRemove={() => toggleField(f)} size="sm" />
              ))}
              {selectedLocations.map((loc: string) => (
                <Chip key={loc} label={loc} selected onRemove={() => toggleLocation(loc)} size="sm" />
              ))}
              {fundedOnly && (
                <Chip label="Funded Only" selected onRemove={() => setFundedOnly(false)} size="sm" />
              )}
              {remoteOnly && (
                <Chip label="Remote Only" selected onRemove={() => setRemoteOnly(false)} size="sm" />
              )}
              <button 
                onClick={clearAllFilters}
                className="text-xs text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 ml-auto font-medium"
              >
                Reset
              </button>
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-surface-100 dark:border-surface-800">
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
              {query || activeFiltersCount > 0 ? (
                <span>Found {results.length} opportunit{results.length === 1 ? 'y' : 'ies'}</span>
              ) : (
                <span>Explore by Possibility & Goals</span>
              )}
            </h2>
            <div className="hidden md:flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
              <ArrowDownWideNarrow className="w-4 h-4" />
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
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.goals.map((goal) => {
                  const IconComp = GOAL_ICON_MAP[goal.icon] || Compass;
                  return (
                    <div 
                      key={goal.id}
                      onClick={() => {
                        setSelectedTypes(goal.relatedTypes);
                      }}
                      className="group cursor-pointer rounded-xl bg-white dark:bg-surface-900 hover:bg-rome-50/50 dark:hover:bg-surface-800/80 p-6 transition-all border border-surface-200 dark:border-surface-800 hover:border-rome-300 dark:hover:border-rome-700 shadow-card hover:shadow-card-hover flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-rome-100 dark:bg-rome-900/30 text-rome-600 dark:text-rome-400 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
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
                          <span key={t} className="text-[10px] bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 px-2 py-0.5 rounded-full font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
                  All Active Opportunities ({opportunities.length})
                </h3>
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
          ) : results.length > 0 ? (
            <OpportunityList 
              opportunities={results} 
              loading={false} 
              showSaveButton
              isOpportunitySaved={(id: string) => isSaved(id)}
              onSaveOpportunity={(id: string) => saveOpportunity(id)}
              onUnsaveOpportunity={(id: string) => unsaveOpportunity(id)}
              onOpportunityClick={(id: string) => navigate(`/opportunity/${id}`)}
            />
          ) : (
            <div className="py-12">
              <EmptyState 
                icon={Compass}
                title="No opportunities found"
                description="We couldn't find any opportunities matching your current filters and keywords. Try loosening your search criteria."
                actionLabel="Reset all filters"
                onAction={clearAllFilters}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
