import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { OpportunityGridSkeleton } from '@/components/ui/composite-skeletons';
import { Button, EmptyState } from '@/components/ui';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { daysUntil } from '@/utils/format';
import { Opportunity, AlternativeDiscovery, SearchResult } from '@/types/models';
import { getPersonalizedRecommendations, getOverlookingOpportunities } from '@/services/personalization.service';
import { cn } from '@/utils/cn';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { opportunities, isLoading } = useOpportunityStore();
  const { user, isAuthenticated } = useAuthStore();
  const { savedOpportunities, trackedApplications } = useApplicationStore();
  const [debugMode, setDebugMode] = useState(false);

  const userInterests = useMemo(() => {
    return user?.preferences?.fields || user?.profile?.interests || [];
  }, [user]);

  const userGoals = useMemo(() => {
    return user?.preferences?.goals || user?.profile?.goals || [];
  }, [user]);

  // Personalized recommendations scored dynamically
  const recommendations: SearchResult[] = useMemo(() => {
    if (!user?.profile || !user?.preferences) {
      return opportunities.slice(0, 6).map((opp: Opportunity) => ({
        opportunity: opp,
        relevanceScore: 70,
        relevanceReasons: ['Curated active opportunity']
      }));
    }
    return getPersonalizedRecommendations(opportunities, user.profile, user.preferences, 6);
  }, [opportunities, user]);

  // "You might be overlooking" adjacent opportunities
  const overlooked: AlternativeDiscovery[] = useMemo(() => {
    if (!user?.profile || !user?.preferences) return [];
    return getOverlookingOpportunities(opportunities, user.profile, user.preferences);
  }, [opportunities, user]);

  // Closing soon opportunities (urgency within 45 days)
  const closingSoon: Opportunity[] = useMemo(() => {
    return opportunities
      .filter((opp: Opportunity) => {
        if (!opp.deadline) return false;
        const days = daysUntil(opp.deadline);
        return days >= 0 && days <= 45;
      })
      .sort((a: Opportunity, b: Opportunity) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
  }, [opportunities]);

  // "Continue where you left off" active opportunities
  const activeItems = useMemo(() => {
    const saved = opportunities.filter(o => savedOpportunities.includes(o.id));
    return saved.slice(0, 3);
  }, [opportunities, savedOpportunities]);

  if (isLoading && opportunities.length === 0) {
    return <OpportunityGridSkeleton count={6} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
        <EmptyState 
          icon="user-rounded-linear"
          title="Sign in to view your recommendations"
          description="Create your profile to unlock personalized opportunity curation and adjacent career discovery."
          actionLabel="Sign In"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* ─── 1. Editorial Header ─── */}
      <header className="border-b border-surface-200 dark:border-surface-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50">
            For You
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 max-w-2xl leading-relaxed">
            Opportunities selected based on your interests, goals, experience, and where you’re looking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Matching Inspector Toggle */}
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border",
              debugMode 
                ? "bg-rome-50 dark:bg-rome-950/40 text-rome-700 dark:text-rome-300 border-rome-300 dark:border-rome-700 shadow-2xs" 
                : "bg-surface-50 dark:bg-surface-900 text-surface-500 dark:text-surface-400 border-surface-200 dark:border-surface-800 hover:text-surface-900 dark:hover:text-surface-200"
            )}
            title="Toggle matching signals breakdown on opportunity cards"
          >
            <SolarIcon name="bug-linear" size={14} className="w-3.5 h-3.5" />
            <span>Matching Inspector: {debugMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* User Focus Summary Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {userInterests.slice(0, 3).map((interest: string) => (
              <span key={interest} className="px-2.5 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-xs font-medium border border-surface-200/60 dark:border-surface-700">
                {interest}
              </span>
            ))}
            <Link to="/profile" className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline px-1.5 py-1">
              Edit preferences →
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. Recommended For You (Primary Curated Feed) ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-surface-950 dark:text-surface-50">
              Recommended for you
            </h2>
            <p className="text-xs text-surface-500">
              Ranked by alignment with your active profile criteria.
            </p>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white">
            Explore full catalog →
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <EmptyState
            icon="compass-linear"
            title="No recommendations yet"
            description="Add your target disciplines and location preferences in your profile to generate matches."
            actionLabel="Update Profile"
            onAction={() => navigate('/profile')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(({ opportunity, relevanceScore, relevanceReasons, matchSignals }) => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity}
                relevanceScore={relevanceScore}
                relevanceReasons={relevanceReasons}
                matchSignals={matchSignals}
                showDebugSignals={debugMode}
              />
            ))}
          </div>
        )}
      </section>

      {/* ─── 3. Continue Where You Left Off (Only if user has activity) ─── */}
      {activeItems.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-surface-950 dark:text-surface-50">
                Continue where you left off
              </h2>
              <p className="text-xs text-surface-500">Opportunities you recently saved or began tracking.</p>
            </div>
            <Link to="/my-opportunities" className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline">
              View all saved ({savedOpportunities.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeItems.map((opp) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp}
                compact
                showDebugSignals={debugMode}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. You Might Be Overlooking (Adjacent Possibilities) ─── */}
      {overlooked.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-surface-200 dark:border-surface-800">
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">
              You might be overlooking
            </h2>
            <p className="text-xs text-surface-500">
              Parallel pathways and adjacent fields that develop the same core competencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {overlooked.slice(0, 2).map((alt, idx) => (
              <div key={idx} className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-850/50 p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-surface-200/80 dark:bg-surface-700 text-surface-800 dark:text-surface-200 mb-1.5">
                      Adjacent: {alt.alternativeType}
                    </span>
                    <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
                      {alt.reason}
                    </p>
                  </div>
                </div>

                {alt.opportunities[0] && (
                  <OpportunityCard 
                    opportunity={alt.opportunities[0]} 
                    compact 
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 5. Closing Soon (Approaching Deadlines) ─── */}
      {closingSoon.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-surface-200 dark:border-surface-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                Closing soon
              </h2>
              <p className="text-xs text-surface-500">Opportunities with application windows closing within 45 days.</p>
            </div>
            <Link to="/explore?sort=deadline" className="text-xs font-semibold text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white">
              View all closing soon →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {closingSoon.map((opp) => (
              <OpportunityCard 
                key={opp.id}
                opportunity={opp}
                compact
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── 6. Based On Your Specific Interests ─── */}
      {userInterests.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-surface-200 dark:border-surface-800">
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">
              Explore by your interests
            </h2>
            <p className="text-xs text-surface-500">Quickly filter all opportunities matching your saved focus areas.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {userInterests.map((interest: string) => (
              <Button
                key={interest}
                variant="outline"
                size="sm"
                onClick={() => navigate(`/explore?field=${encodeURIComponent(interest)}`)}
                className="text-xs font-semibold"
              >
                <span>Explore {interest}</span>
                <SolarIcon name="alt-arrow-right-linear" size={12} />
              </Button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default RecommendationsPage;
