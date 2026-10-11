import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useAuthStore } from '@/store/authStore';
import { getRecommendationsForOpportunity, getRecommendationsForProfile } from '@/services/learning.service';
import { learningResources } from '@/data/learning-resources';
import { api } from '@/api/client';
import { EmptyState, Skeleton } from '@/components/ui';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Opportunity, LearningResource } from '@/types/models';
import { cn } from '@/utils/cn';

export default function LearnPage() {
  const navigate = useNavigate();
  const { opportunities, isLoading } = useOpportunityStore();
  const { savedOpportunities, trackedApplications } = useApplicationStore();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [costFilter, setCostFilter] = useState<'all' | 'free' | 'paid'>('all');

  const [learningStatus, setLearningStatus] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('learningStatus') || '{}');
    } catch {
      return {};
    }
  });

  // Fetch learning progress from backend
  useEffect(() => {
    api.getUserLearningProgress()
      .then(progressList => {
        if (Array.isArray(progressList)) {
          const map: Record<string, string> = {};
          progressList.forEach(p => {
            const st = p.status === 'COMPLETED' ? 'completed' : p.status === 'LEARNING' ? 'learning' : 'want';
            map[p.resourceId] = st;
          });
          setLearningStatus(prev => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const newStatus = { ...learningStatus, [id]: status };
    setLearningStatus(newStatus);
    localStorage.setItem('learningStatus', JSON.stringify(newStatus));

    const serverStatus = status === 'completed' ? 'COMPLETED' : status === 'learning' ? 'LEARNING' : 'WANT_TO_LEARN';
    try {
      await api.updateUserLearningProgress(id, serverStatus as any);
    } catch {
      // Local storage persists if offline
    }
  };

  const relevantOpportunityIds = useMemo(() => Array.from(new Set([
    ...savedOpportunities,
    ...trackedApplications.map(a => a.opportunityId)
  ])), [savedOpportunities, trackedApplications]);

  const savedOpps: Opportunity[] = useMemo(() => opportunities.filter((opp: Opportunity) =>
    relevantOpportunityIds.includes(opp.id)
  ), [opportunities, relevantOpportunityIds]);

  // Derive unique categories from learning resources
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    learningResources.forEach(r => {
      if (r.type) cats.add(r.type);
    });
    return ['All', ...Array.from(cats)];
  }, []);

  // Filtered resources matching user query, category, and cost
  const filteredCatalog = useMemo(() => {
    return learningResources.filter((resource: LearningResource) => {
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(q);
        const matchesProvider = resource.provider.toLowerCase().includes(q);
        const matchesDesc = resource.description.toLowerCase().includes(q);
        const matchesSkills = resource.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesProvider && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      // Category check
      if (selectedCategory !== 'All' && resource.type?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Cost check
      if (costFilter === 'free' && !resource.free) return false;
      if (costFilter === 'paid' && resource.free) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, costFilter]);

  const profileRecommendations: LearningResource[] = useMemo(() => {
    if (user?.profile) {
      return getRecommendationsForProfile(user.profile, learningResources);
    }
    return learningResources.slice(0, 6);
  }, [user]);

  if (isLoading) {
    return (
      <div className="w-full py-8 space-y-8 animate-in fade-in">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const isFiltering = Boolean(searchQuery.trim() || selectedCategory !== 'All' || costFilter !== 'all');

  return (
    <div className="w-full py-6 md:py-10 flex flex-col gap-8 animate-in fade-in text-left">
      {/* ─── 1. Header Section ─── */}
      <header className="space-y-1.5 pb-2 border-b border-surface-200 dark:border-surface-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-950 dark:text-surface-50 tracking-tight">
          Learn what moves you forward.
        </h1>
        <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
          Discover resources to build your skills, strengthen your applications, and prepare for opportunities.
        </p>
      </header>

      {/* ─── 2. Search & Discovery Controls ─── */}
      <section aria-label="Search and filter resources" className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <SolarIcon
              name="magnifer-linear"
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
            />
            <input
              type="search"
              role="searchbox"
              aria-label="Search learning resources"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill (e.g. UX Research, SQL), or provider..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/50 shadow-xs min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 p-1"
              >
                <SolarIcon name="close-circle-linear" size={16} />
              </button>
            )}
          </div>

          {/* Cost Filter */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setCostFilter(costFilter === 'free' ? 'all' : 'free')}
              className={cn(
                "h-11 min-h-[44px] px-3.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5",
                costFilter === 'free'
                  ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-surface-900 dark:border-white"
                  : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-300"
              )}
            >
              <span>Free only</span>
            </button>

            <button
              type="button"
              onClick={() => setCostFilter(costFilter === 'paid' ? 'all' : 'paid')}
              className={cn(
                "h-11 min-h-[44px] px-3.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5",
                costFilter === 'paid'
                  ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-surface-900 dark:border-white"
                  : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-800 hover:border-surface-300"
              )}
            >
              <span>Paid only</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filter by resource type">
          {availableCategories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer capitalize min-h-[32px] shrink-0",
                selectedCategory === cat
                  ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900"
                  : "bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700"
              )}
            >
              {cat}
            </button>
          ))}
          {isFiltering && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setCostFilter('all');
              }}
              className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline px-2 py-1 ml-1 cursor-pointer shrink-0"
            >
              Reset filters
            </button>
          )}
        </div>
      </section>

      {/* ─── 3. Filtered Search Results (if actively searching/filtering) ─── */}
      {isFiltering ? (
        <section aria-label="Search results" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-100">
              {filteredCatalog.length} resource{filteredCatalog.length === 1 ? '' : 's'} found
            </h2>
          </div>

          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCatalog.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  learningStatus={learningStatus[resource.id] || 'want'}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 flex justify-center">
              <EmptyState
                icon="book-2-linear"
                title="No resources match your search"
                description="Try clearing your search query or selecting a different category to see available materials."
                actionLabel="Reset search"
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setCostFilter('all');
                }}
              />
            </div>
          )}
        </section>
      ) : (
        /* ─── 4. Standard Curated View (Tailored by Saved Opportunities & Profile) ─── */
        <div className="space-y-10">
          
          {/* Section: Tailored to Saved Opportunities */}
          {savedOpps.length > 0 ? (
            <section className="space-y-6">
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <SolarIcon name="bookmark-linear" size={18} className="text-rome-500" />
                  Recommended for your active pursuits
                </h2>
                <p className="text-xs text-surface-500">
                  Targeted skills identified directly from opportunities you have saved.
                </p>
              </div>

              <div className="space-y-6">
                {savedOpps.map((opp: Opportunity) => {
                  const resources = getRecommendationsForOpportunity(opp, learningResources);
                  if (resources.length === 0) return null;

                  return (
                    <div key={opp.id} className="space-y-3">
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-surface-100 dark:border-surface-800">
                        <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
                          Skills for: <span className="text-rome-600 dark:text-rome-400">{opp.title}</span>
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 font-medium shrink-0">
                          {opp.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resources.slice(0, 3).map((resource: LearningResource) => (
                          <ResourceCard
                            key={resource.id}
                            resource={resource}
                            learningStatus={learningStatus[resource.id] || 'want'}
                            onStatusChange={updateStatus}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            /* Welcome / Discovery prompt when no opportunities are saved */
            <section className="bg-surface-50 dark:bg-surface-900/60 rounded-2xl p-6 sm:p-8 border border-surface-200 dark:border-surface-800 text-center">
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 flex items-center justify-center mx-auto mb-3">
                  <SolarIcon name="book-2-linear" size={20} />
                </div>
                <h2 className="text-base font-bold text-surface-900 dark:text-surface-100">
                  Personalize your learning roadmap
                </h2>
                <p className="text-xs text-surface-500 leading-relaxed">
                  When you save opportunities you want to pursue, ROMEfind highlights the exact skills and preparation courses recommended for your target deadlines.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/explore')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rome-500 hover:bg-rome-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer min-h-[38px]"
                  >
                    <span>Explore opportunities</span>
                    <SolarIcon name="alt-arrow-right-linear" size={13} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Section: General Career & Foundation Skills */}
          <section className="space-y-4 pt-4 border-t border-surface-100 dark:border-surface-800">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <SolarIcon name="star-linear" size={18} className="text-rome-500" />
                Featured skill-building resources
              </h2>
              <p className="text-xs text-surface-500">
                Curated foundational courses and certifications across major fields.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {profileRecommendations.map((resource: LearningResource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  learningStatus={learningStatus[resource.id] || 'want'}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}

// ─── Individual Learning Resource Card Component ─────────────────────────────
interface ResourceCardProps {
  resource: LearningResource;
  learningStatus: string;
  onStatusChange: (id: string, status: string) => void;
}

function ResourceCard({ resource, learningStatus, onStatusChange }: ResourceCardProps) {
  return (
    <article
      aria-label={resource.title}
      className="bg-white dark:bg-surface-900 rounded-2xl p-5 border border-surface-200 dark:border-surface-800 shadow-xs hover:border-surface-300 dark:hover:border-surface-700 transition-all flex flex-col justify-between text-left"
    >
      <div className="space-y-2.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 capitalize">
            {resource.type}
          </span>
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-md",
            resource.free
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300"
          )}>
            {resource.free ? 'Free' : 'Paid'}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-surface-950 dark:text-white leading-snug line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            {resource.provider} {resource.duration ? `• ${resource.duration}` : ''}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-surface-600 dark:text-surface-400 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {resource.skills.slice(0, 3).map((skill: string) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-surface-50 dark:bg-surface-800/80 text-xs rounded-md text-surface-600 dark:text-surface-400 border border-surface-200/60 dark:border-surface-700 font-medium"
            >
              {skill}
            </span>
          ))}
          {resource.skills.length > 3 && (
            <span className="px-1.5 py-0.5 text-xs text-surface-400 font-medium">
              +{resource.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3.5 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between gap-2">
        <label htmlFor={`learning-status-${resource.id}`} className="sr-only">
          Status for {resource.title}
        </label>
        <select
          id={`learning-status-${resource.id}`}
          className="text-xs font-semibold bg-surface-50 dark:bg-surface-800 px-2.5 py-1.5 rounded-xl border border-surface-200 dark:border-surface-700 outline-none cursor-pointer text-surface-700 dark:text-surface-300 min-h-[36px]"
          value={learningStatus}
          onChange={(e) => onStatusChange(resource.id, e.target.value)}
          aria-label={`Update learning progress for ${resource.title}`}
        >
          <option value="want">Want to learn</option>
          <option value="learning">In progress</option>
          <option value="completed">Completed ✓</option>
        </select>

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${resource.title} on ${resource.provider} (opens in new tab)`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rome-600 dark:text-rome-400 hover:text-rome-700 py-1.5 px-2 rounded-lg hover:bg-rome-50 dark:hover:bg-rome-950/20 transition-colors min-h-[36px]"
          >
            <span>Access</span>
            <SolarIcon name="arrow-right-up-linear" size={13} />
          </a>
        )}
      </div>
    </article>
  );
}
