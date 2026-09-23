import React, { useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from '@/components/ui/SearchInput';
import { useUiStore } from '@/store/uiStore';

const SearchOverlay = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (inputRef.current?.value) {
      navigate(`/explore?q=${encodeURIComponent(inputRef.current.value)}`);
      onClose();
    }
  };

  const recentSearches = ['Research grants', 'UI/UX internships', 'Startup fellowships'];
  const trending = ['Summer 2024 Tech', 'Study abroad Europe', 'Open source grants'];

  return (
    <div className="fixed inset-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-sm z-50 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="max-w-3xl mx-auto w-full px-4 pt-16 md:pt-24 h-full flex flex-col">
        <div className="flex items-center gap-4 relative">
          <form onSubmit={handleSearch} className="w-full flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-surface-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for opportunities, organizations, fields..."
              className="w-full pl-11 pr-4 py-4 bg-surface-100 dark:bg-surface-800 border-none rounded-xl text-lg text-surface-900 dark:text-white placeholder:text-surface-400 focus:ring-2 focus:ring-rome-500 outline-none transition-all shadow-sm"
            />
          </form>
          <button
            onClick={onClose}
            className="p-3 text-surface-500 hover:text-surface-900 dark:hover:text-white rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto pb-8">
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock size={16} /> Recent Searches
            </h3>
            <ul className="space-y-3">
              {recentSearches.map((term, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      if (inputRef.current) inputRef.current.value = term;
                      handleSearch({ preventDefault: () => {} } as any);
                    }}
                    className="flex items-center gap-3 text-surface-600 dark:text-surface-300 hover:text-rome-500 dark:hover:text-rome-400 transition-colors w-full text-left"
                  >
                    <Search size={16} className="text-surface-400" />
                    <span>{term}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={16} /> Trending Now
            </h3>
            <div className="flex flex-wrap gap-2">
              {trending.map((term, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = term;
                    handleSearch({ preventDefault: () => {} } as any);
                  }}
                  className="px-4 py-2 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 rounded-full text-sm hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
