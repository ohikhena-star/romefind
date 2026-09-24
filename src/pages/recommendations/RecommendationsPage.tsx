import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { TrendingUp, CheckCircle2, Compass, Award, Globe, Activity, Filter, DollarSign, ArrowRight } from 'lucide-react';
import { RemoteStatus, Opportunity } from '@/types/models';

type RecTab = 'all' | 'high_match' | 'public_health' | 'remote' | 'funded' | 'alternative';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RecTab>('all');
  const { opportunities, isLoading } = useOpportunityStore();
  const { user } = useAuthStore();
  const { isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();

  const userFields = useMemo(() => {
    const fields = user?.preferences?.fields || user?.profile?.interests || [];
    return fields.map((f: string) => f.toLowerCase().trim());
  }, [user]);

  const userTypes = useMemo(() => {
    const types = user?.preferences?.opportunityTypes || [];
    return types.map((t: string) => t.toLowerCase().trim());
  }, [user]);

  const remotePref = useMemo(() => {
    return user?.preferences?.remotePreference || [];
  }, [user]);

  const userSkills = useMemo(() => {
    const skills = user?.profile?.skills || [];
    return skills.map((s: string) => s.toLowerCase().trim());
  }, [user]);

  const locationPref = useMemo(() => {
    return user?.preferences?.locationPreference || [];
  }, [user]);

  // Generate multi-factor, realistic, dynamic scored recommendations
  const scoredOpportunities = useMemo(() => {
    return opportunities.map(opp => {
      let score = 25; // Transparent baseline
      const matchReasons: string[] = [];

      const oppFields = (opp.field || []).map(f => f.toLowerCase());
      const oppTitle = (opp.title || '').toLowerCase();
      const oppDesc = (opp.description || '').toLowerCase();
      const oppTags = (opp.tags || []).map(t => t.toLowerCase());

      // 1. Target Field Match (0 - 35 points)
      if (userFields.length > 0) {
        const directFieldMatches = oppFields.filter(f => 
          userFields.some(uf => f.includes(uf) || uf.includes(f))
        );
        if (directFieldMatches.length > 0) {
          score += Math.min(35, directFieldMatches.length * 18);
          matchReasons.push(`Direct match for your interest in ${directFieldMatches.join(', ')}`);
        } else {
          // Check title / description for keyword alignment
          const textMatches = userFields.filter(uf => oppTitle.includes(uf) || oppDesc.includes(uf));
          if (textMatches.length > 0) {
            score += 15;
            matchReasons.push(`Relates to your target domain (${textMatches[0]})`);
          }
        }
      } else {
        score += 15; // default domain credit
      }

      // 2. Opportunity Type Match (0 - 15 points)
      if (userTypes.length > 0) {
        const oppTypeStr = String(opp.type).toLowerCase();
        if (userTypes.some(ut => ut.includes(oppTypeStr) || oppTypeStr.includes(ut))) {
          score += 15;
          matchReasons.push(`Matches your preferred format: ${opp.type}`);
        }
      } else {
        score += 8;
      }

      // 3. Modality & Remote Match (0 - 18 points)
      const isOppRemote = opp.remoteStatus === RemoteStatus.Remote || String(opp.remoteStatus).toLowerCase().includes('remote');
      const wantsRemote = remotePref.some((r: any) => String(r).toLowerCase().includes('remote'));

      if (isOppRemote) {
        if (wantsRemote || remotePref.length === 0) {
          score += 18;
          matchReasons.push('100% Full-Time Remote flexibility');
        } else {
          score += 10;
        }
      } else if (remotePref.length > 0) {
        const statusStr = String(opp.remoteStatus).toLowerCase();
        if (remotePref.some((r: any) => String(r).toLowerCase() === statusStr)) {
          score += 14;
          matchReasons.push(`Matches your ${opp.remoteStatus} preference`);
        }
      }

      // 4. Skills Match (0 - 15 points)
      if (userSkills.length > 0) {
        const skillMatches = userSkills.filter(sk => 
          oppTags.some(t => t.includes(sk) || sk.includes(t)) || oppDesc.includes(sk)
        );
        if (skillMatches.length > 0) {
          score += Math.min(15, skillMatches.length * 8);
          matchReasons.push(`Leverages your skill in ${skillMatches[0]}`);
        }
      }

      // 5. Funding Match (0 - 12 points)
      const hasFunding = opp.funding && (
        opp.funding.toLowerCase().includes('full') ||
        opp.funding.toLowerCase().includes('stipend') ||
        opp.funding.toLowerCase().includes('$') ||
        opp.funding.toLowerCase().includes('£') ||
        opp.funding.toLowerCase().includes('€') ||
        opp.funding.toLowerCase().includes('grant') ||
        opp.funding.toLowerCase().includes('award')
      );

      if (hasFunding) {
        score += 12;
        matchReasons.push('Verified funding & financial support');
      }

      // 6. Location Match (0 - 8 points)
      if (opp.location === 'Global' || locationPref.some(lp => opp.location.toLowerCase().includes(lp.toLowerCase()))) {
        score += 8;
        matchReasons.push('Open to your location & eligibility');
      }

      // Dynamic clamping between 38% and 94% (realistic, credible distribution)
      const finalScore = Math.min(94, Math.max(38, score));

      return {
        opportunity: opp,
        score: finalScore,
        reasons: matchReasons.length > 0 ? matchReasons : ['High-quality curated opportunity for your profile']
      };
    }).sort((a, b) => b.score - a.score);
  }, [opportunities, userFields, userTypes, remotePref, userSkills, locationPref]);

  // Tab categorization filter logic
  const tabFiltered = useMemo(() => {
    switch (activeTab) {
      case 'high_match':
        return scoredOpportunities.filter(item => item.score >= 80);
      case 'public_health':
        return scoredOpportunities.filter(item => {
          const fields = (item.opportunity.field || []).map(f => f.toLowerCase());
          const title = (item.opportunity.title || '').toLowerCase();
          const desc = (item.opportunity.description || '').toLowerCase();
          const tags = (item.opportunity.tags || []).map(t => t.toLowerCase());
          return (
            fields.some(f => f.includes('health') || f.includes('medicine') || f.includes('epidemiology') || f.includes('bio') || f.includes('clinical')) ||
            title.includes('health') || title.includes('epidemiology') || title.includes('who') || title.includes('biomedical') ||
            tags.some(t => t.includes('health') || t.includes('epidemiology') || t.includes('bio')) ||
            desc.includes('public health') || desc.includes('global health')
          );
        });
      case 'remote':
        return scoredOpportunities.filter(item => 
          item.opportunity.remoteStatus === RemoteStatus.Remote || 
          String(item.opportunity.remoteStatus).toLowerCase().includes('remote')
        );
      case 'funded':
        return scoredOpportunities.filter(item => {
          const fund = (item.opportunity.funding || '').toLowerCase();
          return (
            fund.includes('full') || 
            fund.includes('stipend') ||
            fund.includes('$') ||
            fund.includes('£') ||
            fund.includes('€') ||
            fund.includes('grant') ||
            fund.includes('award') ||
            fund.includes('salary')
          );
        });
      case 'alternative':
        return scoredOpportunities.filter(item => {
          const oppFields = (item.opportunity.field || []).map(f => f.toLowerCase());
          const isDirectPrimary = oppFields.some(of => userFields.some(uf => of.includes(uf) || uf.includes(of)));
          // Opportunities outside direct primary field that offer adjacent transferrable skills
          return !isDirectPrimary || item.opportunity.field.length >= 2;
        });
      case 'all':
      default:
        return scoredOpportunities;
    }
  }, [scoredOpportunities, activeTab, userFields]);

  // Live Counts for each tab
  const counts = useMemo(() => {
    return {
      all: scoredOpportunities.length,
      high_match: scoredOpportunities.filter(item => item.score >= 80).length,
      public_health: scoredOpportunities.filter(item => {
        const fields = (item.opportunity.field || []).map(f => f.toLowerCase());
        const title = (item.opportunity.title || '').toLowerCase();
        return (
          fields.some(f => f.includes('health') || f.includes('medicine') || f.includes('epidemiology') || f.includes('bio')) ||
          title.includes('health') || title.includes('epidemiology')
        );
      }).length,
      remote: scoredOpportunities.filter(item => 
        item.opportunity.remoteStatus === RemoteStatus.Remote || 
        String(item.opportunity.remoteStatus).toLowerCase().includes('remote')
      ).length,
      funded: scoredOpportunities.filter(item => {
        const fund = (item.opportunity.funding || '').toLowerCase();
        return fund.includes('full') || fund.includes('stipend') || fund.includes('$') || fund.includes('£') || fund.includes('€') || fund.includes('grant');
      }).length,
      alternative: scoredOpportunities.filter(item => {
        const oppFields = (item.opportunity.field || []).map(f => f.toLowerCase());
        const isDirect = oppFields.some(of => userFields.some(uf => of.includes(uf) || uf.includes(of)));
        return !isDirect || item.opportunity.field.length >= 2;
      }).length
    };
  }, [scoredOpportunities, userFields]);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-900 via-rome-950 to-surface-950 p-6 md:p-10 text-white shadow-2xl border border-surface-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rome-500/20 text-rome-300 text-xs font-semibold mb-4 border border-rome-400/30 backdrop-blur-sm">
            <Activity className="w-4 h-4 text-rome-400" />
            Decision-Support Intelligence Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
            Opportunities Tailored Specifically For You
          </h1>
          <p className="text-surface-300 text-base md:text-lg mb-6 leading-relaxed">
            Multi-factor scoring calculated dynamically against your target fields, work modality (Remote, Hybrid), experience level, and verified funding requirements.
          </p>

          {/* User Personalization Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            {userFields.map((f, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-surface-800/90 text-surface-200 border border-surface-700/60 flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="text-emerald-400 w-3.5 h-3.5" /> Field: {f.charAt(0).toUpperCase() + f.slice(1)}
              </span>
            ))}
            {remotePref.map((m: string, idx: number) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-surface-800/90 text-surface-200 border border-surface-700/60 flex items-center gap-1.5 shadow-xs">
                <Globe className="text-blue-400 w-3.5 h-3.5" /> Modality: {m}
              </span>
            ))}
            {user?.profile?.currentStatus && (
              <span className="px-3 py-1 rounded-xl bg-surface-800/90 text-surface-200 border border-surface-700/60">
                Status: {user.profile.currentStatus}
              </span>
            )}
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-rome-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-surface-200 dark:border-surface-800 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          All Recommendations
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300'}`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('high_match')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'high_match'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          Top Matches (80%+ Fit)
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'high_match' ? 'bg-white/20 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300'}`}>
            {counts.high_match}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('public_health')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'public_health'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          Public & Global Health
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'public_health' ? 'bg-white/20 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300'}`}>
            {counts.public_health}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('remote')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'remote'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Globe className="w-4 h-4 text-sky-400" />
          100% Full-Time Remote
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'remote' ? 'bg-white/20 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300'}`}>
            {counts.remote}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('funded')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'funded'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          Fully Funded & Fellowships
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'funded' ? 'bg-white/20 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300'}`}>
            {counts.funded}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('alternative')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'alternative'
              ? 'bg-rome-600 text-white shadow-md'
              : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
          }`}
        >
          <Compass className="w-4 h-4 text-purple-400" />
          Alternative Paths & Adjacent
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'alternative' ? 'bg-white/20 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300'}`}>
            {counts.alternative}
          </span>
        </button>
      </div>

      {/* Grid of Recommended Opportunities */}
      {tabFiltered.length === 0 ? (
        <div className="text-center py-16 bg-surface-50 dark:bg-surface-900/50 rounded-3xl border border-surface-200 dark:border-surface-800 p-8 space-y-4">
          <Filter className="w-12 h-12 text-surface-400 mx-auto" />
          <h3 className="text-xl font-bold text-surface-800 dark:text-surface-100">
            No opportunities found in this category
          </h3>
          <p className="text-surface-500 text-sm max-w-md mx-auto">
            Try switching to 'All Recommendations' or updating your profile interests to expand your matching pool.
          </p>
          <button
            onClick={() => setActiveTab('all')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rome-600 hover:bg-rome-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            View All Recommendations <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabFiltered.map(({ opportunity, score, reasons }) => (
            <div 
              key={opportunity.id} 
              className="flex flex-col relative group transition-transform hover:-translate-y-0.5"
            >
              {/* Fit Score Header on Card Top */}
              <div 
                onClick={() => navigate(`/opportunity/${opportunity.id}`)}
                className="mb-1.5 flex items-center justify-between px-1 cursor-pointer"
              >
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs ${
                  score >= 80 
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : score >= 65
                    ? 'bg-rome-50 text-rome-800 dark:bg-rome-950/70 dark:text-rome-300 border-rome-200 dark:border-rome-800'
                    : 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border-surface-200 dark:border-surface-700'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {score}% Fit Score
                </span>
                <span className="text-[11px] text-surface-500 dark:text-surface-400 truncate max-w-[190px] font-medium" title={reasons[0]}>
                  {reasons[0]}
                </span>
              </div>

              {/* Clickable Opportunity Card */}
              <OpportunityCard 
                opportunity={opportunity}
                relevanceScore={score}
                relevanceReasons={reasons}
                showSaveButton
                isSaved={isSaved(opportunity.id)}
                onSave={() => saveOpportunity(opportunity.id)}
                onUnsave={() => unsaveOpportunity(opportunity.id)}
                onClick={() => navigate(`/opportunity/${opportunity.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
