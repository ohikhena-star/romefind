import { opportunities } from '../src/data/opportunities';
import { 
  calculateRelevanceScore, 
  getPersonalizedRecommendations, 
  getAlternativeDiscoveries 
} from '../src/services/personalization.service';
import { 
  UserProfile, 
  UserPreferences, 
  OpportunityType, 
  RemoteStatus, 
  ExperienceLevel, 
  EducationLevel 
} from '../src/types/models';

console.log('Total opportunities loaded:', opportunities.length);

// ── Profile A: Student interested in UX/Product Design ──────────────
const profileA: UserProfile = {
  name: 'Maya Lin',
  email: 'maya@example.com',
  location: 'San Francisco, CA',
  country: 'United States',
  bio: 'Design student passionate about interaction design and accessibility.',
  education: [],
  experience: [],
  skills: ['Figma', 'UX Research', 'Prototyping', 'Design Systems'],
  projects: [],
  certifications: [],
  portfolioLinks: ['https://mayalin.design'],
  interests: ['Design', 'UX & Product Design', 'Technology'],
  goals: ['Break into product design', 'Find summer design internship'],
  currentStatus: 'University Student',
  completeness: 85,
  experienceLevel: ExperienceLevel.Beginner
};
const prefsA: UserPreferences = {
  opportunityTypes: [OpportunityType.Internship, OpportunityType.Fellowship],
  fields: ['Design', 'Technology'],
  goals: ['Find remote internships and fellowships in design'],
  remotePreference: [RemoteStatus.Remote, RemoteStatus.Hybrid],
  fundingPreference: true,
  locationPreference: ['United States', 'Remote']
};

// ── Profile B: Graduate looking specifically for jobs ───────────────
const profileB: UserProfile = {
  name: 'Devon Vance',
  email: 'devon@example.com',
  location: 'London, UK',
  country: 'United Kingdom',
  bio: 'Recent CS graduate looking for full-time backend or systems engineering roles.',
  education: [],
  experience: [],
  skills: ['Python', 'Go', 'Distributed Systems', 'Git'],
  projects: [],
  certifications: [],
  portfolioLinks: [],
  interests: ['Software Engineering', 'Technology', 'Distributed Systems'],
  goals: ['Find a full-time job', 'Join high-scale tech team'],
  currentStatus: 'Recent Graduate',
  completeness: 90,
  experienceLevel: ExperienceLevel.Beginner
};
const prefsB: UserPreferences = {
  opportunityTypes: [OpportunityType.Job],
  fields: ['Software Engineering', 'Technology'],
  goals: ['Secure full-time junior/mid software engineering job'],
  remotePreference: [RemoteStatus.Remote, RemoteStatus.Hybrid],
  fundingPreference: true,
  locationPreference: ['United Kingdom', 'Remote', 'Europe']
};

// ── Profile C: User looking for scholarships / funding ──────────────
const profileC: UserProfile = {
  name: 'Amara Okafor',
  email: 'amara@example.com',
  location: 'Lagos, Nigeria',
  country: 'Nigeria',
  bio: 'Aspiring global scholar seeking fully funded master’s scholarships or development grants.',
  education: [],
  experience: [],
  skills: ['Policy Analysis', 'Research', 'Community Health'],
  projects: [],
  certifications: [],
  portfolioLinks: [],
  interests: ['Public Health', 'Policy & Governance', 'Education'],
  goals: ['Secure fully funded international scholarship', 'Obtain study abroad grant'],
  currentStatus: 'University Graduate',
  completeness: 95,
  experienceLevel: ExperienceLevel.Intermediate
};
const prefsC: UserPreferences = {
  opportunityTypes: [OpportunityType.Scholarship, OpportunityType.Grant, OpportunityType.Fellowship],
  fields: ['Public Health', 'Policy & Governance'],
  goals: ['Secure fully funded scholarship', 'Obtain development grant'],
  remotePreference: [RemoteStatus.InPerson, RemoteStatus.Flexible],
  fundingPreference: true,
  locationPreference: ['Global', 'United Kingdom', 'United States', 'Germany']
};

// ── Profile D: User looking for research opportunities ──────────────
const profileD: UserProfile = {
  name: 'Dr. Elena Rostova',
  email: 'elena@example.com',
  location: 'Geneva, Switzerland',
  country: 'Switzerland',
  bio: 'Postdoctoral researcher focusing on epidemiology, AI in medicine, and biostatistics.',
  education: [],
  experience: [],
  skills: ['Epidemiology', 'Biostatistics', 'Machine Learning', 'R', 'Python'],
  projects: [],
  certifications: [],
  portfolioLinks: [],
  interests: ['Public Health', 'Research', 'AI & Machine Learning'],
  goals: ['Lead funded research study', 'Publish health intelligence papers'],
  currentStatus: 'Postdoctoral Researcher / PhD',
  completeness: 98,
  experienceLevel: ExperienceLevel.Advanced
};
const prefsD: UserPreferences = {
  opportunityTypes: [OpportunityType.Research, OpportunityType.Fellowship, OpportunityType.Job],
  fields: ['Public Health', 'Research', 'AI & Machine Learning'],
  goals: ['Lead research team', 'Publish academic papers'],
  remotePreference: [RemoteStatus.Hybrid, RemoteStatus.InPerson],
  fundingPreference: true,
  locationPreference: ['Switzerland', 'Europe', 'Global']
};

