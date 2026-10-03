import { Opportunity, OpportunityType, RemoteStatus, VerificationStatus, ExperienceLevel, EducationLevel } from '@/types/models';

export const opportunities: Opportunity[] = [
  {
    "id": "opp-tech-01",
    "title": "Software Engineering Intern, Summer 2027",
    "organization": {
      "id": "org-google",
      "name": "Google",
      "website": "https://careers.google.com",
      "description": "Global technology leader",
      "type": "Company"
    },
    "type": "Internship",
    "description": "Join Google as a Software Engineering Intern and work on core scalable infrastructure, cloud systems, and user-facing applications impacting billions of users.",
    "shortDescription": "12-week summer software engineering internship for undergraduate and graduate students.",
    "field": [
      "Technology",
      "Software Engineering"
    ],
    "subfields": [
      "Cloud",
      "Systems",
      "Full-Stack"
    ],
    "location": "Global (US, UK, Nigeria, Switzerland, Singapore)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Enrolled in a Bachelor’s, Master’s, or PhD in Computer Science or related technical field",
      "Proficiency in C++, Java, Python, or Go"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Competitive Salary + Housing Stipend",
    "benefits": [
      "Competitive monthly salary",
      "Relocation and housing stipend",
      "1:1 mentorship",
      "Hardware & gear package"
    ],
    "duration": "12-14 weeks",
    "deadline": "2026-12-01",
    "applicationUrl": "https://careers.google.com/students",
    "officialSource": "https://careers.google.com/students",
    "sourceName": "Google Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Software Engineering",
      "Python",
      "Go",
      "Distributed Systems",
      "Cloud"
    ],
    "requirements": [
      "Enrolled in university degree",
      "Data structures and algorithms proficiency"
    ],
    "applicationSteps": [
      "Online application & CV",
      "Technical coding assessment",
      "2 rounds of technical interviews"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-tech-02",
    "title": "Product Design Internship",
    "organization": {
      "id": "org-spotify",
      "name": "Spotify",
      "website": "https://lifeatspotify.com",
      "description": "Audio streaming and media services provider",
      "type": "Company"
    },
    "type": "Internship",
    "description": "Design intuitive, world-class listening and creator experiences across Spotify mobile, desktop, and automotive interfaces with senior design mentors.",
    "shortDescription": "Product design internship focused on UX/UI, user research, and design systems.",
    "field": [
      "Technology",
      "Product Design",
      "UX/UI"
    ],
    "subfields": [
      "User Experience",
      "Interaction Design",
      "Figma"
    ],
    "location": "Stockholm, Sweden / London, UK / New York, USA",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Enrolled in a design-related degree or bootcamp",
      "Portfolio demonstrating end-to-end product thinking"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Monthly Stipend)",
    "benefits": [
      "Competitive monthly salary",
      "Flight & accommodation support for international relocations",
      "Spotify Premium"
    ],
    "duration": "10-12 weeks",
    "deadline": "2026-11-15",
    "applicationUrl": "https://lifeatspotify.com/students",
    "officialSource": "https://lifeatspotify.com/students",
    "sourceName": "Spotify Life",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Product Design",
      "UX/UI",
      "Figma",
      "User Research",
      "Design Systems"
    ],
    "requirements": [
      "Digital portfolio submission required",
      "Returning to studies or recent grad"
    ],
    "applicationSteps": [
      "Portfolio & CV submission",
      "Portfolio walk-through interview",
      "Design challenge presentation"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-tech-03",
    "title": "Meta AI Research Residency",
    "organization": {
      "id": "org-meta",
      "name": "Meta AI",
      "website": "https://ai.meta.com",
      "description": "Artificial Intelligence Research at Meta",
      "type": "Research Institute"
    },
    "type": "Fellowship",
    "description": "A prestigious one-year research training program pairing emerging AI researchers with FAIR scientists to publish cutting-edge machine learning papers.",
    "shortDescription": "1-year AI research training fellowship with top FAIR scientists.",
    "field": [
      "Technology",
      "AI / Machine Learning",
      "Research"
    ],
    "subfields": [
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "LLMs"
    ],
    "location": "Remote (US, UK, France, Global Remote options)",
    "remoteStatus": "Flexible",
    "eligibility": [
      "STEM degree or equivalent practical experience",
      "Strong proficiency in PyTorch/Python",
      "Passion for open-source AI research"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully Funded (Full Research Salary)",
    "benefits": [
      "Competitive full-time salary",
      "Comprehensive healthcare and benefits",
      "Compute resources access",
      "Conference travel grants"
    ],
    "duration": "12 months",
    "deadline": "2027-01-30",
    "applicationUrl": "https://ai.meta.com/join-us/residency/",
    "officialSource": "https://ai.meta.com/join-us/residency/",
    "sourceName": "Meta AI Research",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "AI/ML",
      "PyTorch",
      "Research",
      "Deep Learning",
      "Computer Vision"
    ],
    "requirements": [
      "Coding sample / GitHub",
      "Research statement"
    ],
    "applicationSteps": [
      "Online application",
      "Coding and math assessment",
      "Panel interviews with research scientists"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-tech-04",
    "title": "GitHub Campus Experts Program",
    "organization": {
      "id": "org-github",
      "name": "GitHub",
      "website": "https://github.com",
      "description": "Software collaboration and developer platform",
      "type": "Company"
    },
    "type": "Programme",
    "description": "Global leadership and developer advocacy program empowering student leaders to build inclusive tech communities, organize hackathons, and learn public speaking.",
    "shortDescription": "Leadership program and funding for technical student community builders.",
    "field": [
      "Technology",
      "Software Engineering",
      "Education"
    ],
    "subfields": [
      "Open Source",
      "Community Building",
      "DevRel"
    ],
    "location": "Worldwide / Remote",
    "remoteStatus": "Remote",
    "eligibility": [
      "18+ years old",
      "Enrolled in higher education institution",
      "Active member of a student tech community"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully Funded (Training & Event Grants)",
    "benefits": [
      "GitHub Swag & Event Sponsorship funding",
      "Exclusive mentorship from GitHub engineers",
      "Travel grants to major GitHub conferences"
    ],
    "duration": "6-12 months",
    "deadline": "2027-02-28",
    "applicationUrl": "https://githubcampus.expert/",
    "officialSource": "https://githubcampus.expert/",
    "sourceName": "GitHub Education",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Community",
      "Open Source",
      "Git",
      "Leadership",
      "Public Speaking"
    ],
    "requirements": [
      "Community leadership essay",
      "Video submission"
    ],
    "applicationSteps": [
      "Application submission",
      "Community training module",
      "Graduation presentation"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-tech-05",
    "title": "Stripe Early Career Software Engineer (EMEA / Remote)",
    "organization": {
      "id": "org-stripe",
      "name": "Stripe",
      "website": "https://stripe.com",
      "description": "Financial infrastructure for the internet",
      "type": "Company"
    },
    "type": "Job",
    "description": "Build economic infrastructure for the internet. Work on payment rails, fraud detection, billing APIs, and developer-first financial tools.",
    "shortDescription": "Full-time software engineering role for early career engineers in EMEA and remote.",
    "field": [
      "Technology",
      "Software Engineering",
      "Finance"
    ],
    "subfields": [
      "Backend",
      "APIs",
      "Distributed Systems"
    ],
    "location": "Dublin, Ireland / London, UK / Remote (EMEA)",
    "remoteStatus": "Remote",
    "eligibility": [
      "0-2 years of software engineering experience",
      "Strong foundations in algorithms and systems design"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (High Base Salary + Equity)",
    "benefits": [
      "Top-tier competitive base salary",
      "Equity grant (RSUs)",
      "Home office setup stipend",
      "Wellness & learning budget"
    ],
    "duration": "Full-time",
    "deadline": "2026-11-30",
    "applicationUrl": "https://stripe.com/jobs/early-career",
    "officialSource": "https://stripe.com/jobs/early-career",
    "sourceName": "Stripe Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Backend",
      "Ruby",
      "Java",
      "Distributed Systems",
      "Fintech"
    ],
    "requirements": [
      "CV",
      "Technical interview clearance"
    ],
    "applicationSteps": [
      "Recruiter screen",
      "Take-home / pair programming interview",
      "System architecture & values rounds"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-tech-06",
    "title": "Apple Design Fellowship & Internship",
    "organization": {
      "id": "org-apple",
      "name": "Apple",
      "website": "https://www.apple.com",
      "description": "Consumer electronics and software company",
      "type": "Company"
    },
    "type": "Internship",
    "description": "Collaborate with Apple Human Interface and Industrial Design teams in Cupertino on next-generation iOS, macOS, watchOS and visionOS human experiences.",
    "shortDescription": "UI/UX and interactive design internship at Apple Design Studio in Cupertino.",
    "field": [
      "Technology",
      "Product Design",
      "UX/UI"
    ],
    "subfields": [
      "Human Interface",
      "Interaction Design",
      "3D Prototyping"
    ],
    "location": "Cupertino, CA, USA",
    "remoteStatus": "In-person",
    "eligibility": [
      "Enrolled in undergraduate or graduate design program",
      "Exceptional portfolio of digital interface and interaction design"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid ($50+/hr + Housing)",
    "benefits": [
      "Top compensation",
      "Corporate housing in Silicon Valley",
      "Relocation travel",
      "Employee hardware discounts"
    ],
    "duration": "12-16 weeks",
    "deadline": "2026-12-15",
    "applicationUrl": "https://jobs.apple.com/en-us/search?team=internships",
    "officialSource": "https://jobs.apple.com/en-us/search?team=internships",
    "sourceName": "Apple Jobs",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Apple",
      "UX/UI",
      "Product Design",
      "Human Interface",
      "Cupertino"
    ],
    "requirements": [
      "Interactive design portfolio",
      "CV",
      "Design case study"
    ],
    "applicationSteps": [
      "Portfolio screening",
      "Design team interview",
      "Executive design review presentation"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-tech-07",
    "title": "OpenAI Residency Program",
    "organization": {
      "id": "org-openai",
      "name": "OpenAI",
      "website": "https://openai.com",
      "description": "AI research and deployment company",
      "type": "Research Institute"
    },
    "type": "Fellowship",
    "description": "A 6-month full-time paid pathway for exceptional researchers and engineers from non-traditional AI backgrounds to transition into frontier AI alignment and capability research.",
    "shortDescription": "6-month full-time research residency at OpenAI in San Francisco.",
    "field": [
      "Technology",
      "AI / Machine Learning",
      "Research"
    ],
    "subfields": [
      "LLMs",
      "Reinforcement Learning",
      "AI Safety"
    ],
    "location": "San Francisco, CA, USA",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Strong foundation in mathematics, physics, or software engineering",
      "Desire to specialize in frontier deep learning"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD",
      "Any"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Paid ($210,000/yr annualized + Benefits)",
    "benefits": [
      "Full annual salary rate of $210,000 prorated",
      "Health insurance",
      "Compute cluster access",
      "Conversion opportunity to Full-Time Member of Technical Staff"
    ],
    "duration": "6 months",
    "deadline": "2027-01-15",
    "applicationUrl": "https://openai.com/careers/residency",
    "officialSource": "https://openai.com/careers/residency",
    "sourceName": "OpenAI Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "AI",
      "OpenAI",
      "Deep Learning",
      "San Francisco",
      "Machine Learning"
    ],
    "requirements": [
      "Technical assessment",
      "Code repository",
      "Research statement"
    ],
    "applicationSteps": [
      "Application submission",
      "Take-home coding exam",
      "Technical interviews with research scientists"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-biz-01",
    "title": "Y Combinator Startup Accelerator (Batch S27)",
    "organization": {
      "id": "org-yc",
      "name": "Y Combinator",
      "website": "https://www.ycombinator.com",
      "description": "Leading technology startup accelerator",
      "type": "Accelerator"
    },
    "type": "Programme",
    "description": "Twice a year Y Combinator invests $500,000 in early-stage startups across AI, software, climate, biotech, fintech, and hard tech, working intensively with founders to achieve product-market fit.",
    "shortDescription": "Premier 3-month startup accelerator investing $500k in early-stage founders.",
    "field": [
      "Business",
      "Entrepreneurship",
      "Technology"
    ],
    "subfields": [
      "Venture Capital",
      "Startups",
      "Product Management"
    ],
    "location": "San Francisco, CA, USA",
    "remoteStatus": "In-person",
    "eligibility": [
      "Founding teams with a working prototype or validated concept",
      "Founders willing to spend 3 months in SF"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "$500,000 Investment ($125k for 7% + $375k MFN SAFE)",
    "benefits": [
      "Direct mentorship from Garry Tan and group partners",
      "Access to Bookface alumni network of 9,000+ founders",
      "Demo Day presentation to global top VCs"
    ],
    "duration": "3 months",
    "deadline": "2027-02-15",
    "applicationUrl": "https://www.ycombinator.com/apply",
    "officialSource": "https://www.ycombinator.com/apply",
    "sourceName": "Y Combinator",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Startups",
      "Venture Capital",
      "Entrepreneurship",
      "Product"
    ],
    "requirements": [
      "Written application",
      "1-minute founder intro video"
    ],
    "applicationSteps": [
      "Written application",
      "10-minute partner interview",
      "Same-day investment decision"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-biz-02",
    "title": "McKinsey & Company Business Analyst",
    "organization": {
      "id": "org-mckinsey",
      "name": "McKinsey & Company",
      "website": "https://www.mckinsey.com",
      "description": "Global management consulting firm",
      "type": "Company"
    },
    "type": "Job",
    "description": "Work alongside leadership teams of Fortune 500 corporations, governments, and non-profits on strategic transformations, operational restructuring, and market entry.",
    "shortDescription": "Full-time management consulting analyst role for graduating students and early career talent.",
    "field": [
      "Business",
      "Finance",
      "Strategy"
    ],
    "subfields": [
      "Management Consulting",
      "Operations",
      "Corporate Finance"
    ],
    "location": "Global (Lagos, London, New York, Johannesburg, Nairobi, Dubai)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Bachelor’s or Master’s degree in any discipline",
      "Demonstrated problem-solving and leadership skills"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Competitive Consulting Salary)",
    "benefits": [
      "Top management consulting compensation",
      "Global office rotation opportunities",
      "Full MBA sponsorship support"
    ],
    "duration": "Full-time",
    "deadline": "2026-10-30",
    "applicationUrl": "https://www.mckinsey.com/careers/students",
    "officialSource": "https://www.mckinsey.com/careers/students",
    "sourceName": "McKinsey Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Consulting",
      "Strategy",
      "Analytics",
      "Finance",
      "Leadership"
    ],
    "requirements": [
      "Academic transcript",
      "CV with leadership credentials"
    ],
    "applicationSteps": [
      "Solve digital assessment (Solve game)",
      "First round case interview",
      "Final partner case & fit interviews"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-biz-03",
    "title": "Endeavor Global Entrepreneur Fellowship",
    "organization": {
      "id": "org-endeavor",
      "name": "Endeavor",
      "website": "https://endeavor.org",
      "description": "Global community of high-impact entrepreneurs",
      "type": "Non-Profit"
    },
    "type": "Fellowship",
    "description": "Supports high-impact founders in emerging and underserved markets (Africa, Latin America, Southeast Asia, Middle East) to scale rapidly with access to global capital and mentor networks.",
    "shortDescription": "High-impact entrepreneurship fellowship supporting scale-up founders across emerging markets.",
    "field": [
      "Business",
      "Entrepreneurship",
      "Social Impact"
    ],
    "subfields": [
      "Scaleups",
      "Venture Capital",
      "Emerging Markets"
    ],
    "location": "Global (Nigeria, Kenya, South Africa, Brazil, Mexico, Indonesia)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Founder of a high-growth tech or tech-enabled business",
      "Demonstrated market traction ($500k+ ARR or major scale)"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Experienced professional",
    "funding": "Funded (Capital Access & Advisory)",
    "benefits": [
      "Direct access to Endeavor Catalyst fund co-investments",
      "Mentorship from global unicorn founders",
      "Executive education programs at Harvard & Stanford"
    ],
    "duration": "Ongoing / Lifetime network",
    "deadline": "2027-03-31",
    "applicationUrl": "https://endeavor.org/apply/",
    "officialSource": "https://endeavor.org/apply/",
    "sourceName": "Endeavor Global",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Startups",
      "Venture Capital",
      "Africa",
      "LatAm",
      "High Impact"
    ],
    "requirements": [
      "Financial statements",
      "Pitch deck",
      "Founder background profile"
    ],
    "applicationSteps": [
      "Local selection panel",
      "International selection panel (ISP)",
      "Onboarding into global network"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-biz-04",
    "title": "Goldman Sachs Global Summer Analyst Programme",
    "organization": {
      "id": "org-gs",
      "name": "Goldman Sachs",
      "website": "https://www.goldmansachs.com",
      "description": "Global investment banking and securities firm",
      "type": "Company"
    },
    "type": "Internship",
    "description": "A 10-week summer internship for undergraduate and graduate students in Investment Banking, Global Markets, Asset Management, or Engineering.",
    "shortDescription": "10-week summer investment banking and financial markets analyst internship.",
    "field": [
      "Business",
      "Finance",
      "Strategy"
    ],
    "subfields": [
      "Investment Banking",
      "Asset Management",
      "Financial Modeling"
    ],
    "location": "London, UK / New York, USA / Singapore / Hong Kong",
    "remoteStatus": "In-person",
    "eligibility": [
      "Undergraduate student in penultimate year of study",
      "Strong analytical, quantitative, and interpersonal communication skills"
    ],
    "educationRequirements": [
      "Undergraduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Prorated Full Analyst Salary)",
    "benefits": [
      "Competitive Wall Street / City of London compensation",
      "Direct pipeline to full-time graduate offer",
      "Executive speaker series"
    ],
    "duration": "10 weeks",
    "deadline": "2026-11-20",
    "applicationUrl": "https://www.goldmansachs.com/careers/students/programs/",
    "officialSource": "https://www.goldmansachs.com/careers/students/programs/",
    "sourceName": "Goldman Sachs Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Finance",
      "Investment Banking",
      "Wall Street",
      "London",
      "Markets"
    ],
    "requirements": [
      "CV",
      "Cover letter",
      "Online numerical reasoning assessment"
    ],
    "applicationSteps": [
      "HireVue video interview",
      "Superday panel interviews",
      "Offer"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-sch-01",
    "title": "Chevening Scholarship (UK Master’s)",
    "organization": {
      "id": "org-chevening",
      "name": "UK Foreign, Commonwealth & Development Office",
      "website": "https://www.chevening.org",
      "description": "UK Government Global Scholarship Programme",
      "type": "Government"
    },
    "type": "Scholarship",
    "description": "Fully funded scholarship to undertake any one-year master’s course at any UK university for emerging global leaders with leadership potential.",
    "shortDescription": "Prestigious, fully funded UK master’s scholarship covering tuition, flights, and monthly living stipend.",
    "field": [
      "Research",
      "Policy",
      "Law",
      "Business",
      "Social Impact"
    ],
    "subfields": [
      "Public Policy",
      "International Development",
      "Economics",
      "All Disciplines"
    ],
    "location": "United Kingdom (Any UK University)",
    "remoteStatus": "In-person",
    "eligibility": [
      "Citizen of a Chevening-eligible country (160+ countries including Nigeria, Kenya, Ghana, India, etc.)",
      "Minimum 2 years of work experience",
      "Completed undergraduate degree with 2:1 or equivalent"
    ],
    "educationRequirements": [
      "Undergraduate"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Fully funded",
    "benefits": [
      "Full university tuition fees paid directly",
      "Monthly living stipend",
      "Round-trip economy flights to the UK",
      "Arrival and visa allowances"
    ],
    "duration": "12 months",
    "deadline": "2026-11-05",
    "applicationUrl": "https://www.chevening.org/apply",
    "officialSource": "https://www.chevening.org/apply",
    "sourceName": "Chevening UK",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Scholarship",
      "UK",
      "Master’s",
      "Fully Funded",
      "Leadership"
    ],
    "requirements": [
      "4 essays on leadership, networking, studying in UK, and career plans",
      "Two references",
      "Degree transcript"
    ],
    "applicationSteps": [
      "Online application submission",
      "Longlist review by independent reading committee",
      "In-person British Embassy interview",
      "Final conditional award"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-sch-02",
    "title": "Schwarzman Scholars at Tsinghua University",
    "organization": {
      "id": "org-schwarzman",
      "name": "Schwarzman College",
      "website": "https://www.schwarzmanscholars.org",
      "description": "Global leadership master’s program in Beijing",
      "type": "University"
    },
    "type": "Scholarship",
    "description": "A fully funded one-year Master of Global Affairs at Tsinghua University in Beijing designed to build understanding between China and the rest of the world.",
    "shortDescription": "Fully funded 1-year master’s in Global Affairs at Tsinghua University in Beijing.",
    "field": [
      "Policy",
      "Business",
      "Research",
      "International Relations"
    ],
    "subfields": [
      "Geopolitics",
      "Global Economics",
      "Public Leadership"
    ],
    "location": "Beijing, China",
    "remoteStatus": "In-person",
    "eligibility": [
      "Completed undergraduate degree by matriculation",
      "Age 18–28 at start of program",
      "Demonstrated exceptional leadership and academic excellence"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded",
    "benefits": [
      "Full tuition and mandatory fees",
      "Room and board on Tsinghua campus",
      "Round-trip travel to Beijing",
      "In-country study tours",
      "Health insurance and laptop stipend"
    ],
    "duration": "1 year",
    "deadline": "2026-09-15",
    "applicationUrl": "https://www.schwarzmanscholars.org/admissions/",
    "officialSource": "https://www.schwarzmanscholars.org/admissions/",
    "sourceName": "Schwarzman College",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "China",
      "Global Affairs",
      "Scholarship",
      "Fully Funded",
      "Leadership"
    ],
    "requirements": [
      "Leadership essay",
      "Statement of purpose",
      "3 letters of recommendation",
      "Video intro"
    ],
    "applicationSteps": [
      "Online portal submission",
      "Global panel interview (London/Singapore/New York)",
      "Cohort selection"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-sch-03",
    "title": "Rhodes Scholarship at Oxford University",
    "organization": {
      "id": "org-rhodes",
      "name": "Rhodes Trust",
      "website": "https://www.rhodeshouse.ox.ac.uk",
      "description": "Oldest graduate scholarship program in the world",
      "type": "University"
    },
    "type": "Scholarship",
    "description": "Postgraduate awards supporting exceptional young people from around the world to study any postgraduate degree at the University of Oxford.",
    "shortDescription": "The world’s oldest and most prestigious graduate scholarship to study at Oxford University.",
    "field": [
      "Research",
      "Science",
      "Law",
      "Policy",
      "Creative"
    ],
    "subfields": [
      "All Oxford Postgraduate Fields"
    ],
    "location": "Oxford, United Kingdom",
    "remoteStatus": "In-person",
    "eligibility": [
      "Citizen of a designated Rhodes constituency (including West Africa, East Africa, India, USA, Global)",
      "Completed Bachelor’s degree with First Class / high 2:1",
      "Age between 18 and 25 (or up to 27 for advanced degrees)"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded",
    "benefits": [
      "All Oxford University and college fees",
      "Generous annual living stipend (£19,000+)",
      "Economy flights to and from UK",
      "Tier 4 Visa and health surcharge paid"
    ],
    "duration": "2-3 years",
    "deadline": "2026-10-01",
    "applicationUrl": "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/",
    "officialSource": "https://www.rhodeshouse.ox.ac.uk/scholarships/applications/",
    "sourceName": "Rhodes Trust",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Oxford",
      "Scholarship",
      "Fully Funded",
      "Research",
      "UK"
    ],
    "requirements": [
      "Academic transcripts",
      "Personal statement",
      "4 to 6 recommendation letters"
    ],
    "applicationSteps": [
      "Constituency online application",
      "National selection committee interview",
      "Final Oxford college acceptance"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-sch-04",
    "title": "Fulbright Foreign Student Program (United States)",
    "organization": {
      "id": "org-fulbright",
      "name": "US Department of State (ECA)",
      "website": "https://foreign.fulbrightonline.org",
      "description": "US Flagship International Educational Exchange Program",
      "type": "Government"
    },
    "type": "Scholarship",
    "description": "Enables graduate students, young professionals and artists from abroad to conduct master’s degree study or PhD research at accredited universities across the United States.",
    "shortDescription": "Flagship US government scholarship for international graduate study and research.",
    "field": [
      "Research",
      "Science",
      "Engineering",
      "Creative",
      "Social Impact"
    ],
    "subfields": [
      "STEM",
      "Humanities",
      "Public Policy",
      "Arts"
    ],
    "location": "United States (All US Universities)",
    "remoteStatus": "In-person",
    "eligibility": [
      "Non-US citizen residing in home country during application",
      "Completed undergraduate degree with strong academic record",
      "English language proficiency (TOEFL/GRE supported)"
    ],
    "educationRequirements": [
      "Undergraduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded",
    "benefits": [
      "Full tuition and institutional fees",
      "Monthly living stipend",
      "J-1 Visa sponsorship & health benefit plan",
      "Roundtrip airfare to USA"
    ],
    "duration": "1-2 years",
    "deadline": "2027-04-30",
    "applicationUrl": "https://foreign.fulbrightonline.org/",
    "officialSource": "https://foreign.fulbrightonline.org/",
    "sourceName": "Fulbright US State Dept",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "USA",
      "Master’s",
      "Fulbright",
      "Fully Funded",
      "Research"
    ],
    "requirements": [
      "Study/research objective essay",
      "Personal statement",
      "3 references"
    ],
    "applicationSteps": [
      "Embassy / Commission submission",
      "Interview by binational selection panel",
      "US university placement matching"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-sch-05",
    "title": "Gates Cambridge Scholarship",
    "organization": {
      "id": "org-gates-cambridge",
      "name": "Bill & Melinda Gates Foundation / University of Cambridge",
      "website": "https://www.gatescambridge.org",
      "description": "Global postgraduate scholarship at Cambridge",
      "type": "University"
    },
    "type": "Scholarship",
    "description": "Fully funded postgraduate scholarships for outstanding applicants from countries outside the UK to pursue a full-time PhD or Master’s in any subject at Cambridge University.",
    "shortDescription": "Prestigious full-cost postgraduate scholarship at the University of Cambridge.",
    "field": [
      "Research",
      "Science",
      "Engineering",
      "Social Impact",
      "Policy"
    ],
    "subfields": [
      "All Cambridge Graduate Courses"
    ],
    "location": "Cambridge, United Kingdom",
    "remoteStatus": "In-person",
    "eligibility": [
      "Citizen of any country outside the United Kingdom",
      "Applying to pursue a full-time Master’s or PhD at Cambridge",
      "Outstanding intellectual ability & commitment to improving the lives of others"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded (£45,000+/year)",
    "benefits": [
      "Full Cambridge University composition fee",
      "Maintenance allowance of £20,000 per annum",
      "Roundtrip airfare",
      "Inbound visa & health surcharge costs",
      "Academic development funding up to £2,000"
    ],
    "duration": "1-4 years",
    "deadline": "2026-12-05",
    "applicationUrl": "https://www.gatescambridge.org/apply/",
    "officialSource": "https://www.gatescambridge.org/apply/",
    "sourceName": "Gates Cambridge Trust",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Cambridge",
      "Scholarship",
      "Fully Funded",
      "PhD",
      "Master’s"
    ],
    "requirements": [
      "Gates Cambridge statement (500 words)",
      "Research proposal",
      "Reference letters"
    ],
    "applicationSteps": [
      "Cambridge graduate application with Gates section",
      "Departmental ranking",
      "Trust selection interview"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-crt-01",
    "title": "Adobe Creative Residency Community Fund",
    "organization": {
      "id": "org-adobe",
      "name": "Adobe",
      "website": "https://www.adobe.com",
      "description": "Digital media and creative software company",
      "type": "Company"
    },
    "type": "Grant",
    "description": "Direct micro-grants and creative project funding for independent visual artists, UI/UX designers, illustrators, motion artists, and photographers worldwide to fund personal passion projects.",
    "shortDescription": "Grants of $5,000–$10,000 and Adobe CC licenses for independent visual and digital creators.",
    "field": [
      "Creative",
      "Product Design",
      "Media"
    ],
    "subfields": [
      "Digital Illustration",
      "UI/UX Design",
      "Animation",
      "Photography"
    ],
    "location": "Worldwide (100% Remote)",
    "remoteStatus": "Remote",
    "eligibility": [
      "18+ visual creators and designers",
      "Portfolio showcasing original digital work",
      "Creative proposal for a self-initiated project"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Grant ($5,000 - $10,000 USD)",
    "benefits": [
      "Direct cash grant funding ($5k–$10k)",
      "Full 1-year Adobe Creative Cloud All Apps membership",
      "Global feature on Adobe Creative channels"
    ],
    "duration": "Project-based (3-6 months)",
    "deadline": "2026-12-31",
    "applicationUrl": "https://www.adobe.com/about-adobe/creative-residency.html",
    "officialSource": "https://www.adobe.com/about-adobe/creative-residency.html",
    "sourceName": "Adobe Creative Community",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Creative",
      "Design",
      "Grants",
      "Remote",
      "Visual Arts"
    ],
    "requirements": [
      "Project pitch document",
      "Online portfolio link",
      "Budget breakdown"
    ],
    "applicationSteps": [
      "Online application form",
      "Review by Adobe Design Curators",
      "Direct grant disbursement"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-crt-02",
    "title": "Pentagram Design Fellowship",
    "organization": {
      "id": "org-pentagram",
      "name": "Pentagram",
      "website": "https://www.pentagram.com",
      "description": "World’s largest independently owned design studio",
      "type": "Company"
    },
    "type": "Fellowship",
    "description": "Intensive 6-month fellowship working directly in a partner-led team on brand identities, editorial design, environmental graphics, and digital design systems.",
    "shortDescription": "6-month paid design fellowship at world-renowned design consultancy Pentagram.",
    "field": [
      "Creative",
      "Product Design",
      "Media"
    ],
    "subfields": [
      "Brand Identity",
      "Typography",
      "Graphic Design"
    ],
    "location": "London, UK / New York, USA / Austin, TX",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Recent design graduates or early-career designers with strong typography and visual craft"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Full Junior Designer Salary)",
    "benefits": [
      "Competitive living salary",
      "Direct mentorship from Pentagram partners",
      "High-profile client portfolio pieces"
    ],
    "duration": "6 months",
    "deadline": "2026-11-30",
    "applicationUrl": "https://www.pentagram.com/about/careers",
    "officialSource": "https://www.pentagram.com/about/careers",
    "sourceName": "Pentagram Design",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Branding",
      "Typography",
      "Graphic Design",
      "London",
      "New York"
    ],
    "requirements": [
      "Curated PDF portfolio",
      "Cover letter explaining design philosophy"
    ],
    "applicationSteps": [
      "Portfolio review by partner team",
      "Video design walkthrough interview",
      "Offer"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-crt-03",
    "title": "D&AD New Blood Awards & Academy",
    "organization": {
      "id": "org-dand",
      "name": "D&AD (Design and Art Direction)",
      "website": "https://www.dandad.org",
      "description": "Global design and advertising non-profit association",
      "type": "Non-Profit"
    },
    "type": "Competition",
    "description": "Global creative competition offering aspiring designers, copywriters, and art directors real-world briefs from brands like BBC, Google, and Duolingo with entry into the D&AD New Blood Academy.",
    "shortDescription": "World-leading creative awards competition and academy for emerging design talent.",
    "field": [
      "Creative",
      "Product Design",
      "Media",
      "Marketing"
    ],
    "subfields": [
      "Art Direction",
      "Copywriting",
      "Brand Strategy",
      "Motion Design"
    ],
    "location": "Worldwide / London In-Person Academy",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Students or recent graduates within 2 years of study",
      "Non-professionals aged 18+"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Prizes & Academy Sponsorship",
    "benefits": [
      "D&AD Wooden/Yellow/Black Pencil trophy recognition",
      "Free spot at D&AD New Blood Academy creative bootcamp",
      "Direct recruitment showcases with global agency heads"
    ],
    "duration": "Competition (3 months) + 2-week Academy",
    "deadline": "2027-03-20",
    "applicationUrl": "https://www.dandad.org/en/d-ad-new-blood-awards/",
    "officialSource": "https://www.dandad.org/en/d-ad-new-blood-awards/",
    "sourceName": "D&AD Awards",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Creative",
      "Advertising",
      "Design",
      "Pencil",
      "London"
    ],
    "requirements": [
      "Campaign submission per official brand brief PDF",
      "Presentation board and video"
    ],
    "applicationSteps": [
      "Brief selection and creation",
      "Digital board submission",
      "Global creative jury review"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-sci-01",
    "title": "CERN Summer Student Programme",
    "organization": {
      "id": "org-cern",
      "name": "CERN (European Organization for Nuclear Research)",
      "website": "https://careers.cern",
      "description": "World’s premier particle physics laboratory",
      "type": "Research Institute"
    },
    "type": "Internship",
    "description": "Join day-to-day experimental research at the Large Hadron Collider in Geneva. Work on detector hardware, distributed computing, robotics, or high-energy physics data analysis.",
    "shortDescription": "Summer physics and engineering research internship at CERN Large Hadron Collider in Geneva.",
    "field": [
      "Engineering",
      "Science",
      "Technology"
    ],
    "subfields": [
      "Applied Physics",
      "Data Engineering",
      "Hardware & Robotics"
    ],
    "location": "Geneva, Switzerland",
    "remoteStatus": "In-person",
    "eligibility": [
      "Enrolled in Bachelor’s or Master’s degree in Physics, Computing, Engineering or Mathematics",
      "Completed at least 3 years of full-time university studies"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded",
    "benefits": [
      "Daily living allowance of 90 CHF per day (tax-free)",
      "Comprehensive health insurance assistance",
      "Roundtrip travel allowance",
      "On-site housing assistance"
    ],
    "duration": "8-13 weeks",
    "deadline": "2027-01-31",
    "applicationUrl": "https://careers.cern/summer",
    "officialSource": "https://careers.cern/summer",
    "sourceName": "CERN Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Physics",
      "Engineering",
      "Switzerland",
      "Geneva",
      "Computing"
    ],
    "requirements": [
      "Academic transcripts",
      "CV in English/French",
      "2 academic reference letters"
    ],
    "applicationSteps": [
      "Online application portal",
      "Review by CERN scientific committee",
      "Project placement offer"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-sci-02",
    "title": "Africa Prize for Engineering Innovation",
    "organization": {
      "id": "org-raeng",
      "name": "Royal Academy of Engineering",
      "website": "https://raeng.org.uk",
      "description": "UK national academy for engineering and innovation",
      "type": "Non-Profit"
    },
    "type": "Competition",
    "description": "Africa’s biggest prize dedicated to engineering innovation, supporting African inventors and engineering entrepreneurs with 8 months of tailored business acceleration, mentoring, and £60,000+ in prize funding.",
    "shortDescription": "Engineering innovation competition and accelerator with £60k in equity-free prize funding.",
    "field": [
      "Engineering",
      "Entrepreneurship",
      "Agriculture",
      "Energy"
    ],
    "subfields": [
      "Clean Energy",
      "AgriTech",
      "Hardware",
      "Water Sanitation"
    ],
    "location": "Sub-Saharan Africa (All countries) / London Showcase",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Citizen of a country within Sub-Saharan Africa",
      "Engineering innovation addressing a local socio-economic challenge",
      "Proven engineering prototype"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Grant & Prize (£25,000 First Prize + £10,000 Runners-Up)",
    "benefits": [
      "8 months tailored business acceleration and media training",
      "1:1 mentorship from top UK and African engineering leaders",
      "Equity-free cash prizes"
    ],
    "duration": "8 months",
    "deadline": "2027-01-15",
    "applicationUrl": "https://www.raeng.org.uk/programmes-and-prizes/programmes/international-programmes/africa-prize",
    "officialSource": "https://www.raeng.org.uk/programmes-and-prizes/programmes/international-programmes/africa-prize",
    "sourceName": "Royal Academy of Engineering",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Africa",
      "Engineering",
      "Innovation",
      "Prize",
      "AgriTech"
    ],
    "requirements": [
      "Engineering IP description",
      "Video demonstration of working prototype",
      "Business model canvas"
    ],
    "applicationSteps": [
      "Online submission",
      "Technical due diligence",
      "Shortlist pitch to judging panel"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-sci-03",
    "title": "European Space Agency (ESA) Student Traineeship",
    "organization": {
      "id": "org-esa",
      "name": "European Space Agency",
      "website": "https://www.esa.int",
      "description": "Europe’s gateway to space exploration",
      "type": "International Organization"
    },
    "type": "Internship",
    "description": "Student internships at ESA establishments (ESTEC, ESOC, EAC) working on satellite telecommunications, Earth observation data, rocket propulsion, or planetary science.",
    "shortDescription": "Paid 3 to 6-month aerospace and engineering traineeship at ESA centres across Europe.",
    "field": [
      "Engineering",
      "Science",
      "Technology"
    ],
    "subfields": [
      "Aerospace",
      "Satellite Systems",
      "Astrophysics"
    ],
    "location": "Noordwijk, Netherlands / Darmstadt, Germany / Paris, France",
    "remoteStatus": "In-person",
    "eligibility": [
      "Citizen of an ESA Member State or Cooperating State",
      "Enrolled in final two years of a Master’s degree in STEM"
    ],
    "educationRequirements": [
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (€800–€1,200/mo allowance)",
    "benefits": [
      "Monthly living allowance",
      "Relocation travel costs coverage",
      "Access to European space testing facilities"
    ],
    "duration": "3-6 months",
    "deadline": "2026-11-30",
    "applicationUrl": "https://www.esa.int/About_Us/Careers_at_ESA/Student_Internships",
    "officialSource": "https://www.esa.int/About_Us/Careers_at_ESA/Student_Internships",
    "sourceName": "ESA Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Space",
      "Aerospace",
      "Engineering",
      "Europe",
      "Satellite"
    ],
    "requirements": [
      "CV in Europass format",
      "Cover letter detailing scientific interest",
      "Transcript of university grades"
    ],
    "applicationSteps": [
      "Online application",
      "Technical interview with lead flight/space systems engineer"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-soc-01",
    "title": "UN Young Professionals Programme (YPP)",
    "organization": {
      "id": "org-un",
      "name": "United Nations Secretariat",
      "website": "https://careers.un.org",
      "description": "International intergovernmental organization",
      "type": "International Organization"
    },
    "type": "Job",
    "description": "Premier recruitment pathway for talented, highly qualified early-career professionals to start an international diplomatic civil service career with the United Nations Secretariat.",
    "shortDescription": "Official entry examination for early-career diplomatic and professional civil service roles at the UN.",
    "field": [
      "Social Impact",
      "Policy",
      "International Relations"
    ],
    "subfields": [
      "Multilateral Diplomacy",
      "Human Rights",
      "Global Governance"
    ],
    "location": "Global (New York, Geneva, Nairobi, Vienna, Addis Ababa, Bangkok)",
    "remoteStatus": "In-person",
    "eligibility": [
      "Nationality of a participating UN Member State for the exam year",
      "Hold at least a Bachelor’s degree in relevant subject area",
      "Age 32 or younger in the year of examination",
      "Fluency in English or French"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (UN P-1/P-2 International Salary & Expatriate Benefits)",
    "benefits": [
      "International civil servant salary (P-1/P-2 grade, tax-exempt)",
      "Post adjustment allowance",
      "Relocation and dependency grants",
      "Diplomatic mobility"
    ],
    "duration": "Full-time / Permanent career track",
    "deadline": "2027-02-28",
    "applicationUrl": "https://careers.un.org/ypp",
    "officialSource": "https://careers.un.org/ypp",
    "sourceName": "United Nations Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "United Nations",
      "Diplomacy",
      "International Relations",
      "Civil Service"
    ],
    "requirements": [
      "Passport verification",
      "Degree certificate",
      "Language proficiency"
    ],
    "applicationSteps": [
      "Inspira online application",
      "Online proctored substantive exam",
      "Structured competency-based interview",
      "Placement on UN Roster"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-soc-02",
    "title": "Atlas Corps Fellowship for Global Leaders",
    "organization": {
      "id": "org-atlas-corps",
      "name": "Atlas Corps",
      "website": "https://atlascorps.org",
      "description": "Global leadership development organization",
      "type": "Non-Profit"
    },
    "type": "Fellowship",
    "description": "12-month professional fellowship placing emerging social change leaders from around the world at top US non-profits, foundations, and social enterprises in Washington DC and New York.",
    "shortDescription": "12-month fully funded professional fellowship in the US for global social impact leaders.",
    "field": [
      "Social Impact",
      "Policy",
      "Education"
    ],
    "subfields": [
      "Non-Profit Management",
      "Youth Empowerment",
      "Community Development"
    ],
    "location": "Washington, DC / New York, USA / Remote",
    "remoteStatus": "Flexible",
    "eligibility": [
      "2-10 years of professional social sector experience",
      "Bachelor’s degree or equivalent",
      "English proficiency",
      "Age 22–35"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Fully funded",
    "benefits": [
      "Monthly living stipend covering food and housing",
      "J-1 Visa sponsorship and US flight costs",
      "Comprehensive health insurance",
      "Global Leadership Lab training certificate"
    ],
    "duration": "12 months",
    "deadline": "2026-11-30",
    "applicationUrl": "https://atlascorps.org/apply/",
    "officialSource": "https://atlascorps.org/apply/",
    "sourceName": "Atlas Corps",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Social Impact",
      "Fellowship",
      "USA",
      "Fully Funded",
      "Leadership"
    ],
    "requirements": [
      "CV",
      "Two recommendation letters",
      "English test scores or transcript"
    ],
    "applicationSteps": [
      "Short application",
      "Long-form application & essays",
      "Semi-finalist interview",
      "Host organization matching interview"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-soc-03",
    "title": "African Development Bank Young Professionals Program",
    "organization": {
      "id": "org-afdb",
      "name": "African Development Bank (AfDB)",
      "website": "https://www.afdb.org",
      "description": "Premier regional multilateral development finance institution in Africa",
      "type": "International Organization"
    },
    "type": "Programme",
    "description": "3-year leadership development track providing young African professionals with operational assignments in sovereign infrastructure finance, energy transition, climate, and macroeconomic policy.",
    "shortDescription": "3-year early career multilateral development leadership program based in Abidjan.",
    "field": [
      "Social Impact",
      "Finance",
      "Policy",
      "Energy"
    ],
    "subfields": [
      "Development Economics",
      "Sovereign Debt",
      "Infrastructure Financing"
    ],
    "location": "Abidjan, Côte d’Ivoire & Regional Country Hubs",
    "remoteStatus": "In-person",
    "eligibility": [
      "Citizen of an AfDB member country",
      "32 years of age or younger",
      "Master’s degree or equivalent in Economics, Finance, Engineering, or Social Sciences",
      "Minimum 3 years relevant experience"
    ],
    "educationRequirements": [
      "Graduate"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Paid (International Grade PL-6 Expatriate Salary)",
    "benefits": [
      "Tax-free international salary",
      "Full diplomatic health and retirement pension",
      "Housing and education allowance support",
      "Annual home country leave flight"
    ],
    "duration": "3 years (leads to permanent staff appointment)",
    "deadline": "2027-01-20",
    "applicationUrl": "https://www.afdb.org/en/about-us/careers/young-professionals-program-ypp",
    "officialSource": "https://www.afdb.org/en/about-us/careers/young-professionals-program-ypp",
    "sourceName": "AfDB Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Africa",
      "Development Finance",
      "AfDB",
      "Economics",
      "Abidjan"
    ],
    "requirements": [
      "Master’s diploma",
      "CV in English or French",
      "Statement of purpose"
    ],
    "applicationSteps": [
      "Online application",
      "Comprehensive psychometric and technical assessment",
      "Assessment centre in Abidjan"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-law-01",
    "title": "World Bank Legal Vice Presidency Internship Program",
    "organization": {
      "id": "org-worldbank",
      "name": "The World Bank Group",
      "website": "https://www.worldbank.org",
      "description": "International financial institution providing development loans",
      "type": "International Organization"
    },
    "type": "Internship",
    "description": "Offers law students and recent law graduates exposure to international financial law, sovereign development financing agreements, procurement integrity, and environmental law compliance.",
    "shortDescription": "Paid legal internship at World Bank headquarters in Washington DC.",
    "field": [
      "Law",
      "Policy",
      "Finance"
    ],
    "subfields": [
      "International Law",
      "Development Finance",
      "Corporate Governance"
    ],
    "location": "Washington, DC, USA",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Currently enrolled in an accredited law degree (LLB, JD, LLM, or SJD/PhD)",
      "Excellent command of English; knowledge of French or Spanish an asset"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Hourly Rate + Travel Support)",
    "benefits": [
      "Competitive hourly compensation",
      "Direct mentorship from World Bank senior legal counsel",
      "G-4 visa sponsorship support"
    ],
    "duration": "10-12 weeks",
    "deadline": "2026-12-15",
    "applicationUrl": "https://www.worldbank.org/en/about/careers/programs-and-internships/legal-internship-program",
    "officialSource": "https://www.worldbank.org/en/about/careers/programs-and-internships/legal-internship-program",
    "sourceName": "World Bank Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Law",
      "International Law",
      "Finance",
      "Policy",
      "Washington DC"
    ],
    "requirements": [
      "CV",
      "Statement of interest",
      "Legal writing sample",
      "Official law school transcript"
    ],
    "applicationSteps": [
      "Online application",
      "Legal department shortlisting",
      "Interview with Lead Counsel"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-law-02",
    "title": "Chatham House Mo Ibrahim Leadership Fellowship",
    "organization": {
      "id": "org-chatham-house",
      "name": "Chatham House (Royal Institute of International Affairs)",
      "website": "https://www.chathamhouse.org",
      "description": "World-leading policy institute based in London",
      "type": "Research Institute"
    },
    "type": "Fellowship",
    "description": "Fellowship for African nationals to conduct research at the Queen Elizabeth II Academy for Leadership in International Affairs on governance, security, or economic policy in London.",
    "shortDescription": "Fully funded 10-month public policy research fellowship in London for African policy professionals.",
    "field": [
      "Policy",
      "Research",
      "Law"
    ],
    "subfields": [
      "Governance",
      "Security",
      "African Political Economy"
    ],
    "location": "London, United Kingdom",
    "remoteStatus": "In-person",
    "eligibility": [
      "Citizen of an African country",
      "Hold a Master’s degree or equivalent in political science, law, economics, or international relations",
      "Early to mid-career professional"
    ],
    "educationRequirements": [
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Fully funded (£2,360 monthly stipend)",
    "benefits": [
      "Monthly living stipend of £2,360 (tax-free)",
      "Travel costs to and from London",
      "Relocation and fieldwork research grant",
      "Dedicated office at Chatham House London"
    ],
    "duration": "10 months",
    "deadline": "2027-03-15",
    "applicationUrl": "https://www.chathamhouse.org/about-us/our-academy/fellowships/mo-ibrahim-foundation-fellowship",
    "officialSource": "https://www.chathamhouse.org/about-us/our-academy/fellowships/mo-ibrahim-foundation-fellowship",
    "sourceName": "Chatham House Academy",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Policy",
      "London",
      "Fellowship",
      "Governance",
      "Africa"
    ],
    "requirements": [
      "Research project proposal (1,500 words)",
      "Curriculum vitae",
      "Two professional references"
    ],
    "applicationSteps": [
      "Written research submission",
      "Academic panel review",
      "In-person / video interview in London"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-hlth-01",
    "title": "World Health Organization (WHO) Global Internship Programme",
    "organization": {
      "id": "org-who",
      "name": "World Health Organization",
      "website": "https://www.who.int",
      "description": "United Nations specialized agency for international public health",
      "type": "International Organization"
    },
    "type": "Internship",
    "description": "Provides opportunities for graduate students and recent graduates in public health, global health policy, medicine, or health data science to gain practical insight into global health programmes.",
    "shortDescription": "6-month international internship at WHO headquarters and regional offices.",
    "field": [
      "Healthcare",
      "Research",
      "Policy"
    ],
    "subfields": [
      "Epidemiology",
      "Health Data",
      "Health Policy"
    ],
    "location": "Geneva, Switzerland / Regional Offices (Brazzaville, Cairo, Manila, Copenhagen)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Enrolled in or completed a graduate degree in public health, life sciences, or public administration",
      "At least 20 years of age",
      "Fluent in at least one UN official language"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Living Allowance / Stipend)",
    "benefits": [
      "Monthly living allowance based on duty station (approx 1,800 CHF in Geneva)",
      "Medical and accident insurance coverage",
      "Global public health network"
    ],
    "duration": "6 to 24 weeks",
    "deadline": "2026-11-30",
    "applicationUrl": "https://www.who.int/careers/internship-programme",
    "officialSource": "https://www.who.int/careers/internship-programme",
    "sourceName": "WHO Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Public Health",
      "WHO",
      "Geneva",
      "Epidemiology",
      "Global Health"
    ],
    "requirements": [
      "CV",
      "Proof of university enrollment / degree",
      "Motivation letter"
    ],
    "applicationSteps": [
      "Stellis online application",
      "Technical screening by department leads",
      "Interview"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-hlth-02",
    "title": "Wellcome Trust Master’s Fellowships in Tropical Medicine",
    "organization": {
      "id": "org-wellcome",
      "name": "Wellcome Trust",
      "website": "https://wellcome.org",
      "description": "Global charitable foundation supporting scientific discovery",
      "type": "Foundation"
    },
    "type": "Fellowship",
    "description": "Supports researchers from low- and middle-income countries to gain an MSc at an internationally recognised centre of excellence and carry out a research project in clinical or public health.",
    "shortDescription": "Fully funded master’s degree and research project funding in tropical medicine and health sciences.",
    "field": [
      "Healthcare",
      "Research",
      "Science"
    ],
    "subfields": [
      "Infectious Disease",
      "Biomedical Research",
      "Clinical Science"
    ],
    "location": "United Kingdom & Low/Middle-Income Countries",
    "remoteStatus": "In-person",
    "eligibility": [
      "National of a low- or middle-income country",
      "Clinical or non-clinical degree in health/biological sciences",
      "Sponsorship from an eligible host institution"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Fully funded (£120,000 Total Award)",
    "benefits": [
      "Full MSc course tuition fees",
      "Monthly living stipend for 30 months",
      "Research project expenses (£30,000+)",
      "Travel and conference allowances"
    ],
    "duration": "30 months",
    "deadline": "2027-04-10",
    "applicationUrl": "https://wellcome.org/grant-funding/schemes/masters-fellowships-public-health-and-tropical-medicine",
    "officialSource": "https://wellcome.org/grant-funding/schemes/masters-fellowships-public-health-and-tropical-medicine",
    "sourceName": "Wellcome Trust Grants",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Health",
      "Research",
      "Fellowship",
      "Fully Funded",
      "Science"
    ],
    "requirements": [
      "Research proposal",
      "Host institution endorsement",
      "Supervisor references"
    ],
    "applicationSteps": [
      "Preliminary proposal",
      "Full grant application submission",
      "External scientific peer review",
      "Wellcome interview panel"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  }
] as any;
