import { Opportunity, SearchFilters, SearchResult, UserProfile, UserPreferences, EducationLevel, ExperienceLevel } from '@/types/models';
import { calculateRelevanceScore } from './personalization.service';

export const searchOpportunities = (
  query: string,
  opportunities: Opportunity[],
  filters: Partial<SearchFilters> = {}
): Opportunity[] => {
  return opportunities.filter((opp: Opportunity) => {
    // 1. Text Query Search
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      const matchTitle = opp.title?.toLowerCase().includes(q);
      const matchDesc = (opp.shortDescription || opp.description || '').toLowerCase().includes(q);
      
      const orgName = typeof opp.organization === 'object' && opp.organization !== null 
        ? (opp.organization.name || '') 
        : String(opp.organization || '');
      const matchOrg = orgName.toLowerCase().includes(q);
      
      const matchTags = Array.isArray(opp.tags) && opp.tags.some((tag: string) => tag.toLowerCase().includes(q));
      const matchField = Array.isArray(opp.field) && opp.field.some((f: string) => f.toLowerCase().includes(q));
      const matchSubfields = Array.isArray(opp.subfields) && opp.subfields.some((s: string) => s.toLowerCase().includes(q));
      const matchLocation = opp.location?.toLowerCase().includes(q);
      const matchType = opp.type?.toLowerCase().includes(q);

      if (!matchTitle && !matchDesc && !matchOrg && !matchTags && !matchField && !matchSubfields && !matchLocation && !matchType) {
        return false;
      }
    }

    // 2. Filters
    if (filters.types?.length && !filters.types.includes(opp.type)) return false;
    
    if (filters.fields?.length && !opp.field?.some((field: string) => filters.fields!.includes(field))) return false;
    
    if (filters.locations?.length) {
      const locationMatch = filters.locations.some((loc: string) => 
        opp.location?.toLowerCase().includes(loc.toLowerCase())
      );
      if (!locationMatch) return false;
    }

    if (filters.remoteStatus?.length && !filters.remoteStatus.includes(opp.remoteStatus)) return false;

    if (filters.funded !== null && filters.funded !== undefined) {
      const isFunded = !!opp.funding && opp.funding.toLowerCase() !== 'unfunded';
      if (filters.funded && !isFunded) return false;
      if (!filters.funded && isFunded) return false;
    }

    if (filters.educationLevel?.length) {
      const oppEdu = opp.educationRequirements;
      if (oppEdu && !oppEdu.some((lvl: EducationLevel) => filters.educationLevel!.includes(lvl))) return false;
    }

    if (filters.experienceLevel?.length) {
      const oppExp = opp.experienceRequirements;
      if (oppExp && !filters.experienceLevel.includes(oppExp)) return false;
    }

    if (filters.duration?.length && opp.duration) {
      const matchDuration = filters.duration.some((dur: string) => opp.duration!.toLowerCase().includes(dur.toLowerCase()));
      if (!matchDuration) return false;
    }

    return true;
  });
};

export const sortByRelevance = (
  results: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences
): SearchResult[] => {
  return results.map((opp: Opportunity) => {
    const { score, reasons } = calculateRelevanceScore(opp, profile, preferences);
    return {
      opportunity: opp,
      relevanceScore: score,
      relevanceReasons: reasons
    };
  }).sort((a: SearchResult, b: SearchResult) => b.relevanceScore - a.relevanceScore);
};
