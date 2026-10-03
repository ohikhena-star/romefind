import { Opportunity, UserProfile, UserPreferences } from '@/types/models';
import { FIELDS } from '@/utils/constants';

export interface TrendingContextResult {
  fieldContext: string;
  source: 'query' | 'explore_filter' | 'onboarding_interests' | 'profile_interests' | 'recent_searches' | 'general';
  sourceDescription: string;
  opportunities: Opportunity[];
  totalMatching: number;
  isLowInventory: boolean;
  relatedFields: string[];
}

// Synonyms and semantic keywords mapping to canonical FIELDS
const FIELD_SYNONYM_MAP: Record<string, string[]> = {
  'Product Design': ['product design', 'ux', 'ui', 'ux/ui', 'design systems', 'interaction design', 'figma', 'prototyping', 'user experience', 'user research'],
  'UX/UI': ['ux/ui', 'ux', 'ui', 'product design', 'user interface', 'visual design', 'interaction design'],
  'Data Science': ['data science', 'machine learning', 'data analytics', 'analytics', 'statistics', 'biostatistics', 'data engineering', 'data analysis', 'big data'],
  'AI': ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'nlp', 'llm', 'computer vision', 'neural'],
  'Machine Learning': ['machine learning', 'ml', 'ai', 'deep learning', 'neural networks', 'data science'],
  'Customer Experience': ['customer experience', 'cx', 'customer success', 'customer service', 'support', 'account management', 'voice of customer', 'service design', 'journey management'],
  'Customer Success': ['customer success', 'customer experience', 'cx', 'client success', 'account management'],
  'Agriculture': ['agriculture', 'agri', 'agronomy', 'farming', 'food security', 'fao', 'sustainable agriculture', 'crop science', 'forestry'],
  'Software Engineering': ['software engineering', 'software development', 'coding', 'developer', 'frontend', 'backend', 'full stack', 'web development', 'programming', 'javascript', 'typescript', 'python'],
  'Project Management': ['project management', 'program management', 'scrum', 'agile', 'pmo', 'project manager', 'pmi'],
  'Operations': ['operations', 'business operations', 'process improvement', 'logistics', 'supply chain', 'admin', 'operational excellence'],
  'Finance': ['finance', 'financial', 'banking', 'investment', 'accounting', 'fintech', 'venture capital', 'treasury', 'economics'],
  'Biotechnology': ['biotechnology', 'biotech', 'life sciences', 'genomics', 'molecular biology', 'sanger', 'crispr', 'bioinformatics'],
  'Climate & Sustainability': ['climate', 'sustainability', 'clean energy', 'renewable', 'carbon', 'esg', 'circular economy'],
  'Journalism': ['journalism', 'reporting', 'news', 'media', 'investigative reporting', 'press', 'reuters', 'broadcasting'],
  'Teaching': ['teaching', 'education', 'teacher', 'classroom', 'tutoring', 'pedagogy', 'curriculum', 'teach first'],
  'Human Resources': ['human resources', 'hr', 'talent acquisition', 'people operations', 'recruitment', 'diversity & inclusion', 'shrm'],
  'Human Rights': ['human rights', 'civil rights', 'social justice', 'open society', 'advocacy', 'legal aid', 'refugees', 'equality'],
  'Governance': ['governance', 'public sector', 'government', 'public administration', 'policy reform', 'tony blair institute', 'state delivery'],
  'Public Policy': ['public policy', 'policy', 'policy analysis', 'international affairs', 'think tank', 'public affairs'],
  'Innovation': ['innovation', 'social innovation', 'solve', 'mit solve', 'social enterprise', 'accelerator', 'venture'],
  'Entrepreneurship': ['entrepreneurship', 'startups', 'founder', 'venture', 'business development', 'incubator', 'pitch'],
  'Academic Research': ['academic research', 'research fellowship', 'phd', 'postdoc', 'scientific research', 'scholarship'],
};

/**
 * Normalizes and attempts to match a string or query to one of the canonical fields.
 */
export function matchStringToCanonicalField(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const clean = input.trim().toLowerCase();
  if (!clean) return null;

  // 1. Direct exact match against canonical FIELDS
  for (const field of FIELDS) {
    if (field.toLowerCase() === clean) return field;
  }

  // 2. Direct substring match against canonical FIELDS
  for (const field of FIELDS) {
    const fLower = field.toLowerCase();
    if (clean.includes(fLower) || fLower.includes(clean)) return field;
  }

  // 3. Synonym / Keyword dictionary match
  for (const [canonicalField, synonyms] of Object.entries(FIELD_SYNONYM_MAP)) {
    if (synonyms.some(s => clean === s || clean.includes(s) || s.includes(clean))) {
      return canonicalField;
    }
  }

  return null;
}

/**
 * Resolves the strongest available field context based on the strict hierarchy:
 * 1. Current search query / selected field
 * 2. Current Explore/filter context
 * 3. User's onboarding interests
 * 4. User profile interests
 * 5. Recent search behavior
 * 6. General opportunity relevance/freshness
 */
