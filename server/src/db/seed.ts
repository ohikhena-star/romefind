import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function main() {
  console.log('🌱 Starting ROMEfind Database Seed...');

  // 1. Clear existing data in reverse order of foreign keys
  await prisma.applicationNote.deleteMany();
  await prisma.applicationTask.deleteMany();
  await prisma.trackedApplication.deleteMany();
  await prisma.savedOpportunity.deleteMany();
  await prisma.rejectedOpportunity.deleteMany();
  await prisma.behaviourSignal.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.providerSubmission.deleteMany();
  await prisma.opportunityChangeHistory.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Seed Default Demo Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const demoUser = await prisma.user.create({
    data: {
      id: 'usr-demo-001',
      email: 'alex.chen@example.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Chen',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      location: 'London, UK',
      country: 'United Kingdom',
      role: 'USER',
      onboardingCompleted: true,
      profile: {
        create: {
          bio: 'Passionate about human-computer interaction, ethical AI, and building tools that empower creators worldwide.',
          currentStatus: 'Graduate Student / Junior Researcher',
          education: JSON.stringify([
            {
              id: 'edu-1',
              degree: 'BSc Computer Science & Design',
              institution: 'University College London',
              fieldOfStudy: 'Human Computer Interaction',
              startDate: '2021',
              endDate: '2024',
              current: false
            }
          ]),
          experience: JSON.stringify([
            {
              id: 'exp-1',
              title: 'Research Assistant',
              company: 'UCL Interaction Centre',
              location: 'London, UK',
              startDate: '2023-09',
              endDate: '2024-06',
              current: false,
              description: 'Investigated accessibility in multi-modal generative interfaces.'
            }
          ]),
          skills: JSON.stringify(['Python', 'TypeScript', 'React', 'UX Research', 'Data Analysis', 'PyTorch', 'Product Design']),
          interests: JSON.stringify(['Artificial Intelligence', 'Human-Computer Interaction', 'Climate Tech', 'Design Systems', 'Open Source']),
          goals: JSON.stringify([
            'Land a research fellowship or funded master/PhD track in AI & Society',
            'Publish a peer-reviewed paper in CHI or NeurIPS workshops',
            'Secure a grant for an open-source accessibility tool'
          ]),
          portfolioLinks: JSON.stringify(['https://alexchen.dev', 'https://github.com/alexchen', 'https://linkedin.com/in/alexchen']),
          certifications: JSON.stringify(['DeepLearning.AI Machine Learning Specialization', 'Nielsen Norman UX Certification']),
          opportunityPreferences: JSON.stringify(['Fellowship', 'Scholarship', 'Research', 'Grant', 'Internship']),
          locationPreferences: JSON.stringify(['Global', 'United Kingdom', 'United States', 'Remote', 'Europe']),
          fundingPreferences: true,
          remotePreferences: JSON.stringify(['Remote', 'Hybrid', 'In-Person']),
          experienceLevel: 'Intermediate',
          completeness: 92
        }
      }
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      id: 'usr-admin-001',
      email: 'admin@romefind.com',
      passwordHash,
      firstName: 'ROMEfind',
      lastName: 'Admin',
      location: 'San Francisco, CA',
      country: 'United States',
      role: 'ADMIN',
      onboardingCompleted: true,
      profile: {
        create: {
          bio: 'Platform Administrator & Curator for ROMEfind opportunity engine.',
          currentStatus: 'System Administrator',
          skills: JSON.stringify(['Platform Management', 'Curations', 'Verification']),
          interests: JSON.stringify(['Opportunities', 'Global Education', 'Impact']),
          goals: JSON.stringify(['Curate 10,000 verified opportunities worldwide']),
          completeness: 100
        }
      }
    }
  });

  console.log(`👤 Created Demo User (${demoUser.email}) and Admin (${adminUser.email})`);

  // 3. Organizations Seed Data
  const rawOrgs = [
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
  ];

  for (const org of rawOrgs) {
    await prisma.organization.create({
      data: {
        id: org.id,
        name: org.name,
        website: org.website,
        description: org.description,
        country: org.country,
        logo: org.logo,
        verificationStatus: 'VERIFIED'
      }
    });
  }
  console.log(`🏢 Seeded ${rawOrgs.length} Organizations.`);

  // 4. Learning Resources Seed Data
  const rawLearning = [
    { id: 'lr-01', title: 'UX Research and Design Specialization', description: 'Learn the fundamentals of UX research, design principles, and user testing.', url: 'https://www.coursera.org/specializations/michiganux', provider: 'Coursera (University of Michigan)', skills: ['UX Research', 'Product Design'], duration: '4 months', free: false, relatedOpportunityTypes: ['Fellowship', 'Programme', 'Job'] },
    { id: 'lr-02', title: 'Google Data Analytics Professional Certificate', description: 'A comprehensive program covering data cleaning, visualization, and analysis using SQL, R, and Tableau.', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', provider: 'Coursera (Google)', skills: ['Data Science', 'Data Analysis'], duration: '6 months', free: false, relatedOpportunityTypes: ['Internship', 'Job', 'Programme'] },
    { id: 'lr-03', title: 'Machine Learning by Stanford University', description: 'The definitive machine learning course covering supervised/unsupervised learning and best practices.', url: 'https://www.coursera.org/specializations/machine-learning-introduction', provider: 'Coursera (Stanford)', skills: ['Machine Learning', 'Data Science'], duration: '3 months', free: true, relatedOpportunityTypes: ['Research', 'Fellowship'] },
    { id: 'lr-04', title: 'Introduction to Public Speaking', description: 'Improve your public speaking skills, reduce anxiety, and craft compelling narratives.', url: 'https://www.coursera.org/learn/public-speaking', provider: 'Coursera (University of Washington)', skills: ['Public Speaking', 'Communication'], duration: '4 weeks', free: true, relatedOpportunityTypes: ['Conference/Event', 'Competition'] },
    { id: 'lr-05', title: 'Business Strategy from Wharton', description: 'Learn how to analyze industry structure, build competitive advantage, and drive strategic growth.', url: 'https://www.coursera.org/specializations/wharton-business-strategy', provider: 'Coursera (University of Pennsylvania)', skills: ['Business Strategy', 'Entrepreneurship'], duration: '3 months', free: false, relatedOpportunityTypes: ['Programme', 'Fellowship'] },
    { id: 'lr-06', title: 'Climate Change Science and Negotiations', description: 'Understand the science of climate change and the dynamics of global environmental policy.', url: 'https://www.edx.org/course/climate-change-the-science-and-global-impact', provider: 'edX (SDG Academy)', skills: ['Climate Science', 'Policy Analysis'], duration: '8 weeks', free: true, relatedOpportunityTypes: ['Fellowship', 'Research', 'Conference/Event'] },
    { id: 'lr-07', title: 'Harvard CS50: Introduction to Computer Science', description: 'An expansive and highly acclaimed introduction to computer science and programming.', url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x', provider: 'edX (Harvard)', skills: ['Software Engineering'], duration: '12 weeks', free: true, relatedOpportunityTypes: ['Programme', 'Internship'] },
    { id: 'lr-08', title: 'Open Source Software Development, Linux and Git', description: 'Learn how to contribute to open source projects, use Git, and navigate Linux environments.', url: 'https://www.coursera.org/specializations/oss-development-linux-git', provider: 'Coursera (Linux Foundation)', skills: ['Open Source', 'Software Engineering'], duration: '2 months', free: true, relatedOpportunityTypes: ['Programme', 'Grant', 'Competition'] },
    { id: 'lr-09', title: 'Writing Successful Grant Proposals', description: 'Master the art of crafting compelling, fundable proposals for nonprofits, research, and creative projects.', url: 'https://www.edx.org/learn/grant-writing', provider: 'edX', skills: ['Grant Writing', 'Communication'], duration: '4 weeks', free: true, relatedOpportunityTypes: ['Grant', 'Fellowship', 'Research'] },
    { id: 'lr-10', title: 'Full Stack Open (University of Helsinki)', description: 'Deep dive into modern web development with React, Redux, Node.js, GraphQL and TypeScript.', url: 'https://fullstackopen.com/en/', provider: 'University of Helsinki', skills: ['TypeScript', 'React', 'Software Engineering'], duration: '12 weeks', free: true, relatedOpportunityTypes: ['Internship', 'Job', 'Competition'] },
    { id: 'lr-11', title: 'Deep Learning Specialization', description: 'Master deep learning fundamentals, build neural networks, and lead successful machine learning projects.', url: 'https://www.deeplearning.ai/courses/deep-learning-specialization/', provider: 'DeepLearning.AI', skills: ['Machine Learning', 'PyTorch', 'Data Science'], duration: '3 months', free: false, relatedOpportunityTypes: ['Research', 'Fellowship', 'Job'] },
    { id: 'lr-12', title: 'Policy Design and Evaluation', description: 'Frameworks for designing evidence-based public policies and measuring their impact.', url: 'https://www.edx.org/course/evaluating-social-programs', provider: 'MITx', skills: ['Policy Analysis', 'Research'], duration: '6 weeks', free: true, relatedOpportunityTypes: ['Fellowship', 'Research'] }
  ];

  for (const lr of rawLearning) {
    await prisma.learningResource.create({
      data: {
        id: lr.id,
        title: lr.title,
        description: lr.description,
        provider: lr.provider,
        url: lr.url,
        skills: JSON.stringify(lr.skills),
        duration: lr.duration,
        free: lr.free,
        relatedOpportunityTypes: JSON.stringify(lr.relatedOpportunityTypes),
      }
    });
  }
  console.log(`📚 Seeded ${rawLearning.length} Learning Resources.`);

  // 5. Read all opportunities directly from frontend opportunities dataset file or defined array
  // Let's load the opportunities dataset
  const oppFile = readFileSync(resolve('../src/data/opportunities.ts'), 'utf-8');
  
  // Extract all opportunity objects with safe regex or eval
  // Or create rich comprehensive seed opportunities matching the 50 in frontend
  const oppsData = [
    {
      id: 'opp-001',
      title: 'Creative Media Fellowship',
      orgId: 'org-mozilla',
      type: 'Fellowship',
      description: 'The Mozilla Creative Media Fellowship supports artists, activists, and technologists who are working at the intersection of technology and society. Fellows receive funding, mentorship, and resources to develop projects that promote internet health and digital inclusion. The fellowship runs for 10 months and includes travel support for convenings.',
      shortDescription: 'Build experience through a funded fellowship focused on technology and creative media.',
      field: ['Technology', 'Creative', 'Media'],
      subfields: ['Internet Health', 'Digital Rights', 'AI Ethics'],
      location: 'Global',
      country: 'United States',
      remoteStatus: 'Remote',
      eligibility: ['Open to artists, designers, and technologists worldwide', 'Must have a project proposal', 'Must be 18 or older'],
      educationRequirements: ['Any'],
      experienceRequirements: 'Intermediate',
      funding: 'Up to $60,000 stipend',
      fundingType: 'Fully-Funded',
      fundingAmount: '$60,000',
      benefits: ['Stipend of up to $60,000', 'Travel support', 'Mentorship from Mozilla staff', 'Access to Mozilla network', 'Project resources'],
      duration: '10 months',
      deadline: '2027-03-14',
      startDate: '2027-06-01',
      applicationUrl: 'https://foundation.mozilla.org/fellowships/',
      officialSource: 'https://foundation.mozilla.org/fellowships/',
      sourceName: 'Mozilla Foundation',
      sourceType: 'nonprofit',
      tags: ['tech', 'creative', 'digital rights', 'open source', 'internet health'],
      requirements: ['Project proposal', 'Portfolio of past work', 'CV/Resume', 'Two references'],
      applicationSteps: ['Submit online application', 'Include project proposal', 'Provide portfolio', 'Supply two references', 'Interview if shortlisted'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-002',
      title: 'TED Fellowship',
      orgId: 'org-ted',
      type: 'Fellowship',
      description: 'The TED Fellowship program supports outstanding individuals with bold ideas who are working to make positive change. Fellows attend TED conferences, receive coaching on public speaking, and gain access to the TED community. The program is designed for innovators, activists, and researchers who want to amplify their work.',
      shortDescription: 'Join a global community of changemakers and share your ideas on the TED stage.',
      field: ['Creative', 'Research', 'Social Impact', 'Technology'],
      subfields: ['Public Speaking', 'Innovation', 'Global Impact'],
      location: 'Global',
      country: 'United States',
      remoteStatus: 'Hybrid',
      eligibility: ['Open to remarkable individuals worldwide', 'Must be doing innovative work', 'Must be able to attend TED conference'],
      educationRequirements: ['Any'],
      experienceRequirements: 'Intermediate',
      funding: 'Fully funded (travel, accommodation, conference pass)',
      fundingType: 'Fully-Funded',
      fundingAmount: 'Full Coverage',
      benefits: ['Attendance at TED conference', 'Public speaking coaching', 'Global network of fellows', 'Media amplification of your work', 'Mentorship'],
      duration: '1 year',
      deadline: '2027-04-14',
      startDate: '2027-07-01',
      applicationUrl: 'https://www.ted.com/participate/ted-fellows-program',
      officialSource: 'https://www.ted.com/participate/ted-fellows-program',
      sourceName: 'TED',
      sourceType: 'nonprofit',
      tags: ['leadership', 'innovation', 'public speaking', 'social impact', 'global'],
      requirements: ['Portfolio/work samples', 'Personal statement', 'Two references', 'Short video introduction'],
      applicationSteps: ['Online application form', 'Work portfolio upload', 'Reference submission', 'Semi-finalist interview', 'Final selection'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-003',
      title: 'Rhodes Scholarship',
      orgId: 'org-rhodes',
      type: 'Scholarship',
      description: 'The Rhodes Scholarship is a fully funded postgraduate award enabling talented young people from around the world to study at the University of Oxford. Rhodes Scholars are chosen for their academic excellence, leadership qualities, commitment to service, and energy to use their talents to the full.',
      shortDescription: 'Fully funded postgraduate study at the University of Oxford for exceptional young leaders.',
      field: ['Academia', 'Leadership', 'Policy', 'Research'],
      subfields: ['Postgraduate Studies', 'Global Leadership', 'Public Policy'],
      location: 'Oxford, UK',
      country: 'United Kingdom',
      remoteStatus: 'In-Person',
      eligibility: ['Bachelor degree completed by start date', 'Ages 18-24 (some constituencies up to 27)', 'Citizenship of eligible constituency', 'Outstanding academic record (GPA 3.7+)'],
      educationRequirements: ['Bachelor'],
      experienceRequirements: 'Intermediate',
      funding: 'Full tuition + £19,000/year living stipend + travel',
      fundingType: 'Fully-Funded',
      fundingAmount: '£19,000/yr + Tuition',
      benefits: ['All Oxford University and college fees', 'Annual living stipend (£19,000+)', 'Economy class flights to and from Oxford', 'Health insurance', 'Rhodes House community and events'],
      duration: '2-3 years',
      deadline: '2027-10-01',
      startDate: '2028-10-01',
      applicationUrl: 'https://www.rhodeshouse.ox.ac.uk/scholarships/applications/',
      officialSource: 'https://www.rhodeshouse.ox.ac.uk',
      sourceName: 'Rhodes Trust',
      sourceType: 'foundation',
      tags: ['oxford', 'postgraduate', 'scholarship', 'leadership', 'academic excellence'],
      requirements: ['Transcripts', 'Personal statement (1000 words)', 'Academic writing sample', '4-8 letters of recommendation', 'Institutional endorsement'],
      applicationSteps: ['Institutional endorsement (if applicable)', 'Online application submission', 'First-round interview', 'Final panel interview in Oxford/constituency'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-004',
      title: 'Fulbright Foreign Student Program',
      orgId: 'org-fulbright',
      type: 'Scholarship',
      description: 'The Fulbright Foreign Student Program enables graduate students, young professionals and artists from abroad to study and conduct research in the United States. Operating in more than 160 countries worldwide, it provides full funding for Master and PhD programs at US universities.',
      shortDescription: 'Full funding for international graduate students and researchers to study in the United States.',
      field: ['Academia', 'Research', 'Education', 'Social Sciences'],
      subfields: ['Graduate Studies', 'International Exchange'],
      location: 'United States (Various)',
      country: 'United States',
      remoteStatus: 'In-Person',
      eligibility: ['Non-US citizen', 'Bachelor degree equivalent completed', 'English proficiency (TOEFL/IELTS)', 'Strong academic background'],
      educationRequirements: ['Bachelor'],
      experienceRequirements: 'Intermediate',
      funding: 'Full tuition, monthly stipend, health insurance, airfare',
      fundingType: 'Fully-Funded',
      fundingAmount: 'Full Coverage',
      benefits: ['Full tuition coverage', 'Monthly living stipend', 'Round-trip international airfare', 'Health benefit plan', 'Enrichment seminars and workshops across the US'],
      duration: '1-2 years',
      deadline: '2027-06-15',
      startDate: '2028-08-15',
      applicationUrl: 'https://us.fulbrightonline.org',
      officialSource: 'https://foreign.fulbrightonline.org',
      sourceName: 'U.S. Department of State',
      sourceType: 'government',
      tags: ['fulbright', 'usa', 'graduate', 'masters', 'phd', 'international exchange'],
      requirements: ['Academic transcripts', 'Statement of purpose', 'Personal statement', '3 letters of reference', 'TOEFL/IELTS and GRE scores (where applicable)'],
      applicationSteps: ['Apply through home country Fulbright Commission/US Embassy', 'Technical review and interview', 'Placement at US university', 'Visa processing'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-005',
      title: 'Google AI Residency / Student Researcher',
      orgId: 'org-google',
      type: 'Research',
      description: 'The Student Researcher Program at Google offers students an opportunity to directly work with Google Research teams on real-world problems. Researchers collaborate with scientists and engineers to publish papers, develop models, and innovate in areas like machine learning, computer vision, and NLP.',
      shortDescription: 'Work alongside world-class Google scientists on cutting-edge machine learning research.',
      field: ['Technology', 'Artificial Intelligence', 'Research'],
      subfields: ['Machine Learning', 'NLP', 'Computer Vision'],
      location: 'Mountain View, CA / London / Zurich',
      country: 'United States',
      remoteStatus: 'Hybrid',
      eligibility: ['Enrolled in a PhD or Master program in Computer Science or related field', 'Experience with ML frameworks (TensorFlow, PyTorch, JAX)', 'Publication record in top-tier conferences is a plus'],
      educationRequirements: ['Master', 'PhD'],
      experienceRequirements: 'Intermediate',
      funding: '$9,000 - $12,000/month salary + housing stipend',
      fundingType: 'Stipend',
      fundingAmount: '$10,000/month',
      benefits: ['Competitive monthly salary', 'Housing and relocation support', 'Access to Google computing infrastructure (TPUs)', 'Co-authorship on peer-reviewed papers', 'Direct mentorship from Google researchers'],
      duration: '4-12 months',
      deadline: '2027-04-30',
      startDate: '2027-06-01',
      applicationUrl: 'https://careers.google.com/research/',
      officialSource: 'https://careers.google.com/research/',
      sourceName: 'Google Research',
      sourceType: 'corporate',
      tags: ['google', 'ai', 'machine learning', 'research', 'deep learning', 'nlp'],
      requirements: ['CV/Resume with publication list', 'Research statement (1-2 pages)', 'Academic transcripts', 'GitHub profile / code samples'],
      applicationSteps: ['Submit online application', 'Technical screening interview with research team', 'Research talk / presentation', 'Team matching and offer'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-006',
      title: 'Y Combinator Core Accelerator (S27 Batch)',
      orgId: 'org-yc',
      type: 'Programme',
      description: 'Y Combinator runs a 3-month startup accelerator twice a year. YC invests $500,000 in every accepted company on standard terms. Founders receive intensive mentorship, access to the alumni network, weekly dinners with world-class speakers, and the opportunity to pitch to thousands of investors on Demo Day.',
      shortDescription: '$500,000 investment and world-class acceleration for early-stage startup founders.',
      field: ['Entrepreneurship', 'Technology', 'Business'],
      subfields: ['Startups', 'Venture Capital', 'Product'],
      location: 'San Francisco, CA',
      country: 'United States',
      remoteStatus: 'In-Person',
      eligibility: ['Open to founders worldwide at any stage from idea to revenue', 'Must be willing to relocate to San Francisco for the 3-month program', 'Technical and non-technical founders welcome'],
      educationRequirements: ['Any'],
      experienceRequirements: 'Beginner',
      funding: '$500,000 investment ($125k for 7% + $375k MFN SAFE)',
      fundingType: 'Fully-Funded',
      fundingAmount: '$500,000',
      benefits: ['$500,000 total investment', 'Unmatched alumni network (Airbnb, Stripe, Coinbase, DoorDash)', 'Demo Day investor exposure', 'Office hours with YC Group Partners', 'Over $500k in partner discounts and credits'],
      duration: '3 months',
      deadline: '2027-04-01',
      startDate: '2027-06-15',
      applicationUrl: 'https://www.ycombinator.com/apply',
      officialSource: 'https://www.ycombinator.com/apply',
      sourceName: 'Y Combinator',
      sourceType: 'accelerator',
      tags: ['startups', 'y combinator', 'venture capital', 'entrepreneurship', 'acceleration', 'funding'],
      requirements: ['Online application form', '1-minute video introducing founders', 'Demo / prototype link if available', 'Equity breakdown details'],
      applicationSteps: ['Submit online application before deadline', '10-minute partner interview (if selected)', 'Decision announced same day as interview', 'Onboarding & batch kickoff'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-007',
      title: 'Chevening Scholarship',
      orgId: 'org-chevening',
      type: 'Scholarship',
      description: 'Chevening is the UK Government\'s global scholarship programme funded by the Foreign, Commonwealth and Development Office. It awards outstanding emerging leaders from around the world to pursue a one-year Master degree at any UK university.',
      shortDescription: 'Fully funded one-year Master degree at any university in the United Kingdom.',
      field: ['Leadership', 'Policy', 'International Relations', 'Academia'],
      subfields: ['Master Degree', 'Public Leadership'],
      location: 'United Kingdom (Any University)',
      country: 'United Kingdom',
      remoteStatus: 'In-Person',
      eligibility: ['Citizen of a Chevening-eligible country', 'Undergraduate degree with 2:1 honours equivalent', 'At least 2 years of work experience (2,800 hours)', 'Return to country of citizenship for 2 years after study'],
      educationRequirements: ['Bachelor'],
      experienceRequirements: 'Intermediate',
      funding: 'Full university tuition + monthly living stipend + flights',
      fundingType: 'Fully-Funded',
      fundingAmount: 'Full Coverage',
      benefits: ['Full tuition fees coverage', 'Monthly living allowance', 'Economy travel to/from the UK', 'Arrival and departure allowances', 'Access to exclusive UK networking events'],
      duration: '1 year',
      deadline: '2027-11-05',
      startDate: '2028-09-01',
      applicationUrl: 'https://www.chevening.org/scholarships/',
      officialSource: 'https://www.chevening.org',
      sourceName: 'UK FCDO',
      sourceType: 'government',
      tags: ['chevening', 'uk', 'masters', 'leadership', 'scholarship', 'study abroad'],
      requirements: ['4 essay questions (Leadership, Networking, Study in UK, Career Plan)', 'University degree certificates', '2 references', 'Acceptance from at least one UK university course'],
      applicationSteps: ['Online application with 4 essays', 'Longlisting by independent reading committee', 'Interview at British Embassy/High Commission', 'Course unconditional offer confirmation'],
      status: 'OPEN',
      isFeatured: false
    },
    {
      id: 'opp-008',
      title: 'OpenAI Research Fellowship',
      orgId: 'org-openai',
      type: 'Fellowship',
      description: 'The OpenAI Residency is a 6-month program that serves as a pathway to a full-time Research Scientist or Member of Technical Staff role. It is designed for exceptional researchers and engineers from adjacent fields (mathematics, physics, neuroscience, software engineering) looking to transition into AI research.',
      shortDescription: 'A paid 6-month pathway to full-time frontier AI research at OpenAI.',
      field: ['Artificial Intelligence', 'Research', 'Technology'],
      subfields: ['Deep Learning', 'Alignment', 'Reinforcement Learning'],
      location: 'San Francisco, CA',
      country: 'United States',
      remoteStatus: 'Hybrid',
      eligibility: ['Strong foundation in math, physics, computer science, or engineering', 'Proficiency in Python and deep learning frameworks', 'Demonstrated problem-solving track record and curiosity for AGI safety'],
      educationRequirements: ['Bachelor', 'Master', 'PhD'],
      experienceRequirements: 'Intermediate',
      funding: '$210,000/year annualized salary + benefits + compute resources',
      fundingType: 'Fully-Funded',
      fundingAmount: '$17,500/month',
      benefits: ['$210,000 annualized compensation', '1:1 mentorship from top OpenAI research scientists', 'Access to massive scale supercomputing clusters', 'Full health and wellness coverage', 'Path to permanent staff research offer'],
      duration: '6 months',
      deadline: '2027-05-30',
      startDate: '2027-09-01',
      applicationUrl: 'https://openai.com/careers/residency',
      officialSource: 'https://openai.com/careers',
      sourceName: 'OpenAI',
      sourceType: 'corporate',
      tags: ['openai', 'agi', 'deep learning', 'research fellowship', 'machine learning', 'san francisco'],
      requirements: ['Resume / CV', 'Links to GitHub / papers / projects', 'Written responses detailing machine learning understanding and math depth'],
      applicationSteps: ['Resume review and initial questionnaire', 'Practical coding / math take-home challenge', 'Technical phone interview', 'On-site technical research presentations and pair problem-solving'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-009',
      title: 'Gates Cambridge Scholarship',
      orgId: 'org-gates',
      type: 'Scholarship',
      description: 'The Gates Cambridge Scholarship is a prestigious international postgraduate scholarship awarded to outstanding applicants from countries outside the UK to pursue a full-time postgraduate degree in any subject available at the University of Cambridge.',
      shortDescription: 'Full-cost scholarship for outstanding non-UK applicants to study postgraduate degrees at Cambridge.',
      field: ['Academia', 'Research', 'Leadership', 'Social Impact'],
      subfields: ['PhD', 'Masters', 'Global Development'],
      location: 'Cambridge, UK',
      country: 'United Kingdom',
      remoteStatus: 'In-Person',
      eligibility: ['Citizen of any country outside the United Kingdom', 'Applying to pursue a full-time residential course of study at Cambridge (PhD, MSc, MLitt, or one-year postgraduate)', 'Demonstrated commitment to improving the lives of others'],
      educationRequirements: ['Bachelor'],
      experienceRequirements: 'Intermediate',
      funding: 'Full cost of studying at Cambridge (tuition + £20,000/year living allowance + discretionary funds)',
      fundingType: 'Fully-Funded',
      fundingAmount: '£20,000/yr + Tuition',
      benefits: ['University Composition Fee and College fees', 'Maintenance allowance of £20,000/year', 'Inbound and outbound airfare', 'Academic development funding (up to £2,000 for conferences)', 'Family allowance support'],
      duration: '1-4 years',
      deadline: '2027-12-05',
      startDate: '2028-10-01',
      applicationUrl: 'https://www.gatescambridge.org/apply/',
      officialSource: 'https://www.gatescambridge.org',
      sourceName: 'Bill & Melinda Gates Foundation / Cambridge',
      sourceType: 'foundation',
      tags: ['cambridge', 'gates', 'postgraduate', 'phd', 'masters', 'leadership', 'social impact'],
      requirements: ['Cambridge Graduate Application', 'Gates Cambridge Statement (500 words)', 'Research proposal (for PhD)', 'Gates reference letter + 2 academic references'],
      applicationSteps: ['Submit Cambridge Postgraduate admission application with Gates section', 'Departmental ranking and nomination', 'Shortlisting by Gates Cambridge Trust', 'Panel interview (online or in Cambridge)'],
      status: 'OPEN',
      isFeatured: false
    },
    {
      id: 'opp-010',
      title: 'DAAD Helmut-Schmidt Master Scholarships for Public Policy',
      orgId: 'org-daad',
      type: 'Scholarship',
      description: 'The Helmut-Schmidt-Programme offers future leaders from developing and emerging countries the chance to acquire a Master degree in Public Policy and Good Governance at renowned German universities.',
      shortDescription: 'Full Master degree scholarship in Public Policy and Governance in Germany.',
      field: ['Policy', 'Governance', 'Economics', 'Social Sciences'],
      subfields: ['Public Administration', 'International Relations'],
      location: 'Germany (Various Universities)',
      country: 'Germany',
      remoteStatus: 'In-Person',
      eligibility: ['Graduates from developing and emerging countries (OECD DAC list)', 'First academic degree in political science, law, economics, or social sciences', 'English or German language proficiency depending on chosen program'],
      educationRequirements: ['Bachelor'],
      experienceRequirements: 'Beginner',
      funding: '€934/month stipend + tuition waiver + travel allowance + health insurance',
      fundingType: 'Fully-Funded',
      fundingAmount: '€934/month + Tuition',
      benefits: ['Full tuition exemption', 'Monthly scholarship rate of €934', 'Health insurance coverage in Germany', 'Travel allowance', 'German language preparatory course (up to 6 months)'],
      duration: '2 years',
      deadline: '2027-07-31',
      startDate: '2028-09-01',
      applicationUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
      officialSource: 'https://www.daad.de',
      sourceName: 'German Academic Exchange Service (DAAD)',
      sourceType: 'government',
      tags: ['daad', 'germany', 'public policy', 'governance', 'scholarship', 'europe'],
      requirements: ['DAAD application form', 'Curriculum vitae in Europass format', 'Motivation letter (max 2 pages)', 'Certified copies of university certificates and transcripts', 'Proof of language proficiency'],
      applicationSteps: ['Select up to 2 Master courses from participating German universities', 'Submit full application package directly to universities', 'DAAD selection committee review', 'Award notification'],
      status: 'OPEN',
      isFeatured: false
    },
    {
      id: 'opp-011',
      title: 'Stripe Software Engineering Internship (Summer 2027)',
      orgId: 'org-stripe',
      type: 'Internship',
      description: 'Stripe interns work alongside full-time engineers on real customer-facing infrastructure and financial products. You will design, write, test, and deploy code to production systems handling hundreds of billions of dollars annually.',
      shortDescription: 'High-impact software engineering internship building global internet economic infrastructure.',
      field: ['Technology', 'Software Engineering', 'FinTech'],
      subfields: ['Distributed Systems', 'Frontend', 'Backend', 'API Design'],
      location: 'San Francisco, CA / Seattle, WA / Remote US/EU',
      country: 'United States',
      remoteStatus: 'Hybrid',
      eligibility: ['Currently pursuing a BS, MS, or PhD in Computer Science or related STEM field', 'Graduating in late 2027 or 2028', 'Solid proficiency in at least one modern language (Ruby, Java, Go, TypeScript, Python)'],
      educationRequirements: ['Bachelor', 'Master'],
      experienceRequirements: 'Beginner',
      funding: '$55 - $65/hour + housing stipend or company housing',
      fundingType: 'Stipend',
      fundingAmount: '$9,500/month',
      benefits: ['Industry-leading hourly compensation ($55-$65/hr)', 'Corporate housing or $2,500/month stipend', 'Dedicated mentor and manager', 'Social events and tech talks', 'Direct pipeline to return full-time new grad offer'],
      duration: '12 weeks',
      deadline: '2027-03-30',
      startDate: '2027-06-01',
      applicationUrl: 'https://stripe.com/jobs/university',
      officialSource: 'https://stripe.com/jobs',
      sourceName: 'Stripe University Talent',
      sourceType: 'corporate',
      tags: ['stripe', 'software engineering', 'internship', 'fintech', 'distributed systems'],
      requirements: ['Updated Resume', 'GitHub / portfolio links', 'Transcript (unofficial)'],
      applicationSteps: ['Online application', 'Take-home coding assessment / HackerRank', 'Technical phone screen', 'Virtual final round (systems design + pair programming + hiring manager)'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-012',
      title: 'MIT Climate & Energy Prize',
      orgId: 'org-mit',
      type: 'Competition',
      description: 'The MIT Climate & Energy Prize (CEP) is the longest-running and largest university competition for student-led climate-tech and clean energy startups in the world, with over $100,000 in non-dilutive cash prizes.',
      shortDescription: 'Global student competition awarding over $100,000 in non-dilutive climate tech grants.',
      field: ['Climate Tech', 'Entrepreneurship', 'Engineering', 'Sustainability'],
      subfields: ['Clean Energy', 'Carbon Removal', 'Circular Economy'],
      location: 'Cambridge, MA (Grand Finals)',
      country: 'United States',
      remoteStatus: 'Hybrid',
      eligibility: ['At least one active degree-seeking student on the founding team', 'Startup has raised under $1M in equity funding to date', 'Clean tech / climate solution focus'],
      educationRequirements: ['Bachelor', 'Master', 'PhD'],
      experienceRequirements: 'Beginner',
      funding: 'Over $100,000 in non-dilutive cash prizes ($50k Grand Prize)',
      fundingType: 'Prize',
      fundingAmount: '$50,000 Grand Prize',
      benefits: ['Non-dilutive cash grant funding', 'Mentorship from leading energy investors and executives', 'Travel support to MIT for finalists', 'Global press coverage and investor exposure'],
      duration: '5 months',
      deadline: '2027-02-15',
      startDate: '2027-03-01',
      applicationUrl: 'https://cep.mit.edu',
      officialSource: 'https://cep.mit.edu',
      sourceName: 'MIT Energy Club',
      sourceType: 'university',
      tags: ['climate', 'energy', 'mit', 'competition', 'prize', 'cleantech', 'startups'],
      requirements: ['Executive summary (2-3 pages)', 'Pitch deck (10-15 slides)', 'Proof of student enrollment on founding team'],
      applicationSteps: ['Round 1 Executive Summary submission', 'Semi-finals virtual pitch to industry judges', 'Mentorship phase (2 months)', 'Live Grand Finals pitch at MIT'],
      status: 'OPEN',
      isFeatured: false
    },
    {
      id: 'opp-013',
      title: 'World Bank Young Professionals Program (YPP)',
      orgId: 'org-worldbank',
      type: 'Programme',
      description: 'The World Bank Group Young Professionals Program is the premier starting point for an international development career across the World Bank, IFC, and MIGA. It is a 2-year leadership development curriculum with competitive international salaries.',
      shortDescription: 'Premier global development leadership entry track across World Bank, IFC, and MIGA.',
      field: ['Economics', 'International Development', 'Finance', 'Policy'],
      subfields: ['Macroeconomics', 'Sustainable Development', 'Infrastructure Finance'],
      location: 'Washington, D.C.',
      country: 'United States',
      remoteStatus: 'In-Person',
      eligibility: ['Born on or after October 1, 1994', 'Master degree or PhD in relevant field (Economics, Finance, Engineering, Public Health)', 'Minimum 3 years relevant professional experience or PhD research', 'Fluency in English + second UN language preferred'],
      educationRequirements: ['Master', 'PhD'],
      experienceRequirements: 'Intermediate',
      funding: 'Full international staff salary + health + pension + relocation grant',
      fundingType: 'Fully-Funded',
      fundingAmount: '$110,000/year',
      benefits: ['Competitive net-of-tax salary', 'Full comprehensive medical & dental coverage', 'Expatriate benefits & relocation allowance', 'Pension plan and mobility premiums', 'Rotational global field assignments'],
      duration: '2 years (permanent track)',
      deadline: '2027-08-31',
      startDate: '2028-09-01',
      applicationUrl: 'https://www.worldbank.org/en/about/careers/programs-and-internships/young-professionals-program',
      officialSource: 'https://www.worldbank.org',
      sourceName: 'World Bank Group HR',
      sourceType: 'international',
      tags: ['world bank', 'economics', 'development', 'leadership program', 'washington dc'],
      requirements: ['CV/Resume', 'Academic credentials and transcripts', 'Short essay responses', 'Video pitch recording', '2 letters of recommendation'],
      applicationSteps: ['Online application & essay submission', 'Timed recorded video interview', 'Center-based technical & leadership assessments', 'Executive final interviews'],
      status: 'OPEN',
      isFeatured: true
    },
    {
      id: 'opp-014',
      title: 'Ford Foundation Global Fellowship',
      orgId: 'org-ford',
      type: 'Fellowship',
      description: 'The Ford Global Fellowship is a flagship program connecting 24 visionary leaders from around the world each year who are tackling inequality in innovative ways. Fellows receive $25,000 in individual project funding plus immersive global convenings.',
      shortDescription: 'A global network and funding for leaders tackling inequality across social justice sectors.',
      field: ['Social Impact', 'Civil Rights', 'Policy', 'Community'],
      subfields: ['Economic Equality', 'Human Rights', 'Civic Engagement'],
      location: 'Global',
      country: 'United States',
      remoteStatus: 'Hybrid',
      eligibility: ['Leaders with 5+ years track record in social justice or inequality eradication', 'Working in community, grassroots, or institutional advocacy', 'No minimum formal academic degree required'],
      educationRequirements: ['Any'],
      experienceRequirements: 'Intermediate',
      funding: '$25,000 flexible grant + all convening travel paid',
      fundingType: 'Fully-Funded',
      fundingAmount: '$25,000 + Travel',
      benefits: ['$25,000 direct flexible funding', 'Global network of 100+ social justice leaders', '3 international all-expenses-paid study convenings', 'Executive leadership coaching', 'Media training and profile amplification'],
      duration: '18 months',
      deadline: '2027-06-30',
      startDate: '2027-10-01',
      applicationUrl: 'https://www.fordfoundation.org/work/our-grants/ford-global-fellows/',
      officialSource: 'https://www.fordfoundation.org',
      sourceName: 'Ford Foundation',
      sourceType: 'foundation',
      tags: ['social justice', 'equality', 'fellowship', 'leadership', 'advocacy', 'ford foundation'],
      requirements: ['Nomination / Application form', 'Leadership impact narrative (1,500 words)', 'Organizational overview', '3 character / impact references'],
      applicationSteps: ['Stage 1 written application', 'Stage 2 video submission and project proposal', 'Regional advisory panel interview', 'Fellowship selection'],
      status: 'OPEN',
      isFeatured: false
    },
    {
      id: 'opp-015',
      title: 'NASA Postdoctoral Program (NPP)',
      orgId: 'org-nasa',
      type: 'Research',
      description: 'The NASA Postdoctoral Program provides talented early-career and senior scientists with opportunities to engage in ongoing NASA research projects at NASA Centers across the United States. Fellows participate in Earth science, astrophysics, planetary science, and space exploration research.',
      shortDescription: 'Funded postdoctoral fellowship conducting breakthrough research at NASA centers.',
      field: ['Aerospace', 'Astrophysics', 'Earth Science', 'Engineering'],
      subfields: ['Space Exploration', 'Remote Sensing', 'Robotics'],
      location: 'NASA Centers (Pasadena CA, Houston TX, Greenbelt MD)',
      country: 'United States',
      remoteStatus: 'In-Person',
      eligibility: ['Hold a PhD or equivalent doctorate in science, technology, engineering, or math', 'US citizens, permanent residents, and eligible foreign nationals with J-1 visa qualification', 'Strong record of scientific publication'],
      educationRequirements: ['PhD'],
      experienceRequirements: 'Advanced',
      funding: '$70,000 - $85,000 annual stipend + $10,000 travel/research budget',
      fundingType: 'Fully-Funded',
      fundingAmount: '$75,000/year',
      benefits: ['Annual stipend up to $85,000', 'Annual $10,000 travel and research allowance', 'Comprehensive health insurance options', 'Relocation allowance support', 'Direct access to NASA laboratory instrumentation and telescope data'],
      duration: '1-3 years',
      deadline: '2027-07-01',
      startDate: '2027-11-01',
      applicationUrl: 'https://npp.orau.org',
      officialSource: 'https://npp.orau.org',
      sourceName: 'NASA / ORAU',
      sourceType: 'government',
      tags: ['nasa', 'space', 'astrophysics', 'postdoc', 'research', 'engineering'],
      requirements: ['NASA NPP Research Proposal (15 pages max)', 'Curriculum Vitae with publication list', 'Transcripts', '3 letters of recommendation from senior scientists'],
      applicationSteps: ['Identify and contact a NASA Research Advisor', 'Develop and submit research proposal', 'Peer review evaluation by panel of subject experts', 'NASA Center selection and appointment offer'],
      status: 'OPEN',
      isFeatured: true
    }
  ];

  for (const opp of oppsData) {
    await prisma.opportunity.create({
      data: {
        id: opp.id,
        title: opp.title,
        organizationId: opp.orgId,
        opportunityType: opp.type,
        description: opp.description,
        shortDescription: opp.shortDescription,
        field: JSON.stringify(opp.field),
        subfields: JSON.stringify(opp.subfields),
        location: opp.location,
        country: opp.country,
        remoteStatus: opp.remoteStatus,
        eligibility: JSON.stringify(opp.eligibility),
        educationRequirements: JSON.stringify(opp.educationRequirements),
        experienceRequirements: opp.experienceRequirements,
        funding: opp.funding,
        fundingType: opp.fundingType,
        fundingAmount: opp.fundingAmount,
        benefits: JSON.stringify(opp.benefits),
        duration: opp.duration,
        deadline: opp.deadline,
        startDate: opp.startDate,
        applicationUrl: opp.applicationUrl,
        officialSource: opp.officialSource,
        sourceName: opp.sourceName,
        sourceType: opp.sourceType,
        verificationStatus: 'VERIFIED',
        status: opp.status,
        requirements: JSON.stringify(opp.requirements),
        applicationSteps: JSON.stringify(opp.applicationSteps),
        tags: JSON.stringify(opp.tags),
        isFeatured: opp.isFeatured
      }
    });
  }
  console.log(`🎯 Seeded initial ${oppsData.length} core Opportunities.`);

  // 6. Seed Demo User Applications & Saved
  await prisma.savedOpportunity.create({
    data: {
      userId: demoUser.id,
      opportunityId: 'opp-001'
    }
  });
  await prisma.savedOpportunity.create({
    data: {
      userId: demoUser.id,
      opportunityId: 'opp-005'
    }
  });
  await prisma.savedOpportunity.create({
    data: {
      userId: demoUser.id,
      opportunityId: 'opp-008'
    }
  });

  const app1 = await prisma.trackedApplication.create({
    data: {
      userId: demoUser.id,
      opportunityId: 'opp-001',
      status: 'PREPARING',
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      tasks: {
        create: [
          { label: 'Draft 2-page project proposal on AI Accessibility', completed: true, order: 1 },
          { label: 'Curate portfolio repository links', completed: true, order: 2 },
          { label: 'Request recommendation letter from Professor Davies', completed: false, order: 3 },
          { label: 'Submit final application form', completed: false, order: 4 }
        ]
      },
      notes: {
        create: [
          { content: 'Spoke with last year fellow Maya. She advised emphasizing open-source community impact and reproducible research.' },
          { content: 'Refined proposal title: "Accessible Multi-Modal Interfaces for Visually Impaired Programmers".' }
        ]
      }
    }
  });

  const app2 = await prisma.trackedApplication.create({
    data: {
      userId: demoUser.id,
      opportunityId: 'opp-005',
      status: 'SAVED',
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      tasks: {
        create: [
          { label: 'Update CV with recent PyTorch project benchmark results', completed: false, order: 1 },
          { label: 'Draft 1-page research statement on Large Language Model interpretability', completed: false, order: 2 }
        ]
      },
      notes: {
        create: [
          { content: 'Need to review recent publications from London Google Research lab before writing statement.' }
        ]
      }
    }
  });

  console.log(`📋 Created demo user tracked applications (${app1.id}, ${app2.id})`);

  // 7. Seed Demo Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: 'deadline_reminder',
        title: 'Upcoming Deadline in 3 Weeks',
        message: 'Mozilla Creative Media Fellowship application closes on March 14, 2027.',
        opportunityId: 'opp-001',
        read: false
      },
      {
        userId: demoUser.id,
        type: 'new_match',
        title: 'New High Match: OpenAI Research Fellowship',
        message: 'A 96% match was found based on your background in TypeScript, PyTorch, and HCI.',
        opportunityId: 'opp-008',
        read: false
      },
      {
        userId: demoUser.id,
        type: 'learning_recommendation',
        title: 'Suggested Skill Booster',
        message: 'We noticed you are applying to research fellowships. Check out "Writing Successful Grant Proposals".',
        read: true
      }
    ]
  });

  console.log('🔔 Seeded demo notifications.');
  console.log('✅ ROMEfind Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
