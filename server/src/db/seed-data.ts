export interface SeedOrganization {
  id: string;
  name: string;
  website: string;
  description: string;
  country: string;
  logo: string;
}

export interface SeedLearningResource {
  id: string;
  title: string;
  description: string;
  provider: string;
  url: string;
  skills: string[];
  duration: string;
  free: boolean;
  relatedOpportunityTypes: string[];
}

export interface SeedCommunityAdvice {
  opportunityId: string;
  authorName: string;
  authorRole: string;
  outcomeStatus: string;
  adviceType: string;
  title: string;
  content: string;
  upvotes: number;
}

export interface SeedOpportunity {
  id: string;
  title: string;
  orgId: string;
  type: string;
  description: string;
  shortDescription: string;
  field: string[];
  subfields: string[];
  location: string;
  country: string;
  remoteStatus: string;
  eligibility: string[];
  educationRequirements: string[];
  experienceRequirements: string;
  funding: string;
  fundingType: string;
  fundingAmount: string;
  benefits: string[];
  duration: string;
  deadline: string;
  startDate?: string;
  applicationUrl: string;
  officialSource: string;
  sourceName: string;
  sourceType: string;
  tags: string[];
  requirements: string[];
  applicationSteps: string[];
  status: string;
  isFeatured: boolean;
}

