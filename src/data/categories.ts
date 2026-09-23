import { OpportunityType } from '@/types/models';

export const categories = {
  opportunityTypes: Object.values(OpportunityType),
  
  fields: [
    'Technology', 'Business', 'Finance', 'Design', 'Engineering',
    'Science', 'Health', 'Education', 'Policy', 'Climate',
    'Creative', 'Research', 'Social Impact', 'Arts', 'Law',
    'Media', 'Data Science', 'AI/ML', 'Sustainability', 'Other',
  ],

  goals: [
    { id: 'get-experience', label: 'Get experience', icon: 'Briefcase', description: 'Build real-world experience through internships, fellowships, and programmes', relatedTypes: [OpportunityType.Internship, OpportunityType.Fellowship, OpportunityType.Programme, OpportunityType.Volunteering] },
    { id: 'find-funding', label: 'Find funding', icon: 'DollarSign', description: 'Discover scholarships, grants, and funded opportunities', relatedTypes: [OpportunityType.Scholarship, OpportunityType.Grant, OpportunityType.Fellowship] },
    { id: 'study', label: 'Study', icon: 'GraduationCap', description: 'Find academic programmes, scholarships, and research opportunities', relatedTypes: [OpportunityType.Scholarship, OpportunityType.Programme, OpportunityType.Research] },
    { id: 'find-job', label: 'Find a job', icon: 'Target', description: 'Discover career opportunities aligned with your skills', relatedTypes: [OpportunityType.Job, OpportunityType.Internship] },
    { id: 'build-portfolio', label: 'Build my portfolio', icon: 'Layers', description: 'Take on projects and competitions to showcase your work', relatedTypes: [OpportunityType.Competition, OpportunityType.Programme, OpportunityType.Internship] },
    { id: 'meet-people', label: 'Meet people', icon: 'Users', description: 'Network at conferences, events, and collaborative programmes', relatedTypes: [OpportunityType.Conference, OpportunityType.Fellowship, OpportunityType.Programme] },
    { id: 'start-research', label: 'Start research', icon: 'Microscope', description: 'Begin or advance research with grants and programmes', relatedTypes: [OpportunityType.Research, OpportunityType.Grant, OpportunityType.Fellowship] },
    { id: 'grow-skill', label: 'Grow a skill', icon: 'TrendingUp', description: 'Develop specific skills through structured opportunities', relatedTypes: [OpportunityType.Programme, OpportunityType.Internship, OpportunityType.Competition] },
    { id: 'travel', label: 'Travel', icon: 'Globe', description: 'Find international opportunities and exchanges', relatedTypes: [OpportunityType.Fellowship, OpportunityType.Scholarship, OpportunityType.Conference, OpportunityType.Volunteering] },
    { id: 'build-something', label: 'Build something', icon: 'Rocket', description: 'Competitions, hackathons, and startup programmes', relatedTypes: [OpportunityType.Competition, OpportunityType.Grant, OpportunityType.Programme] },
    { id: 'explore', label: 'Explore opportunities', icon: 'Compass', description: 'Browse and discover what\'s out there', relatedTypes: Object.values(OpportunityType) },
  ],

  interests: [
    'Technology', 'Business', 'Finance', 'Design', 'Engineering',
    'Science', 'Health', 'Education', 'Policy', 'Climate',
    'Creative', 'Research', 'Other',
  ],
};
