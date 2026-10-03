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
  // Customer Experience & Success
  'Customer Experience', 'Customer Success', 'UX Research',
  // Business, Operations & Strategy
  'Project Management', 'Operations', 'Business Development', 'Strategy', 'Human Resources',
  // Finance, Investment & Banking
  'Finance', 'Investment', 'Fintech', 'Venture Capital',
  // Technology, Software & Computing
  'Software Engineering', 'Cloud', 'Cybersecurity', 'AI', 'Machine Learning', 'Data Science', 'Engineering',
  // Product, Design & UX
  'Product Design', 'UX/UI', 'Product Management',
  // Marketing, Communications & Media
  'Digital Marketing', 'Content Marketing', 'Communications', 'Journalism', 'Media',
  // Science, Climate & Sustainability
  'Climate & Sustainability', 'Clean Energy', 'Life Sciences', 'Biotechnology', 'Environmental Science', 'Agriculture',
  // Health & Medicine
  'Public Health', 'Healthcare Administration',
  // Education & Academia
  'Education', 'Teaching', 'Academic Research',
  // Law, Policy & Social Impact
  'Law', 'Human Rights', 'Public Policy', 'Governance', 'International Relations', 'Social Impact',
  // Entrepreneurship & Innovation
  'Entrepreneurship', 'Startups', 'Innovation',
] as const;

export const INTENT_PATHWAYS = [
  { id: 'find-work', label: 'Find work', icon: 'case-linear', description: 'Jobs, internships, contract and remote positions' },
  { id: 'build-experience', label: 'Build experience', icon: 'cup-star-linear', description: 'Fellowships, apprenticeships, and hands-on programmes' },
  { id: 'get-funded', label: 'Get funded', icon: 'dollar-minimalistic-linear', description: 'Grants, equity-free funding, and scholarships' },
  { id: 'study', label: 'Study somewhere new', icon: 'diploma-verified-linear', description: 'Master’s degrees, university exchange, and academic programmes' },
  { id: 'build-portfolio', label: 'Build my portfolio', icon: 'layers-minimalistic-linear', description: 'Competitions, open-source, and project residencies' },
  { id: 'research', label: 'Get into research', icon: 'test-tube-linear', description: 'Scientific, academic, policy and market research' },
  { id: 'start-something', label: 'Start something', icon: 'rocket-linear', description: 'Accelerators, incubators, founder grants, and pitch competitions' },
  { id: 'explore-new-field', label: 'Explore a new field', icon: 'compass-linear', description: 'Career transition programmes and entry-level pathways' },
  { id: 'not-sure', label: 'I\'m still figuring it out', icon: 'magic-stick-linear', description: 'Curated multidisciplinary possibilities' },
] as const;

export const GOALS = [
  'Find work', 'Build my experience', 'Get funded', 'Study somewhere new',
  'Build my portfolio', 'Get into research', 'Start something',
  'Explore a new field', 'Expand global network', 'I\'m still figuring it out',
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