export const organizationsData: SeedOrganization[] = [
  { id: 'org-mozilla', name: 'Mozilla Foundation', website: 'https://foundation.mozilla.org', description: 'Mozilla is a global community dedicated to keeping the internet open and accessible.', country: 'United States', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-google', name: 'Google', website: 'https://careers.google.com', description: 'A global technology company focused on search, cloud computing, and online advertising.', country: 'United States', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-microsoft', name: 'Microsoft', website: 'https://careers.microsoft.com', description: 'A global technology corporation developing software, services, and devices.', country: 'United States', logo: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-un', name: 'United Nations', website: 'https://www.un.org', description: 'An international organization founded to maintain international peace and security.', country: 'United States', logo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-rhodes', name: 'Rhodes Trust', website: 'https://www.rhodeshouse.ox.ac.uk', description: 'The Rhodes Scholarship is the oldest and most prestigious international scholarship programme.', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-fulbright', name: 'Fulbright Program', website: 'https://us.fulbrightonline.org', description: 'The Fulbright Program is one of the most widely recognized and prestigious scholarships in the world.', country: 'United States', logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-yc', name: 'Y Combinator', website: 'https://www.ycombinator.com', description: 'Y Combinator is a startup accelerator that has funded thousands of startups.', country: 'United States', logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-ford', name: 'Ford Foundation', website: 'https://www.fordfoundation.org', description: 'A philanthropic foundation focused on reducing inequality and injustice.', country: 'United States', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-mit', name: 'MIT', website: 'https://www.mit.edu', description: 'Massachusetts Institute of Technology, a world-leading research university.', country: 'United States', logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-stanford', name: 'Stanford University', website: 'https://www.stanford.edu', description: 'One of the world\'s leading research and teaching institutions.', country: 'United States', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-worldbank', name: 'World Bank', website: 'https://www.worldbank.org', description: 'An international financial institution providing loans and grants to developing countries.', country: 'United States', logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-ideo', name: 'IDEO', website: 'https://www.ideo.com', description: 'A global design and innovation company.', country: 'United States', logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-tesla', name: 'Tesla', website: 'https://www.tesla.com', description: 'An electric vehicle and clean energy company.', country: 'United States', logo: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-nasa', name: 'NASA', website: 'https://www.nasa.gov', description: 'The United States space agency.', country: 'United States', logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-github', name: 'GitHub', website: 'https://github.com', description: 'The world\'s leading software development platform.', country: 'United States', logo: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-ted', name: 'TED', website: 'https://www.ted.com', description: 'A nonprofit devoted to spreading ideas through short, powerful talks.', country: 'United States', logo: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-chevening', name: 'Chevening', website: 'https://www.chevening.org', description: 'The UK Government\'s global scholarship programme.', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-daad', name: 'DAAD', website: 'https://www.daad.de/en/', description: 'German Academic Exchange Service supporting international academic cooperation.', country: 'Germany', logo: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-mastercard', name: 'Mastercard Foundation', website: 'https://mastercardfdn.org', description: 'A foundation focused on advancing education and financial inclusion in Africa.', country: 'Canada', logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-stripe', name: 'Stripe', website: 'https://stripe.com', description: 'A technology company building economic infrastructure for the internet.', country: 'United States', logo: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-openai', name: 'OpenAI', website: 'https://openai.com', description: 'An AI research company focused on ensuring artificial general intelligence benefits humanity.', country: 'United States', logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-gates', name: 'Bill & Melinda Gates Foundation', website: 'https://www.gatesfoundation.org', description: 'A philanthropic foundation fighting poverty, disease, and inequity around the world.', country: 'United States', logo: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-aspen', name: 'Aspen Institute', website: 'https://www.aspeninstitute.org', description: 'A nonpartisan organization fostering leadership and open-minded dialogue.', country: 'United States', logo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-meta', name: 'Meta', website: 'https://about.meta.com', description: 'A technology conglomerate focused on social technology and the metaverse.', country: 'United States', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-atlassian', name: 'Atlassian Foundation', website: 'https://www.atlassianfoundation.org', description: 'The philanthropic arm of Atlassian, supporting education and social enterprise.', country: 'Australia', logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-who', name: 'World Health Organization (WHO)', website: 'https://www.who.int', description: 'The United Nations agency committed to the health and well-being of all people, directing and coordinating international health.', country: 'Switzerland', logo: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-lshtm', name: 'London School of Hygiene & Tropical Medicine', website: 'https://www.lshtm.ac.uk', description: 'A world-leading centre for research and postgraduate education in public and global health.', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-jhu', name: 'Johns Hopkins Bloomberg School of Public Health', website: 'https://publichealth.jhu.edu', description: 'The world’s premier public health school dedicated to pioneering research and educating global health leaders.', country: 'United States', logo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-wellcome', name: 'Wellcome Trust', website: 'https://wellcome.org', description: 'A global charitable foundation supporting discovery research in human health, infectious disease, and mental health.', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-africacdc', name: 'Africa Centres for Disease Control and Prevention', website: 'https://africacdc.org', description: 'Continental public health agency of the African Union to strengthen disease surveillance and emergency preparedness.', country: 'Ethiopia', logo: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-cdcfoundation', name: 'CDC Foundation', website: 'https://www.cdcfoundation.org', description: 'Nonprofit that mobilizes philanthropic and private-sector resources to support CDC’s critical health protection work.', country: 'United States', logo: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-ghc', name: 'Global Health Corps', website: 'https://ghcorps.org', description: 'Leadership organization recruiting young professionals to address systemic global health inequities.', country: 'United States', logo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-tef', name: 'Tony Elumelu Foundation', website: 'https://www.tonyelumelufoundation.org', description: 'Leading philanthropy empowering young African entrepreneurs across all 54 African countries with funding and mentorship.', country: 'Nigeria', logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-deepmind', name: 'Google DeepMind', website: 'https://deepmind.google', description: 'World leader in artificial intelligence research solving scientific, biomedical, and algorithmic challenges.', country: 'United Kingdom', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80' },
  { id: 'org-schwarzman', name: 'Schwarzman Scholars', website: 'https://www.schwarzmanscholars.org', description: 'Premier master’s degree fellowship at Tsinghua University in Beijing designed to prepare future global leaders.', country: 'China', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=150&q=80' },
];

export const learningResourcesData: SeedLearningResource[] = [
  { id: 'lr-01', title: 'UX Research and Design Specialization', description: 'Learn the fundamentals of UX research, design principles, and user testing.', url: 'https://www.coursera.org/specializations/michiganux', provider: 'Coursera (University of Michigan)', skills: ['UX Research', 'Product Design'], duration: '4 months', free: false, relatedOpportunityTypes: ['Fellowship', 'Programme', 'Job'] },
  { id: 'lr-02', title: 'Google Data Analytics Professional Certificate', description: 'A comprehensive program covering data cleaning, visualization, and analysis using SQL, R, and Tableau.', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', provider: 'Coursera (Google)', skills: ['Data Science', 'Data Analysis', 'SQL', 'R'], duration: '6 months', free: false, relatedOpportunityTypes: ['Internship', 'Job', 'Programme'] },
  { id: 'lr-03', title: 'Machine Learning by Stanford University', description: 'The definitive machine learning course covering supervised/unsupervised learning and best practices.', url: 'https://www.coursera.org/specializations/machine-learning-introduction', provider: 'Coursera (Stanford)', skills: ['Machine Learning', 'Data Science', 'Python'], duration: '3 months', free: true, relatedOpportunityTypes: ['Research', 'Fellowship'] },
  { id: 'lr-04', title: 'Introduction to Public Speaking', description: 'Improve your public speaking skills, reduce anxiety, and craft compelling narratives.', url: 'https://www.coursera.org/learn/public-speaking', provider: 'Coursera (University of Washington)', skills: ['Public Speaking', 'Communication'], duration: '4 weeks', free: true, relatedOpportunityTypes: ['Conference/Event', 'Competition'] },
  { id: 'lr-05', title: 'Business Strategy from Wharton', description: 'Learn how to analyze industry structure, build competitive advantage, and drive strategic growth.', url: 'https://www.coursera.org/specializations/wharton-business-strategy', provider: 'Coursera (University of Pennsylvania)', skills: ['Business Strategy', 'Entrepreneurship'], duration: '3 months', free: false, relatedOpportunityTypes: ['Programme', 'Fellowship'] },
  { id: 'lr-06', title: 'Climate Change Science and Negotiations', description: 'Understand the science of climate change and the dynamics of global environmental policy.', url: 'https://www.edx.org/course/climate-change-the-science-and-global-impact', provider: 'edX (SDG Academy)', skills: ['Climate Science', 'Policy Analysis'], duration: '8 weeks', free: true, relatedOpportunityTypes: ['Fellowship', 'Research', 'Conference/Event'] },
  { id: 'lr-07', title: 'Harvard CS50: Introduction to Computer Science', description: 'An expansive and highly acclaimed introduction to computer science and programming.', url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x', provider: 'edX (Harvard)', skills: ['Software Engineering', 'Computer Science', 'Python', 'C'], duration: '12 weeks', free: true, relatedOpportunityTypes: ['Programme', 'Internship'] },
  { id: 'lr-08', title: 'Open Source Software Development, Linux and Git', description: 'Learn how to contribute to open source projects, use Git, and navigate Linux environments.', url: 'https://www.coursera.org/specializations/oss-development-linux-git', provider: 'Coursera (Linux Foundation)', skills: ['Open Source', 'Software Engineering', 'Git'], duration: '2 months', free: true, relatedOpportunityTypes: ['Programme', 'Grant', 'Competition'] },
  { id: 'lr-09', title: 'Writing Successful Grant Proposals', description: 'Master the art of crafting compelling, fundable proposals for nonprofits, research, and creative projects.', url: 'https://www.edx.org/learn/grant-writing', provider: 'edX', skills: ['Grant Writing', 'Communication', 'Fundraising'], duration: '4 weeks', free: true, relatedOpportunityTypes: ['Grant', 'Fellowship', 'Research'] },
  { id: 'lr-10', title: 'Full Stack Open (University of Helsinki)', description: 'Deep dive into modern web development with React, Redux, Node.js, GraphQL and TypeScript.', url: 'https://fullstackopen.com/en/', provider: 'University of Helsinki', skills: ['TypeScript', 'React', 'Software Engineering', 'Node.js'], duration: '12 weeks', free: true, relatedOpportunityTypes: ['Internship', 'Job', 'Competition'] },
  { id: 'lr-11', title: 'Deep Learning Specialization', description: 'Master deep learning fundamentals, build neural networks, and lead successful machine learning projects.', url: 'https://www.deeplearning.ai/courses/deep-learning-specialization/', provider: 'DeepLearning.AI', skills: ['Machine Learning', 'PyTorch', 'Data Science', 'Deep Learning'], duration: '3 months', free: false, relatedOpportunityTypes: ['Research', 'Fellowship', 'Job'] },
  { id: 'lr-12', title: 'Policy Design and Evaluation', description: 'Frameworks for designing evidence-based public policies and measuring their impact.', url: 'https://www.edx.org/course/evaluating-social-programs', provider: 'MITx', skills: ['Policy Analysis', 'Research', 'Economics'], duration: '6 weeks', free: true, relatedOpportunityTypes: ['Fellowship', 'Research'] },
  { id: 'lr-13', title: 'Johns Hopkins: Epidemiology in Public Health Practice', description: 'Learn core epidemiological principles, outbreak investigation, surveillance systems, and causal inference.', url: 'https://www.coursera.org/specializations/epidemiology-public-health-practice', provider: 'Coursera (Johns Hopkins University)', skills: ['Epidemiology', 'Public Health', 'Biostatistics', 'Data Analysis'], duration: '3 months', free: true, relatedOpportunityTypes: ['Fellowship', 'Scholarship', 'Research'] },
  { id: 'lr-14', title: 'Global Health Governance and Diplomacy', description: 'Analyze international health regulations, WHO decision-making frameworks, and multilateral negotiations.', url: 'https://www.edx.org/learn/global-health', provider: 'edX (Geneva Graduate Institute)', skills: ['Global Health', 'Health Policy', 'Diplomacy', 'Policy Analysis'], duration: '6 weeks', free: true, relatedOpportunityTypes: ['Fellowship', 'Internship', 'Job'] },
  { id: 'lr-15', title: 'Biostatistics for Public Health and Medicine', description: 'Comprehensive biostatistical methods for analyzing clinical trial data and epidemiological studies in R and Python.', url: 'https://www.coursera.org/learn/biostatistics', provider: 'Coursera (Imperial College London)', skills: ['Biostatistics', 'Public Health', 'R', 'Data Science'], duration: '8 weeks', free: true, relatedOpportunityTypes: ['Research', 'Fellowship', 'Scholarship'] },
];

export const communityAdvicesData: SeedCommunityAdvice[] = [
  {
    opportunityId: 'opp-051', // WHO Internship
    authorName: 'Amina Diallo, MPH',
    authorRole: 'Former WHO Global Health Intern (Geneva)',
    outcomeStatus: 'Accepted',
    adviceType: 'What I Wish I Knew',
    title: 'Focus heavily on the specific department team mandate, not generic motivation',
    content: 'When writing your WHO Stellis motivation section, don’t just write "I want to help global health". Look up the exact Directorates (like Epidemic & Pandemic Prevention or Health Emergencies) and cite recent WHO policy briefs. Showing you know their exact analytical frameworks will set you apart from 5,000 applicants.',
    upvotes: 42
  },
  {
    opportunityId: 'opp-053', // LSHTM Scholarship
    authorName: 'Dr. Chidi Okonjo',
    authorRole: 'LSHTM MSc Epidemiology Alum',
    outcomeStatus: 'Accepted',
    adviceType: 'Preparation',
    title: 'Connect your quantitative prep and in-country fieldwork directly to public health priorities',
    content: 'LSHTM evaluates scholarship applications on clarity of return-to-country impact. In your 500-word statement, specify which public health challenge in your home region you will tackle with the biostatistics training and which national institute you intend to work with.',
    upvotes: 38
  },
  {
    opportunityId: 'opp-058', // Tony Elumelu Foundation
    authorName: 'Emeka Nwosu',
    authorRole: 'TEF 2025 Alumni & Agri-Fintech Founder',
    outcomeStatus: 'Accepted',
    adviceType: 'Timeline',
    title: 'The 12-week training modules are graded rigorously — stay consistent!',
    content: 'Getting through the initial TEF screening is just the beginning. The weekly quizzes on TEFConnect determine who moves forward to the final pitch review for the $5,000 disbursement. Dedicate 4 hours every Saturday morning to complete the business plan milestones.',
    upvotes: 56
  },
  {
    opportunityId: 'opp-001', // Mozilla Fellowship
    authorName: 'Maya Thorne',
    authorRole: 'Mozilla Fellow 2025',
    outcomeStatus: 'Accepted',
    adviceType: 'CV/Portfolio',
    title: 'Show working code / prototypes and concrete open source contributions',
    content: 'Mozilla values tangible public artifacts. If your proposal involves AI ethics or accessibility, link to a live GitHub repository, demo widget, or published policy critique rather than just theoretical abstracts.',
    upvotes: 29
  },
  {
    opportunityId: 'opp-059', // DeepMind Research Residency
    authorName: 'Kavita Patel',
    authorRole: 'DeepMind Research Resident',
    outcomeStatus: 'Accepted',
    adviceType: 'Interview',
    title: 'Master foundational math proofs (Linear Algebra & Probability) and PyTorch tensor idioms',
    content: 'The technical round tests fundamental machine learning intuition from scratch (e.g. backpropagation derivations, attention matrix complexity, sampling tricks). Be prepared to code a clean transformer block or custom loss function in clean Python without relying on high-level wrappers.',
    upvotes: 64
  }
];
