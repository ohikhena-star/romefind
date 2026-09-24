// ─── Enums ───────────────────────────────────────────────

export enum OpportunityType {
  Scholarship = 'Scholarship',
  Fellowship = 'Fellowship',
  Internship = 'Internship',
  Job = 'Job',
  Grant = 'Grant',
  Programme = 'Programme',
  Competition = 'Competition',
  Conference = 'Conference/Event',
  Research = 'Research',
  Volunteering = 'Volunteering',
  Other = 'Other',
}

export enum ApplicationStatus {
  Saved = 'Saved',
  Considering = 'Considering',
  Preparing = 'Preparing',
  Applying = 'Applying',
  Submitted = 'Submitted',
  Result = 'Result',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export enum LearningStatus {
  WantToLearn = 'Want to learn',
  Learning = 'Learning',
  Completed = 'Completed',
}

export enum NotificationType {
  DeadlineApproaching = 'deadline_approaching',
  OpportunityUpdated = 'opportunity_updated',
  NewMatch = 'new_match',
  ApplicationReminder = 'application_reminder',
  LearningRecommendation = 'learning_recommendation',
}

export enum VerificationStatus {
  Verified = 'Verified',
  Unverified = 'Unverified',
  Outdated = 'Outdated',
}

export enum RemoteStatus {
  Remote = 'Remote',
  InPerson = 'In-person',
  Hybrid = 'Hybrid',
  Flexible = 'Flexible',
}

export enum ExperienceLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

export enum EducationLevel {
  HighSchool = 'High School',
  Undergraduate = 'Undergraduate',
  Graduate = 'Graduate',
  Postgraduate = 'Postgraduate',
  PhD = 'PhD',
  Any = 'Any',
}

// ─── Core Models ─────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  website: string;
  description: string;
  type: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: Organization;
  type: OpportunityType;
  description: string;
  shortDescription: string;
  field: string[];
  subfields?: string[];
  location: string;
  remoteStatus: RemoteStatus;
  eligibility: string[];
  educationRequirements: EducationLevel[];
  experienceRequirements: ExperienceLevel;
  funding: string | null;
  benefits: string[];
  duration: string;
  deadline: string; // ISO date
  applicationUrl: string;
  officialSource: string;
  sourceName: string;
  lastVerified: string; // ISO date
  verificationStatus: VerificationStatus;
  tags: string[];
  requirements: string[];
  applicationSteps: string[];
  status: 'open' | 'closed' | 'upcoming';
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
}

// ─── User & Profile ──────────────────────────────────────

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  tags: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  photo?: string;
  location: string;
  country: string;
  bio: string;
  education: Education[];
  experience: WorkExperience[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  portfolioLinks: string[];
  linkedinUrl?: string;
  interests: string[];
  goals: string[];
  currentStatus: string;
  completeness: number;
  onboardingStep?: number;
}

export interface UserPreferences {
  opportunityTypes: OpportunityType[];
  fields: string[];
  goals: string[];
  remotePreference: RemoteStatus[];
  fundingPreference: boolean;
  locationPreference: string[];
  maxTimeCommitment?: string;
}

export interface User {
  id: string;
  profile: UserProfile;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  onboardingStep?: number;
  createdAt: string;
}

// ─── Application Tracking ────────────────────────────────

export interface ApplicationTask {
  id: string;
  label: string;
  completed: boolean;
  order: number;
}

export interface ApplicationNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface TrackedApplication {
  id: string;
  opportunityId: string;
  status: ApplicationStatus;
  tasks: ApplicationTask[];
  notes: ApplicationNote[];
  documents: string[];
  startedAt: string;
  updatedAt: string;
  submittedAt?: string;
  result?: 'accepted' | 'rejected' | 'waitlisted' | 'pending';
}

// ─── Learning ────────────────────────────────────────────

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  provider: string;
  type: 'course' | 'article' | 'video' | 'tutorial' | 'book' | 'project';
  skills: string[];
  duration: string;
  free: boolean;
  relatedOpportunityTypes: OpportunityType[];
}

export interface UserLearning {
  resourceId: string;
  status: LearningStatus;
  startedAt?: string;
  completedAt?: string;
}

// ─── Notifications ───────────────────────────────────────

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  opportunityId?: string;
  createdAt: string;
}

// ─── Search & Filtering ─────────────────────────────────

export interface SearchFilters {
  query: string;
  types: OpportunityType[];
  fields: string[];
  locations: string[];
  remoteStatus: RemoteStatus[];
  funded: boolean | null;
  educationLevel: EducationLevel[];
  experienceLevel: ExperienceLevel[];
  deadlineBefore?: string;
  duration: string[];
  status: ('open' | 'closed' | 'upcoming')[];
}

export interface SearchResult {
  opportunity: Opportunity;
  relevanceScore: number;
  relevanceReasons: string[];
}

// ─── Personalization ────────────────────────────────────

export interface BehaviourSignal {
  type: 'view' | 'save' | 'unsave' | 'reject' | 'apply' | 'search' | 'click' | 'learn';
  opportunityId?: string;
  query?: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface RejectionReason {
  opportunityId: string;
  reason: 'not_relevant' | 'too_advanced' | 'wrong_location' | 'too_expensive' | 'too_much_time' | 'deadline_too_soon' | 'not_interested_in_type';
  timestamp: string;
}

export interface AlternativeDiscovery {
  sourceType: OpportunityType;
  alternativeType: OpportunityType;
  count: number;
  reason: string;
  opportunities: Opportunity[];
}

// ─── Provider (architecture placeholder) ─────────────────

export interface Provider {
  id: string;
  organizationId: string;
  userId: string;
  role: 'provider';
  verified: boolean;
  createdAt: string;
}

// ─── Goal Categories ─────────────────────────────────────

export interface GoalCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  relatedTypes: OpportunityType[];
}
