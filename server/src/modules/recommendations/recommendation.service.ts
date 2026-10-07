import { prisma } from '../../config/prisma.js';
import { parseJsonArray, formatOpportunityResponse } from '../../utils/helpers.js';

export interface ScoredOpportunity {
  opportunity: any;
  relevanceScore: number;
  relevanceReasons: string[];
}

export interface AlternativePathResult {
  sourceType: string;
  alternativeType: string;
  headline: string;
  rationale: string;
  benefits: string[];
  opportunities: any[];
}

// Alternative type transition mapping matrix
const ALTERNATIVE_TYPE_MAP: Record<string, { targetType: string; headline: string; rationale: string; benefits: string[] }[]> = {
  Internship: [
    {
      targetType: 'Fellowship',
      headline: 'Consider Fellowships for Greater Autonomy & Recognition',
      rationale: 'Fellowships offer project autonomy, direct funding, and high prestige without corporate tier constraints.',
      benefits: ['Higher autonomy on self-directed projects', 'Direct industry and philanthropic mentorship', 'Global cohort networking']
    },
    {
      targetType: 'Research',
      headline: 'Accelerate Your Depth Through Funded Research Residencies',
      rationale: 'Residencies and research labs offer cutting-edge publication pathways and access to proprietary compute/infrastructure.',
      benefits: ['Publish peer-reviewed contributions', 'Collaborate directly with senior scientists', 'Access to top-tier institutional compute']
    },
    {
      targetType: 'Competition',
      headline: 'Validate Your Ideas & Win Non-Dilutive Funding in Competitions',
      rationale: 'Competitions let you build portfolio proof-of-work in weeks rather than months while competing for grant prizes.',
      benefits: ['Fast non-dilutive capital', 'Immediate portfolio demonstration', 'Direct investor pitch exposure']
    }
  ],
  Job: [
    {
      targetType: 'Fellowship',
      headline: 'Bridge into High-Impact Roles via Innovation Fellowships',
      rationale: 'Fellowships can act as springboard accelerators to senior positions and grant leadership in half the traditional time.',
      benefits: ['Leadership positioning', 'Global alumni access', 'Dedicated stipends for personal development']
    },
    {
      targetType: 'Programme',
      headline: 'Found or Accelerate a Venture with Incubator Programmes',
      rationale: 'Instead of standard corporate employment, structured accelerator batches provide seed funding and co-founder networks.',
      benefits: ['Up to $500k in seed financing', 'Direct partner mentorship', 'Accelerated product launch']
    }
  ],
  Scholarship: [
    {
      targetType: 'Fellowship',
      headline: 'Explore Fellowships Alongside Academic Degree Funding',
      rationale: 'Fellowships often allow simultaneous remote study and research while granting substantial stipend support.',
      benefits: ['Global research travel stipends', 'Interdisciplinary cohorts', 'No strict university course prerequisites']
    },
    {
      targetType: 'Grant',
      headline: 'Fund Independent Inquiries Through Open Grants',
      rationale: 'Grants provide direct project capital without requiring enrollment in a formal degree curriculum.',
      benefits: ['Direct project allocation', 'Retain full IP rights', 'Flexible completion timeline']
    }
  ],
  Research: [
    {
      targetType: 'Fellowship',
      headline: 'Apply Research to Real-World Impact with Creative Fellowships',
      rationale: 'Translate theoretical insights into public prototypes and societal applications.',
      benefits: ['Public media amplification', 'Industry partner deployment', 'Interdisciplinary collaboration']
    },
    {
      targetType: 'Grant',
      headline: 'Secure Dedicated Research Grants for Independent Exploration',
      rationale: 'Obtain dedicated non-profit and foundation grants to spearhead your own research agenda.',
      benefits: ['Principal investigator autonomy', 'Equipment and compute subsidies', 'Zero institutional overhead']
    }
  ]
};

