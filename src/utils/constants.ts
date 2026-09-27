import { OpportunityType } from '@/types/models';

export const OPPORTUNITY_TYPE_COLORS: Record<OpportunityType, string> = {
  [OpportunityType.Job]: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80',
  [OpportunityType.Internship]: 'bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60',
  [OpportunityType.Fellowship]: 'bg-purple-50 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60',
  [OpportunityType.Scholarship]: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80',
  [OpportunityType.Grant]: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60',
  [OpportunityType.Programme]: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80',
  [OpportunityType.Competition]: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80',
  [OpportunityType.Conference]: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80',
  [OpportunityType.Research]: 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60',
  [OpportunityType.Volunteering]: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80',
  [OpportunityType.Other]: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200 border border-surface-200/80 dark:border-surface-700/80',
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
