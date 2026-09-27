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

// Domain knowledge clusters for semantic field and skill normalization
const DOMAIN_CLUSTERS: Record<string, string[]> = {
  ux_design: ['ux', 'ui', 'product design', 'user research', 'user experience', 'interaction design', 'figma', 'design systems', 'wireframing', 'prototyping', 'usability', 'hci', 'human-centered design'],
  software_engineering: ['software engineering', 'computer science', 'frontend', 'backend', 'full stack', 'fullstack', 'web development', 'javascript', 'typescript', 'python', 'react', 'node.js', 'c++', 'go', 'git', 'open source', 'cloud'],
  data_ai: ['artificial intelligence', 'machine learning', 'data science', 'deep learning', 'nlp', 'computer vision', 'data analytics', 'statistics', 'pytorch', 'tensorflow', 'biostatistics'],
  public_health: ['public health', 'global health', 'epidemiology', 'health policy', 'biomedical', 'health data', 'infectious disease', 'community health', 'health equity', 'healthcare'],
  climate_sustainability: ['climate', 'climate change', 'sustainability', 'environment', 'environmental policy', 'clean energy', 'renewable energy', 'conservation', 'ecology'],
  policy_impact: ['social impact', 'policy', 'governance', 'diplomacy', 'human rights', 'development economics', 'international development', 'civic tech'],
  research_academic: ['research', 'scientific research', 'academic', 'laboratory', 'clinical research', 'grant writing', 'field research', 'publications']
};