export class RecommendationEngine {
  /**
   * Calculates relevance score (0-100) and human-readable match reasons
   */
  static calculateRelevance(userProfile: any, opp: any, rejectedTypes: Set<string> = new Set()): { score: number; reasons: string[]; isRelevant: boolean } {
    let score = 0;
    const reasons: string[] = [];

    const userSkills: string[] = parseJsonArray(userProfile?.skills).map(s => s.toLowerCase().trim()).filter(Boolean);
    const userInterests: string[] = parseJsonArray(userProfile?.interests).map(i => i.toLowerCase().trim()).filter(Boolean);
    const userTypePrefs: string[] = parseJsonArray(userProfile?.opportunityPreferences).map(t => t.toLowerCase().trim()).filter(Boolean);
    const userRemotePrefs: string[] = parseJsonArray(userProfile?.remotePreferences).map(r => r.toLowerCase().trim()).filter(Boolean);
    const userLocations: string[] = parseJsonArray(userProfile?.locationPreferences).map(l => l.toLowerCase().trim()).filter(Boolean);

    const oppTitle = (opp.title || '').toLowerCase().trim();
    const oppFields: string[] = parseJsonArray(opp.field).map(f => f.toLowerCase().trim()).filter(Boolean);
    const oppSubfields: string[] = parseJsonArray(opp.subfields).map(s => s.toLowerCase().trim()).filter(Boolean);
    const oppTags: string[] = parseJsonArray(opp.tags).map(t => t.toLowerCase().trim()).filter(Boolean);
    const oppType = (opp.opportunityType || '').toLowerCase().trim();
    const oppRemote = (opp.remoteStatus || '').toLowerCase().trim();
    const oppLocation = (opp.location || '').toLowerCase().trim();

    // 1. Field & Title Alignment (0 - 45 pts)
    const matchingInterests = userInterests.filter(interest => 
      oppFields.some(f => f === interest || f.includes(interest) || interest.includes(f)) ||
      oppSubfields.some(s => s === interest || s.includes(interest) || interest.includes(s)) ||
      oppTags.some(t => t === interest || t.includes(interest) || interest.includes(t)) ||
      oppTitle.includes(interest)
    );

    const titleMatchesInterest = userInterests.some(interest => oppTitle.includes(interest));
    const titleMatchesSkill = userSkills.some(skill => oppTitle.includes(skill));

    if (matchingInterests.length > 0 || titleMatchesInterest) {
      const boost = Math.min(40, (matchingInterests.length * 15) + (titleMatchesInterest ? 10 : 0));
      score += boost;
      const topInterest = matchingInterests[0] || userInterests[0];
      reasons.push(`Aligned with your interest in ${topInterest.charAt(0).toUpperCase() + topInterest.slice(1)}`);
    }

    // 2. Skill Overlap (0 - 25 pts)
    const matchingSkills = userSkills.filter(skill => 
      oppTitle.includes(skill) ||
      oppTags.some(t => t === skill || t.includes(skill) || skill.includes(t)) ||
      oppSubfields.some(s => s === skill || s.includes(skill) || skill.includes(s))
    );

    if (matchingSkills.length > 0 || titleMatchesSkill) {
      const boost = Math.min(25, (matchingSkills.length * 8) + (titleMatchesSkill ? 8 : 0));
      score += boost;
      reasons.push(`Fits your skills in ${(matchingSkills[0] || userSkills[0]).toUpperCase()}`);
    }

    // Domain Gatekeeper: If user has defined interests, require field, title, or skill alignment
    const hasUserDomainPrefs = userInterests.length > 0;
    const hasDomainAlignment = matchingInterests.length > 0 || matchingSkills.length > 0 || titleMatchesInterest || titleMatchesSkill;
    if (hasUserDomainPrefs && !hasDomainAlignment) {
      score -= 30; // Severe penalty: unrelated role
    }

    // 3. Opportunity Type Alignment (0 - 15 pts)
    if (userTypePrefs.length > 0) {
      if (userTypePrefs.includes(oppType)) {
        score += 15;
        if (hasDomainAlignment) reasons.push(`Matches your preferred format (${opp.opportunityType})`);
      }
    } else {
      score += 5;
    }

    // 4. Remote & Location Compatibility (0 - 10 pts)
    if (userRemotePrefs.length > 0) {
      if (userRemotePrefs.includes(oppRemote) || oppRemote === 'flexible' || oppRemote === 'remote') {
        score += 8;
        if (hasDomainAlignment && oppRemote === 'remote') {
          reasons.push('Fully remote opportunity');
        }
      }
    }

    if (userLocations.some(l => oppLocation.includes(l) || l === 'global' || oppLocation.includes('global'))) {
      score += 5;
    }

    // 5. Funding Preference (0 - 5 pts)
    if (userProfile?.fundingPreferences && (opp.fundingType === 'Fully-Funded' || opp.fundingType === 'Stipend' || opp.fundingType === 'Prize')) {
      score += 5;
      if (hasDomainAlignment) reasons.push('Provides full funding or stipend');
    }

    // 6. Experience Level Compatibility
    if (userProfile?.experienceLevel && opp.experienceRequirements) {
      if (userProfile.experienceLevel.toLowerCase() === opp.experienceRequirements.toLowerCase()) {
        score += 5;
      }
    }

    // 7. Behavioral rejection penalty
    if (rejectedTypes.has(oppType)) {
      score -= 20;
    }

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    const isRelevant = hasUserDomainPrefs ? hasDomainAlignment && finalScore >= 45 : finalScore >= 40;

    return { 
      score: finalScore, 
      reasons: reasons.slice(0, 3),
      isRelevant 
    };
  }

