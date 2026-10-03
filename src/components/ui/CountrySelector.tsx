import React, { useState, useRef, useEffect, useMemo } from 'react';
import { COUNTRIES, Country, getCountryByName, getCountryByCode } from '@/data/countries';
import { SolarIcon } from './SolarIcon';
import { cn } from '@/utils/cn';

export interface CountrySelectorProps {
  value?: string;
  onChange: (countryName: string, country?: Country) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  id?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select your country...',
  className,
  disabled = false,
  autoFocus = false,
  id = 'country-selector',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Match current selected country
  const selectedCountry = useMemo(() => {
    if (!value) return undefined;
    return getCountryByName(value) || getCountryByCode(value);
  }, [value]);

  // Filter countries by query
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase() === q
    );
  }, [searchQuery]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto focus trigger button if autoFocus is set
  useEffect(() => {
    if (autoFocus && !disabled) {
      // do not automatically open, but can be focused
    }
  }, [autoFocus, disabled]);

  const handleSelect = (country: Country) => {
    onChange(country.name, country);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : Math.max(0, filteredCountries.length - 1)
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCountries[highlightedIndex]) {
          handleSelect(filteredCountries[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchQuery('');
        break;
    }
  };

  // Keep highlighted item in view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Where are you based right now? Select country"
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3.5 sm:py-4 rounded-xl text-left transition-all duration-150',
          'bg-white dark:bg-surface-900 border min-h-[52px]',
          isOpen
            ? 'border-rome-500 ring-2 ring-rome-500/20 shadow-sm'
            : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600',
          disabled && 'opacity-50 cursor-not-allowed bg-surface-100 dark:bg-surface-800'
        )}
      >
        <div className="flex items-center gap-3 truncate">
          {selectedCountry ? (
            <>
              <span className="text-xl sm:text-2xl leading-none select-none" role="img" aria-label={selectedCountry.name}>
                {selectedCountry.flag}
              </span>
              <span className="text-base sm:text-lg font-medium text-surface-900 dark:text-surface-50 truncate">
                {selectedCountry.name}
              </span>
            </>
          ) : (
            <span className="text-base sm:text-lg text-surface-400 dark:text-surface-500">
              {placeholder}
            </span>
          )}
        </div>

        <SolarIcon
          name={isOpen ? 'alt-arrow-up-linear' : 'alt-arrow-down-linear'}
          size={18}
          className="shrink-0 text-surface-400 dark:text-surface-500 transition-transform duration-200"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-2xl',
            'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700',
            'shadow-xl shadow-surface-950/10 dark:shadow-surface-950/50 animate-in fade-in-0 zoom-in-95 duration-150'
          )}
          style={{ maxHeight: 'min(360px, 60vh)' }}
        >
          {/* Search Bar */}
          <div className="p-3 border-b border-surface-100 dark:border-surface-800 bg-surface-50/70 dark:bg-surface-850/70">
            <div className="relative flex items-center">
              <SolarIcon
                name="magnifer-linear"
                size={16}
                className="absolute left-3 text-surface-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search countries..."
                className={cn(
                  'w-full pl-9 pr-8 py-2 text-sm rounded-xl',
                  'bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700',
                  'text-surface-900 dark:text-white placeholder:text-surface-400',
                  'focus:outline-none focus:border-rome-500 focus:ring-2 focus:ring-rome-500/20'
                )}
                aria-label="Search country"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 p-1"
                  aria-label="Clear search"
                >
                  <SolarIcon name="close-circle-linear" size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Country List */}
          <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-label="Countries list"
            className="overflow-y-auto divide-y divide-surface-100/60 dark:divide-surface-800/60"
            style={{ maxHeight: '280px' }}
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country, index) => {
                const isSelected = selectedCountry?.code === country.code;
                const isHighlighted = highlightedIndex === index;

                return (
                  <button
                    key={country.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(country)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors cursor-pointer min-h-[44px]',
                      isHighlighted
                        ? 'bg-surface-100 dark:bg-surface-800'
                        : 'bg-transparent',
                      isSelected && 'bg-rome-50 dark:bg-rome-950/40 text-rome-900 dark:text-rome-100 font-semibold'
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-xl leading-none select-none" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <span
                        className={cn(
                          'text-sm truncate',
                          isSelected
                            ? 'text-rome-600 dark:text-rome-400 font-semibold'
                            : 'text-surface-800 dark:text-surface-200'
                        )}
                      >
                        {country.name}
                      </span>
                    </div>

                    {isSelected && (
                      <SolarIcon
                        name="check-circle-linear"
                        size={16}
                        className="shrink-0 text-rome-500"
                      />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-8 px-4 text-center text-sm text-surface-400 dark:text-surface-500">
                No countries found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
