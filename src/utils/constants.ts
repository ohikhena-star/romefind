import { OpportunityType } from '@/types/models';

export const OPPORTUNITY_TYPE_COLORS: Record<OpportunityType, string> = {
  [OpportunityType.Scholarship]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  [OpportunityType.Fellowship]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  [OpportunityType.Internship]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  [OpportunityType.Job]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  [OpportunityType.Grant]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  [OpportunityType.Programme]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  [OpportunityType.Competition]: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  [OpportunityType.Conference]: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  [OpportunityType.Research]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  [OpportunityType.Volunteering]: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
  [OpportunityType.Other]: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300',
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