  /**
   * Generates personalized opportunities for a user
   */
  static async getPersonalizedFeed(userId: string, limit = 20) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        savedOpportunities: { select: { opportunityId: true } },
        rejectedOpportunities: { select: { opportunityId: true, reason: true } }
      }
    });

    const rejectedIds = user?.rejectedOpportunities.map(r => r.opportunityId) || [];
    const savedIds = new Set(user?.savedOpportunities.map(s => s.opportunityId) || []);

    const allOpps = await prisma.opportunity.findMany({
      where: {
        id: { notIn: rejectedIds },
        status: 'OPEN'
      },
      include: {
        organization: true
      }
    });

    const scored = allOpps
      .map(opp => {
        const { score, reasons, isRelevant } = this.calculateRelevance(user?.profile, opp);
        return {
          opportunity: {
            ...formatOpportunityResponse(opp),
            isSaved: savedIds.has(opp.id)
          },
          relevanceScore: score,
          relevanceReasons: reasons,
          isRelevant
        };
      })
      .filter(item => item.isRelevant);

    // Sort strictly descending by relevance score
    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scored.slice(0, limit);
  }

  /**
   * Generates Alternative Paths recommendations based on user's primary focus
   */
  static async getAlternativePaths(userId?: string): Promise<AlternativePathResult[]> {
    let primaryType = 'Internship';
    let userProfile = null;

    if (userId) {
      const profile = await prisma.profile.findUnique({ where: { userId } });
      userProfile = profile;
      const typePrefs = parseJsonArray(profile?.opportunityPreferences);
      if (typePrefs.length > 0) {
        primaryType = typePrefs[0];
      }
    }

    // Get transitions for primary type or fallback to Internship / Job
    const transitions = ALTERNATIVE_TYPE_MAP[primaryType] || ALTERNATIVE_TYPE_MAP['Internship'];

    const results: AlternativePathResult[] = [];

    for (const trans of transitions) {
      // Find top opportunities for the alternative type
      const opps = await prisma.opportunity.findMany({
        where: {
          opportunityType: trans.targetType,
          status: 'OPEN'
        },
        include: { organization: true },
        take: 3
      });

      if (opps.length > 0) {
        results.push({
          sourceType: primaryType,
          alternativeType: trans.targetType,
          headline: trans.headline,
          rationale: trans.rationale,
          benefits: trans.benefits,
          opportunities: opps.map(formatOpportunityResponse)
        });
      }
    }

    return results;
  }
}
