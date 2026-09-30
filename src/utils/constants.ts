import { OpportunityType } from '@/types/models';

export const OPPORTUNITY_TYPE_COLORS: Record<OpportunityType, string> = {
  [OpportunityType.Job]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Internship]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Fellowship]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Scholarship]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Grant]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Programme]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Competition]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Conference]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Research]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Volunteering]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
  [OpportunityType.Other]: 'bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60',
};

export const FIELDS = [
  'Public Health', 'Global Health', 'Health & Medicine', 'Biotechnology', 'Life Sciences',
  'Technology', 'AI & Machine Learning', 'Data Science', 'Engineering', 'Design & UX',
  'Climate & Sustainability', 'Clean Energy', 'Science', 'Research',
  'Business & Startups', 'Finance & VC', 'Policy & Governance', 'International Relations',
  'Social Impact', 'Education & Teaching', 'Creative & Media', 'Journalism', 'Law & Human Rights',
  'Other',
] as const;

export const GOALS = [
  'Build practical experience', 'Find funding & grants', 'Study abroad / Scholarships',
  'Transition into a new field', 'Find a remote job', 'Publish research',
  'Build my portfolio', 'Expand global network', 'Launch a startup / venture',
  'Grow specialized skills', 'Explore opportunities',
] as const;

export const WORK_MODALITIES = [
  'Remote (Worldwide)', 'Remote (Country-specific)', 'Hybrid', 'In-Person', 'Flexible',
] as const;

export const LOCATIONS = [
  'Remote (Worldwide)', 'United States', 'United Kingdom', 'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Rwanda',
  'Germany', 'Canada', 'France', 'Netherlands', 'Switzerland', 'Sweden', 'Australia',
  'Singapore', 'Japan', 'India', 'Brazil', 'Global / Anywhere',
] as const;

export const DURATIONS = [
  '1 month', '2-3 months', '3-6 months', '6-12 months', '1 year', '2 years', 'Varies',
] as const;

export const DEFAULT_APPLICATION_TASKS = [
  'Confirm eligibility',
  'Prepare CV/Resume',
  'Prepare portfolio',
  'Write personal statement',
  'Request recommendation letters',
  'Gather supporting documents',
  'Complete application form',
  'Review and submit',
];

export const REJECTION_REASONS = [
  { value: 'not_relevant', label: 'Not relevant to me' },
  { value: 'too_advanced', label: 'Too advanced for my level' },
  { value: 'wrong_location', label: 'Wrong location' },
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'too_much_time', label: 'Too much time commitment' },
  { value: 'deadline_too_soon', label: 'Deadline too soon' },
  { value: 'not_interested_in_type', label: 'Not interested in this type' },
] as const;
