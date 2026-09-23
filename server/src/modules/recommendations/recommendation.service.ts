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
  static calculateRelevance(userProfile: any, opp: any, rejectedTypes: Set<string> = new Set()): { score: number; reasons: string[] } {
    let score = 50; // base score
    const reasons: string[] = [];

    const userSkills: string[] = parseJsonArray(userProfile?.skills).map(s => s.toLowerCase());
    const userInterests: string[] = parseJsonArray(userProfile?.interests).map(i => i.toLowerCase());
    const userGoals: string[] = parseJsonArray(userProfile?.goals).map(g => g.toLowerCase());
    const userTypePrefs: string[] = parseJsonArray(userProfile?.opportunityPreferences).map(t => t.toLowerCase());
    const userRemotePrefs: string[] = parseJsonArray(userProfile?.remotePreferences).map(r => r.toLowerCase());
    const userLocations: string[] = parseJsonArray(userProfile?.locationPreferences).map(l => l.toLowerCase());

    const oppFields: string[] = parseJsonArray(opp.field).map(f => f.toLowerCase());
    const oppSubfields: string[] = parseJsonArray(opp.subfields).map(s => s.toLowerCase());
    const oppTags: string[] = parseJsonArray(opp.tags).map(t => t.toLowerCase());
    const oppType = opp.opportunityType?.toLowerCase() || '';
    const oppRemote = opp.remoteStatus?.toLowerCase() || '';
    const oppLocation = opp.location?.toLowerCase() || '';
    const oppDesc = (opp.description + ' ' + (opp.shortDescription || '')).toLowerCase();

    // 1. Opportunity Type Alignment (+15 or -10)
    if (userTypePrefs.length > 0) {
      if (userTypePrefs.includes(oppType)) {
        score += 15;
        reasons.push(`Matches your preferred format (${opp.opportunityType})`);
      }
    }

    // 2. Field & Interest Alignment (+20 max)
    const matchingInterests = userInterests.filter(interest => 
      oppFields.some(f => f.includes(interest) || interest.includes(f)) ||
      oppSubfields.some(s => s.includes(interest) || interest.includes(s)) ||
      oppTags.some(t => t.includes(interest) || interest.includes(t)) ||
      oppDesc.includes(interest)
    );

    if (matchingInterests.length > 0) {
      const boost = Math.min(20, matchingInterests.length * 7);
      score += boost;
      const topInterest = matchingInterests[0];
      reasons.push(`Aligned with your interest in ${topInterest.charAt(0).toUpperCase() + topInterest.slice(1)}`);
    }

    // 3. Skill Overlap (+20 max)
    const matchingSkills = userSkills.filter(skill => 
      oppDesc.includes(skill) ||
      oppTags.some(t => t.includes(skill) || skill.includes(t)) ||
      oppSubfields.some(s => s.includes(skill) || skill.includes(s))
    );

    if (matchingSkills.length > 0) {
      const boost = Math.min(20, matchingSkills.length * 6);
      score += boost;
      reasons.push(`Fits your skills in ${matchingSkills.slice(0, 2).join(' & ')}`);
    }

    // 4. Remote & Location Compatibility (+10)
    if (userRemotePrefs.length > 0) {
      if (userRemotePrefs.includes(oppRemote) || oppRemote === 'flexible' || oppRemote === 'remote') {
        score += 8;
        if (oppRemote === 'remote') {
          reasons.push('Fully remote opportunity');
        } else if (oppRemote === 'hybrid') {
          reasons.push('Flexible hybrid arrangement');
        }
      }
    }

    if (userLocations.some(l => oppLocation.includes(l) || l === 'global' || oppLocation.includes('global'))) {
      score += 7;
      if (oppLocation.toLowerCase().includes('global')) {
        reasons.push('Open to global applicants');
      }
    }

    // 5. Funding Preference (+10)
    if (userProfile?.fundingPreferences && (opp.fundingType === 'Fully-Funded' || opp.fundingType === 'Stipend' || opp.fundingType === 'Prize')) {
      score += 10;
      reasons.push('Provides full funding or living stipend');
    }

    // 6. Experience Level Compatibility (+5 / -10)
    if (userProfile?.experienceLevel && opp.experienceRequirements) {
      if (userProfile.experienceLevel.toLowerCase() === opp.experienceRequirements.toLowerCase()) {
        score += 5;
      }
    }

    // 7. Behavioral rejection penalty
    if (rejectedTypes.has(oppType)) {
      score -= 15;
    }

    // Clamp score between 25 and 99
    score = Math.max(25, Math.min(99, Math.round(score)));

    // Fallback default reasons if none were generated
    if (reasons.length === 0) {
      reasons.push('High overall compatibility with your profile');
      if (opp.isFeatured) {
        reasons.push('Curated featured opportunity of the week');
      }
    }

    return { score, reasons: reasons.slice(0, 3) };
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

    const scored = allOpps.map(opp => {
      const { score, reasons } = this.calculateRelevance(user?.profile, opp);
      return {
        opportunity: {
          ...formatOpportunityResponse(opp),
          isSaved: savedIds.has(opp.id)
        },
        relevanceScore: score,
        relevanceReasons: reasons
      };
    });

    // Sort descending by relevance score
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
