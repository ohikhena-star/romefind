import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Education, WorkExperience, Project } from '@/types/models';
import { nanoid } from 'nanoid';
import { calculateProfileCompleteness } from '@/utils/format';

interface ProfileState extends UserProfile {
  updateProfile: (updates: Partial<UserProfile>) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  removeEducation: (id: string) => void;
  addExperience: (exp: Omit<WorkExperience, 'id'>) => void;
  removeExperience: (id: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addProject: (proj: Omit<Project, 'id'>) => void;
  removeProject: (id: string) => void;
  getCompleteness: () => number;
}

const initialProfile: UserProfile = {
  name: 'Opportunity Explorer',
  email: 'user@romefind.com',
  location: 'United States',
  country: 'United States',
  bio: '',
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  portfolioLinks: [],
  interests: [],
  goals: [],
  currentStatus: 'Exploring options',
  completeness: 0
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      ...initialProfile,

      updateProfile: (updates) => {
        set((state) => {
          const merged = { ...state, ...updates };
          return {
            ...merged,
            completeness: calculateProfileCompleteness(merged)
          };
        });
      },

      addEducation: (edu) => {
        set((state) => {
          const education = [...state.education, { ...edu, id: nanoid() }];
          return {
            education,
            completeness: calculateProfileCompleteness({ ...state, education })
          };
        });
      },

      removeEducation: (id) => {
        set((state) => {
          const education = state.education.filter(e => e.id !== id);
          return {
            education,
            completeness: calculateProfileCompleteness({ ...state, education })
          };
        });
      },

      addExperience: (exp) => {
        set((state) => {
          const experience = [...state.experience, { ...exp, id: nanoid() }];
          return {
            experience,
            completeness: calculateProfileCompleteness({ ...state, experience })
          };
        });
      },

      removeExperience: (id) => {
        set((state) => {
          const experience = state.experience.filter(e => e.id !== id);
          return {
            experience,
            completeness: calculateProfileCompleteness({ ...state, experience })
          };
        });
      },

      addSkill: (skill) => {
        set((state) => {
          if (state.skills.includes(skill)) return state;
          const skills = [...state.skills, skill];
          return {
            skills,
            completeness: calculateProfileCompleteness({ ...state, skills })
          };
        });
      },

      removeSkill: (skill) => {
        set((state) => {
          const skills = state.skills.filter(s => s !== skill);
          return {
            skills,
            completeness: calculateProfileCompleteness({ ...state, skills })
          };
        });
      },

      addProject: (proj) => {
        set((state) => {
          const projects = [...(state.projects || []), { ...proj, id: nanoid() }];
          return {
            projects,
            completeness: calculateProfileCompleteness({ ...state, projects })
          };
        });
      },

      removeProject: (id) => {
        set((state) => {
          const projects = (state.projects || []).filter(p => p.id !== id);
          return {
            projects,
            completeness: calculateProfileCompleteness({ ...state, projects })
          };
        });
      },

      getCompleteness: () => {
        return calculateProfileCompleteness(get());
      }
    }),
    {
      name: 'romefind-profile-storage'
    }
  )
);
