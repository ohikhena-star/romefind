import { Opportunity, SearchFilters, SearchResult, UserProfile, UserPreferences, EducationLevel, ExperienceLevel, RemoteStatus } from '@/types/models';
import { calculateRelevanceScore } from './personalization.service';

// Human-centered intent mapping table for broad search interpretation
const INTENT_MAPPINGS: Record<string, string[]> = {
  'behind the scenes': ['operations', 'project management', 'virtual assistance', 'administration', 'executive assistance', 'logistics', 'procurement', 'supply chain'],
  'working with people': ['customer experience', 'customer success', 'sales', 'community management', 'human resources', 'recruitment', 'account management'],
  'people': ['customer experience', 'customer success', 'sales', 'community management', 'human resources', 'social impact'],
  'money and numbers': ['finance', 'accounting', 'investment', 'banking', 'economics', 'financial analysis', 'fintech', 'audit', 'tax'],
  'numbers': ['finance', 'accounting', 'data science', 'analytics', 'statistics', 'investment'],
  'money': ['finance', 'investment', 'banking', 'grants', 'funding', 'scholarships'],
  'create things': ['design', 'writing', 'photography', 'film', 'animation', 'marketing', 'creative technology', 'architecture', 'ux/ui'],
  'creating': ['product design', 'ux/ui', 'writing', 'media', 'creative', 'graphic design', 'content creation'],
  'solving technical problems': ['software engineering', 'data science', 'ai', 'cybersecurity', 'cloud', 'engineering', 'devops'],
  'technical': ['software engineering', 'ai', 'data science', 'cloud', 'cybersecurity', 'engineering'],
  'help people': ['healthcare', 'education', 'social impact', 'development', 'public health', 'ngo', 'policy', 'human rights'],
  'helping': ['social impact', 'healthcare', 'education', 'ngo', 'community', 'volunteering'],
  'project manager': ['project management', 'operations', 'program management', 'scrum', 'agile'],
  'customer experience': ['customer success', 'customer service', 'support', 'account management', 'cx'],
  'virtual assistant': ['administration', 'executive assistance', 'virtual assistant', 'remote assistance'],
  'accountant': ['accounting', 'audit', 'tax', 'bookkeeping', 'finance'],
  'marketer': ['digital marketing', 'content marketing', 'seo', 'social media', 'growth marketing'],
  'event': ['conference/event', 'conference', 'summit', 'networking', 'expo', 'workshop', 'career fair'],
  'events': ['conference/event', 'conference', 'summit', 'networking', 'expo', 'workshop', 'career fair'],
  'networking': ['conference/event', 'networking', 'meetup', 'community', 'conference', 'expo', 'summit'],
  'conference': ['conference/event', 'conference', 'summit', 'symposium', 'expo', 'research'],
  'conferences': ['conference/event', 'conference', 'summit', 'symposium', 'expo', 'research'],
  'career fair': ['conference/event', 'career fair', 'recruiting', 'expo', 'internship', 'job'],
  'workshop': ['conference/event', 'workshop', 'masterclass', 'training', 'programme'],
  'workshops': ['conference/event', 'workshop', 'masterclass', 'training', 'programme'],
  'hackathon': ['conference/event', 'competition', 'hackathon', 'open-source', 'bounty'],
};

// Sourcing Gap In-Memory / Local Storage Tracker
export interface SourcingGap {
  query: string;
  count: number;
  timestamp: string;
  categorySuggestion?: string;
}

export const trackSourcingGap = (query: string, resultsCount: number): void => {
  if (!query || resultsCount > 1) return;
  try {
    const raw = localStorage.getItem('romefind_sourcing_gaps');
    const gaps: SourcingGap[] = raw ? JSON.parse(raw) : [];
    const existing = gaps.find(g => g.query.toLowerCase() === query.trim().toLowerCase());
    if (existing) {
      existing.count += 1;
      existing.timestamp = new Date().toISOString();
    } else {
      gaps.push({
        query: query.trim(),
        count: 1,
        timestamp: new Date().toISOString()
      });
    }
    localStorage.setItem('romefind_sourcing_gaps', JSON.stringify(gaps.slice(0, 100)));
  } catch (e) {
    // Ignore storage issues in non-browser environments
  }
};

