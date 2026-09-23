import { Opportunity, UserProfile, UserPreferences, SearchResult, RemoteStatus, OpportunityType, AlternativeDiscovery } from '@/types/models';

export const calculateRelevanceScore = (
  opportunity: Opportunity,
  profile: UserProfile,
  preferences: UserPreferences
): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  // 1. Field Match (0-30 points)
  const userInterests = new Set([...(profile.interests || []), ...(preferences.fields || [])].map((i: string) => i.toLowerCase()));
  const oppFields = opportunity.field.map((f: string) => f.toLowerCase());
  
  const fieldMatches = oppFields.filter((f: string) => userInterests.has(f));
  if (fieldMatches.length > 0) {
    score += Math.min(30, fieldMatches.length * 15);
    reasons.push(`Matches your interest in ${fieldMatches.map((f: string) => f.charAt(0).toUpperCase() + f.slice(1)).join(' and ')}`);
  }

  // 2. Type Match (0-20 points)
  if (preferences.opportunityTypes?.includes(opportunity.type)) {
    score += 20;
    reasons.push(`Fits your preference for ${opportunity.type} opportunities`);
  }

  // 3. Location / Remote Preference (0-20 points)
  if (opportunity.remoteStatus === RemoteStatus.Remote && preferences.remotePreference?.some((r: RemoteStatus) => [RemoteStatus.Remote, RemoteStatus.Hybrid, RemoteStatus.Flexible].includes(r))) {
    score += 20;
    reasons.push('Matches your remote work preference');
  } else if (profile.location && opportunity.location.toLowerCase().includes(profile.location.toLowerCase())) {
    score += 20;
    reasons.push(`Located in your area (${profile.location})`);
  }

  // 4. Funding (0-15 points)
  if (preferences.fundingPreference) {
    if (opportunity.funding) {
      score += 15;
      reasons.push('Meets your requirement for funded opportunities');
    }
  } else if (opportunity.funding) {
    score += 10;
  }

  // 5. Skills Match (0-15 points)
  if (opportunity.tags && profile.skills?.length > 0) {
    const userSkills = new Set(profile.skills.map((s: string) => s.toLowerCase()));
    const skillMatches = opportunity.tags.filter((t: string) => userSkills.has(t.toLowerCase()));
    if (skillMatches.length > 0) {
      score += Math.min(15, skillMatches.length * 5);
      reasons.push(`Aligns with your skill in ${skillMatches[0]}`);
    }
  }

  const uniqueReasons = Array.from(new Set(reasons)).slice(0, 3);

  return {
    score: Math.max(10, Math.min(100, score)),
    reasons: uniqueReasons.length > 0 ? uniqueReasons : ['Aligns with your career direction']
  };
};

export const getAlternativeDiscoveries = (
  searchType: OpportunityType,
  allOpportunities: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences
): AlternativeDiscovery[] => {
  // Filter out the currently searched type
  const alternatives = allOpportunities.filter((opp: Opportunity) => opp.type !== searchType);
  
  // Score them
  const scoredAlts = alternatives.map((opp: Opportunity) => ({
    opportunity: opp,
    ...calculateRelevanceScore(opp, profile, preferences)
  })).filter((item: { score: number }) => item.score >= 30);

  // Group by type
  const grouped = scoredAlts.reduce((acc: Record<string, AlternativeDiscovery>, curr: { opportunity: Opportunity; score: number; reasons: string[] }) => {
    const altType = curr.opportunity.type;
    if (!acc[altType]) {
      acc[altType] = {
        sourceType: searchType,
        alternativeType: altType,
        count: 0,
        opportunities: [],
        reason: ''
      };
    }
    acc[altType].count++;
    acc[altType].opportunities.push(curr.opportunity);
    
    if (!acc[altType].reason && curr.reasons.length > 0) {
      acc[altType].reason = `While looking for ${searchType}s, you might also consider ${altType}s because they offer ${curr.reasons[0].toLowerCase()}`;
    }
    
    return acc;
  }, {} as Record<string, AlternativeDiscovery>);

  return Object.values(grouped).sort((a: AlternativeDiscovery, b: AlternativeDiscovery) => b.count - a.count);
};

export const getPersonalizedRecommendations = (
  opportunities: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences,
  limit: number = 10
): SearchResult[] => {
  const scored = opportunities.map((opp: Opportunity) => {
    const { score, reasons } = calculateRelevanceScore(opp, profile, preferences);
    return {
      opportunity: opp,
      relevanceScore: score,
      relevanceReasons: reasons
    };
  });

  return scored.sort((a: SearchResult, b: SearchResult) => b.relevanceScore - a.relevanceScore).slice(0, limit);
};

export const getOverlookingOpportunities = (
  opportunities: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences
): AlternativeDiscovery[] => {
  const preferredTypes = new Set(preferences.opportunityTypes || [OpportunityType.Internship]);
  const overlookedOpps = opportunities.filter((o: Opportunity) => !preferredTypes.has(o.type));
  
  const baseType = preferences.opportunityTypes?.[0] || OpportunityType.Internship;

  return getAlternativeDiscoveries(
    baseType,
    overlookedOpps,
    profile,
    preferences
  );
};
