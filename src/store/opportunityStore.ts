import { create } from 'zustand';
import { Opportunity, SearchFilters, SearchResult, OpportunityType } from '@/types/models';
import { opportunities as initialOpportunities } from '@/data/opportunities';
import { searchOpportunities } from '@/services/search.service';
import { api } from '@/api/client';

interface OpportunityState {
  opportunities: Opportunity[];
  filters: SearchFilters;
  searchResults: SearchResult[];
  selectedOpportunity: Opportunity | null;
  isLoading: boolean;
  
  fetchOpportunities: () => Promise<void>;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  searchOpportunities: (query?: string) => void;
  getOpportunityById: (id: string) => Opportunity | undefined;
  getFeaturedOpportunities: () => Opportunity[];
  getClosingSoon: () => Opportunity[];
  getByType: (type: OpportunityType) => Opportunity[];
  getByField: (field: string) => Opportunity[];
}

const defaultFilters: SearchFilters = {
  query: '',
  types: [],
  fields: [],
  locations: [],
  remoteStatus: [],
  funded: null,
  educationLevel: [],
  experienceLevel: [],
  duration: [],
  status: []
};

export const useOpportunityStore = create<OpportunityState>()((set, get) => ({
  opportunities: initialOpportunities as Opportunity[],
  filters: defaultFilters,
  searchResults: [],
  selectedOpportunity: null,
  isLoading: false,

  fetchOpportunities: async () => {
    try {
      set({ isLoading: true });
      const remoteOpps = await api.getOpportunities({ limit: 100 });
      if (Array.isArray(remoteOpps) && remoteOpps.length > 0) {
        set({ opportunities: remoteOpps as Opportunity[], isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      // Fallback to initial local opportunities
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().searchOpportunities();
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
    get().searchOpportunities();
  },

  searchOpportunities: (query = '') => {
    const { opportunities, filters } = get();
    const rawResults = searchOpportunities(query, opportunities, filters);
    
    const searchResults: SearchResult[] = rawResults.map((opp: Opportunity) => ({
      opportunity: opp,
      relevanceScore: 0,
      relevanceReasons: []
    }));

    set({ searchResults });
  },

  getOpportunityById: (id: string) => {
    return get().opportunities.find(opp => opp.id === id);
  },

  getFeaturedOpportunities: () => {
    return get().opportunities.filter(opp => opp.isFeatured);
  },

  getClosingSoon: () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    return get().opportunities.filter(opp => {
      if (!opp.deadline) return false;
      const deadlineDate = new Date(opp.deadline);
      return deadlineDate > now && deadlineDate <= thirtyDaysFromNow;
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  },

  getByType: (type) => {
    return get().opportunities.filter(opp => opp.type === type);
  },

  getByField: (field) => {
    return get().opportunities.filter(opp => opp.field.includes(field));
  }
}));