// ── Profile E: User looking for remote international opportunities ──
const profileE: UserProfile = {
  name: 'Tariq Al-Mansoor',
  email: 'tariq@example.com',
  location: 'Cairo, Egypt',
  country: 'Egypt',
  bio: 'Full stack engineer and open source contributor seeking 100% remote global roles.',
  education: [],
  experience: [],
  skills: ['TypeScript', 'React', 'Node.js', 'PHP', 'Open Source'],
  projects: [],
  certifications: [],
  portfolioLinks: [],
  interests: ['Software Engineering', 'Technology', 'Open Source'],
  goals: ['Find 100% remote global engineering role'],
  currentStatus: 'Software Developer',
  completeness: 90,
  experienceLevel: ExperienceLevel.Intermediate
};
const prefsE: UserPreferences = {
  opportunityTypes: [OpportunityType.Job, OpportunityType.Internship],
  fields: ['Software Engineering', 'Technology'],
  goals: ['Find 100% remote global role'],
  remotePreference: [RemoteStatus.Remote],
  fundingPreference: true,
  locationPreference: ['Remote (Worldwide)', 'Global']
};

// ── Profile F: User with limited experience ─────────────────────────
const profileF: UserProfile = {
  name: 'Sam Rivera',
  email: 'sam@example.com',
  location: 'Austin, TX',
  country: 'United States',
  bio: 'High school graduate exploring career opportunities in technology and design.',
  education: [],
  experience: [],
  skills: ['HTML', 'CSS', 'Basic Graphic Design'],
  projects: [],
  certifications: [],
  portfolioLinks: [],
  interests: ['Technology', 'Design'],
  goals: ['Gain first practical experience', 'Join starter programme or competition'],
  currentStatus: 'High School Graduate / Explorer',
  completeness: 70,
  experienceLevel: ExperienceLevel.Beginner
};
const prefsF: UserPreferences = {
  opportunityTypes: [OpportunityType.Programme, OpportunityType.Competition, OpportunityType.Internship],
  fields: ['Technology', 'Design'],
  goals: ['Build foundation and initial portfolio'],
  remotePreference: [RemoteStatus.Remote, RemoteStatus.Hybrid],
  fundingPreference: false,
  locationPreference: ['United States', 'Remote']
};

// ── Evaluation Runner ───────────────────────────────────────────────
const runTest = (label: string, profile: UserProfile, prefs: UserPreferences) => {
  console.log(`\n======================================================`);
  console.log(`TESTING ${label}: ${profile.name} (${profile.currentStatus})`);
  console.log(`Interests: ${profile.interests.join(', ')} | Skills: ${profile.skills.join(', ')}`);
  console.log(`Target Types: ${prefs.opportunityTypes.join(', ')} | Remote: ${prefs.remotePreference.join(', ')}`);
  console.log(`======================================================`);

  const recs = getPersonalizedRecommendations(opportunities, profile, prefs, 5);
  console.log(`Top ${recs.length} Personalized Recommendations:`);
  recs.forEach((r, idx) => {
    const org = typeof r.opportunity.organization === 'object' ? r.opportunity.organization.name : r.opportunity.organization;
    console.log(`  ${idx + 1}. [${r.relevanceScore}% Fit] [${r.opportunity.type}] "${r.opportunity.title}" at ${org}`);
    console.log(`     Location: ${r.opportunity.location} | Remote: ${r.opportunity.remoteStatus}`);
    console.log(`     Reasons: ${r.relevanceReasons.join(' | ')}`);
    if (r.matchSignals) {
      console.log(`     Signals: Interest:${r.matchSignals.interestMatch} Goal:${r.matchSignals.goalMatch} Skill:${r.matchSignals.skillMatch} Type:${r.matchSignals.typeMatch} Elig:${r.matchSignals.eligibilityMatch}`);
    }
  });

  const baseType = prefs.opportunityTypes[0] || OpportunityType.Internship;
  const overlooking = getAlternativeDiscoveries(baseType, opportunities, profile, prefs);
  console.log(`\n"You might be overlooking" Alternative Discoveries (Base: ${baseType}):`);
  overlooking.slice(0, 3).forEach((alt, idx) => {
    console.log(`  ${idx + 1}. Alternative: ${alt.alternativeType} (${alt.count} matching options)`);
    console.log(`     Attribute Reason: "${alt.reason}"`);
  });
};

runTest('PROFILE A (Student UX/Product Design)', profileA, prefsA);
runTest('PROFILE B (Graduate looking for Jobs)', profileB, prefsB);
runTest('PROFILE C (Scholarships & Funding)', profileC, prefsC);
runTest('PROFILE D (Research & Global Health)', profileD, prefsD);
runTest('PROFILE E (Remote International Tech)', profileE, prefsE);
runTest('PROFILE F (Limited Experience / Beginner)', profileF, prefsF);
