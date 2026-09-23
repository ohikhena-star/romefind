import { useAuthStore } from '@/store/authStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { 
  getPersonalizedRecommendations, 
  getAlternativeDiscoveries, 
  getOverlookingOpportunities,
  calculateRelevanceScore 
} from '@/services/personalization.service';
import { useMemo } from 'react';
import { Opportunity, OpportunityType } from '@/types/models';

export const usePersonalization = () => {
  const { user } = useAuthStore();
  const { opportunities } = useOpportunityStore();

  const recommendations = useMemo(() => {
    if (!user) return [];
    return getPersonalizedRecommendations(opportunities, user.profile, user.preferences);
  }, [user, opportunities]);

  const getAlternatives = (searchType: OpportunityType) => {
    if (!user) return [];
    return getAlternativeDiscoveries(searchType, opportunities, user.profile, user.preferences);
  };

  const getOverlooking = () => {
    if (!user) return [];
    return getOverlookingOpportunities(opportunities, user.profile, user.preferences);
  };

  const getScore = (opportunity: Opportunity) => {
    if (!user) return { score: 0, reasons: [] };
    return calculateRelevanceScore(opportunity, user.profile, user.preferences);
  };

  return {
    recommendations,
    getAlternatives,
    getOverlooking,
    calculateScore: getScore
  };
};