// Check if an item matches a specific domain cluster
const getMatchedClusters = (tokens: string[]): string[] => {
  const matched: string[] = [];
  const normalized = tokens.map(t => t.toLowerCase().trim());

  for (const [clusterKey, keywords] of Object.entries(DOMAIN_CLUSTERS)) {
    const hasMatch = normalized.some(norm => 
      keywords.some(kw => norm === kw || (norm.length > 3 && kw.includes(norm)) || (kw.length > 3 && norm.includes(kw)))
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
  const userInterestsLower = rawUserInterests.map(i => i.toLowerCase().trim());
  const userSkillsLower = (profile.skills || []).map(s => s.toLowerCase().trim());
  const userGoals = [...(profile.goals || []), ...(preferences.goals || [])].map(g => g.toLowerCase().trim());

  // Collect opportunity attributes
  const oppFieldsLower = (opportunity.field || []).map(f => f.toLowerCase().trim());
  const oppSubfieldsLower = (opportunity.subfields || []).map(s => s.toLowerCase().trim());
  const oppTagsLower = (opportunity.tags || []).map(t => t.toLowerCase().trim());
  const oppAllTerms = [...oppFieldsLower, ...oppSubfieldsLower, ...oppTagsLower];

  // Detect domain clusters
  const userClusters = getMatchedClusters([...userInterestsLower, ...userSkillsLower]);
  const oppClusters = getMatchedClusters(oppAllTerms);
  const commonClusters = userClusters.filter(c => oppClusters.includes(c));

  // ─── 1. Field & Domain Match (0 - 35 points) ───────────────────────────
  let fieldMatchScore = 0;
  let interestMatch = false;

  // Direct exact field match
  const directFieldMatches = oppFieldsLower.filter(f => userInterestsLower.includes(f));
  if (directFieldMatches.length > 0) {
    interestMatch = true;
    fieldMatchScore += Math.min(25, directFieldMatches.length * 15);
    const capitalized = directFieldMatches.map(f => f.charAt(0).toUpperCase() + f.slice(1));
    reasons.push(`Direct alignment with your interest in ${capitalized.join(' & ')}`);
  }

  // Domain cluster semantic match (e.g. UX/Product Design or Public Health)
  if (commonClusters.length > 0) {
    interestMatch = true;
    fieldMatchScore = Math.max(fieldMatchScore, 25);
    if (!reasons.some(r => r.includes('alignment with your interest'))) {
      const clusterNames: Record<string, string> = {
        ux_design: 'UX & Product Design',
        software_engineering: 'Software Engineering',
        data_ai: 'Artificial Intelligence & Data Science',
        public_health: 'Public & Global Health',
        climate_sustainability: 'Climate & Sustainability',
        policy_impact: 'Social Impact & Policy',
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

    if (directSkillMatches.length > 0) {
      skillMatch = true;
      skillMatchScore = Math.min(10, directSkillMatches.length * 5);
      fieldMatchScore += skillMatchScore;
      const matchedSkill = directSkillMatches[0];
      reasons.push(`Direct match for your skill in ${matchedSkill.charAt(0).toUpperCase() + matchedSkill.slice(1)}`);
    }
  }

  score += Math.min(35, fieldMatchScore);

  // ─── 2. Goal / Intent Match (0 - 25 points) ────────────────────────────
  let goalMatchScore = 0;
  let goalMatch = false;

  for (const goal of userGoals) {
    // Check type-related intent in goal
    if (goal.includes('internship') && opportunity.type === OpportunityType.Internship) {
      goalMatchScore += 15;
      goalMatch = true;
      reasons.push('Fulfills your goal to secure an internship');
      break;
    } else if (goal.includes('fellowship') && opportunity.type === OpportunityType.Fellowship) {
      goalMatchScore += 15;
      goalMatch = true;
      reasons.push('Directly matches your goal for a fellowship programme');
      break;
    } else if (goal.includes('job') && opportunity.type === OpportunityType.Job) {
      goalMatchScore += 15;
      goalMatch = true;
      reasons.push('Fulfills your goal to find a job / full-time role');
      break;
    } else if (goal.includes('grant') && opportunity.type === OpportunityType.Grant) {
      goalMatchScore += 15;
      goalMatch = true;
      reasons.push('Matches your goal to secure project/research funding');
      break;
    } else if (goal.includes('research') && (opportunity.type === OpportunityType.Research || oppClusters.includes('research_academic'))) {
      goalMatchScore += 15;
      goalMatch = true;
      reasons.push('Directly supports your research goals');
      break;
    }
    
    // Check remote intent in goal
    if (goal.includes('remote') && opportunity.remoteStatus === RemoteStatus.Remote) {
      goalMatchScore += 10;
      goalMatch = true;
      reasons.push('Aligns with your goal for remote opportunities');
      break;
    }
  }

  score += Math.min(25, goalMatchScore);

  // ─── 3. Opportunity Type Preference (0 - 15 points) ────────────────────
  let typeMatchScore = 0;
  let typeMatch = false;
  if (preferences.opportunityTypes?.length) {
    if (preferences.opportunityTypes.includes(opportunity.type)) {
      typeMatch = true;
      typeMatchScore = 15;
      score += 15;
      if (!reasons.some(r => r.includes(opportunity.type))) {
        reasons.push(`Preferred opportunity type: ${opportunity.type}`);
      }
    }
  } else {
    // Neutral if no preference specified
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
    // Severe penalty if requires PhD and user is not graduate/PhD
    eligibilityScore -= 20;
    eligibilityMatch = false;
  } else if (eduReqs.includes(EducationLevel.Graduate) && isBeginnerOrStudent && !isPhdOrGrad) {
    eligibilityScore -= 10;
    eligibilityMatch = false;
  } else {
    eligibilityScore += 8;
  }

  // Experience level check - infer from number of work experience entries
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
      reasons.push(`Targeted at your experience level (${oppExp})`);
    } else if (userExp === ExperienceLevel.Beginner && (oppExp === ExperienceLevel.Advanced || oppExp === ExperienceLevel.Expert)) {
      // Junior user applying for Senior/Expert role
      eligibilityScore -= 15;
      experienceMatch = false;
    } else if (userExp === ExperienceLevel.Intermediate && oppExp === ExperienceLevel.Beginner) {
      eligibilityScore += 4;
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
    if (!reasons.some(r => r.includes('remote'))) {
      reasons.push('100% remote work modality');
    }
  } else if (profile.location && opportunity.location.toLowerCase().includes(profile.location.toLowerCase())) {
    locationScore += 8;
    locationMatch = true;
    reasons.push(`Located in ${profile.location}`);
  } else if (opportunity.location.toLowerCase().includes('global')) {
    locationScore += 6;
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
      reasons.push('Fully funded with stipend / financial support');
    } else {
      score -= 10; // Penalize unfunded if user explicitly demanded funding
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
    reasons: uniqueReasons.length > 0 ? uniqueReasons : ['General career development opportunity'],
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
 * Prevents forced filling of slots with irrelevant listings.
 */
export const getPersonalizedRecommendations = (
  opportunities: Opportunity[],
  profile: UserProfile,
  preferences: UserPreferences,
  limit: number = 10
): SearchResult[] => {
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
  // Must score >= 45 AND have at least an interestMatch, goalMatch, or skillMatch
  const highQuality = scored.filter(item => {
    if (item.relevanceScore < 45) return false;
    const signals = item.matchSignals;
    if (!signals) return false;
    // An opportunity with zero interest, zero goal, and zero skill match should NEVER be a top recommendation
    return signals.interestMatch || signals.goalMatch || signals.skillMatch;
  });

  // Sort descending by score
  return highQuality
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
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
