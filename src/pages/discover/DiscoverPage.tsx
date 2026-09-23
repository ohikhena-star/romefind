import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { getPersonalizedRecommendations, getOverlookingOpportunities } from '@/services/personalization.service';
import { OpportunityCard } from '@/components/opportunity';
import { EmptyState } from '@/components/ui';
import { getGreeting, daysUntil } from '@/utils/format';
import { OPPORTUNITY_TYPE_COLORS } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { ChevronRight, Clock, Star, Sparkles, Compass } from 'lucide-react';
import { Opportunity, AlternativeDiscovery, SearchResult } from '@/types/models';

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { opportunities } = useOpportunityStore();
  const { savedOpportunities, trackedApplications, saveOpportunity, unsaveOpportunity, isSaved } = useApplicationStore();

  const recommendations: SearchResult[] = useMemo(() => {
    if (!user?.profile || !user?.preferences) {
      return opportunities.slice(0, 6).map((opp: Opportunity) => ({
        opportunity: opp,
        relevanceScore: 85,
        relevanceReasons: ['Popular opportunity matching general interests']
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
      .slice(0, 8);
  }, [opportunities]);

  const interestBased: Opportunity[] = useMemo(() => {
    const userInterests = user?.profile?.interests || user?.preferences?.fields || [];
    if (userInterests.length === 0) return opportunities.slice(0, 6);
    return opportunities
      .filter((opp: Opportunity) => opp.field.some((f: string) => userInterests.includes(f)))
      .slice(0, 6);
  }, [opportunities, user]);

  const continueExploring: Opportunity[] = useMemo(() => {
    return opportunities.filter((opp: Opportunity) => 
      savedOpportunities.includes(opp.id) || 
      trackedApplications.some(app => app.opportunityId === opp.id)
    ).slice(0, 4);
  }, [opportunities, savedOpportunities, trackedApplications]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
        <EmptyState 
          icon={Compass}
          title="Sign in to discover opportunities"
          description="Create a profile to get personalized opportunity recommendations and alternative path discovery."
          actionLabel="Sign In"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-20 animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <header className="space-y-1.5">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-950 dark:text-surface-50">
          {getGreeting()}, {user.profile?.name || 'Explorer'}
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400">
          Here's what's worth exploring for your path today.
        </p>
      </header>

      {/* Section 1: For You */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-surface-900 dark:text-surface-100">
              <Star className="w-5 h-5 text-rome-500 fill-rome-500" />
              For you
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Personalized opportunities matched to your identity and goals.
            </p>
          </div>
          <Link to="/explore" className="hidden sm:flex text-rome-600 dark:text-rome-400 hover:text-rome-700 font-medium items-center gap-1 transition-colors text-sm">
            See all recommendations <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map(rec => (
              <OpportunityCard 
                key={rec.opportunity.id} 
                opportunity={rec.opportunity}
                relevanceScore={rec.relevanceScore}
                relevanceReasons={rec.relevanceReasons}
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
            icon={Compass}
            title="We're learning about your path"
            description="Complete your profile skills and goals to get better recommendations."
            actionLabel="Update Profile"
            onAction={() => navigate('/profile')}
          />
        )}
      </section>

      <hr className="border-surface-200 dark:border-surface-800" />

      {/* Section 2: You Might Be Overlooking (Core Differentiator) */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rome-500" />
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">You might be overlooking</h2>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Based on your profile, there are alternative high-impact paths you could pursue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {overlooked.length > 0 ? (
            overlooked.map((item: AlternativeDiscovery, idx: number) => (
              <div 
                key={idx}
                onClick={() => navigate(`/explore?type=${encodeURIComponent(item.alternativeType)}`)}
                className={cn(
                  "cursor-pointer group relative overflow-hidden rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 transition-all hover:shadow-card-hover hover:border-rome-300 dark:hover:border-rome-800",
                )}
                style={{ borderLeftWidth: '5px', borderLeftColor: '#f97316' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 group-hover:text-rome-500 transition-colors">
                    {item.alternativeType}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rome-50 dark:bg-rome-900/30 text-rome-600 dark:text-rome-400">
                    {item.count} relevant
                  </span>
                </div>
                <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
                  {item.reason}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rome-600 dark:text-rome-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore {item.alternativeType}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-surface-50 dark:bg-surface-800/40 p-6 rounded-xl border border-surface-200 dark:border-surface-700">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                You're actively exploring multiple types! As you save more items, we'll continue suggesting unexplored pathways.
              </p>
            </div>
          )}
        </div>
      </section>

      {closingSoon.length > 0 && <hr className="border-surface-200 dark:border-surface-800" />}

      {/* Section 3: Closing Soon */}
      {closingSoon.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-surface-900 dark:text-surface-100">
              <Clock className="w-5 h-5 text-amber-500" />
              Closing soon
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Opportunities with deadlines approaching in the next 45 days.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {closingSoon.map((opp: Opportunity) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp} 
                compact 
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

      {interestBased.length > 0 && <hr className="border-surface-200 dark:border-surface-800" />}

      {/* Section 4: Based on Your Interests */}
      {interestBased.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Based on your interests</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Curated for your selected career fields and domains.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {interestBased.map((opp: Opportunity) => (
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

      <hr className="border-surface-200 dark:border-surface-800" />

      {/* Section 5: Continue Where You Left Off */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Continue where you left off</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Your saved opportunities and active applications.
          </p>
        </div>
        {continueExploring.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {continueExploring.map((opp: Opportunity) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp} 
                compact 
                showSaveButton
                isSaved={isSaved(opp.id)}
                onSave={() => saveOpportunity(opp.id)}
                onUnsave={() => unsaveOpportunity(opp.id)}
                onClick={() => navigate(`/opportunity/${opp.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Compass}
            title="No saved items yet"
            description="Start exploring opportunities and save what aligns with your ambitions."
            actionLabel="Explore Opportunities"
            onAction={() => navigate('/explore')}
          />
        )}
      </section>
    </div>
  );
}
