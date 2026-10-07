import { 
  Opportunity, 
  UserProfile, 
  UserPreferences, 
  SearchResult, 
  RemoteStatus, 
  OpportunityType, 
  AlternativeDiscovery,
  ExperienceLevel,
  EducationLevel 
} from '@/types/models';

// Domain knowledge clusters for universal career and skill normalization
const DOMAIN_CLUSTERS: Record<string, string[]> = {
  business_operations: ['project management', 'operations', 'business analysis', 'virtual assistant', 'administrative', 'executive assistant', 'supply chain', 'procurement', 'human resources', 'recruitment', 'customer experience', 'customer success', 'account management', 'consulting', 'strategy', 'business development', 'sales'],
  finance_accounting: ['accounting', 'financial analysis', 'investment', 'banking', 'fintech', 'audit', 'tax', 'risk management', 'economics', 'financial planning', 'treasury', 'bookkeeping', 'finance'],
  ux_design: ['ux', 'ui', 'product design', 'user research', 'user experience', 'interaction design', 'figma', 'design systems', 'wireframing', 'prototyping', 'usability', 'hci', 'human-centered design', 'graphic design', 'brand design', 'motion design', 'industrial design'],
  software_engineering: ['software engineering', 'computer science', 'frontend', 'backend', 'full stack', 'fullstack', 'web development', 'javascript', 'typescript', 'python', 'react', 'node.js', 'c++', 'go', 'git', 'open source', 'cloud', 'devops', 'cybersecurity', 'mobile development', 'qa', 'testing', 'it support'],
  data_ai: ['artificial intelligence', 'machine learning', 'data science', 'deep learning', 'nlp', 'computer vision', 'data analytics', 'statistics', 'pytorch', 'tensorflow', 'biostatistics', 'data engineering'],
  marketing_comms: ['digital marketing', 'content marketing', 'social media', 'seo', 'communications', 'public relations', 'copywriting', 'content creation', 'community management', 'growth marketing', 'advertising', 'branding'],
  creative_arts: ['writing', 'journalism', 'photography', 'film', 'animation', 'illustration', 'music', 'fashion', 'architecture', 'creative direction', 'publishing', 'arts', 'media'],
  science_engineering: ['engineering', 'biotechnology', 'chemistry', 'physics', 'mathematics', 'environmental science', 'agriculture', 'climate', 'clean energy', 'life sciences', 'materials science', 'robotics'],
  health_medicine: ['medicine', 'nursing', 'public health', 'global health', 'mental health', 'healthcare administration', 'health technology', 'nutrition', 'biomedical sciences', 'epidemiology', 'clinical research'],
  education_teaching: ['teaching', 'educational technology', 'edtech', 'curriculum design', 'academic research', 'education administration', 'higher education', 'tutoring'],
  policy_law_society: ['law', 'human rights', 'public policy', 'governance', 'international relations', 'social impact', 'ngo', 'nonprofit', 'public administration', 'development economics', 'diplomacy', 'civic tech'],
  entrepreneurship_startups: ['startups', 'accelerators', 'incubators', 'venture capital', 'entrepreneurship', 'founder', 'pitch', 'innovation', 'angel investing'],
  research_academic: ['research', 'scientific research', 'academic', 'laboratory', 'clinical research', 'grant writing', 'field research', 'publications', 'scholarships', 'phd']
};

