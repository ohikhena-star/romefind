import { Opportunity, OpportunityType, RemoteStatus, VerificationStatus, ExperienceLevel, EducationLevel } from '@/types/models';

export const opportunities: Opportunity[] = [
  {
    "id": "opp-pm-01",
    "title": "Google Project Management Apprenticeship",
    "organization": {
      "id": "org-google-pm",
      "name": "Google",
      "website": "https://buildyourfuture.withgoogle.com",
      "description": "Global technology leader",
      "type": "Company"
    },
    "type": "Programme",
    "description": "Work alongside experienced Google project and program managers on technical cross-functional projects, resource planning, and sprint delivery.",
    "shortDescription": "Paid 20-month project management apprenticeship with structured PMI certification training.",
    "field": [
      "Project Management",
      "Operations",
      "Business"
    ],
    "subfields": [
      "Agile",
      "Scrum",
      "Program Management"
    ],
    "location": "London, UK / New York, USA / Lagos, Nigeria",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Prior project coordination or administrative experience",
      "Strong organizational and stakeholder communication skills"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Annual Apprenticeship Salary)",
    "benefits": [
      "Full competitive salary",
      "Funded Google Project Management Certificate & CAPM training",
      "Healthcare and mentorship"
    ],
    "duration": "20 months",
    "deadline": "2026-12-10",
    "applicationUrl": "https://buildyourfuture.withgoogle.com/apprenticeships",
    "officialSource": "https://buildyourfuture.withgoogle.com/apprenticeships",
    "sourceName": "Google Apprenticeships",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Project Management",
      "Operations",
      "Agile",
      "Google",
      "CAPM"
    ],
    "requirements": [
      "CV",
      "Statement of purpose",
      "Behavioral scenario interview"
    ],
    "applicationSteps": [
      "Online application",
      "Written scenario assessment",
      "Google panel interviews"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-pm-02",
    "title": "PMI Global Research & Project Management Grant",
    "organization": {
      "id": "org-pmi",
      "name": "Project Management Institute (PMI)",
      "website": "https://www.pmi.org",
      "description": "World leading professional association for project management",
      "type": "Professional Association"
    },
    "type": "Grant",
    "description": "Direct research and project execution funding of up to $50,000 for project managers, researchers, and operations specialists studying agile delivery and governance.",
    "shortDescription": "Up to $50,000 project management research and field execution grant.",
    "field": [
      "Project Management",
      "Research",
      "Operations"
    ],
    "subfields": [
      "Organizational Governance",
      "Agile Methodologies",
      "Strategic PMO"
    ],
    "location": "Worldwide / Remote",
    "remoteStatus": "Remote",
    "eligibility": [
      "Project managers or academic researchers with demonstrated track record in project management"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Grant ($10,000 - $50,000 USD)",
    "benefits": [
      "Direct research and project funding",
      "Presentation at PMI Global Summit",
      "Publication in Project Management Journal"
    ],
    "duration": "1-2 years",
    "deadline": "2027-02-15",
    "applicationUrl": "https://www.pmi.org/learning/academic-research/sponsored-research-program",
    "officialSource": "https://www.pmi.org/learning/academic-research/sponsored-research-program",
    "sourceName": "PMI Academic Grants",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Project Management",
      "Grant",
      "Remote",
      "PMI",
      "Leadership"
    ],
    "requirements": [
      "Project proposal",
      "Budget justification",
      "CV and credentials"
    ],
    "applicationSteps": [
      "Initial proposal submission",
      "Peer review by PMI Academic Council",
      "Grant award disbursement"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-cx-01",
    "title": "Automattic Happiness Engineer (Customer Success & CX)",
    "organization": {
      "id": "org-automattic",
      "name": "Automattic (WordPress.com / WooCommerce)",
      "website": "https://automattic.com",
      "description": "Fully distributed web technology company",
      "type": "Company"
    },
    "type": "Job",
    "description": "Help millions of WordPress.com and WooCommerce site owners solve technical setup questions, design workflows, and customer onboarding 100% remotely.",
    "shortDescription": "100% remote customer experience and technical support role at Automattic.",
    "field": [
      "Customer Experience",
      "Customer Success",
      "Technology"
    ],
    "subfields": [
      "Client Support",
      "Troubleshooting",
      "Account Success"
    ],
    "location": "100% Remote (Worldwide - All Time Zones)",
    "remoteStatus": "Remote",
    "eligibility": [
      "Passionate about working with people and solving problems",
      "Strong written English communication",
      "Familiarity with web technology or WordPress is a plus"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid ($65,000 - $90,000 USD + Equity)",
    "benefits": [
      "100% work from anywhere",
      "Home office setup budget ($2,000)",
      "Annual company worldwide retreats",
      "Open vacation policy"
    ],
    "duration": "Full-time",
    "deadline": "2026-12-31",
    "applicationUrl": "https://automattic.com/work-with-us/happiness-engineer/",
    "officialSource": "https://automattic.com/work-with-us/happiness-engineer/",
    "sourceName": "Automattic Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Customer Experience",
      "Remote",
      "Customer Success",
      "WordPress",
      "Global"
    ],
    "requirements": [
      "Written application questionnaire",
      "Paid trial rotation"
    ],
    "applicationSteps": [
      "Written application review",
      "Slack text-based interview",
      "Paid 4-week trial period",
      "Full-time offer"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-cx-02",
    "title": "Shopify Merchant Success & CX Specialist",
    "organization": {
      "id": "org-shopify-cx",
      "name": "Shopify",
      "website": "https://www.shopify.com",
      "description": "Global commerce enablement platform",
      "type": "Company"
    },
    "type": "Job",
    "description": "Advise and support direct-to-consumer e-commerce entrepreneurs and scaling merchants to optimize their digital storefronts, payment gateways, and checkout conversions.",
    "shortDescription": "Full-time remote Merchant Success role empowering global digital entrepreneurs.",
    "field": [
      "Customer Success",
      "Customer Experience",
      "Business"
    ],
    "subfields": [
      "E-Commerce",
      "Account Management",
      "Merchant Advisory"
    ],
    "location": "Remote (Worldwide / EMEA / Americas)",
    "remoteStatus": "Remote",
    "eligibility": [
      "Customer-first mindset and proactive problem solver",
      "Interest in digital commerce, retail tech, or marketing"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Competitive Salary + Stock Options)",
    "benefits": [
      "Digital-first remote work environment",
      "Internet and home office monthly stipend",
      "Flexible wellness spending account"
    ],
    "duration": "Full-time",
    "deadline": "2026-11-30",
    "applicationUrl": "https://www.shopify.com/careers/specialties/merchant-success",
    "officialSource": "https://www.shopify.com/careers/specialties/merchant-success",
    "sourceName": "Shopify Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Customer Success",
      "CX",
      "E-Commerce",
      "Remote",
      "Shopify"
    ],
    "requirements": [
      "CV",
      "Customer empathy scenario response"
    ],
    "applicationSteps": [
      "Life story interview",
      "Practical customer scenario simulation",
      "Offer"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-va-01",
    "title": "Boldly Remote Executive Assistant & Operations Associate",
    "organization": {
      "id": "org-boldly",
      "name": "Boldly",
      "website": "https://boldly.com",
      "description": "Premium subscription staffing and executive assistance agency",
      "type": "Company"
    },
    "type": "Job",
    "description": "Provide high-touch calendar management, executive correspondence, travel coordination, and workflow optimization for founders and corporate leaders worldwide.",
    "shortDescription": "Flexible, premium remote executive assistant role supporting global founders and executives.",
    "field": [
      "Virtual Assistance",
      "Administration",
      "Operations"
    ],
    "subfields": [
      "Executive Support",
      "Workflow Coordination",
      "Project Administration"
    ],
    "location": "Remote (Worldwide - US, UK, Europe, Africa, LatAm)",
    "remoteStatus": "Remote",
    "eligibility": [
      "3+ years in an executive assistant, virtual assistant, or operations coordination role",
      "Impeccable written communication and discreet professionalism"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Paid ($24 - $36/hr USD + Paid Time Off)",
    "benefits": [
      "Full remote flexibility",
      "Guaranteed hourly contracts",
      "Paid vacation and public holidays",
      "Long-term client relationships"
    ],
    "duration": "Full-time or Part-time (20-40 hrs/wk)",
    "deadline": "2026-12-15",
    "applicationUrl": "https://boldly.com/jobs/",
    "officialSource": "https://boldly.com/jobs/",
    "sourceName": "Boldly Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Virtual Assistant",
      "Remote",
      "Administration",
      "Executive Assistant",
      "Operations"
    ],
    "requirements": [
      "CV",
      "Skills testing (communication, software, prioritization)"
    ],
    "applicationSteps": [
      "Online application",
      "Skills assessment test",
      "Video interviews",
      "Client matching"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-fin-01",
    "title": "PwC Graduate Associate Scheme (Audit, Tax & Advisory)",
    "organization": {
      "id": "org-pwc",
      "name": "PwC (PricewaterhouseCoopers)",
      "website": "https://www.pwc.com",
      "description": "Global professional services network",
      "type": "Company"
    },
    "type": "Job",
    "description": "Join PwC’s structured graduate programme in Accounting, Assurance, Corporate Tax, or Financial Risk, leading directly to chartered accounting qualifications (ACA/ACCA/CPA).",
    "shortDescription": "Full-time graduate entry program in accounting and financial audit with fully funded ACCA/ACA sponsorship.",
    "field": [
      "Accounting",
      "Audit",
      "Finance"
    ],
    "subfields": [
      "Financial Audit",
      "Tax Advisory",
      "Risk Assurance"
    ],
    "location": "Global (Lagos, London, Johannesburg, Dublin, New York)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Graduating student or recent graduate in any discipline (Business, Accounting, Economics, STEM, Humanities)",
      "Strong numerical and logical reasoning"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Competitive Salary + Full ACCA/ACA Sponsorship)",
    "benefits": [
      "Fully funded ACA/ACCA/CPA exam fees and paid study leave",
      "Competitive graduate starting salary",
      "Fast-track promotion pathway to Senior Associate"
    ],
    "duration": "3-year programme",
    "deadline": "2026-11-25",
    "applicationUrl": "https://www.pwc.com/gx/en/careers.html",
    "officialSource": "https://www.pwc.com/gx/en/careers.html",
    "sourceName": "PwC Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Accounting",
      "Audit",
      "Finance",
      "ACCA",
      "ACA",
      "PwC"
    ],
    "requirements": [
      "Academic degree certificate",
      "Online behavioral and numerical tests"
    ],
    "applicationSteps": [
      "Online application",
      "Game-based psychometric assessment",
      "Video interview",
      "Virtual Assessment Day"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-fin-02",
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
      "Finance",
      "Investment",
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
    "id": "opp-mkt-01",
    "title": "HubSpot Product Marketing & Growth Fellowship",
    "organization": {
      "id": "org-hubspot",
      "name": "HubSpot",
      "website": "https://www.hubspot.com",
      "description": "CRM and inbound marketing software leader",
      "type": "Company"
    },
    "type": "Fellowship",
    "description": "Hands-on marketing fellowship learning product positioning, go-to-market execution, content strategy, and lifecycle retention alongside HubSpot senior product marketing managers.",
    "shortDescription": "Paid 6-month product marketing and growth marketing fellowship.",
    "field": [
      "Digital Marketing",
      "Content Marketing",
      "Communications"
    ],
    "subfields": [
      "Product Marketing",
      "Growth",
      "Brand Strategy"
    ],
    "location": "Dublin, Ireland / Boston, USA / Remote",
    "remoteStatus": "Flexible",
    "eligibility": [
      "Aspiring marketers, writers, or growth enthusiasts",
      "Strong storytelling and data interpretation skills"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Competitive Fellowship Stipend)",
    "benefits": [
      "Full monthly fellowship salary",
      "HubSpot Academy certifications",
      "Direct mentorship from Director of Product Marketing"
    ],
    "duration": "6 months",
    "deadline": "2026-12-01",
    "applicationUrl": "https://www.hubspot.com/careers",
    "officialSource": "https://www.hubspot.com/careers",
    "sourceName": "HubSpot Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Marketing",
      "Product Marketing",
      "Growth",
      "HubSpot",
      "Remote"
    ],
    "requirements": [
      "Marketing case study response",
      "CV and writing portfolio"
    ],
    "applicationSteps": [
      "Online application",
      "Written marketing brief challenge",
      "Panel interview"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-wri-01",
    "title": "Thomson Reuters Journalism Trainee Programme",
    "organization": {
      "id": "org-reuters",
      "name": "Reuters News Agency",
      "website": "https://www.reuters.com",
      "description": "World’s largest multimedia news provider",
      "type": "Company"
    },
    "type": "Programme",
    "description": "A 9-month paid fast-track training program for aspiring multimedia journalists, financial reporters, and investigative writers with rotations in international bureaus.",
    "shortDescription": "Prestigious 9-month paid international multimedia journalism training scheme.",
    "field": [
      "Journalism",
      "Writing",
      "Media"
    ],
    "subfields": [
      "Financial Journalism",
      "Investigative Reporting",
      "Multimedia"
    ],
    "location": "London, UK / Singapore / New York, USA",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Graduates or early-career writers with passion for global news and financial reporting",
      "Strong writing and critical analysis skills in English"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Full Reporting Salary + Travel Allowance)",
    "benefits": [
      "Full staff journalist salary",
      "Comprehensive training by senior editors",
      "International bureau rotation opportunities"
    ],
    "duration": "9 months (with permanent contract track)",
    "deadline": "2026-11-15",
    "applicationUrl": "https://www.thomsonreuters.com/en/careers/journalism-trainee-program.html",
    "officialSource": "https://www.thomsonreuters.com/en/careers/journalism-trainee-program.html",
    "sourceName": "Reuters Journalism",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Journalism",
      "Writing",
      "Media",
      "Reuters",
      "Reporting"
    ],
    "requirements": [
      "3 published writing clips or articles",
      "CV",
      "Timed news-writing test"
    ],
    "applicationSteps": [
      "Online application & clips",
      "Timed breaking news writing test",
      "Assessment Centre in London/Singapore"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-edu-01",
    "title": "Teach For All Global Education Fellowship",
    "organization": {
      "id": "org-teachforall",
      "name": "Teach For All",
      "website": "https://teachforall.org",
      "description": "Global network expanding educational opportunity",
      "type": "Non-Profit"
    },
    "type": "Fellowship",
    "description": "A 2-year leadership and teaching fellowship placing exceptional graduates and career switchers in high-need schools across 60+ countries to expand educational equity.",
    "shortDescription": "2-year fully funded teaching and educational leadership fellowship.",
    "field": [
      "Teaching",
      "Social Impact",
      "Education Administration"
    ],
    "subfields": [
      "Curriculum Delivery",
      "Educational Equity",
      "Youth Leadership"
    ],
    "location": "Global (Nigeria, Ghana, Kenya, India, UK, USA, Peru, South Africa)",
    "remoteStatus": "In-person",
    "eligibility": [
      "Bachelor’s degree in any field",
      "Demonstrated leadership capacity and resilience",
      "Passion for expanding educational opportunity for children"
    ],
    "educationRequirements": [
      "Undergraduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully Funded (Full Teaching Salary + Training)",
    "benefits": [
      "Full monthly teacher salary and regional benefits",
      "Teaching certification and pedagogy training",
      "Alumni access to global policy and social impact networks"
    ],
    "duration": "2 years",
    "deadline": "2027-01-31",
    "applicationUrl": "https://teachforall.org/join",
    "officialSource": "https://teachforall.org/join",
    "sourceName": "Teach For All Network",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Education",
      "Teaching",
      "Social Impact",
      "Leadership",
      "Fellowship"
    ],
    "requirements": [
      "University transcripts",
      "Personal statement",
      "Leadership resume"
    ],
    "applicationSteps": [
      "Online application",
      "Competency interview",
      "Sample teaching lesson evaluation"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-arch-01",
    "title": "Norman Foster Foundation Architecture Fellowship",
    "organization": {
      "id": "org-foster",
      "name": "Norman Foster Foundation",
      "website": "https://www.normanfosterfoundation.org",
      "description": "Foundation promoting multidisciplinary architecture and urban research",
      "type": "Foundation"
    },
    "type": "Fellowship",
    "description": "Fully funded research fellowship in Madrid for young architects and urbanists to develop innovative sustainability, materials, and infrastructure prototypes.",
    "shortDescription": "Fully funded architecture and urban design research fellowship in Madrid, Spain.",
    "field": [
      "Architecture",
      "Creative",
      "Sustainability"
    ],
    "subfields": [
      "Urban Planning",
      "Sustainable Design",
      "Spatial Prototyping"
    ],
    "location": "Madrid, Spain",
    "remoteStatus": "In-person",
    "eligibility": [
      "Graduates in Architecture, Urban Design, or Structural Engineering",
      "Outstanding design portfolio"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded (€18,000 Stipend + Travel)",
    "benefits": [
      "Full research stipend (€18,000)",
      "Accommodation and studio space in Madrid",
      "Mentorship by Lord Norman Foster and international juries"
    ],
    "duration": "6 months",
    "deadline": "2027-02-28",
    "applicationUrl": "https://www.normanfosterfoundation.org/fellowships/",
    "officialSource": "https://www.normanfosterfoundation.org/fellowships/",
    "sourceName": "Norman Foster Foundation",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Architecture",
      "Design",
      "Sustainability",
      "Madrid",
      "Fellowship"
    ],
    "requirements": [
      "Curated architecture portfolio (PDF)",
      "Research topic proposal",
      "Two academic references"
    ],
    "applicationSteps": [
      "Digital portfolio submission",
      "Scientific council review",
      "Interview"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-photo-01",
    "title": "National Geographic Early Career Storytelling Grant",
    "organization": {
      "id": "org-natgeo",
      "name": "National Geographic Society",
      "website": "https://www.nationalgeographic.org",
      "description": "Global non-profit exploring and illuminating the wonder of the world",
      "type": "Foundation"
    },
    "type": "Grant",
    "description": "Provides seed grants of up to $20,000 for early-career photographers, documentary filmmakers, and visual storytellers capturing conservation, climate, and community cultures.",
    "shortDescription": "Grants up to $20,000 for early-career documentary photographers and visual creators.",
    "field": [
      "Photography",
      "Film",
      "Creative",
      "Environmental Science"
    ],
    "subfields": [
      "Documentary Photography",
      "Visual Storytelling",
      "Cinematography"
    ],
    "location": "Worldwide (Project in your local region)",
    "remoteStatus": "Flexible",
    "eligibility": [
      "Early-career photographers, filmmakers, or journalists",
      "18+ years old",
      "Clear project field proposal"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Grant ($10,000 - $20,000 USD)",
    "benefits": [
      "Direct project grant funding",
      "Affiliation as a National Geographic Explorer",
      "Access to NatGeo media channels and global Explorer Network"
    ],
    "duration": "1 year project period",
    "deadline": "2027-04-15",
    "applicationUrl": "https://www.nationalgeographic.org/society/grants-and-investments/",
    "officialSource": "https://www.nationalgeographic.org/society/grants-and-investments/",
    "sourceName": "National Geographic Society",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Photography",
      "Film",
      "Storytelling",
      "Grant",
      "National Geographic"
    ],
    "requirements": [
      "Project narrative (1,000 words)",
      "Visual portfolio sample link",
      "Itemized budget"
    ],
    "applicationSteps": [
      "Online grant portal submission",
      "Peer review by NatGeo storytelling committee",
      "Grant disbursement"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-hr-01",
    "title": "L’Oréal Management Trainee Program (People & HR Track)",
    "organization": {
      "id": "org-loreal",
      "name": "L’Oréal Group",
      "website": "https://careers.loreal.com",
      "description": "Global beauty and consumer goods leader",
      "type": "Company"
    },
    "type": "Programme",
    "description": "An accelerated 18-month rotational management program across Talent Acquisition, Learning & Development, HR Business Partnering, and Employee Relations.",
    "shortDescription": "Accelerated 18-month management trainee program in Human Resources and People Operations.",
    "field": [
      "Human Resources",
      "Operations",
      "Business"
    ],
    "subfields": [
      "Talent Acquisition",
      "Learning & Development",
      "People Analytics"
    ],
    "location": "Paris, France / London, UK / Lagos, Nigeria / Johannesburg",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Graduating students or recent graduates in HR, Psychology, Business, or Humanities",
      "Strong interpersonal empathy and project management aptitude"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Full Competitive Trainee Salary)",
    "benefits": [
      "Competitive starting salary with annual review",
      "3 cross-departmental HR rotations",
      "Dedicated HR Director mentor"
    ],
    "duration": "18 months",
    "deadline": "2026-12-05",
    "applicationUrl": "https://careers.loreal.com/en_US/jobs/students-graduates",
    "officialSource": "https://careers.loreal.com/en_US/jobs/students-graduates",
    "sourceName": "L’Oréal Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Human Resources",
      "HR",
      "Talent",
      "Management Trainee",
      "Operations"
    ],
    "requirements": [
      "CV",
      "Short motivational video or answers"
    ],
    "applicationSteps": [
      "Online application",
      "Gamified cognitive assessment",
      "Assessment Day case simulation"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
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
      "Software Engineering",
      "Technology",
      "Cloud"
    ],
    "subfields": [
      "Systems",
      "Full-Stack",
      "APIs"
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
      "Product Design",
      "UX/UI",
      "Technology"
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
      "AI",
      "Machine Learning",
      "Research",
      "Technology"
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
      "Software Engineering",
      "Technology",
      "Fintech"
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
      "Public Policy",
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
      "Public Policy",
      "Governance",
      "Law",
      "Research"
    ],
    "subfields": [
      "Security",
      "African Political Economy",
      "Diplomacy"
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
      "Public Policy",
      "Law",
      "Business",
      "Social Impact"
    ],
    "subfields": [
      "All Postgraduate Disciplines"
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
      "Engineering",
      "Law",
      "Public Policy",
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
      "Physics",
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
      "Clean Energy"
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
      "Startups",
      "Entrepreneurship",
      "Technology"
    ],
    "subfields": [
      "Venture Capital",
      "Product Management",
      "Go-to-Market"
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
      "Public Health",
      "Healthcare Administration",
      "Research"
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
    "id": "opp-event-01",
    "title": "AfroTech Global Conference & Executive Networking Expo",
    "organization": {
      "id": "org-afrotech",
      "name": "AfroTech",
      "website": "https://afrotechconference.com",
      "description": "The largest multicultural tech conference and career community in the world",
      "type": "Professional Association"
    },
    "type": "Conference/Event",
    "description": "Connect with over 20,000 tech professionals, founders, and recruiters. Features dedicated recruiting expos with 150+ leading technology employers, executive leadership tracks, and technical innovation workshops.",
    "shortDescription": "Global tech career expo, executive networking summit, and founder pitch competition.",
    "field": [
      "Technology & Computing",
      "Software Engineering",
      "AI",
      "Entrepreneurship"
    ],
    "subfields": [
      "Career Fair",
      "Executive Networking",
      "Recruiting",
      "Engineering Leadership"
    ],
    "location": "Austin, TX, USA / Hybrid (Virtual Access)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Open to students, software engineers, product managers, designers, and tech founders globally",
      "Student & Early Career scholarship applications open to all accredited institutions"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Funded Student Scholarships & Registration Subsidies",
    "benefits": [
      "Direct recruiting sessions with hiring managers from 150+ tech scaleups and enterprise leaders",
      "Full registration fee waiver and travel grants for selected student scholarship recipients",
      "1-on-1 resume reviews, portfolio clinics, and engineering interview prep",
      "Access to private executive networking lounges and investor mixers"
    ],
    "duration": "4 days",
    "deadline": "2026-11-15",
    "applicationUrl": "https://afrotechconference.com",
    "officialSource": "https://afrotechconference.com",
    "sourceName": "AfroTech",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "AfroTech",
      "Conference",
      "Career Fair",
      "Networking",
      "Software Engineering",
      "Recruiting"
    ],
    "requirements": [
      "Online registration profile",
      "CV / Portfolio for recruiting database",
      "Student ID for scholarship applicants"
    ],
    "applicationSteps": [
      "Select registration track (Student, General, or Executive)",
      "Upload CV to recruiter talent network",
      "Book 1-on-1 networking slots via attendee portal"
    ],
    "status": "open",
    "createdAt": "2026-09-15T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-event-02",
    "title": "NeurIPS Global AI Research Conference & Affinity Workshops",
    "organization": {
      "id": "org-neurips",
      "name": "NeurIPS Foundation",
      "website": "https://neurips.cc",
      "description": "Premier annual international conference on Neural Information Processing Systems",
      "type": "Research Institute"
    },
    "type": "Conference/Event",
    "description": "The world's foremost conference on machine learning and computational neuroscience. Includes keynotes from top pioneers, accepted oral paper presentations, and specialized affinity workshops (Black in AI, LatinX in AI, Women in ML, Queer in AI).",
    "shortDescription": "Flagship international machine learning conference with fully funded travel and registration grants.",
    "field": [
      "AI",
      "Machine Learning",
      "Data Science",
      "Academic Research"
    ],
    "subfields": [
      "Deep Learning",
      "Affinity Workshops",
      "Computer Vision",
      "Natural Language Processing"
    ],
    "location": "Vancouver, Canada & Remote (Worldwide Virtual)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Researchers, graduate students, undergraduates, and practitioners working in machine learning, statistics, and related disciplines",
      "Travel grants prioritized for authors of accepted papers and participants from historically underrepresented regions"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Funded (Full Registration Waiver + Travel Stipend for Grant Recipients)",
    "benefits": [
      "Full conference registration fee waiver and up to $2,500 travel support for D&I scholars",
      "Direct access to research scientists and hiring directors from DeepMind, OpenAI, FAIR, and Anthropic",
      "Mentorship roundtables pairing junior researchers with senior faculty",
      "Access to all oral sessions, poster presentations, and tutorial recordings"
    ],
    "duration": "6 days",
    "deadline": "2026-10-30",
    "applicationUrl": "https://neurips.cc/Conferences/2026",
    "officialSource": "https://neurips.cc",
    "sourceName": "NeurIPS Official",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "NeurIPS",
      "AI",
      "Machine Learning",
      "Research",
      "Conference",
      "Grant"
    ],
    "requirements": [
      "Conference registration or Grant application form",
      "Statement of interest and CV",
      "Letter of recommendation (for student travel grants)"
    ],
    "applicationSteps": [
      "Submit D&I travel grant application",
      "Register virtual or in-person ticket",
      "Access workshop schedule"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-event-03",
    "title": "Figma Config Global Product Design & Systems Summit",
    "organization": {
      "id": "org-figma",
      "name": "Figma",
      "website": "https://config.figma.com",
      "description": "Global design and product creation platform",
      "type": "Company"
    },
    "type": "Conference/Event",
    "description": "The premier annual global conference for product designers, design engineers, creative directors, and UX leaders. Discover the latest design system architectures, UI prototyping techniques, and AI-assisted design workflows.",
    "shortDescription": "Global product design and systems conference with 100% free virtual attendance.",
    "field": [
      "Product Design",
      "UX/UI",
      "Design Systems",
      "Product Management"
    ],
    "subfields": [
      "Interaction Design",
      "Design Engineering",
      "Prototyping",
      "Design Leadership"
    ],
    "location": "San Francisco, CA, USA & Remote (Worldwide)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Open to product designers, frontend engineers, design students, and product creators worldwide",
      "Virtual streaming pass is 100% free and open to everyone"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Free (100% Free Virtual Registration & Student Subsidies)",
    "benefits": [
      "Free global streaming access to 50+ interactive design keynotes and masterclasses",
      "Hands-on design systems and variable token workshops",
      "Community breakout rooms and portfolio clinics with industry leaders",
      "Live Q&A with Figma product and engineering directors"
    ],
    "duration": "2 days",
    "deadline": "2026-12-01",
    "applicationUrl": "https://config.figma.com",
    "officialSource": "https://config.figma.com",
    "sourceName": "Figma Config",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Figma",
      "Design",
      "Product Design",
      "UX/UI",
      "Design Systems",
      "Conference"
    ],
    "requirements": [
      "Online registration form"
    ],
    "applicationSteps": [
      "Register for free virtual streaming pass",
      "Select workshop tracks",
      "Join the official Config community Discord"
    ],
    "status": "open",
    "createdAt": "2026-09-20T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-event-04",
    "title": "MIT Solve Global Innovation Summit & Pitch Challenge",
    "organization": {
      "id": "org-mit-solve",
      "name": "MIT Solve",
      "website": "https://solve.mit.edu",
      "description": "Massachusetts Institute of Technology social innovation and venture catalyst",
      "type": "University"
    },
    "type": "Conference/Event",
    "description": "An annual flagship gathering at MIT connecting social entrepreneurs, climate innovators, and tech builders with philanthropic funders, impact investors, and research collaborators.",
    "shortDescription": "Social entrepreneurship and climate innovation summit with over $1M in challenge prize funding.",
    "field": [
      "Social Impact",
      "Climate & Sustainability",
      "Clean Energy",
      "Entrepreneurship"
    ],
    "subfields": [
      "Venture Pitching",
      "Cross-Sector Partnerships",
      "Social Innovation",
      "Impact Grants"
    ],
    "location": "Cambridge, MA, USA & Virtual",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Social entrepreneurs, researchers, students, and early-stage innovators addressing global climate, education, health, and economic prosperity challenges"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Funded (Over $1,000,000 in Non-Dilutive Challenge Grants & Travel Support)",
    "benefits": [
      "Pitch live to a panel of philanthropic donors, venture capitalists, and NGO executives",
      "Fully sponsored travel and accommodation for finalist teams presenting at MIT",
      "9-month structured mentorship and corporate partnership accelerator access",
      "Global media coverage across MIT publications and international press"
    ],
    "duration": "3 days",
    "deadline": "2026-11-20",
    "applicationUrl": "https://solve.mit.edu/events",
    "officialSource": "https://solve.mit.edu",
    "sourceName": "MIT Solve",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "MIT",
      "Social Impact",
      "Climate",
      "Innovation",
      "Grant",
      "Conference"
    ],
    "requirements": [
      "Challenge solution submission or attendee registration",
      "Executive summary of innovation",
      "Team background information"
    ],
    "applicationSteps": [
      "Submit challenge proposal via MIT Solve portal",
      "Expert judge panel review",
      "Invitation to pitch at Cambridge flagship summit"
    ],
    "status": "open",
    "createdAt": "2026-09-10T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-event-05",
    "title": "Grace Hopper Celebration & Technical Career Fair",
    "organization": {
      "id": "org-anitab",
      "name": "AnitaB.org",
      "website": "https://ghc.anitab.org",
      "description": "Global non-profit organization promoting diversity, equity, and inclusion in computing",
      "type": "Non-Profit"
    },
    "type": "Conference/Event",
    "description": "The world's largest gathering of women and non-binary technologists. Features world-class technical keynotes, an expansive career fair with 200+ employers, and structured student-to-professional mentorship sessions.",
    "shortDescription": "World's largest computing conference and career fair with comprehensive student travel scholarships.",
    "field": [
      "Software Engineering",
      "Technology & Computing",
      "Cybersecurity",
      "Data Science"
    ],
    "subfields": [
      "Career Fair",
      "Technical Workshops",
      "Mentorship",
      "DEI in Tech"
    ],
    "location": "Philadelphia, PA, USA / Hybrid",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Open to undergraduate students, graduate students, researchers, and technology professionals",
      "Scholarships available for students enrolled in accredited computer science and STEM degree programmes"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Funded Student Scholarships (Full Travel, Hotel & Registration)",
    "benefits": [
      "Direct on-site and virtual interviews with hiring teams from Google, Apple, Microsoft, Amazon, and 200+ companies",
      "Full AnitaB.org Student Scholar award covering round-trip flights, hotel, and conference badge",
      "1-on-1 resume reviews and technical mock interviews with senior engineers",
      "Lifelong access to global alumni directory and community mentorship cohorts"
    ],
    "duration": "4 days",
    "deadline": "2026-10-25",
    "applicationUrl": "https://ghc.anitab.org",
    "officialSource": "https://ghc.anitab.org",
    "sourceName": "AnitaB.org GHC",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Grace Hopper",
      "Career Fair",
      "Software Engineering",
      "Diversity",
      "Recruiting",
      "Conference"
    ],
    "requirements": [
      "CV / Resume",
      "Academic transcript (for scholarship track)",
      "Short essay on career goals in technology"
    ],
    "applicationSteps": [
      "Submit Student Scholar or general registration",
      "Upload CV to GHC Resume Database for employers",
      "Pre-schedule technical interviews"
    ],
    "status": "open",
    "createdAt": "2026-09-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-event-06",
    "title": "London Tech Week & Emerging Founders Summit",
    "organization": {
      "id": "org-informa-tech",
      "name": "Informa Tech & London & Partners",
      "website": "https://londontechweek.com",
      "description": "Europe's premier technology and startup ecosystem festival",
      "type": "Company"
    },
    "type": "Conference/Event",
    "description": "A week-long innovation festival bringing together 45,000 attendees, 5,000 startup founders, and global venture capitalists. Discover early-stage investment trends, participate in founder-investor matchmaking, and explore cross-border expansion.",
    "shortDescription": "Europe's premier tech festival with curated founder-investor matchmaking and scaleup clinics.",
    "field": [
      "Entrepreneurship",
      "Startups",
      "Venture Capital",
      "Software Engineering"
    ],
    "subfields": [
      "Founder-Investor Matchmaking",
      "Scaleup Masterclasses",
      "Angel Demo Days",
      "Fintech"
    ],
    "location": "London, UK",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Founders, university researchers, tech innovators, and ecosystem builders",
      "Subsidized tickets available for early-stage startups and university incubators"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Free Early-Stage Founder Passes & University Subsidies",
    "benefits": [
      "Pre-scheduled 1-on-1 pitch meetings with European and UK venture capital partners",
      "Free exhibition demo booths for university-affiliated and pre-seed startups",
      "Masterclasses on fundraising governance, UK/EU talent visas, and international expansion",
      "Networking access to private evening mixers across London's leading innovation hubs"
    ],
    "duration": "5 days",
    "deadline": "2026-12-15",
    "applicationUrl": "https://londontechweek.com",
    "officialSource": "https://londontechweek.com",
    "sourceName": "London Tech Week",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "London",
      "Startups",
      "Venture Capital",
      "Networking",
      "UK",
      "Conference"
    ],
    "requirements": [
      "Delegate registration form",
      "Company or university affiliation overview (for pitch tracks)"
    ],
    "applicationSteps": [
      "Register online for general badge or founder pass",
      "Apply for Venture Matchmaking programme",
      "Receive personalized schedule of investor meetings"
    ],
    "status": "open",
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-event-07",
    "title": "Kigali Global Innovation & YouthConnekt Summit",
    "organization": {
      "id": "org-undp-rwanda",
      "name": "UNDP & Republic of Rwanda",
      "website": "https://youthconnektafrica.org",
      "description": "Pan-African youth empowerment and digital economy platform",
      "type": "International Organization"
    },
    "type": "Conference/Event",
    "description": "The largest gathering of young innovators, tech entrepreneurs, policymakers, and civic leaders in Africa. Focuses on scaling digital public infrastructure, green entrepreneurship, and intra-African trade opportunities.",
    "shortDescription": "Pan-African innovation and policy summit with fully funded delegate sponsorship.",
    "field": [
      "Social Impact",
      "Entrepreneurship",
      "Public Policy",
      "International Relations"
    ],
    "subfields": [
      "Digital Economy",
      "Youth Empowerment",
      "Pan-African Trade",
      "Policy Roundtables"
    ],
    "location": "Kigali, Rwanda & Remote (Worldwide)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Young leaders, entrepreneurs, and innovators aged 18-35 from Africa and the global diaspora",
      "Travel and visa sponsorship available for competitively selected innovation champions"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Funded (Full Flights, Accommodation & Visa Support for Selected Delegates)",
    "benefits": [
      "Fully sponsored travel, luxury accommodation, and local transport in Kigali for 150+ selected youth leaders",
      "Pitch for the YouthConnekt Africa Innovation Prize ($10,000 to $50,000 in grant capital)",
      "Direct roundtables with African heads of state, UN leaders, and international development bank executives",
      "Access to the Pan-African entrepreneur directory and bilateral trade networks"
    ],
    "duration": "3 days",
    "deadline": "2026-11-10",
    "applicationUrl": "https://youthconnektafrica.org",
    "officialSource": "https://youthconnektafrica.org",
    "sourceName": "YouthConnekt Africa",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "UNDP",
      "Rwanda",
      "Kigali",
      "Africa",
      "Innovation",
      "Grant",
      "Conference"
    ],
    "requirements": [
      "Online delegate application",
      "Innovation project description or community initiative outline",
      "Passport copy for visa letter"
    ],
    "applicationSteps": [
      "Submit online delegate application",
      "Review by national UNDP country office committee",
      "Issuance of official invitation letter and flight ticket"
    ],
    "status": "open",
    "createdAt": "2026-09-05T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-event-08",
    "title": "DAAD Global Academic Research & Fellowship Fair",
    "organization": {
      "id": "org-daad",
      "name": "German Academic Exchange Service (DAAD)",
      "website": "https://www.daad.de/en",
      "description": "The world's largest funding organization for international academic exchange",
      "type": "Government"
    },
    "type": "Conference/Event",
    "description": "An interactive global virtual fair connecting prospective master's, PhD, and postdoctoral researchers with admissions directors and research group leaders from 50+ German universities and Max Planck / Helmholtz institutes.",
    "shortDescription": "Virtual research fair offering direct guidance on €1,300/mo German fellowships and PhD grants.",
    "field": [
      "Academic Research",
      "Engineering",
      "Life Sciences",
      "International Relations"
    ],
    "subfields": [
      "PhD Opportunities",
      "Research Grants",
      "Postgraduate Funding",
      "University Admissions"
    ],
    "location": "Remote (Worldwide Virtual Fair)",
    "remoteStatus": "Remote",
    "eligibility": [
      "Undergraduate seniors, master's graduates, and prospective PhD researchers worldwide seeking funded study and research placements in Germany"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Postgraduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Free (100% Free Virtual Registration & Application Advice)",
    "benefits": [
      "Direct 1-on-1 virtual chat rooms with professors and admissions officers from top German universities",
      "Step-by-step masterclasses on winning DAAD monthly living stipends (€934 - €1,300/mo) and health insurance grants",
      "Guidance on German language immersion funding, student visa pathways, and post-study work options",
      "Downloadable research proposal writing templates and institutional directories"
    ],
    "duration": "1 day",
    "deadline": "2026-11-05",
    "applicationUrl": "https://www.daad.de/en/study-and-research-in-germany/virtual-fair",
    "officialSource": "https://www.daad.de",
    "sourceName": "DAAD Germany",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "DAAD",
      "Germany",
      "Research",
      "Scholarship",
      "Fellowship",
      "Virtual Fair",
      "Conference"
    ],
    "requirements": [
      "Free online registration form"
    ],
    "applicationSteps": [
      "Register for virtual fair portal",
      "Upload CV to virtual booth directory",
      "Schedule live video chats with university representatives"
    ],
    "status": "open",
    "createdAt": "2026-09-12T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-event-09",
    "title": "ETHGlobal Hackathon & Developer Summit",
    "organization": {
      "id": "org-ethglobal",
      "name": "ETHGlobal",
      "website": "https://ethglobal.com",
      "description": "Global developer community and hackathon organization for open-source and decentralized protocols",
      "type": "Non-Profit"
    },
    "type": "Conference/Event",
    "description": "Join 2,000+ developers, distributed systems engineers, and open-source contributors for a high-energy 36-hour hackathon, technical workshops, and mentor office hours. Build prototypes and compete for over $500,000 in ecosystem bounties.",
    "shortDescription": "Global open-source hackathon and developer summit with $500,000+ in bounties and travel grants.",
    "field": [
      "Software Engineering",
      "Full Stack",
      "Cybersecurity",
      "DevOps"
    ],
    "subfields": [
      "Open Source",
      "Smart Contracts",
      "Distributed Systems",
      "Hackathon"
    ],
    "location": "Worldwide / Remote & London, UK",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Software engineers, UI designers, technical writers, and student developers of all experience levels",
      "Free admission for all accepted hackathon participants"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Funded ($500,000+ in Bounties & Builder Travel Grants)",
    "benefits": [
      "Direct code mentorship and architectural reviews from core protocol engineers and open-source maintainers",
      "Compete for track prizes and sponsor bounties totaling over $500,000 in cash and token grants",
      "Top projects fast-tracked for venture accelerator interviews and seed grant programmes",
      "Builder travel stipends available for demonstrated open-source contributors"
    ],
    "duration": "3 days",
    "deadline": "2026-11-28",
    "applicationUrl": "https://ethglobal.com/events",
    "officialSource": "https://ethglobal.com",
    "sourceName": "ETHGlobal",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "ETHGlobal",
      "Hackathon",
      "Open Source",
      "Software Engineering",
      "Conference"
    ],
    "requirements": [
      "Developer application profile",
      "GitHub profile or technical project portfolio link"
    ],
    "applicationSteps": [
      "Submit hacker application with GitHub portfolio",
      "Receive acceptance notification and Discord invite",
      "Form team and participate in hackathon and sponsor workshops"
    ],
    "status": "open",
    "createdAt": "2026-09-14T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-event-10",
    "title": "PMI Global Operations & Project Management Summit",
    "organization": {
      "id": "org-pmi-summit",
      "name": "Project Management Institute (PMI)",
      "website": "https://www.pmi.org/global-summit",
      "description": "Global professional organization for project management and agile practitioners",
      "type": "Professional Association"
    },
    "type": "Conference/Event",
    "description": "The premier annual convention for project leaders, operations managers, and PMO executives worldwide. Features 100+ educational sessions on agile transformations, AI in project governance, and an exclusive operations recruiting expo.",
    "shortDescription": "Premier operations and project management convention with career recruiting fair.",
    "field": [
      "Project Management",
      "Operations",
      "Strategy",
      "Business Development"
    ],
    "subfields": [
      "Agile Delivery",
      "PMO Leadership",
      "Career Networking",
      "PMP / CAPM Credential Sessions"
    ],
    "location": "Los Angeles, CA, USA & Virtual",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Project coordinators, operations leads, scrum masters, and students pursuing management careers",
      "Subsidized student and early-career registration tiers available"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Student & Early Career Subsidies Available",
    "benefits": [
      "Earn up to 20 Professional Development Units (PDUs) toward PMP, CAPM, and PMI-ACP certifications",
      "1-on-1 career speed-mentoring with enterprise PMO directors from Fortune 500 organizations",
      "Exclusive access to career pavilion connecting certified project managers with hiring companies",
      "Full on-demand library access to keynote recordings and operational toolkits"
    ],
    "duration": "4 days",
    "deadline": "2026-12-05",
    "applicationUrl": "https://www.pmi.org/global-summit",
    "officialSource": "https://www.pmi.org",
    "sourceName": "PMI Global",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "PMI",
      "Project Management",
      "Operations",
      "Career Fair",
      "Agile",
      "Conference"
    ],
    "requirements": [
      "Registration form",
      "PMI Member ID or Student ID (for discount rates)"
    ],
    "applicationSteps": [
      "Register online for in-person or virtual pass",
      "Select certified track workshops",
      "Book recruiter meetings in the PMI Career Hub"
    ],
    "status": "open",
    "createdAt": "2026-09-16T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  }
] as any;