export const getSourcingGaps = (): SourcingGap[] => {
  try {
    const raw = localStorage.getItem('romefind_sourcing_gaps');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Geographic & Regional Taxonomy Mapping
const REGION_TERMS_MAP: Record<string, string[]> = {
  'nigeria': ['nigeria', 'lagos', 'abuja'],
  'kenya': ['kenya', 'nairobi'],
  'south africa': ['south africa', 'johannesburg', 'cape town'],
  'ghana': ['ghana', 'accra'],
  'rwanda': ['rwanda', 'kigali'],
  'africa': ['africa', 'sub-saharan africa', 'nigeria', 'ghana', 'kenya', 'south africa', 'rwanda', 'lagos', 'johannesburg', 'nairobi', 'accra', 'kigali', 'cairo', 'brazzaville'],
  'united kingdom': ['united kingdom', 'uk', 'london', 'oxford', 'cambridge', 'edinburgh', 'manchester'],
  'uk': ['united kingdom', 'uk', 'london', 'oxford', 'cambridge', 'edinburgh', 'manchester'],
  'united states': ['united states', 'usa', 'us', 'new york', 'san francisco', 'washington', 'boston', 'california', 'stanford', 'cambridge, ma'],
  'north america': ['united states', 'usa', 'us', 'canada', 'toronto', 'vancouver', 'mexico'],
  'canada': ['canada', 'toronto', 'vancouver', 'montreal', 'ottawa'],
  'france': ['france', 'paris'],
  'germany': ['germany', 'berlin', 'munich'],
  'spain': ['spain', 'madrid', 'barcelona'],
  'switzerland': ['switzerland', 'geneva', 'zurich'],
  'sweden': ['sweden', 'stockholm'],
  'ireland': ['ireland', 'dublin'],
  'netherlands': ['netherlands', 'amsterdam'],
  'europe': ['europe', 'emea', 'united kingdom', 'uk', 'london', 'oxford', 'france', 'paris', 'germany', 'berlin', 'spain', 'madrid', 'switzerland', 'geneva', 'sweden', 'stockholm', 'ireland', 'dublin', 'netherlands', 'amsterdam'],
  'asia': ['asia', 'singapore', 'japan', 'tokyo', 'india', 'delhi', 'mumbai', 'bangalore', 'hong kong', 'china', 'manila'],
  'india': ['india', 'delhi', 'mumbai', 'bangalore'],
  'singapore': ['singapore'],
  'japan': ['japan', 'tokyo'],
  'australia': ['australia', 'sydney', 'melbourne'],
  'oceania': ['australia', 'new zealand', 'oceania'],
  'latin america & caribbean': ['latin america', 'latam', 'brazil', 'peru', 'argentina', 'colombia', 'caribbean'],
  'brazil': ['brazil', 'sao paulo', 'rio'],
  'middle east': ['middle east', 'dubai', 'uae', 'saudi arabia', 'cairo', 'doha', 'qatar'],
  'remote': ['remote', 'worldwide', 'all time zones'],
  'remote (worldwide)': ['remote', 'worldwide', 'all time zones', 'flexible'],
  'global / anywhere': ['global', 'worldwide', 'anywhere', 'all countries', 'remote'],
  'worldwide': ['global', 'worldwide', 'anywhere', 'all countries', 'remote'],
};

export const searchOpportunities = (
  query: string,
  opportunities: Opportunity[],
  filters: Partial<SearchFilters> = {}
): Opportunity[] => {
  const filtered = opportunities.filter((opp: Opportunity) => {
    // 1. Text & Semantic Query Search
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      
      // Exact term matches
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

      // Semantic Intent expansion matches
      let matchIntent = false;
      for (const [intentPhrase, mappedTerms] of Object.entries(INTENT_MAPPINGS)) {
        if (q.includes(intentPhrase) || intentPhrase.includes(q)) {
          const hasFieldOrTagMatch = mappedTerms.some(term => 
            (opp.field || []).some((f: string) => f.toLowerCase().includes(term)) ||
            (opp.subfields || []).some((s: string) => s.toLowerCase().includes(term)) ||
            (opp.tags || []).some((t: string) => t.toLowerCase().includes(term)) ||
            opp.title.toLowerCase().includes(term)
          );
          if (hasFieldOrTagMatch) {
            matchIntent = true;
            break;
          }
        }
      }

      if (!matchTitle && !matchDesc && !matchOrg && !matchTags && !matchField && !matchSubfields && !matchLocation && !matchType && !matchIntent) {
        return false;
      }
    }

    // 2. Types Filter
    if (filters.types?.length && !filters.types.includes(opp.type)) return false;
    
    // 3. Field of Focus Filter
    if (filters.fields?.length) {
      const matchField = filters.fields.some((selectedField: string) => {
        const target = selectedField.trim().toLowerCase();
        
        const oppFields = Array.isArray(opp.field) ? opp.field : (typeof opp.field === 'string' ? [opp.field] : []);
        const oppSubfields = Array.isArray(opp.subfields) ? opp.subfields : (typeof opp.subfields === 'string' ? [opp.subfields] : []);
        const oppTags = Array.isArray(opp.tags) ? opp.tags : (typeof opp.tags === 'string' ? [opp.tags] : []);

        const inField = oppFields.some((f: string) => {
          const item = (f || '').trim().toLowerCase();
          return item === target || item.includes(target) || target.includes(item);
        });

        const inSubfields = oppSubfields.some((s: string) => {
          const item = (s || '').trim().toLowerCase();
          return item === target || item.includes(target) || target.includes(item);
        });

        const inTags = oppTags.some((t: string) => {
          const item = (t || '').trim().toLowerCase();
          return item === target || item.includes(target);
        });

        const inTitle = (opp.title || '').toLowerCase().includes(target);

        return inField || inSubfields || inTags || inTitle;
      });

      if (!matchField) return false;
    }
    
    // 4. Location Filter (with Regional Hierarchy)
    if (filters.locations?.length) {
      const locationMatch = filters.locations.some((selectedLoc: string) => {
        const cleanLoc = selectedLoc.trim().toLowerCase();

        // If filtering for Remote
        if (cleanLoc === 'remote' || cleanLoc === 'remote (worldwide)') {
          return (
            opp.remoteStatus === RemoteStatus.Remote ||
            opp.remoteStatus === RemoteStatus.Flexible ||
            (opp.location || '').toLowerCase().includes('remote')
          );
        }

        // If filtering for Global / Anywhere / Worldwide
        if (cleanLoc === 'global / anywhere' || cleanLoc === 'worldwide' || cleanLoc === 'anywhere') {
          return (
            (opp.location || '').toLowerCase().includes('global') ||
            (opp.location || '').toLowerCase().includes('worldwide') ||
            (opp.location || '').toLowerCase().includes('remote') ||
            opp.remoteStatus === RemoteStatus.Remote
          );
        }

        // Specific regional or country matching
        const mappedTerms = REGION_TERMS_MAP[cleanLoc] || [cleanLoc];
        const oppLoc = (opp.location || '').toLowerCase();
        
        const hasDirectMatch = mappedTerms.some((term) => oppLoc.includes(term));
        if (hasDirectMatch) return true;

        // Also check if opportunity is global/worldwide open to all
        if (oppLoc.includes('worldwide') || oppLoc.includes('all countries') || oppLoc.includes('global (all')) {
          return true;
        }

        return false;
      });

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

  // Track demand vs supply gaps
  if (query && query.trim().length > 2) {
    trackSourcingGap(query, filtered.length);
  }

  return filtered;
};

export const sortByRelevance = (
  results: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences
): SearchResult[] => {
  return results.map((opp: Opportunity) => {
    const { score, reasons, matchSignals } = calculateRelevanceScore(opp, profile, preferences);
    return {
      opportunity: opp,
      relevanceScore: score,
      relevanceReasons: reasons,
      matchSignals
    };
  }).sort((a: SearchResult, b: SearchResult) => b.relevanceScore - a.relevanceScore);
};