// Check if an item matches a specific domain cluster using exact or word-boundary matches
const getMatchedClusters = (tokens: string[]): string[] => {
  const matched: string[] = [];
  const normalized = tokens.map(t => t.toLowerCase().trim()).filter(Boolean);

  for (const [clusterKey, keywords] of Object.entries(DOMAIN_CLUSTERS)) {
    const hasMatch = normalized.some(norm => 
      keywords.some(kw => {
        if (norm === kw) return true;
        // Exact word boundary match for multi-word or compound terms (prevent partial string collisions)
        if (kw.length >= 4 && norm.includes(kw)) {
          const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          return regex.test(norm);
        }
        if (norm.length >= 4 && kw.includes(norm)) {
          const regex = new RegExp(`\\b${norm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          return regex.test(kw);
        }
        return false;
      })
    );
    if (hasMatch) {
      matched.push(clusterKey);
    }
  }
  return matched;
};

export const calculateRelevanceScore = (
  opportunity: Opportunity,
  profile: UserProfile,
  preferences: UserPreferences
): { 
  score: number; 
  reasons: string[];
  matchSignals: NonNullable<SearchResult['matchSignals']>;
} => {
  let score = 0;
  const reasons: string[] = [];

  // Collect user attributes
  const rawUserInterests = [...(profile.interests || []), ...(preferences.fields || [])];
  const userInterestsLower = rawUserInterests.map(i => i.toLowerCase().trim()).filter(Boolean);
  const userSkillsLower = (profile.skills || []).map(s => s.toLowerCase().trim()).filter(Boolean);
  const userGoals = [...(profile.goals || []), ...(preferences.goals || [])].map(g => g.toLowerCase().trim()).filter(Boolean);

  // Collect opportunity attributes
  const oppTitleLower = (opportunity.title || '').toLowerCase().trim();
  const oppFieldsLower = (opportunity.field || []).map(f => f.toLowerCase().trim()).filter(Boolean);
  const oppSubfieldsLower = (opportunity.subfields || []).map(s => s.toLowerCase().trim()).filter(Boolean);
  const oppTagsLower = (opportunity.tags || []).map(t => t.toLowerCase().trim()).filter(Boolean);
  const oppAllTerms = [...oppFieldsLower, ...oppSubfieldsLower, ...oppTagsLower];

  // Detect domain clusters
  const userClusters = getMatchedClusters([...userInterestsLower, ...userSkillsLower]);
  const oppClusters = getMatchedClusters(oppAllTerms);
  const commonClusters = userClusters.filter(c => oppClusters.includes(c));

  // Check title alignment with user's fields or skills
  const titleMatchesInterest = userInterestsLower.some(interest => {
    if (oppTitleLower.includes(interest)) return true;
    const regex = new RegExp(`\\b${interest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(oppTitleLower);
  });
  const titleMatchesSkill = userSkillsLower.some(skill => {
    if (oppTitleLower.includes(skill)) return true;
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(oppTitleLower);
  });

  // ─── 1. Field & Domain Match (0 - 40 points) ───────────────────────────
  let fieldMatchScore = 0;
  let interestMatch = false;

  // Direct exact or boundary field match
  const directFieldMatches = oppFieldsLower.filter(f => 
    userInterestsLower.some(u => u === f || f.includes(u) || u.includes(f))
  );

  if (directFieldMatches.length > 0 || titleMatchesInterest) {
    interestMatch = true;
    fieldMatchScore += directFieldMatches.length > 0 ? Math.min(30, directFieldMatches.length * 15 + 15) : 25;
    if (directFieldMatches.length > 0) {
      const capitalized = directFieldMatches.map(f => f.charAt(0).toUpperCase() + f.slice(1));
      reasons.push(`Direct alignment with your interest in ${capitalized.join(' & ')}`);
    } else if (titleMatchesInterest) {
      reasons.push(`Role directly matches your target focus`);
    }
  }

  // Domain cluster semantic match
  if (commonClusters.length > 0) {
    interestMatch = true;
    fieldMatchScore = Math.max(fieldMatchScore, 25);
    if (!reasons.some(r => r.includes('alignment with your interest') || r.includes('target focus'))) {
      const clusterNames: Record<string, string> = {
        business_operations: 'Business & Operations',
        finance_accounting: 'Finance & Accounting',
        ux_design: 'Product & Design',
        software_engineering: 'Software Engineering & Technology',
        data_ai: 'Artificial Intelligence & Data Science',
        marketing_comms: 'Marketing & Communications',
        creative_arts: 'Creative & Arts',
        science_engineering: 'Science & Engineering',
        health_medicine: 'Health & Medicine',
        education_teaching: 'Education & Teaching',
        policy_law_society: 'Law, Policy & Social Impact',
        entrepreneurship_startups: 'Startups & Entrepreneurship',
        research_academic: 'Research & Academia'
      };
      const name = clusterNames[commonClusters[0]] || 'your domain';
      reasons.push(`Strong domain relevance to ${name}`);
    }
  }

  // Specific skill overlap
  let skillMatchScore = 0;
  let skillMatch = false;
  if (userSkillsLower.length > 0) {
    const directSkillMatches = oppTagsLower.filter(tag => 
      userSkillsLower.some(skill => skill === tag || (skill.length > 3 && tag.includes(skill)) || (tag.length > 3 && skill.includes(tag)))
    );

    if (directSkillMatches.length > 0 || titleMatchesSkill) {
      skillMatch = true;
      skillMatchScore = Math.min(15, (directSkillMatches.length * 5) + (titleMatchesSkill ? 8 : 0));
      fieldMatchScore += skillMatchScore;
      const matchedSkill = directSkillMatches[0] || userSkillsLower[0];
      reasons.push(`Direct match for your skill in ${matchedSkill.charAt(0).toUpperCase() + matchedSkill.slice(1)}`);
    }
  }

  score += Math.min(40, fieldMatchScore);

  // ─── STRICT DOMAIN GATEKEEPER ──────────────────────────────────────────
  // If the user has explicitly selected interests/fields, the opportunity MUST have
  // domain relevance, skill relevance, or title relevance. Otherwise apply severe penalty.
  const hasUserDomainPrefs = userInterestsLower.length > 0;
  const hasDomainRelevance = interestMatch || skillMatch || titleMatchesInterest || titleMatchesSkill;
  if (hasUserDomainPrefs && !hasDomainRelevance) {
    score -= 30; // Severe penalty: unrelated disciplines will never rank as recommended
  }

  // ─── 2. Goal / Intent Match (0 - 20 points) ────────────────────────────
  let goalMatchScore = 0;
  let goalMatch = false;

  for (const goal of userGoals) {
    // Check type-related intent in goal ONLY if domain is relevant
    if (goal.includes('internship') && opportunity.type === OpportunityType.Internship) {
      goalMatchScore += 12;
      goalMatch = true;
      if (hasDomainRelevance) reasons.push('Fulfills your goal to secure an internship');
      break;
    } else if (goal.includes('fellowship') && opportunity.type === OpportunityType.Fellowship) {
      goalMatchScore += 12;
      goalMatch = true;
      if (hasDomainRelevance) reasons.push('Directly matches your goal for a fellowship programme');
      break;
    } else if (goal.includes('job') && opportunity.type === OpportunityType.Job) {
      goalMatchScore += 12;
      goalMatch = true;
      if (hasDomainRelevance) reasons.push('Fulfills your goal to find a job / full-time role');
      break;
    } else if (goal.includes('grant') && opportunity.type === OpportunityType.Grant) {
      goalMatchScore += 12;
      goalMatch = true;
      if (hasDomainRelevance) reasons.push('Matches your goal to secure project/research funding');
      break;
    } else if (goal.includes('research') && (opportunity.type === OpportunityType.Research || oppClusters.includes('research_academic'))) {
      goalMatchScore += 12;
      goalMatch = true;
      if (hasDomainRelevance) reasons.push('Directly supports your research goals');
      break;
    }
    
    // Check remote intent in goal
    if (goal.includes('remote') && opportunity.remoteStatus === RemoteStatus.Remote) {
      goalMatchScore += 8;
      goalMatch = true;
      if (hasDomainRelevance) reasons.push('Aligns with your goal for remote opportunities');
      break;
    }
  }

  score += Math.min(20, goalMatchScore);

  // ─── 3. Opportunity Type Preference (0 - 15 points) ────────────────────
  let typeMatchScore = 0;
  let typeMatch = false;
  if (preferences.opportunityTypes?.length) {
    if (preferences.opportunityTypes.includes(opportunity.type)) {
      typeMatch = true;
      typeMatchScore = 15;
      score += 15;
      if (hasDomainRelevance && !reasons.some(r => r.includes(opportunity.type))) {
        reasons.push(`Preferred opportunity type: ${opportunity.type}`);
      }
    }
  } else {
    typeMatchScore = 5;
    score += 5;
  }

  // ─── 4. Eligibility & Experience Compatibility (0 - 15 points) ─────────
  let eligibilityScore = 0;
  let eligibilityMatch = true;
  let experienceMatch = true;

  // Education level check
  const eduReqs = opportunity.educationRequirements || [EducationLevel.Any];
  const userEduStatus = (profile.currentStatus || '').toLowerCase();

  const isPhdOrGrad = userEduStatus.includes('phd') || userEduStatus.includes('graduate') || userEduStatus.includes('master');
  const isBeginnerOrStudent = userEduStatus.includes('student') || userEduStatus.includes('beginner') || userEduStatus.includes('undergraduate');

  if (eduReqs.includes(EducationLevel.Any)) {
    eligibilityScore += 5;
  } else if (eduReqs.includes(EducationLevel.PhD) && !isPhdOrGrad) {
    eligibilityScore -= 20;
    eligibilityMatch = false;
  } else if (eduReqs.includes(EducationLevel.Graduate) && isBeginnerOrStudent && !isPhdOrGrad) {
    eligibilityScore -= 10;
    eligibilityMatch = false;
  } else {
    eligibilityScore += 8;
  }

  // Experience level check
  const expCount = (profile.experience || []).length;
  const userExp: ExperienceLevel = expCount === 0
    ? ExperienceLevel.Beginner
    : expCount <= 2
      ? ExperienceLevel.Intermediate
      : ExperienceLevel.Advanced;
  const oppExp = opportunity.experienceRequirements;

  if (oppExp) {
    if (userExp === oppExp) {
      eligibilityScore += 7;
      if (hasDomainRelevance) reasons.push(`Targeted at your experience level (${oppExp})`);
    } else if (userExp === ExperienceLevel.Beginner && (oppExp === ExperienceLevel.Advanced || oppExp === ExperienceLevel.Expert)) {
      eligibilityScore -= 15;
      experienceMatch = false;
    } else {
      eligibilityScore += 4;
    }
  } else {
    eligibilityScore += 5;
  }

  score += Math.max(0, eligibilityScore);

  // ─── 5. Location & Remote Work (0 - 10 points) ─────────────────────────
  let locationScore = 0;
  let locationMatch = false;

  const userPrefersRemote = preferences.remotePreference?.some(r => 
    [RemoteStatus.Remote, RemoteStatus.Hybrid, RemoteStatus.Flexible].includes(r)
  );

  if (opportunity.remoteStatus === RemoteStatus.Remote && userPrefersRemote) {
    locationScore += 10;
    locationMatch = true;
    if (hasDomainRelevance && !reasons.some(r => r.includes('remote'))) {
      reasons.push('100% remote work modality');
    }
  } else if (profile.location && opportunity.location.toLowerCase().includes(profile.location.toLowerCase())) {
    locationScore += 8;
    locationMatch = true;
    if (hasDomainRelevance) reasons.push(`Located in ${profile.location}`);
  } else if (opportunity.location.toLowerCase().includes('global')) {
    locationScore += 5;
    locationMatch = true;
  } else if (!userPrefersRemote && opportunity.remoteStatus === RemoteStatus.InPerson) {
    locationScore += 5;
  }

  score += locationScore;

  // ─── 6. Funding Preference (0 - 5 points) ──────────────────────────────
  let fundingScore = 0;
  const isFunded = !!opportunity.funding && opportunity.funding.toLowerCase() !== 'unfunded';

  if (preferences.fundingPreference) {
    if (isFunded) {
      fundingScore += 5;
      if (hasDomainRelevance) reasons.push('Fully funded with stipend / financial support');
    } else {
      score -= 8;
    }
  } else if (isFunded) {
    fundingScore += 3;
  }

  score += fundingScore;

  // ─── Clean up reasons ──────────────────────────────────────────────────
  const uniqueReasons = Array.from(new Set(reasons)).slice(0, 3);
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: finalScore,
    reasons: uniqueReasons.length > 0 ? uniqueReasons : ['Verified opportunity matching your parameters'],
    matchSignals: {
      interestMatch,
      goalMatch,
      skillMatch,
      typeMatch,
      eligibilityMatch,
      locationMatch,
      experienceMatch,
      fieldMatchScore,
      skillMatchScore,
      goalMatchScore,
      typeMatchScore,
      eligibilityScore,
      locationScore,
      fundingScore
    }
  };
};

/**
 * Filter and return only personalized recommendations that meet a high relevance threshold.
 * Strict Quality Over Quantity: Only genuine domain/role matches are returned.
 */
export const getPersonalizedRecommendations = (
  opportunities: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences,
  limit: number = 10
): SearchResult[] => {
  const userInterests = [...(profile.interests || []), ...(preferences.fields || [])]
    .map(i => i.toLowerCase().trim())
    .filter(Boolean);

  // Score all opportunities
  const scored = opportunities.map((opp: Opportunity) => {
    const { score, reasons, matchSignals } = calculateRelevanceScore(opp, profile, preferences);
    return {
      opportunity: opp,
      relevanceScore: score,
      relevanceReasons: reasons,
      matchSignals
    };
  });

  // Strict Threshold:
  // Must achieve a solid score (>= 48) AND satisfy genuine domain/skill alignment when user has declared preferences.
  // Never surface unrelated roles merely because they match "Remote" or "Job".
  const highQuality = scored.filter(item => {
    if (item.relevanceScore < 48) return false;
    const signals = item.matchSignals;
    if (!signals) return false;

    if (userInterests.length > 0) {
      return signals.interestMatch || signals.skillMatch;
    }
    return signals.interestMatch || signals.skillMatch || signals.goalMatch;
  });

  // Sort strictly descending by relevance score
  const sorted = highQuality.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return only the genuinely relevant opportunities up to limit.
  // Do NOT artificially pull in unrelated fields if fewer matches exist!
  return sorted.slice(0, limit);
};

/**
 * "You might be overlooking" logic
 * Explains WHY an alternative opportunity type is relevant to the user's specific domain/intent.
 */
export const getAlternativeDiscoveries = (
  searchType: OpportunityType,
  allOpportunities: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences
): AlternativeDiscovery[] => {
  // Filter out the currently searched type
  const alternatives = allOpportunities.filter((opp: Opportunity) => opp.type !== searchType);

  // Score them using user's profile
  const scoredAlts = alternatives.map((opp: Opportunity) => {
    const { score, reasons, matchSignals } = calculateRelevanceScore(opp, profile, preferences);
    return {
      opportunity: opp,
      score,
      reasons,
      matchSignals
    };
  }).filter(item => {
    // Only keep alternatives that have genuine field or goal relevance (score >= 40)
    return item.score >= 40 && (item.matchSignals.interestMatch || item.matchSignals.skillMatch || item.matchSignals.goalMatch);
  });

  // Group by alternative type
  const grouped = scoredAlts.reduce((acc: Record<string, AlternativeDiscovery>, curr) => {
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

    if (!acc[altType].reason) {
      const opp = curr.opportunity;
      const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
      const benefit = opp.funding ? 'hands-on funded experience' : 'mentorship and portfolio building';
      
      const primaryField = opp.field?.[0] || 'your focus area';
      acc[altType].reason = `While looking for ${searchType}s, this ${altType} at ${orgName} also offers ${benefit} in ${primaryField}.`;
    }

    return acc;
  }, {} as Record<string, AlternativeDiscovery>);

  return Object.values(grouped).sort((a, b) => b.count - a.count);
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
