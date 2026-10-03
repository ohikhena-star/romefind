import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { resolveFieldContext, getTrendingOpportunitiesForContext } from '@/services/trending.service';
import { SolarIcon } from '@/components/ui/SolarIcon';

const SearchOverlay = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useUIStore();
  const { user } = useAuthStore();
  const { opportunities } = useOpportunityStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    
    // Focus input on mount
    setTimeout(() => inputRef.current?.focus(), 100);
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputRef.current?.value?.trim();
    if (query) {
      addRecentSearch(query);
      navigate(`/searches?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleSelectRecent = (term: string) => {
    addRecentSearch(term);
    navigate(`/searches?q=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleOpenFullSearchPage = () => {
    const query = inputRef.current?.value?.trim();
    if (query) {
      addRecentSearch(query);
      navigate(`/searches?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/searches');
    }
    onClose();
  };

  // Derive Field Context based on user state & recent searches
  const resolvedContext = useMemo(() => {
    return resolveFieldContext({
      preferences: user?.preferences,
      profile: user?.profile,
      recentSearches: recentSearches || []
    });
  }, [user, recentSearches]);

  // Derive trending opportunities and related topic pills for this field context
  const trendingData = useMemo(() => {
    return getTrendingOpportunitiesForContext(
      opportunities,
      resolvedContext.fieldContext,
      4
    );
  }, [opportunities, resolvedContext.fieldContext]);

  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="max-w-3xl mx-auto w-full px-4 pt-16 md:pt-24 h-full flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 relative">
          <form onSubmit={handleSearch} className="w-full flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400">
              <SolarIcon name="magnifer-linear" size={20} />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for opportunities, organizations, fields..."
              className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-surface-100 dark:bg-surface-800 border border-surface-200/60 dark:border-surface-700/60 rounded-2xl text-base sm:text-lg text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-rome-500 outline-none transition-all shadow-sm"
            />
          </form>
          <button
            onClick={onClose}
            className="p-3 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-2xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close search overlay"
          >
            <SolarIcon name="close-circle-linear" size={24} />
          </button>
        </div>

        {/* View Full Searches Page Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleOpenFullSearchPage}
            className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:text-rome-700 dark:hover:text-rome-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open full Searches & Trends page</span>
            <SolarIcon name="arrow-right-up-linear" size={14} />
          </button>
        </div>

        {/* Grid Sections: Recent Searches & Field-Based Trending */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto pb-8">
          {/* Column 1: Recent Searches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <SolarIcon name="clock-circle-linear" size={16} className="text-surface-400" />
                <span>Recent Searches</span>
              </h3>
              {recentSearches && recentSearches.length > 0 && (
                <button
                  onClick={clearRecentSearches}
                  className="text-[11px] font-semibold text-surface-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {recentSearches && recentSearches.length > 0 ? (
              <ul className="space-y-1.5">
                {recentSearches.slice(0, 6).map((term) => (
                  <li key={term} className="flex items-center justify-between group rounded-xl px-2.5 py-2 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                    <button
                      onClick={() => handleSelectRecent(term)}
                      className="flex items-center gap-2.5 text-xs font-medium text-surface-700 dark:text-surface-300 hover:text-rome-500 dark:hover:text-rome-400 transition-colors text-left flex-1 min-w-0 truncate cursor-pointer"
                    >
                      <SolarIcon name="magnifer-linear" size={14} className="text-surface-400 flex-shrink-0" />
                      <span className="truncate">{term}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-red-500 transition-all p-1 cursor-pointer"
                      aria-label={`Remove recent search ${term}`}
                    >
                      <SolarIcon name="close-circle-linear" size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 px-4 text-center rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/60 dark:border-surface-700/60">
                <p className="text-xs text-surface-400 dark:text-surface-500">
                  No recent searches. Search above to build your history.
                </p>
              </div>
            )}
          </div>

          {/* Column 2: Trending Opportunities in Focus Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <SolarIcon name="graph-up-linear" size={16} className="text-rome-500" />
                <span>Trending in {resolvedContext.fieldContext}</span>
              </h3>
            </div>

            {trendingData.opportunities.length > 0 ? (
              <div className="space-y-2">
                {trendingData.opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    onClick={() => {
                      navigate(`/opportunity/${opp.id}`);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/60 dark:border-surface-700/50 hover:border-rome-400 dark:hover:border-rome-600 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-surface-400 mb-1">
                      <span className="font-medium text-surface-500 dark:text-surface-400 truncate max-w-[180px]">
                        {typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 font-semibold">
                        {opp.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-surface-900 dark:text-white group-hover:text-rome-500 transition-colors line-clamp-1">
                      {opp.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-surface-400 mt-1.5 pt-1.5 border-t border-surface-100 dark:border-surface-700/50">
                      <span>{opp.location || 'Remote'}</span>
                      {opp.deadline && <span>• Due {opp.deadline}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 px-4 text-center rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/60 dark:border-surface-700/60">
                <p className="text-xs text-surface-400 dark:text-surface-500">
                  Explore opportunities in {resolvedContext.fieldContext}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
