import { Opportunity, LearningResource, UserProfile } from '@/types/models';

export const getRecommendationsForOpportunity = (
  opportunity: Opportunity,
  allResources: LearningResource[]
): LearningResource[] => {
  // Extract keywords from opportunity
  const keywords = new Set([
    ...opportunity.field.map((f: string) => f.toLowerCase()),
    ...(opportunity.tags || []).map((t: string) => t.toLowerCase())
  ]);

  return allResources.filter((resource: LearningResource) => {
    // Check if resource relates to opportunity type
    if (resource.relatedOpportunityTypes && resource.relatedOpportunityTypes.includes(opportunity.type)) {
      return true;
    }
    
    // Check for skill overlap
    const resourceSkills = resource.skills.map((s: string) => s.toLowerCase());
    return resourceSkills.some((skill: string) => keywords.has(skill) || Array.from(keywords).some((kw: string) => kw.includes(skill) || skill.includes(kw)));
  }).slice(0, 5); // Return top 5
};

export const getRecommendationsForProfile = (
  profile: UserProfile,
  allResources: LearningResource[]
): LearningResource[] => {
  const userKeywords = new Set([
    ...profile.interests.map((i: string) => i.toLowerCase()),
    ...profile.skills.map((s: string) => s.toLowerCase())
  ]);

  return allResources.filter((resource: LearningResource) => {
    const resourceSkills = resource.skills.map((s: string) => s.toLowerCase());
    return resourceSkills.some((skill: string) => userKeywords.has(skill));
  }).slice(0, 10);
};