export function resolveFieldContext({
  currentQuery,
  explicitField,
  exploreFilterField,
  preferences,
  profile,
  recentSearches,
}: {
  currentQuery?: string;
  explicitField?: string;
  exploreFilterField?: string;
  preferences?: UserPreferences | null;
  profile?: UserProfile | null;
  recentSearches?: string[];
}): { fieldContext: string; source: TrendingContextResult['source']; sourceDescription: string } {
  // Priority 1A: Explicitly selected field tab / filter
  if (explicitField) {
    const matched = matchStringToCanonicalField(explicitField) || explicitField;
    return {
      fieldContext: matched,
      source: 'explore_filter',
      sourceDescription: `Exploring ${matched}`
    };
  }

  // Priority 1B: Current active search query
  if (currentQuery && currentQuery.trim().length > 1) {
    const matched = matchStringToCanonicalField(currentQuery);
    if (matched) {
      return {
        fieldContext: matched,
        source: 'query',
        sourceDescription: `Matching your search for "${currentQuery.trim()}"`
      };
    }
  }

  // Priority 2: Current Explore filter context
  if (exploreFilterField) {
    const matched = matchStringToCanonicalField(exploreFilterField) || exploreFilterField;
    return {
      fieldContext: matched,
      source: 'explore_filter',
      sourceDescription: `Filtered by ${matched}`
    };
  }

  // Priority 3: User's onboarding interests / preferences
  if (preferences?.fields && preferences.fields.length > 0) {
    const primaryPref = preferences.fields[0];
    const matched = matchStringToCanonicalField(primaryPref) || primaryPref;
    return {
      fieldContext: matched,
      source: 'onboarding_interests',
      sourceDescription: `Based on your onboarding focus: ${matched}`
    };
  }

  // Priority 4: User profile interests
  if (profile?.interests && profile.interests.length > 0) {
    const primaryInterest = profile.interests[0];
    const matched = matchStringToCanonicalField(primaryInterest) || primaryInterest;
    return {
      fieldContext: matched,
      source: 'profile_interests',
      sourceDescription: `Based on your profile interest: ${matched}`
    };
  }

  // Priority 5: Recent search behavior
  if (recentSearches && recentSearches.length > 0) {
    for (const pastSearch of recentSearches) {
      const matched = matchStringToCanonicalField(pastSearch);
      if (matched) {
        return {
          fieldContext: matched,
          source: 'recent_searches',
          sourceDescription: `Based on your recent search for "${pastSearch}"`
        };
      }
    }
  }

  // Priority 6: General catalog relevance
  return {
    fieldContext: 'Product Design', // High-engagement anchor field
    source: 'general',
    sourceDescription: 'Popular across ROMEfind'
  };
}

/**
 * Retrieves genuine field-based trending opportunities with transparent, authentic scoring.
 * Does NOT fake view counts or numbers.
 * Honors low-inventory boundaries without substituting unrelated fields.
 */
export function getTrendingOpportunitiesForContext(
  opportunities: Opportunity[],
  contextField: string,
  limit: number = 6
): {
  opportunities: Opportunity[];
  totalMatching: number;
  isLowInventory: boolean;
  relatedFields: string[];
} {
  if (!opportunities || opportunities.length === 0) {
    return { opportunities: [], totalMatching: 0, isLowInventory: false, relatedFields: [] };
  }

  const targetLower = contextField.trim().toLowerCase();
  const synonyms = FIELD_SYNONYM_MAP[contextField] || [targetLower];

  // Genuine field-matching filter
  const matching = opportunities.filter(opp => {
    // Check in opportunity.field
    const inField = (opp.field || []).some(f => {
      const fLower = f.toLowerCase();
      return fLower === targetLower || fLower.includes(targetLower) || synonyms.some(s => fLower.includes(s));
    });
    if (inField) return true;

    // Check in subfields
    const inSubfields = (opp.subfields || []).some(s => {
      const sLower = s.toLowerCase();
      return sLower === targetLower || synonyms.some(syn => sLower.includes(syn));
    });
    if (inSubfields) return true;

    // Check in tags
    const inTags = (opp.tags || []).some(t => {
      const tLower = t.toLowerCase();
      return tLower === targetLower || synonyms.some(syn => tLower.includes(syn));
    });
    if (inTags) return true;

    // Check in title
    const inTitle = (opp.title || '').toLowerCase().includes(targetLower) || 
      synonyms.some(syn => (opp.title || '').toLowerCase().includes(syn));
    if (inTitle) return true;

    return false;
  });

  const totalMatching = matching.length;
  const isLowInventory = totalMatching > 0 && totalMatching <= 3;

  // Real, transparent ranking based on verifiable signals:
  // 1. Direct canonical field match (highest weight)
  // 2. Verified / Featured status
  // 3. Open status
  // 4. Upcoming deadline freshness (active within upcoming window)
  const ranked = [...matching].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Direct field presence
    const directA = (a.field || []).some(f => f.toLowerCase() === targetLower);
    const directB = (b.field || []).some(f => f.toLowerCase() === targetLower);
    if (directA) scoreA += 40;
    if (directB) scoreB += 40;

    // Featured signal
    if (a.isFeatured) scoreA += 30;
    if (b.isFeatured) scoreB += 30;

    // Status is open
    if (a.status === 'open') scoreA += 20;
    if (b.status === 'open') scoreB += 20;


    // Deadline freshness: closer valid deadlines get small prioritization
    if (a.deadline) {
      const daysA = (new Date(a.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysA > 0 && daysA <= 90) scoreA += 15;
    }
    if (b.deadline) {
      const daysB = (new Date(b.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysB > 0 && daysB <= 90) scoreB += 15;
    }

    return scoreB - scoreA;
  });

  // Collect related fields for quick navigation
  const relatedFields = Array.from(
    new Set(
      ranked.flatMap(o => o.field || [])
        .filter(f => f.toLowerCase() !== targetLower && FIELDS.includes(f as any))
    )
  ).slice(0, 4);

  return {
    opportunities: ranked.slice(0, limit),
    totalMatching,
    isLowInventory,
    relatedFields
  };
}
