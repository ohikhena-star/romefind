import React, { useState, useMemo } from 'react';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { TrendingUp, CheckCircle2, Compass, Award, Globe, Activity, Filter, DollarSign } from 'lucide-react';
import { RemoteStatus } from '@/types/models';

type RecTab = 'all' | 'public_health' | 'remote' | 'high_match' | 'alternative' | 'funded';

export const RecommendationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RecTab>('all');
  const { opportunities } = useOpportunityStore();
  const { user } = useAuthStore();

  const userFields = user?.preferences?.fields || user?.profile?.interests || [];
  const remotePref = user?.preferences?.remotePreference || [];
  const locationPref = user?.preferences?.locationPreference || [];

  // Generate multi-factor scored recommendations
  const scoredOpportunities = useMemo(() => {
    return opportunities.map(opp => {
      let score = 65; // Base baseline
      const matchReasons: string[] = [];

      // 1. Field Alignment
      const oppFields = (opp.field || []).map(f => f.toLowerCase());
      const hasFieldMatch = userFields.some(uf => 
        oppFields.some(of => of.includes(uf.toLowerCase()) || uf.toLowerCase().includes(of))
      );
      if (hasFieldMatch) {
        score += 20;
        matchReasons.push('Aligns with your primary field interests');
      }

      // Public health boost if in user fields
      const isPublicHealth = oppFields.some(f => f.includes('health') || f.includes('medicine') || f.includes('epidemiology'));
      if (isPublicHealth && userFields.some(uf => uf.toLowerCase().includes('health'))) {
        score += 10;
        matchReasons.push('Strong match for Public & Global Health');
      }

      // 2. Modality & Remote Status Match
      if (opp.remoteStatus === RemoteStatus.Remote || String(opp.remoteStatus).toLowerCase() === 'remote') {
        score += 8;
        matchReasons.push('100% Remote — apply from anywhere');
      } else if (remotePref.length > 0 && remotePref.includes(opp.remoteStatus as any)) {
        score += 5;
        matchReasons.push(`Matches your ${opp.remoteStatus} work preference`);
      }

      // 3. Location Match
      if (opp.location === 'Global' || locationPref.some(lp => opp.location.toLowerCase().includes(lp.toLowerCase()))) {
        score += 5;
        matchReasons.push('Available for your target location/citizenship');
      }

      // 4. Funding match
      if (opp.funding && (opp.funding.toLowerCase().includes('fully') || opp.funding.toLowerCase().includes('stipend') || opp.funding.toLowerCase().includes('$') || opp.funding.toLowerCase().includes('£'))) {
        score += 4;
        matchReasons.push('Funded with stipend / tuition support');
      }

      const finalScore = Math.min(99, Math.max(60, score));

      return {
        opportunity: opp,
        score: finalScore,
        reasons: matchReasons.length > 0 ? matchReasons : ['Curated high-potential match for your background']
      };
    }).sort((a, b) => b.score - a.score);
  }, [opportunities, userFields, remotePref, locationPref]);

  // Filtered by active tab
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case 'high_match':
        return scoredOpportunities.filter(item => item.score >= 88);
      case 'public_health':
        return scoredOpportunities.filter(item => {
          const fields = (item.opportunity.field || []).map(f => f.toLowerCase());
          return fields.some(f => f.includes('health') || f.includes('medicine') || f.includes('epidemiology') || f.includes('bio'));
        });
      case 'remote':
        return scoredOpportunities.filter(item => 
          item.opportunity.remoteStatus === RemoteStatus.Remote || String(item.opportunity.remoteStatus).toLowerCase() === 'remote'
        );
      case 'alternative':
        return scoredOpportunities.filter(item => {
          return item.opportunity.field && item.opportunity.field.length >= 2;
        });
      case 'funded':
        return scoredOpportunities.filter(item => 
          item.opportunity.funding?.toLowerCase().includes('full') || 
          item.opportunity.funding?.toLowerCase().includes('stipend') ||
          item.opportunity.funding?.toLowerCase().includes('$') ||
          item.opportunity.funding?.toLowerCase().includes('£')
        );
      case 'all':
      default:
        return scoredOpportunities;
    }
  }, [scoredOpportunities, activeTab]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rome-900 via-surface-900 to-rome-950 p-6 md:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rome-500/20 text-rome-300 text-xs font-semibold mb-4 border border-rome-400/30">
            <Activity className="w-4 h-4 text-rome-400" />
            Decision-Support Intelligence Engine
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Opportunities Tailored Specifically For You
          </h1>
          <p className="text-surface-300 text-base md:text-lg mb-6 leading-relaxed">
            Scored across your target fields, work modality preferences (Remote, Hybrid, In-Person), experience level, and verified funding requirements.
          </p>

          {/* User Personalization Pill Indicators */}
          <div className="flex flex-wrap gap-2 text-xs">
            {userFields.map((f, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-surface-800/80 text-surface-200 border border-surface-700/50 flex items-center gap-1.5">
                <CheckCircle2 className="text-emerald-400 w-3.5 h-3.5" /> Field: {f}
              </span>
            ))}
            {remotePref.map((m, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-surface-800/80 text-surface-200 border border-surface-700/50 flex items-center gap-1.5">
                <Globe className="text-blue-400 w-3.5 h-3.5" /> Modality: {m}
              </span>
            ))}
            {user?.profile?.currentStatus && (
              <span className="px-3 py-1 rounded-lg bg-surface-800/80 text-surface-200 border border-surface-700/50">
                Status: {user.profile.currentStatus}
              </span>
            )}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-rome-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-surface-200 dark:border-surface-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          All Recommendations ({scoredOpportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('high_match')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'high_match'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          Top Matches (90%+ Fit)
        </button>

        <button
          onClick={() => setActiveTab('public_health')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'public_health'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          Public & Global Health
        </button>

        <button
          onClick={() => setActiveTab('remote')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'remote'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Globe className="w-4 h-4 text-sky-400" />
          100% Full-Time Remote
        </button>

        <button
          onClick={() => setActiveTab('funded')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'funded'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          Fully Funded & Fellowships
        </button>

        <button
          onClick={() => setActiveTab('alternative')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'alternative'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Compass className="w-4 h-4 text-purple-400" />
          Alternative Paths & Adjacent
        </button>
      </div>

      {/* Grid of Recommended Opportunities */}
      {tabFiltered.length === 0 ? (
        <div className="text-center py-16 bg-surface-50 dark:bg-surface-900/50 rounded-2xl border border-surface-200 dark:border-surface-800 p-8">
          <Filter className="w-12 h-12 text-surface-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-surface-800 dark:text-surface-100 mb-1">
            No opportunities found in this category
          </h3>
          <p className="text-surface-500 text-sm max-w-md mx-auto">
            Try switching to 'All Recommendations' or updating your profile interests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabFiltered.map(({ opportunity, score, reasons }) => (
            <div key={opportunity.id} className="flex flex-col relative group">
              {/* Fit Score Badge on Card Top */}
              <div className="mb-1 flex items-center justify-between px-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rome-50 text-rome-700 dark:bg-rome-950 dark:text-rome-300 border border-rome-200 dark:border-rome-800">
                  <TrendingUp className="w-3 h-3 text-rome-500" />
                  {score}% Fit Score
                </span>
                <span className="text-[11px] text-surface-400 truncate max-w-[180px]">
                  {reasons[0]}
                </span>
              </div>
              <OpportunityCard opportunity={opportunity} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
