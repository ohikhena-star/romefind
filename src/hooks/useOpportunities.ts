import { useOpportunityStore } from '@/store/opportunityStore';

export const useOpportunities = () => {
  const store = useOpportunityStore();
  
  return {
    opportunities: store.opportunities,
    filters: store.filters,
    setFilters: store.setFilters,
    clearFilters: store.clearFilters,
    searchResults: store.searchResults,
    search: store.searchOpportunities,
    featured: store.getFeaturedOpportunities(),
    closingSoon: store.getClosingSoon(),
    getById: store.getOpportunityById,
    getByType: store.getByType,
    getByField: store.getByField
  };
};
