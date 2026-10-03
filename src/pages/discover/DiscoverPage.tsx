import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { getPersonalizedRecommendations, getOverlookingOpportunities } from '@/services/personalization.service';
import { OpportunityCard } from '@/components/opportunity';
import { EmptyState, DashboardSkeleton, Button } from '@/components/ui';
import { getGreeting, daysUntil } from '@/utils/format';
import { cn } from '@/utils/cn';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Opportunity, AlternativeDiscovery, SearchResult, TrackedApplication, ApplicationStatus, ApplicationTask } from '@/types/models';
import { generateOpportunityTasks } from '@/utils/opportunityTasks';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const { opportunities, isLoading } = useOpportunityStore();
  const { savedOpportunities, trackedApplications, saveOpportunity, unsaveOpportunity, isSaved } = useApplicationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debugMode, setDebugMode] = useState(() => {
    return searchParams.get('debug') === '1' || searchParams.get('debug') === 'true';
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const trackingItems = useMemo(() => {
    const items: Array<{
      opportunity: Opportunity;
      application?: TrackedApplication;
      status: ApplicationStatus;
    }> = [];

    // Tracked applications
    trackedApplications.forEach(app => {
      const opp = opportunities.find(o => o.id === app.opportunityId);
      if (opp && !items.some(i => i.opportunity.id === opp.id)) {
        items.push({
          opportunity: opp,
          application: app,
          status: app.status
        });
      }
    });

    // Saved opportunities not yet tracked
    savedOpportunities.forEach(savedId => {
      if (!items.some(i => i.opportunity.id === savedId)) {
        const opp = opportunities.find(o => o.id === savedId);
        if (opp) {
          items.push({
            opportunity: opp,
            status: ApplicationStatus.Saved
          });
        }
      }
    });

    return items.slice(0, 3);
  }, [opportunities, trackedApplications, savedOpportunities]);

  const recommendations: SearchResult[] = useMemo(() => {
    if (!user?.profile || !user?.preferences) {
      return opportunities.slice(0, 6).map((opp: Opportunity) => ({
        opportunity: opp,
        relevanceScore: 65,
        relevanceReasons: ['Curated active opportunity']
      }));
    }
    return getPersonalizedRecommendations(opportunities, user.profile, user.preferences, 6);
  }, [opportunities, user]);

  const overlooked: AlternativeDiscovery[] = useMemo(() => {
    if (!user?.profile || !user?.preferences) return [];
    return getOverlookingOpportunities(opportunities, user.profile, user.preferences);
  }, [opportunities, user]);

  const closingSoon: Opportunity[] = useMemo(() => {
    return opportunities
      .filter((opp: Opportunity) => {
        if (!opp.deadline) return false;
        const days = daysUntil(opp.deadline);
        return days >= 0 && days <= 45;
      })
      .sort((a: Opportunity, b: Opportunity) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 6);
  }, [opportunities]);

  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.Submitted:
      case ApplicationStatus.Accepted:
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80';
      case ApplicationStatus.Preparing:
      case ApplicationStatus.Applying:
        return 'bg-rome-50 dark:bg-rome-950/40 text-rome-700 dark:text-rome-300 border-rome-200/80 dark:border-rome-800/80';
      case ApplicationStatus.Considering:
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80';
      case ApplicationStatus.Saved:
      default:
        return 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700';
    }
  };

  if (isLoading && opportunities.length === 0) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
        <EmptyState 
          icon="compass-linear"
          title="Sign in to discover opportunities"
          description="Create a profile to get personalized opportunity recommendations and alternative path discovery."
          actionLabel="Sign In"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  const totalTrackedCount = trackedApplications.length + savedOpportunities.filter(id => !trackedApplications.some(a => a.opportunityId === id)).length;

  return (
    <div className="flex flex-col gap-8 sm:gap-10 pb-20 animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
      {/* ─── 1. MOBILE & DESKTOP DISCOVERY SEARCH (Directly below header) ─── */}
      <section id="home-search" className="space-y-2.5">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2 w-full">
          <div className="relative flex-1 min-w-0">
            <SolarIcon name="magnifer-linear" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities by title, field, skill, or organization..."
              aria-label="Search opportunities"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/50 focus:border-rome-500 transition-all shadow-xs min-h-[44px]"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            size="default"
            className="h-11 min-h-[44px] px-4 sm:px-5 rounded-xl bg-rome-500 hover:bg-rome-600 text-white font-semibold text-xs sm:text-sm shrink-0 shadow-xs"
          >
            <span>Search</span>
            <SolarIcon name="alt-arrow-right-linear" size={15} />
          </Button>
        </form>

        {/* Quick 1-Tap Discovery Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
          <span className="text-surface-400 text-[11px] sm:text-xs font-medium mr-0.5">Quick filters:</span>
          <button
            type="button"
            onClick={() => navigate('/explore?remote=Remote')}
            className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800/80 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 transition-colors cursor-pointer border border-surface-200/60 dark:border-surface-700 text-xs min-h-[28px]"
          >
            Remote Only
          </button>
          <button
            type="button"
            onClick={() => navigate('/explore?funded=true')}
            className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800/80 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 transition-colors cursor-pointer border border-surface-200/60 dark:border-surface-700 text-xs min-h-[28px]"
          >
            Fully Funded
          </button>
          <button
            type="button"
            onClick={() => navigate('/explore?type=Fellowship')}
            className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800/80 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 transition-colors cursor-pointer border border-surface-200/60 dark:border-surface-700 text-xs min-h-[28px]"
          >
            Fellowships
          </button>
          <button
            type="button"
            onClick={() => navigate('/explore?type=Internship')}
            className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800/80 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 transition-colors cursor-pointer border border-surface-200/60 dark:border-surface-700 text-xs min-h-[28px]"
          >
            Internships
          </button>
          <button
            type="button"
            onClick={() => navigate('/explore?type=Grant')}
            className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800/80 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 transition-colors cursor-pointer border border-surface-200/60 dark:border-surface-700 text-xs min-h-[28px]"
          >
            Grants
          </button>
        </div>
      </section>

      {/* ─── 2. Greeting & Matching Inspector Toggle ─── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-100 dark:border-surface-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50">
            {getGreeting()}, {user.profile?.name || 'Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            Discover possibilities, explore parallel paths, and track your next steps.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-transparent",
              debugMode 
                ? "text-surface-400 dark:text-surface-500" 
                : "text-surface-300 dark:text-surface-600 hover:text-surface-500"
            )}
            title="Toggle matching signals breakdown on opportunity cards"
          >
            <SolarIcon name="bug-linear" size={14} className="w-3.5 h-3.5" />
            <span>Matching Inspector: {debugMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      {/* Onboarding nudge: only shown if user hasn't set interests */}
      {user && !user.profile?.interests?.length && (
        <div className="rounded-xl bg-rome-50 dark:bg-rome-950/20 border border-rome-200/60 dark:border-rome-800/40 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-rome-900 dark:text-rome-100">Complete your profile for better matches</p>
            <p className="text-xs text-rome-700 dark:text-rome-300 mt-0.5">Add your interests and goals to unlock personalised recommendations.</p>
          </div>
          <Link to="/profile" className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rome-500 hover:bg-rome-600 text-white text-xs font-semibold transition-colors whitespace-nowrap min-h-[36px]">
            Update profile
          </Link>
        </div>
      )}

      {/* ─── 3. FOR YOU (Personalized Discovery) ─── */}
      <section id="for-you" className="space-y-4 scroll-mt-20">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-surface-900 dark:text-surface-100">
              <SolarIcon name="star-linear" size={16} className="text-surface-400 dark:text-surface-500" />
              For you
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Opportunities matching your verified skills, experience level, and goals.
            </p>
          </div>
          <Link to="/recommendations" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs min-h-[44px] sm:min-h-0 items-center">
            See all matches <SolarIcon name="alt-arrow-right-linear" size={14} className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, idx) => (
              <OpportunityCard 
                key={rec.opportunity.id} 
                id={idx === 0 ? 'tour-card' : undefined}
                opportunity={rec.opportunity}
                relevanceScore={rec.relevanceScore}
                relevanceReasons={rec.relevanceReasons}
                matchSignals={rec.matchSignals}
                showDebugSignals={debugMode}
                showSaveButton
                isSaved={isSaved(rec.opportunity.id)}
                onSave={() => saveOpportunity(rec.opportunity.id)}
                onUnsave={() => unsaveOpportunity(rec.opportunity.id)}
                onClick={() => navigate(`/opportunity/${rec.opportunity.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon="compass-linear"
            title="We're learning about your path"
            description="Complete your profile interests and target opportunity types to get high-accuracy recommendations."
            actionLabel="Update Profile"
            onAction={() => navigate('/profile')}
          />
        )}
      </section>

      {/* ─── 4. TRACKING / CONTINUE YOUR OPPORTUNITIES ─── */}
      <section id="continue-tracking" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <SolarIcon name="bookmark-linear" size={16} className="text-surface-400 dark:text-surface-500" />
              Continue where you left off
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Track your active applications, preparation steps, and saved opportunities.
            </p>
          </div>
          {totalTrackedCount > 0 && (
            <Link to="/my-opportunities" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs min-h-[44px] sm:min-h-0 items-center">
              View all ({totalTrackedCount}) <SolarIcon name="alt-arrow-right-linear" size={14} className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {trackingItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackingItems.map(({ opportunity: opp, application: app, status }) => {
              const badge = getStatusBadgeStyle(status);
              const oppTasks = app?.tasks && app.tasks.length > 0 
                ? app.tasks 
                : generateOpportunityTasks(opp).map((label, idx) => ({ id: `task-${idx}`, label, completed: false, order: idx }));
              const completedTasks = oppTasks.filter(t => t.completed).length;
              const totalTasks = oppTasks.length;
              const firstUncompleted = oppTasks.find(t => !t.completed);

              return (
                <div
                  key={opp.id}
                  className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 shadow-xs flex flex-col justify-between hover:border-surface-300 dark:hover:border-surface-700 transition-all text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-surface-500 truncate">
                        {typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded-lg text-xs font-semibold border shrink-0 capitalize", badge)}>
                        {status}
                      </span>
                    </div>

                    <h3 
                      onClick={() => navigate(`/opportunity/${opp.id}`)}
                      className="text-base font-bold text-surface-950 dark:text-white line-clamp-2 hover:text-rome-500 cursor-pointer transition-colors"
                    >
                      {opp.title}
                    </h3>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs text-surface-500">
                        <span>Preparation Checklist</span>
                        <span className="font-semibold text-surface-700 dark:text-surface-300">{completedTasks}/{totalTasks} complete</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-rome-500 rounded-full transition-all"
                          style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                        />
                      </div>
                      {firstUncompleted ? (
                        <p className="text-xs text-rome-600 dark:text-rome-400 font-medium truncate pt-0.5">
                          Next: {firstUncompleted.label}
                        </p>
                      ) : (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate pt-0.5">
                          ✓ All preparation tasks ready!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/opportunity/${opp.id}`)}
                      className="text-xs font-semibold text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer py-1.5"
                    >
                      Details
                    </button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/my-opportunities/${opp.id}/workspace`)}
                      className="text-xs font-semibold h-9 min-h-[36px] px-3.5 bg-rome-500 hover:bg-rome-600 text-white rounded-xl shadow-xs"
                    >
                      <span>Continue</span>
                      <SolarIcon name="alt-arrow-right-linear" size={13} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/60 dark:bg-surface-900/40 p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 mx-auto flex items-center justify-center">
              <SolarIcon name="bookmark-linear" size={20} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">
                Track your opportunity journey
              </h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
                Save opportunities from For You or Explore to start tracking preparation steps, checklist tasks, and application deadlines.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/explore')}
              className="text-xs font-semibold h-9 px-4 rounded-xl"
            >
              <span>Explore opportunities</span>
              <SolarIcon name="alt-arrow-right-linear" size={13} />
            </Button>
          </div>
        )}
      </section>

      {/* ─── 5. YOU MIGHT BE OVERLOOKING (Alternative Paths) ─── */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SolarIcon name="magic-stick-linear" size={16} className="text-surface-400 dark:text-surface-500" />
            <h2 className="text-lg sm:text-xl font-semibold text-surface-900 dark:text-surface-100">You might be overlooking</h2>
          </div>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Alternative paths that advance the same goals through fellowships, grants, or competitions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overlooked.length > 0 ? (
            overlooked.map((item: AlternativeDiscovery, idx: number) => (
              <div 
                key={idx}
                onClick={() => navigate(`/explore?type=${encodeURIComponent(item.alternativeType)}`)}
                className="cursor-pointer group relative overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 transition-all hover:shadow-card hover:border-rome-300 dark:hover:border-rome-700 text-left"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 group-hover:text-rome-500 transition-colors">
                    {item.alternativeType}
                  </h3>
                  <span className="text-xs text-surface-500">
                    {item.count} available
                  </span>
                </div>
                <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed mb-3">
                  {item.reason}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold text-rome-600 dark:text-rome-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore {item.alternativeType}s</span>
                  <SolarIcon name="alt-arrow-right-linear" size={13} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-surface-50 dark:bg-surface-900/50 p-5 rounded-2xl border border-surface-200 dark:border-surface-800 text-left">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                You're exploring a balanced mix of formats. As you track more applications, we will identify complementary pathways.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── 6. CLOSING SOON ─── */}
      {closingSoon.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-surface-900 dark:text-surface-100">
                <SolarIcon name="clock-circle-linear" size={16} className="text-surface-400 dark:text-surface-500" />
                Closing soon
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Upcoming deadlines in the next 45 days.
              </p>
            </div>
            <Link to="/explore?status=open" className="text-rome-600 dark:text-rome-400 hover:text-rome-700 font-semibold flex items-center gap-1 transition-colors text-xs min-h-[44px] sm:min-h-0 items-center">
              View all deadlines <SolarIcon name="alt-arrow-right-linear" size={14} className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closingSoon.map((opp: Opportunity) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp}
                showSaveButton
                isSaved={isSaved(opp.id)}
                onSave={() => saveOpportunity(opp.id)}
                onUnsave={() => unsaveOpportunity(opp.id)}
                onClick={() => navigate(`/opportunity/${opp.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
