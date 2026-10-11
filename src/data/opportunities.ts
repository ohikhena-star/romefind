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
    "type": "Research",
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
    "type": "Research",
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
  },
  {
    "id": "opp-cx-03",
    "title": "Flutterwave Customer Experience Researcher & Analyst",
    "organization": {
      "id": "org-flutterwave",
      "name": "Flutterwave",
      "website": "https://flutterwave.com/careers",
      "description": "Leading African payments technology unicorn",
      "type": "Company"
    },
    "type": "Job",
    "description": "Lead Voice-of-Customer (VoC) research and customer journey analytics across digital payments and merchant checkout flows. Synthesize customer feedback, conduct usability interviews, and collaborate with product managers to resolve experience friction points.",
    "shortDescription": "Customer experience and user journey research role at leading African payments technology firm.",
    "field": [
      "Customer Experience",
      "UX Research",
      "Fintech"
    ],
    "subfields": [
      "Voice of Customer",
      "Journey Management",
      "Customer Insights",
      "User Experience"
    ],
    "location": "Lagos, Nigeria / Hybrid",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "1-3 years experience in customer research, customer experience (CX), customer support analytics, or UX research",
      "Strong analytical skills with qualitative feedback synthesis and Net Promoter Score (NPS) methodologies"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Competitive Salary + Health & Learning Stipend)",
    "benefits": [
      "Competitive tech compensation with annual equity review",
      "Comprehensive private medical, dental, and life insurance",
      "Annual $1,500 professional development and certification stipend",
      "Hybrid flexible work arrangement"
    ],
    "duration": "Full-time",
    "deadline": "2026-11-20",
    "applicationUrl": "https://flutterwave.com/careers",
    "officialSource": "https://flutterwave.com/careers",
    "sourceName": "Flutterwave Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Customer Experience",
      "CX",
      "Flutterwave",
      "UX Research",
      "Lagos",
      "Fintech"
    ],
    "requirements": [
      "CV / Resume",
      "Cover letter or portfolio of research / experience case studies",
      "Live analytical scenario interview"
    ],
    "applicationSteps": [
      "Online application via Flutterwave Careers",
      "Recruiter screening chat",
      "Take-home CX case study presentation",
      "Final team interviews"
    ],
    "status": "open",
    "createdAt": "2026-09-22T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-cx-04",
    "title": "Intercom Customer Success & Experience Specialist",
    "organization": {
      "id": "org-intercom",
      "name": "Intercom",
      "website": "https://www.intercom.com/careers",
      "description": "Pioneering customer messaging, AI support, and service engagement platform",
      "type": "Company"
    },
    "type": "Job",
    "description": "Drive proactive customer success, adoption workflows, and exceptional support experiences for high-growth SaaS customers. Use Intercom AI and conversational support tools to optimize customer satisfaction (CSAT) and lifetime retention.",
    "shortDescription": "Customer success and engagement specialist role at leading conversational AI and support platform.",
    "field": [
      "Customer Success",
      "Customer Experience",
      "Business Development"
    ],
    "subfields": [
      "Account Management",
      "Customer Retention",
      "SaaS Support",
      "Client Engagement"
    ],
    "location": "Dublin, Ireland / Remote",
    "remoteStatus": "Remote",
    "eligibility": [
      "Demonstrated passion for customer advocacy, digital onboarding, and SaaS service delivery",
      "Excellent written communication and troubleshooting skills in fast-paced environments"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (€45,000 - €55,000 + Stock Options)",
    "benefits": [
      "Full remote home-office budget and monthly wellness allowance",
      "Generous stock option grant with equity refreshers",
      "Comprehensive healthcare and pension contribution",
      "25 days annual leave plus company-wide recharge days"
    ],
    "duration": "Full-time",
    "deadline": "2026-11-25",
    "applicationUrl": "https://www.intercom.com/careers",
    "officialSource": "https://www.intercom.com/careers",
    "sourceName": "Intercom Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Customer Success",
      "Customer Experience",
      "Intercom",
      "Remote",
      "SaaS",
      "Dublin"
    ],
    "requirements": [
      "CV",
      "Short video or written introduction",
      "Customer scenario problem-solving assessment"
    ],
    "applicationSteps": [
      "Submit application on Intercom Greenhouse portal",
      "Values & experience screening call",
      "Interactive customer scenario workshop",
      "Leadership conversational interview"
    ],
    "status": "open",
    "createdAt": "2026-09-24T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-cx-05",
    "title": "Paystack CX Operations & Escalations Associate",
    "organization": {
      "id": "org-paystack",
      "name": "Paystack (Stripe)",
      "website": "https://paystack.com/careers",
      "description": "Leading modern online and offline payment provider across Africa",
      "type": "Company"
    },
    "type": "Job",
    "description": "Manage critical customer support escalations, transaction dispute workflows, and merchant operational reviews. Identify systematic operational bottlenecks and partner with engineering to build permanent UX fixes.",
    "shortDescription": "Customer experience operations and merchant service role at leading African payments infrastructure company.",
    "field": [
      "Customer Experience",
      "Operations",
      "Customer Success"
    ],
    "subfields": [
      "Escalation Management",
      "SLA Governance",
      "Merchant Operations",
      "Payments Support"
    ],
    "location": "Lagos, Nigeria / Remote (Worldwide)",
    "remoteStatus": "Remote",
    "eligibility": [
      "Strong empathy for merchants and small business owners",
      "Analytical mindset with keen eye for transactional detail and root-cause analysis"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Competitive Salary + Stripe Stock Options)",
    "benefits": [
      "Competitive compensation benchmarked against top global fintechs",
      "Stripe equity participation and 401(k) / pension matching",
      "Full remote flexibility with co-working space pass",
      "Annual health insurance, optical, and dental coverage"
    ],
    "duration": "Full-time",
    "deadline": "2026-12-05",
    "applicationUrl": "https://paystack.com/careers",
    "officialSource": "https://paystack.com/careers",
    "sourceName": "Paystack Jobs",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Paystack",
      "Customer Experience",
      "Operations",
      "Fintech",
      "Remote",
      "Lagos"
    ],
    "requirements": [
      "CV / LinkedIn Profile",
      "Writing sample / customer communication exercise"
    ],
    "applicationSteps": [
      "Online application",
      "Written customer communication assessment",
      "Operational problem-solving interview",
      "Culture chat"
    ],
    "status": "open",
    "createdAt": "2026-09-25T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-ux-02",
    "title": "Nielsen Norman Group UX Research & Service Design Grant",
    "organization": {
      "id": "org-nngroup",
      "name": "Nielsen Norman Group",
      "website": "https://www.nngroup.com",
      "description": "World leaders in research-based user experience and interaction design",
      "type": "Research Institute"
    },
    "type": "Grant",
    "description": "Provides non-dilutive research funding of up to $25,000 for early-career researchers, UX practitioners, and service designers investigating accessibility, inclusive design, and complex workflow usability.",
    "shortDescription": "Up to $25,000 research and field grant for innovative user experience and service design studies.",
    "field": [
      "UX Research",
      "Product Design",
      "UX/UI"
    ],
    "subfields": [
      "Service Design",
      "Usability Testing",
      "Accessibility",
      "User-Centered Research"
    ],
    "location": "Worldwide / Remote",
    "remoteStatus": "Remote",
    "eligibility": [
      "Open to graduate students, academic researchers, and UX design practitioners globally",
      "Proposals focused on empirical user testing methodologies and digital accessibility"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Grant ($15,000 - $25,000 USD)",
    "benefits": [
      "Direct non-dilutive research stipend",
      "Publication and co-authorship on Nielsen Norman Group research portal",
      "NN/g UX Master Certification scholarship waiver",
      "Dedicated mentorship from principal UX researchers"
    ],
    "duration": "9 months",
    "deadline": "2027-01-30",
    "applicationUrl": "https://www.nngroup.com/articles/ux-research-grant",
    "officialSource": "https://www.nngroup.com",
    "sourceName": "NN/g Research Grants",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "UX Research",
      "Product Design",
      "Grant",
      "Accessibility",
      "Remote"
    ],
    "requirements": [
      "Research proposal (max 4 pages)",
      "Methodology breakdown and participant recruitment plan",
      "CV of principal investigator / designer"
    ],
    "applicationSteps": [
      "Submit research abstract and budget outline",
      "Review by NN/g scientific committee",
      "Grant award notification"
    ],
    "status": "open",
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-ux-03",
    "title": "IDEO CoLab Design & Interaction Residency",
    "organization": {
      "id": "org-ideo",
      "name": "IDEO CoLab",
      "website": "https://www.ideocolab.com",
      "description": "Global design and innovation consultancy incubator",
      "type": "Company"
    },
    "type": "Fellowship",
    "description": "A funded 12-week design residency bringing together multidisciplinary designers, technologists, and researchers to prototype human-centered solutions for emerging technology, climate adaptation, and circular economies.",
    "shortDescription": "Funded 12-week human-centered design and interactive prototyping residency.",
    "field": [
      "Product Design",
      "UX/UI",
      "UX Research",
      "Innovation"
    ],
    "subfields": [
      "Interaction Design",
      "Service Design",
      "Human-Centered Prototyping",
      "Design Strategy"
    ],
    "location": "Cambridge, MA, USA / Remote",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Designers, interaction specialists, creative technologists, and design researchers",
      "Portfolio demonstrating user-centered design process and interactive prototypes"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid ($12,000 Fellowship Living Stipend)",
    "benefits": [
      "$4,000 monthly living stipend for the 12-week sprint",
      "Direct 1-on-1 mentorship from IDEO design directors and portfolio partners",
      "Prototyping equipment and software tooling allowance",
      "Demo day presentation to global design leaders and corporate venture partners"
    ],
    "duration": "12 weeks",
    "deadline": "2026-12-01",
    "applicationUrl": "https://www.ideocolab.com/fellowship",
    "officialSource": "https://www.ideocolab.com",
    "sourceName": "IDEO CoLab",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "IDEO",
      "Product Design",
      "UX/UI",
      "Fellowship",
      "Interaction Design",
      "Design Strategy"
    ],
    "requirements": [
      "Portfolio of 2-3 design case studies",
      "Personal statement on design philosophy",
      "Video intro"
    ],
    "applicationSteps": [
      "Online portfolio submission",
      "Design critique and whiteboard challenge",
      "Final cohort selection"
    ],
    "status": "open",
    "createdAt": "2026-09-20T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-tech-04",
    "title": "SANS Cyber Immersion Academy & GIAC Certification Scholarship",
    "organization": {
      "id": "org-sans",
      "name": "SANS Institute",
      "website": "https://www.sans.org/scholarship-academies",
      "description": "Global leader in cybersecurity training, research, and GIAC certifications",
      "type": "Professional Association"
    },
    "type": "Scholarship",
    "description": "A 100% fully funded cybersecurity academy scholarship providing 3 intensive SANS courses and industry-recognized GIAC certifications (GSEC, GCIH, GCFA), direct hands-on lab training, and employer hiring matchmaking.",
    "shortDescription": "100% funded cybersecurity training scholarship with triple GIAC certifications and employer recruiting.",
    "field": [
      "Cybersecurity",
      "Cloud",
      "Engineering"
    ],
    "subfields": [
      "Threat Analysis",
      "Incident Response",
      "Cloud Security",
      "GIAC Certification"
    ],
    "location": "Worldwide / Remote",
    "remoteStatus": "Remote",
    "eligibility": [
      "Open to students, career switchers, and early-career IT professionals worldwide",
      "No prior cybersecurity experience required; aptitude assessment conducted"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "100% Tuition Paid ($30,000+ Value in Coursework & Exams)",
    "benefits": [
      "Full tuition coverage for 3 elite SANS courses and GIAC certification exam attempts",
      "Hands-on access to SANS Cyber Ranges and live packet-analysis environments",
      "Career coaching, resume clinics, and direct interview placement with partner employers",
      "Alumni mentorship from certified security analysts"
    ],
    "duration": "6 months",
    "deadline": "2026-11-30",
    "applicationUrl": "https://www.sans.org/scholarship-academies",
    "officialSource": "https://www.sans.org",
    "sourceName": "SANS Institute",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Cybersecurity",
      "SANS",
      "Scholarship",
      "Remote",
      "Cloud",
      "Certification"
    ],
    "requirements": [
      "Online application",
      "SANS Cyber Talent Assessment test",
      "Short motivation essays"
    ],
    "applicationSteps": [
      "Complete aptitude assessment",
      "Submit background and career goal responses",
      "Admissions committee interview"
    ],
    "status": "open",
    "createdAt": "2026-09-10T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-deepmind-01",
    "title": "DeepMind AI & Machine Learning Research Fellowship",
    "organization": {
      "id": "org-deepmind",
      "name": "Google DeepMind",
      "website": "https://deepmind.google/about/scholarships",
      "description": "World-leading artificial intelligence research and neuroscience lab",
      "type": "Research Institute"
    },
    "type": "Fellowship",
    "description": "Prestigious fully funded fellowship supporting exceptional graduate and postgraduate researchers in artificial intelligence, reinforcement learning, mechanistic interpretability, and AI safety.",
    "shortDescription": "Full graduate funding, research allowance, and direct 1-on-1 DeepMind scientist mentorship.",
    "field": [
      "AI",
      "Machine Learning",
      "Academic Research",
      "Data Science"
    ],
    "subfields": [
      "Reinforcement Learning",
      "AI Safety",
      "Neural Architectures",
      "Scientific Machine Learning"
    ],
    "location": "London, UK",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Students admitted to or pursuing master's or PhD degrees in computer science, machine learning, mathematics, or related computational sciences"
    ],
    "educationRequirements": [
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Fully Funded (100% Tuition + £22,000 Annual Living Stipend + Conference Travel)",
    "benefits": [
      "Complete payment of university tuition fees throughout degree tenure",
      "Generous tax-free living stipend (£22,000+ per annum)",
      "£2,500 annual equipment and conference travel grant",
      "Personalized 1-on-1 mentorship from Google DeepMind research scientists"
    ],
    "duration": "1-3 years",
    "deadline": "2026-12-15",
    "applicationUrl": "https://deepmind.google/about/scholarships",
    "officialSource": "https://deepmind.google",
    "sourceName": "DeepMind Scholarships",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "DeepMind",
      "AI",
      "Machine Learning",
      "Fellowship",
      "London",
      "Research"
    ],
    "requirements": [
      "Academic transcripts and CV",
      "Research proposal on machine learning or AI alignment",
      "Two letters of academic reference"
    ],
    "applicationSteps": [
      "Submit fellowship dossier via university partnership office",
      "Joint DeepMind and faculty panel evaluation",
      "Fellowship award confirmation"
    ],
    "status": "open",
    "createdAt": "2026-09-08T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-law-03",
    "title": "Amnesty International Human Rights & Strategic Litigation Fellowship",
    "organization": {
      "id": "org-amnesty",
      "name": "Amnesty International",
      "website": "https://www.amnesty.org/en/careers",
      "description": "Global movement campaigning for internationally recognized human rights",
      "type": "Non-Profit"
    },
    "type": "Fellowship",
    "description": "A 1-year residential and field fellowship for legal scholars, human rights advocates, and policy analysts to work on strategic international litigation, regional fact-finding investigations, and advocacy campaigns.",
    "shortDescription": "Funded 1-year international legal fellowship investigating human rights abuses and international law governance.",
    "field": [
      "Law",
      "Human Rights",
      "Public Policy",
      "International Relations"
    ],
    "subfields": [
      "Strategic Litigation",
      "International Humanitarian Law",
      "Human Rights Advocacy",
      "Policy Fact-Finding"
    ],
    "location": "London, UK / Geneva, Switzerland / Remote",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Law graduates, human rights lawyers, or policy professionals with demonstrated commitment to social justice and civil liberties",
      "Fluent in English; working knowledge of French, Spanish, or Arabic is an asset"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Postgraduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (£38,000 Annual Fellowship Stipend + Travel Support)",
    "benefits": [
      "Full living stipend and pension contribution",
      "Direct litigation experience before international tribunals and UN treaty bodies",
      "Funded field fact-finding missions and international advocacy delegations",
      "Lifelong international human rights lawyer network"
    ],
    "duration": "1 year",
    "deadline": "2026-11-15",
    "applicationUrl": "https://www.amnesty.org/en/careers",
    "officialSource": "https://www.amnesty.org",
    "sourceName": "Amnesty International Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Law",
      "Human Rights",
      "Fellowship",
      "Public Policy",
      "International Relations",
      "London"
    ],
    "requirements": [
      "Legal CV",
      "Human rights writing sample (legal brief or memo)",
      "Two professional reference letters"
    ],
    "applicationSteps": [
      "Online application with writing sample",
      "Case study drafting exercise",
      "Panel interview with legal directors"
    ],
    "status": "open",
    "createdAt": "2026-09-15T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-vol-01",
    "title": "United Nations Volunteers (UNV) Youth Specialist Placement",
    "organization": {
      "id": "org-unv",
      "name": "United Nations Volunteers (UNV)",
      "website": "https://www.unv.org",
      "description": "UN organization that promotes volunteerism to support peace and sustainable development",
      "type": "International Organization"
    },
    "type": "Volunteering",
    "description": "Serve directly within UN agencies (UNDP, UNICEF, UNHCR, UNEP) on community development, climate resilience, public health outreach, and education initiatives across 130+ countries.",
    "shortDescription": "Funded UN youth volunteer assignments with living allowance, healthcare, and settlement grants.",
    "field": [
      "Social Impact",
      "International Relations",
      "Public Policy",
      "Education"
    ],
    "subfields": [
      "Community Development",
      "Sustainable Development Goals",
      "Humanitarian Relief",
      "Youth Empowerment"
    ],
    "location": "Worldwide / Regional Hubs",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Motivated individuals aged 18-29 with demonstrated community leadership and relevant undergraduate study or vocational experience",
      "Open to citizens of all UN member states"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Funded (Monthly Volunteer Living Allowance + Travel & Insurance)",
    "benefits": [
      "Monthly Volunteer Living Allowance (VLA) covering food, accommodation, and personal expenses",
      "Settlement grant, return airfare, and comprehensive global medical coverage",
      "Direct operational experience within the United Nations common system",
      "End-of-assignment resettlement allowance and career transition guidance"
    ],
    "duration": "6 to 12 months",
    "deadline": "2026-12-31",
    "applicationUrl": "https://app.unv.org",
    "officialSource": "https://www.unv.org",
    "sourceName": "UNV Unified Volunteer Platform",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "United Nations",
      "Volunteering",
      "Social Impact",
      "International Relations",
      "Global"
    ],
    "requirements": [
      "UNV Unified Roster profile",
      "Academic diplomas and CV",
      "Language proficiency verification"
    ],
    "applicationSteps": [
      "Create profile on Unified Volunteering Platform",
      "Apply to specific agency call for assignments",
      "Interviews conducted by host UN country office"
    ],
    "status": "open",
    "createdAt": "2026-09-12T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-climate-02",
    "title": "Breakthrough Energy Fellows (Bill Gates Climate Tech Fellowship)",
    "organization": {
      "id": "org-breakthrough",
      "name": "Breakthrough Energy",
      "website": "https://breakthrough-energy.org/fellows",
      "description": "Climate technology initiative founded by Bill Gates and global business leaders",
      "type": "Foundation"
    },
    "type": "Fellowship",
    "description": "Supports early-stage climate innovators, engineers, and scientists developing disruptive zero-carbon technologies across clean energy, manufacturing, agriculture, and carbon removal.",
    "shortDescription": "Non-dilutive grant funding of up to $500,000 for breakthrough clean tech and climate engineers.",
    "field": [
      "Clean Energy",
      "Climate & Sustainability",
      "Engineering",
      "Entrepreneurship"
    ],
    "subfields": [
      "Deep Decarbonization",
      "Energy Storage",
      "Carbon Removal",
      "Climate Tech Commercialization"
    ],
    "location": "Boston, MA, USA / Remote",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Innovator Fellows with novel technical solutions capable of reducing greenhouse gas emissions by at least 500 million tons annually at scale",
      "Open to researchers, PhDs, and technical founders globally"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Grant ($500,000+ Non-Dilutive Research & Salary Grant)",
    "benefits": [
      "Full researcher living salary stipend and direct lab prototyping budget",
      "Access to Breakthrough Energy technical advisors, corporate partners, and venture network",
      "Curriculum on techno-economic analysis, IP strategy, and commercial scaleup",
      "No equity taken by Breakthrough Energy"
    ],
    "duration": "1 to 2 years",
    "deadline": "2026-12-10",
    "applicationUrl": "https://breakthrough-energy.org/fellows",
    "officialSource": "https://breakthrough-energy.org",
    "sourceName": "Breakthrough Energy",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Climate",
      "Clean Energy",
      "Fellowship",
      "Grant",
      "Engineering",
      "Innovation"
    ],
    "requirements": [
      "Technical concept paper detailing greenhouse gas reduction mechanism",
      "Techno-economic viability model",
      "Founder CV and lab research background"
    ],
    "applicationSteps": [
      "Phase 1 online application",
      "Technical deep-dive evaluation with scientific reviewers",
      "Final selection committee pitch"
    ],
    "status": "open",
    "createdAt": "2026-09-14T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-climate-03",
    "title": "International Climate Protection Fellowship (Humboldt Foundation)",
    "organization": {
      "id": "org-humboldt",
      "name": "Alexander von Humboldt Foundation",
      "website": "https://www.humboldt-foundation.de/en/apply/sponsorship-programmes/international-climate-protection-fellowship",
      "description": "Prestigious German academic and international research foundation",
      "type": "Foundation"
    },
    "type": "Fellowship",
    "description": "Enables prospective leaders and postdoctoral researchers from non-European transition and developing countries to conduct a 12-to-24 month climate protection and biodiversity research project in Germany.",
    "shortDescription": "Prestigious German research fellowship providing €2,760/month living stipend and family allowances.",
    "field": [
      "Climate & Sustainability",
      "Environmental Science",
      "Academic Research",
      "Public Policy"
    ],
    "subfields": [
      "Climate Adaptation",
      "Biodiversity",
      "Renewable Resource Policy",
      "Environmental Governance"
    ],
    "location": "Berlin & Bonn, Germany",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Citizens of developing or transition countries with demonstrated initial leadership experience in climate protection, biodiversity, or environmental governance"
    ],
    "educationRequirements": [
      "Graduate",
      "Postgraduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Fully Funded (€2,170 - €2,760 Monthly Fellowship Allowance + Health & Family Support)",
    "benefits": [
      "Monthly living allowance of up to €2,760 plus health and liability insurance",
      "Intensive funded German language course prior to research stay",
      "Allowances for accompanying family members (spouses and children)",
      "Extensive Humboldt Foundation alumni network and lifetime re-invitation grants"
    ],
    "duration": "12 to 24 months",
    "deadline": "2027-02-01",
    "applicationUrl": "https://www.humboldt-foundation.de/en/apply/sponsorship-programmes/international-climate-protection-fellowship",
    "officialSource": "https://www.humboldt-foundation.de",
    "sourceName": "Humboldt Foundation",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Climate",
      "Humboldt Foundation",
      "Germany",
      "Fellowship",
      "Environmental Science",
      "Research"
    ],
    "requirements": [
      "Project proposal agreed with a German host academic institution",
      "Letter of host confirmation",
      "Two expert reference letters"
    ],
    "applicationSteps": [
      "Submit application on Humboldt portal",
      "Independent peer review",
      "Selection committee assessment and award notification"
    ],
    "status": "open",
    "createdAt": "2026-09-16T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-health-02",
    "title": "Wellcome Trust Master’s & Early-Career Health Research Award",
    "organization": {
      "id": "org-wellcome",
      "name": "Wellcome Trust",
      "website": "https://wellcome.org/grant-funding",
      "description": "Global charitable foundation supporting biomedical and health sciences research",
      "type": "Foundation"
    },
    "type": "Grant",
    "description": "Provides non-dilutive research funding of up to £120,000 for early-career health researchers in low- and middle-income countries conducting clinical, epidemiological, and health systems research.",
    "shortDescription": "Up to £120,000 research award for health researchers focusing on infectious diseases and health equity.",
    "field": [
      "Public Health",
      "Life Sciences",
      "Academic Research",
      "Healthcare Administration"
    ],
    "subfields": [
      "Epidemiology",
      "Infectious Diseases",
      "Health Systems",
      "Clinical Diagnostics"
    ],
    "location": "Worldwide / Remote",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Nationals of low- or middle-income countries pursuing research projects that improve human health and equity"
    ],
    "educationRequirements": [
      "Graduate",
      "Postgraduate",
      "PhD"
    ],
    "experienceRequirements": "Intermediate",
    "funding": "Grant (Up to £120,000 Research Funding & Salary Support)",
    "benefits": [
      "Full researcher salary stipend for up to 30 months",
      "Direct research materials, laboratory reagent costs, and participant fieldwork expenses",
      "Conference travel and open-access publication fees",
      "Mentorship pairing with international senior principal investigators"
    ],
    "duration": "30 months",
    "deadline": "2026-12-01",
    "applicationUrl": "https://wellcome.org/grant-funding/schemes/early-career-awards",
    "officialSource": "https://wellcome.org",
    "sourceName": "Wellcome Trust",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Wellcome Trust",
      "Public Health",
      "Life Sciences",
      "Grant",
      "Research",
      "Global Health"
    ],
    "requirements": [
      "Research proposal with clinical / public health justification",
      "Administering organization support letter",
      "Curriculum Vitae"
    ],
    "applicationSteps": [
      "Submit preliminary application on Wellcome portal",
      "Full proposal submission upon invitation",
      "Peer review and interview panel"
    ],
    "status": "open",
    "createdAt": "2026-09-15T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-health-03",
    "title": "EMBL International PhD & Postdoctoral Research Placement",
    "organization": {
      "id": "org-embl",
      "name": "European Molecular Biology Laboratory (EMBL)",
      "website": "https://www.embl.org/about/info/eipp",
      "description": "Europe's flagship laboratory for the life sciences and molecular biology",
      "type": "Research Institute"
    },
    "type": "Fellowship",
    "description": "Fully funded doctoral and postdoctoral research fellowships in molecular biology, biotechnology, genomics, and computational structural biology across EMBL sites in Germany, UK, France, and Italy.",
    "shortDescription": "Fully funded life sciences fellowship with full tuition waiver, living stipend, and lab funding.",
    "field": [
      "Life Sciences",
      "Biotechnology",
      "Academic Research",
      "Engineering"
    ],
    "subfields": [
      "Genomics",
      "Structural Biology",
      "Bioinformatics",
      "Cell Biology"
    ],
    "location": "Heidelberg, Germany / Cambridge, UK",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Applicants with a university degree in life sciences, biotechnology, chemistry, physics, or computational biology"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate",
      "Postgraduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Fully Funded (100% Tuition Waiver + €2,400 Monthly Living Stipend)",
    "benefits": [
      "Competitive monthly stipend and comprehensive health insurance",
      "Access to cutting-edge cryo-electron microscopy and supercomputing infrastructure",
      "Travel grants for international scientific conferences",
      "World-class multidisciplinary training and collaborative faculty mentorship"
    ],
    "duration": "3.5 to 4 years",
    "deadline": "2026-11-20",
    "applicationUrl": "https://www.embl.org/about/info/eipp",
    "officialSource": "https://www.embl.org",
    "sourceName": "EMBL International Fellowships",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "EMBL",
      "Life Sciences",
      "Biotechnology",
      "Fellowship",
      "Germany",
      "Research"
    ],
    "requirements": [
      "Academic transcripts and degree certificates",
      "Research motivation letter",
      "Two academic recommendation letters"
    ],
    "applicationSteps": [
      "Online application via EMBL recruitment portal",
      "Initial faculty evaluation and shortlisting",
      "Virtual and on-site interview days in Heidelberg"
    ],
    "status": "open",
    "createdAt": "2026-09-17T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-mkt-02",
    "title": "HubSpot Digital Marketing & Growth Apprenticeship",
    "organization": {
      "id": "org-hubspot-mkt",
      "name": "HubSpot",
      "website": "https://www.hubspot.com/careers",
      "description": "Leading customer relationship management, digital marketing, and sales platform",
      "type": "Company"
    },
    "type": "Programme",
    "description": "An intensive paid 12-month growth apprenticeship focusing on inbound digital marketing, content strategy, SEO analytics, and multichannel audience acquisition.",
    "shortDescription": "Paid 12-month digital marketing and growth apprenticeship with HubSpot Inbound certifications.",
    "field": [
      "Digital Marketing",
      "Content Marketing",
      "Communications",
      "Business Development"
    ],
    "subfields": [
      "Inbound Marketing",
      "SEO Analytics",
      "Audience Growth",
      "Content Strategy"
    ],
    "location": "Dublin, Ireland / Remote",
    "remoteStatus": "Remote",
    "eligibility": [
      "Aspiring marketers, creative storytellers, or career switchers with strong communication skills and digital curiosity"
    ],
    "educationRequirements": [
      "Any"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid (Full Apprenticeship Salary €36,000/yr + Benefits)",
    "benefits": [
      "Competitive annual salary and tuition-free training",
      "Full remote work equipment allowance",
      "Funded HubSpot Academy Master Inbound credentials",
      "Fast-track conversion to permanent full-time Growth Marketing Associate"
    ],
    "duration": "12 months",
    "deadline": "2026-12-10",
    "applicationUrl": "https://www.hubspot.com/careers",
    "officialSource": "https://www.hubspot.com/careers",
    "sourceName": "HubSpot Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "HubSpot",
      "Digital Marketing",
      "Content Marketing",
      "Apprenticeship",
      "Remote"
    ],
    "requirements": [
      "CV",
      "Short written marketing pitch or campaign idea"
    ],
    "applicationSteps": [
      "Online application",
      "Practical content/campaign exercise",
      "Team conversational interview"
    ],
    "status": "open",
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-fin-03",
    "title": "Morgan Stanley Sustainable Finance & Impact Investing Fellowship",
    "organization": {
      "id": "org-morgan-stanley",
      "name": "Morgan Stanley Institute for Sustainable Investing",
      "website": "https://www.morganstanley.com/sustainable-investing",
      "description": "Global financial services leader driving sustainable capital allocation",
      "type": "Company"
    },
    "type": "Fellowship",
    "description": "A funded 1-year graduate fellowship working alongside senior investment bankers, ESG analysts, and sustainable finance directors on green bonds, renewable asset financing, and impact metrics.",
    "shortDescription": "Funded 1-year sustainable finance and ESG investment fellowship in New York and London.",
    "field": [
      "Finance",
      "Investment",
      "Venture Capital",
      "Climate & Sustainability"
    ],
    "subfields": [
      "Sustainable Finance",
      "ESG Asset Valuation",
      "Impact Investing",
      "Green Bond Structuring"
    ],
    "location": "New York, USA / London, UK",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Graduating seniors or master's students in finance, economics, business, or environmental policy with strong financial modeling skills"
    ],
    "educationRequirements": [
      "Undergraduate",
      "Graduate"
    ],
    "experienceRequirements": "Beginner",
    "funding": "Paid ($85,000 - $105,000 Pro-Rata Salary + Sign-on Bonus)",
    "benefits": [
      "Full competitive Wall Street / London investment analyst salary",
      "1-on-1 executive mentorship from Managing Directors",
      "Direct exposure to institutional asset managers and ESG portfolios",
      "Direct pathway to full-time investment banking associate roles"
    ],
    "duration": "1 year",
    "deadline": "2026-11-15",
    "applicationUrl": "https://www.morganstanley.com/people-opportunities/students-graduates",
    "officialSource": "https://www.morganstanley.com",
    "sourceName": "Morgan Stanley Careers",
    "lastVerified": "2026-10-01T00:00:00.000Z",
    "verificationStatus": "Verified",
    "tags": [
      "Morgan Stanley",
      "Finance",
      "Investment",
      "Sustainable Finance",
      "Fellowship",
      "New York",
      "London"
    ],
    "requirements": [
      "CV with financial modeling coursework / experience",
      "Statement of interest in sustainable finance",
      "Academic transcript"
    ],
    "applicationSteps": [
      "Online application via Morgan Stanley campus portal",
      "HireVue on-demand video interview",
      "Virtual assessment center and financial valuation case"
    ],
    "status": "open",
    "createdAt": "2026-09-12T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-jour-02",
    "title": "Reuters Institute Journalism Fellowship",
    "organization": {
      "id": "org-reuters-institute",
      "name": "Reuters Institute for the Study of Journalism",
      "website": "https://reutersinstitute.politics.ox.ac.uk/fellowships",
      "description": "Part of the University of Oxford, the Reuters Institute is one of the world's leading centres for the study of journalism.",
      "type": "University"
    },
    "type": "Fellowship",
    "description": "A highly competitive programme bringing together journalists and media professionals from around the world to Oxford University. Fellows spend 4–6 months conducting independent research on journalism, media, and the information environment, attending seminars with global media leaders and publishing original research.",
    "shortDescription": "Oxford-based journalism research fellowship for mid-career journalists and media professionals from around the world.",
    "field": ["Journalism", "Media", "Communications", "Academic Research"],
    "subfields": ["Investigative Journalism", "Digital Media", "Press Freedom", "Media Policy"],
    "tags": ["journalism", "media", "oxford", "research fellowship", "press freedom", "mid-career"],
    "location": "Oxford, United Kingdom",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Minimum 5 years professional journalism or media experience",
      "Strong track record of published or broadcast work",
      "Applicants from any country welcome",
      "Both broadcast and print/digital journalists eligible"
    ],
    "requirements": ["Portfolio of published/broadcast work", "Research proposal (1,500 words)", "Two referees", "Proof of current media employment"],
    "deadline": "2027-01-31",
    "duration": "4-6 months",
    "stipend": { "amount": 16000, "currency": "GBP", "frequency": "one-time", "notes": "Stipend covers living costs in Oxford; travel grant also available" },
    "isFunded": true,
    "applicationUrl": "https://reutersinstitute.politics.ox.ac.uk/fellowships/reuters-institute-journalism-fellows",
    "applicationSteps": [
      "Complete online application form",
      "Submit research proposal",
      "Provide two professional references",
      "Shortlisted candidates interviewed by panel"
    ],
    "status": "open",
    "createdAt": "2026-09-15T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-bio-02",
    "title": "Wellcome Sanger Institute PhD & Research Fellowship",
    "organization": {
      "id": "org-wellcome-sanger",
      "name": "Wellcome Sanger Institute",
      "website": "https://www.sanger.ac.uk/programmes/education/phd-programme",
      "description": "One of the world's leading genome research centres, playing a key role in the Human Genome Project and advancing genomics globally.",
      "type": "Research Institute"
    },
    "type": "Fellowship",
    "description": "The Wellcome Sanger Institute offers fully funded PhD programmes and postdoctoral fellowships in genomics, computational biology, and biotechnology. Research spans cancer genomics, malaria, genetic epidemiology, and single-cell technologies. Fellows work alongside world-class scientists at the Wellcome Genome Campus in Cambridge.",
    "shortDescription": "Fully funded PhD and postdoctoral research fellowships in genomics and biotechnology at one of the world's top genome centres.",
    "field": ["Biotechnology", "Life Sciences", "Academic Research", "Engineering"],
    "subfields": ["Genomics", "Computational Biology", "Cancer Research", "Bioinformatics"],
    "tags": ["biotechnology", "genomics", "PhD", "postdoc", "cambridge", "wellcome", "life sciences"],
    "location": "Cambridge, United Kingdom",
    "remoteStatus": "In-Person",
    "eligibility": [
      "First-class or upper-second-class degree in biological sciences, computing, or related field",
      "Strong research experience preferred for postdoc positions",
      "International students welcome",
      "PhD candidates must apply through specific supervisor project listings"
    ],
    "requirements": ["Academic transcripts", "Personal statement", "Two academic references", "Research statement (postdocs)"],
    "deadline": "2027-02-28",
    "duration": "3-4 years (PhD) / 2-3 years (postdoc)",
    "stipend": { "amount": 22000, "currency": "GBP", "frequency": "annual", "notes": "Fully funded PhD including stipend, fees, and research expenses" },
    "isFunded": true,
    "applicationUrl": "https://www.sanger.ac.uk/programmes/education/phd-programme",
    "applicationSteps": [
      "Browse open PhD projects on the Sanger website",
      "Contact prospective supervisor",
      "Submit formal application with transcripts and personal statement",
      "Interview with research group"
    ],
    "status": "open",
    "createdAt": "2026-09-20T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-agri-02",
    "title": "FAO Young Professionals Programme",
    "organization": {
      "id": "org-fao",
      "name": "Food and Agriculture Organization of the United Nations",
      "website": "https://www.fao.org/employment/young-professionals-programme/en",
      "description": "The UN's lead agency for food security, agricultural development, rural development, and sustainable management of natural resources.",
      "type": "International Organization"
    },
    "type": "Programme",
    "description": "The FAO Young Professionals Programme recruits early-career professionals to work across FAO's global operations covering food systems, agricultural development, rural livelihoods, fisheries, forestry, and nutrition. YPPs work on policy analysis, field programme implementation, technical support to governments, and data analysis over a two-year fixed-term appointment at FAO HQ in Rome or field offices.",
    "shortDescription": "Two-year professional placement at the UN's food and agriculture agency, covering food systems, agriculture, and rural development globally.",
    "field": ["Agriculture", "Environmental Science", "Public Policy", "Social Impact", "International Relations"],
    "subfields": ["Food Systems", "Agricultural Policy", "Rural Development", "Nutrition", "Food Security"],
    "tags": ["agriculture", "food security", "UN", "FAO", "Rome", "international development", "young professionals"],
    "location": "Rome, Italy / Global field offices",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Nationals of FAO member countries (priority given to underrepresented countries)",
      "Master's degree or equivalent in agriculture, economics, natural sciences, or related field",
      "Under 32 years of age at time of application",
      "No prior employment with the UN system"
    ],
    "requirements": ["University degree certificate", "Cover letter", "Online application through FAO careers portal", "Language proficiency in one UN language"],
    "deadline": "2027-03-31",
    "duration": "2 years",
    "stipend": { "amount": 58000, "currency": "USD", "frequency": "annual", "notes": "Professional salary according to UN P2 grade with full UN benefits package" },
    "isFunded": true,
    "applicationUrl": "https://www.fao.org/employment/young-professionals-programme/en",
    "applicationSteps": [
      "Create profile on FAO e-Recruitment portal",
      "Complete full online application",
      "Submit supporting documents",
      "Written assessment and competency-based interview for shortlisted candidates"
    ],
    "status": "open",
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-teach-02",
    "title": "Teach First Leadership Development Programme",
    "organization": {
      "id": "org-teach-first",
      "name": "Teach First",
      "website": "https://www.teachfirst.org.uk/our-programme",
      "description": "UK's largest graduate employer and a leading education charity working to end educational inequality.",
      "type": "Non-Profit"
    },
    "type": "Programme",
    "description": "Teach First's Leadership Development Programme (LDP) places passionate graduates in low-income schools as fully qualified, salaried teachers for two years. Participants receive a full PGCE qualification, a postgraduate diploma in education and leadership, and ongoing leadership coaching. Teach First alumni become leaders across education, business, policy, and the third sector.",
    "shortDescription": "Two-year paid teaching and leadership programme in underserved schools, leading to PGCE qualification and a career in education or leadership.",
    "field": ["Teaching", "Education", "Social Impact", "Leadership"],
    "subfields": ["Secondary Education", "Primary Education", "Educational Leadership", "STEM Education"],
    "tags": ["teaching", "education", "PGCE", "graduate", "school", "UK", "leadership", "social impact"],
    "location": "United Kingdom (various regions)",
    "remoteStatus": "In-Person",
    "eligibility": [
      "2:1 degree or above (or equivalent)",
      "Applicants who demonstrate passion for tackling educational inequality",
      "UK residents eligible to work in the UK",
      "Degree in a relevant subject for specialist subject teaching"
    ],
    "requirements": ["Online application", "Telephone interview", "Assessment centre", "References"],
    "deadline": "2027-04-30",
    "duration": "2 years",
    "stipend": { "amount": 28000, "currency": "GBP", "frequency": "annual", "notes": "Full teaching salary paid by school throughout the programme; PGCE funded" },
    "isFunded": true,
    "applicationUrl": "https://www.teachfirst.org.uk/our-programme",
    "applicationSteps": [
      "Online application and eligibility check",
      "Telephone interview",
      "Selection day (in-person or virtual assessment centre)",
      "School placement and training begin in September"
    ],
    "status": "open",
    "createdAt": "2026-09-22T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-hr-02",
    "title": "SHRM Foundation HR Rising Stars Fellowship",
    "organization": {
      "id": "org-shrm-foundation",
      "name": "SHRM Foundation",
      "website": "https://www.shrm.org/foundation/pages/default.aspx",
      "description": "The philanthropic arm of SHRM (Society for Human Resource Management), the world's largest HR professional society.",
      "type": "Foundation"
    },
    "type": "Fellowship",
    "description": "The SHRM Foundation HR Rising Stars Fellowship supports early-career HR professionals with funding, mentorship, professional development access, and networking within the global HR community. Fellows receive a scholarship award, attend the SHRM Annual Conference, access a dedicated mentorship programme with senior HR leaders, and participate in inclusive workplace research projects.",
    "shortDescription": "Fellowship for early-career HR professionals with funding, mentorship, and access to the global SHRM HR community.",
    "field": ["Human Resources", "Business", "Social Impact"],
    "subfields": ["People Operations", "Talent Acquisition", "Diversity & Inclusion", "Workforce Development"],
    "tags": ["HR", "human resources", "fellowship", "SHRM", "diversity", "people operations", "early career"],
    "location": "Remote / United States",
    "remoteStatus": "Remote",
    "eligibility": [
      "Currently enrolled in an HR, business, or related graduate programme OR early in HR career (under 5 years)",
      "Demonstrated commitment to advancing inclusive workplaces",
      "SHRM student or professional membership preferred"
    ],
    "requirements": ["Online application", "Personal essay", "Academic transcripts or employment verification", "Two recommendations"],
    "deadline": "2027-02-14",
    "duration": "1 year",
    "stipend": { "amount": 5000, "currency": "USD", "frequency": "one-time", "notes": "Fellowship award plus conference access; mentorship and professional development included" },
    "isFunded": true,
    "applicationUrl": "https://www.shrm.org/foundation/pages/default.aspx",
    "applicationSteps": [
      "Complete online application",
      "Submit personal statement and supporting documents",
      "Letters of recommendation submitted directly by referees",
      "Awards announced at SHRM Annual Conference"
    ],
    "status": "open",
    "createdAt": "2026-09-25T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-rights-02",
    "title": "Open Society Foundations Human Rights Initiative Fellowship",
    "organization": {
      "id": "org-osf",
      "name": "Open Society Foundations",
      "website": "https://www.opensocietyfoundations.org/grants",
      "description": "The world's largest private funder of independent groups working for justice, democratic governance, and human rights.",
      "type": "Foundation"
    },
    "type": "Fellowship",
    "description": "The Open Society Human Rights Initiative Fellowship supports advocates, lawyers, researchers, and activists working on systemic human rights challenges. Fellows work within OSF-supported initiatives on issues including criminal justice reform, statelessness, freedom of expression, LGBTQI+ rights, and racial justice. Placements are embedded within OSF programmes globally.",
    "shortDescription": "Funded fellowship for human rights practitioners working on systemic justice, advocacy, and legal reform with Open Society Foundations.",
    "field": ["Human Rights", "Law", "Governance", "Social Impact", "Public Policy"],
    "subfields": ["Advocacy", "Criminal Justice Reform", "Freedom of Expression", "International Human Rights Law"],
    "tags": ["human rights", "fellowship", "open society", "advocacy", "justice", "law", "NGO"],
    "location": "New York, USA / London, UK / Brussels, Belgium / Various",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Proven track record in human rights work, law, or advocacy",
      "Minimum 3 years professional experience in the field",
      "Strong written and spoken English",
      "Applications accepted globally"
    ],
    "requirements": ["CV/Resume", "Cover letter explaining alignment with OSF mission", "Two professional references", "Work samples or portfolio"],
    "deadline": "2027-01-15",
    "duration": "1 year",
    "stipend": { "amount": 72000, "currency": "USD", "frequency": "annual", "notes": "Competitive professional salary with full benefits; varies by location and grade" },
    "isFunded": true,
    "applicationUrl": "https://www.opensocietyfoundations.org/grants",
    "applicationSteps": [
      "Review current fellowship openings on OSF website",
      "Submit application through OSF grants portal",
      "Programme-specific interviews for shortlisted candidates",
      "Final selection by programme directors"
    ],
    "status": "open",
    "createdAt": "2026-09-28T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-gov-02",
    "title": "Tony Blair Institute for Global Change Policy Fellowship",
    "organization": {
      "id": "org-tbi",
      "name": "Tony Blair Institute for Global Change",
      "website": "https://institute.global/careers",
      "description": "A global policy institute working with political leaders to deliver change that will make a difference to people across the world.",
      "type": "Non-Profit"
    },
    "type": "Fellowship",
    "description": "The Tony Blair Institute Policy Fellowship embeds talented early-career and mid-career professionals in government advisory roles across Africa, the Middle East, and Southeast Asia. Fellows work directly with heads of government and senior ministers on economic reform, governance, digital transformation, and state delivery. Placements are typically 6–12 months at country offices.",
    "shortDescription": "Embedded government advisory fellowship placing fellows with heads of state and senior ministers across Africa, the Middle East and Asia.",
    "field": ["Governance", "Public Policy", "International Relations", "Entrepreneurship", "Technology"],
    "subfields": ["Government Reform", "Economic Policy", "Digital Government", "Political Economy"],
    "tags": ["governance", "policy", "government", "Africa", "advisory", "fellowship", "public sector"],
    "location": "Sub-Saharan Africa / Middle East / Southeast Asia",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Strong academic background in economics, public policy, law, or international relations",
      "Excellent analytical and communication skills",
      "Prior experience in government, consulting, finance, or policy strongly preferred",
      "Willingness to be based in a developing country for the duration"
    ],
    "requirements": ["CV/Resume", "Cover letter", "Policy writing sample", "Two professional references"],
    "deadline": "2027-03-15",
    "duration": "6-12 months",
    "stipend": { "amount": 45000, "currency": "USD", "frequency": "annual", "notes": "Competitive salary, accommodation support, and travel covered" },
    "isFunded": true,
    "applicationUrl": "https://institute.global/careers",
    "applicationSteps": [
      "Apply through TBI careers portal",
      "Written exercise and case study assessment",
      "Panel interview with senior team",
      "Country placement match and onboarding"
    ],
    "status": "open",
    "createdAt": "2026-09-30T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },
  {
    "id": "opp-reforge-01",
    "title": "Reforge Product Management Residency",
    "organization": {
      "id": "org-reforge",
      "name": "Reforge",
      "website": "https://www.reforge.com/programs/product-management",
      "description": "Reforge is the premier professional development platform for growth, product, and technology leaders. Built by practitioners, for practitioners.",
      "type": "Company"
    },
    "type": "Programme",
    "description": "Reforge's Product Management Residency is an intensive cohort-based programme for early-to-mid career PMs looking to level up. Residents work through a structured curriculum covering product strategy, discovery, prioritisation, metrics, and stakeholder communication, guided by senior PMs from top technology companies. The programme includes peer learning, mentor sessions, and live case studies.",
    "shortDescription": "Intensive cohort-based product management development programme taught by senior PMs from leading technology companies.",
    "field": ["Product Management", "Technology", "Strategy", "Entrepreneurship"],
    "subfields": ["Product Strategy", "User Discovery", "Product Analytics", "Roadmapping"],
    "tags": ["product management", "PM", "product strategy", "career development", "cohort", "technology"],
    "location": "Remote (Worldwide)",
    "remoteStatus": "Remote",
    "eligibility": [
      "At least 1 year of product management experience preferred",
      "Career changers with adjacent backgrounds considered",
      "Strong interest in building user-centred products",
      "Application essay required to assess fit"
    ],
    "requirements": ["Online application", "Short essay questions", "Professional background overview"],
    "deadline": "2027-02-28",
    "duration": "8 weeks per cohort",
    "stipend": { "amount": 2495, "currency": "USD", "frequency": "one-time", "notes": "Programme fee; employer-sponsored spots and scholarships available for underrepresented applicants" },
    "isFunded": false,
    "applicationUrl": "https://www.reforge.com/programs/product-management",
    "applicationSteps": [
      "Submit online application",
      "Complete short essay questions",
      "Receive admission decision",
      "Enrol and join cohort Slack community"
    ],
    "status": "open",
    "createdAt": "2026-10-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": false
  },
  {
    "id": "opp-innov-02",
    "title": "MIT Solve Global Challenges Fellowship",
    "organization": {
      "id": "org-mit-solve",
      "name": "MIT Solve",
      "website": "https://solve.mit.edu/fellowships",
      "description": "MIT Solve is a social enterprise with a mission to solve world challenges by connecting innovators with resources through an open innovation marketplace.",
      "type": "University"
    },
    "type": "Fellowship",
    "description": "MIT Solve's Global Challenges Fellowship provides funding, mentorship, network access, and MIT faculty engagement to innovators and entrepreneurs tackling global problems. Fellows receive up to $10,000 USD in prize funding, a one-year MIT Solve membership with community access, connections to a curated investor network, legal and business support, and participation in the annual MIT Solve Innovation Summit.",
    "shortDescription": "Funding, mentorship and MIT network access for innovators and early-stage entrepreneurs tackling global challenges.",
    "field": ["Innovation", "Entrepreneurship", "Social Impact", "Technology"],
    "subfields": ["Social Innovation", "EdTech", "HealthTech", "ClimateTech", "FinTech for Good"],
    "tags": ["innovation", "MIT", "social enterprise", "global challenges", "startup", "fellowship", "funding"],
    "location": "Remote (Global) / Cambridge, MA, USA (Summit)",
    "remoteStatus": "Remote",
    "eligibility": [
      "Innovators, entrepreneurs, or researchers at any stage",
      "Working on solutions to specific MIT Solve challenge areas",
      "Open to individuals and teams from any country",
      "Non-profit, for-profit, and hybrid organisations all eligible"
    ],
    "requirements": ["Online Solver application", "2-minute solution video", "Problem and solution narrative", "Impact and financial plan"],
    "deadline": "2027-03-01",
    "duration": "1 year",
    "stipend": { "amount": 10000, "currency": "USD", "frequency": "one-time", "notes": "Prize funding plus additional funding opportunities through Solve Funding Pool" },
    "isFunded": true,
    "applicationUrl": "https://solve.mit.edu/fellowships",
    "applicationSteps": [
      "Review open challenge areas on MIT Solve website",
      "Submit Solver application including video pitch",
      "Judging by MIT faculty, investors, and domain experts",
      "Selected Solvers announced at MIT Solve Innovation Summit"
    ],
    "status": "open",
    "createdAt": "2026-10-01T00:00:00.000Z",
    "updatedAt": "2026-10-01T00:00:00.000Z",
    "isFeatured": true
  },

  // ─── NEW VERIFIED ADDITIONS — 2026-10-11 ───────────────────────────────────

  {
    "id": "opp-tef-01",
    "title": "Tony Elumelu Foundation Entrepreneurship Programme",
    "organization": {
      "id": "org-tef",
      "name": "Tony Elumelu Foundation",
      "website": "https://www.tonyelumelufoundation.org",
      "description": "Africa's leading private-sector development foundation, committed to empowering African entrepreneurs across all 54 African countries.",
      "type": "Foundation"
    },
    "type": "Programme",
    "description": "The Tony Elumelu Foundation Entrepreneurship Programme is the world's largest African private-sector initiative for empowering African entrepreneurs. Selected entrepreneurs from all 54 African countries receive $5,000 USD in non-refundable seed capital, 12 weeks of world-class business management training, mentorship from a network of experienced African business leaders, and access to the TEFConnect platform of over 1.5 million entrepreneurs. The programme targets early-stage business ideas and businesses up to approximately 5 years old.",
    "shortDescription": "$5,000 USD seed capital, business training, and mentorship for entrepreneurs from all 54 African countries.",
    "field": ["Entrepreneurship", "Business", "Social Impact"],
    "subfields": ["Startup Funding", "Business Development", "SME Growth", "African Enterprise"],
    "tags": ["entrepreneurship", "Africa", "seed funding", "TEF", "all 54 countries", "startup", "mentorship"],
    "location": "All 54 African Countries (remote training + in-person events)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Citizen or legal resident of any of the 54 African countries",
      "Early-stage business idea or business up to approximately 5 years old",
      "Age 18 or older",
      "Committed to growing a business in Africa"
    ],
    "educationRequirements": ["Any"],
    "experienceRequirements": "Beginner",
    "funding": "$5,000 USD non-refundable seed capital",
    "benefits": [
      "$5,000 USD non-refundable seed capital",
      "12-week online business training curriculum",
      "One-on-one mentorship with experienced business leaders",
      "Access to TEFConnect network of 1.5M+ African entrepreneurs",
      "Opportunity for additional funding from TEF"
    ],
    "duration": "12 weeks training + ongoing community",
    "deadline": "2027-03-31",
    "applicationUrl": "https://www.tefconnect.com",
    "officialSource": "https://www.tonyelumelufoundation.org/tef-programme",
    "sourceName": "Tony Elumelu Foundation",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Online application via TEFConnect platform", "Business idea or plan summary", "Personal and business details"],
    "applicationSteps": [
      "Register on TEFConnect (opens January 1, 2027)",
      "Complete application form with business information",
      "Submit before March 31, 2027 deadline",
      "Shortlisted applicants invited to business plan stage",
      "Selected entrepreneurs announced and training begins"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": true
  },

  {
    "id": "opp-daad-africa-01",
    "title": "DAAD In-Country/In-Region Scholarship for Sub-Saharan Africa",
    "organization": {
      "id": "org-daad",
      "name": "DAAD (German Academic Exchange Service)",
      "website": "https://www.daad.de",
      "description": "The world's largest funding organisation for the international exchange of students and researchers, funded by the German Federal Foreign Office.",
      "type": "Government"
    },
    "type": "Scholarship",
    "description": "The DAAD In-Country/In-Region Scholarship Programme provides fully funded scholarships for development-related Master's and doctoral degrees within Sub-Saharan Africa. The programme allows students to study at a participating institution in their home country (In-Country) or at another participating institution in the Sub-Saharan region (In-Region), without needing to travel to Germany. The goal is to strengthen higher education capacity in Africa and support researchers who will contribute to the sustainable development of their home countries.",
    "shortDescription": "Fully funded scholarships for postgraduate study in development-related fields at participating Sub-Saharan African universities.",
    "field": ["Academic Research", "Development", "Engineering", "Agriculture", "Healthcare", "Public Policy"],
    "subfields": ["Development Studies", "Regional Higher Education", "Sustainable Development", "Research"],
    "tags": ["DAAD", "scholarship", "Africa", "Sub-Saharan", "postgraduate", "development", "fully funded", "masters", "PhD"],
    "location": "Sub-Saharan Africa (participating universities)",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Graduate or postgraduate applicant from a Sub-Saharan African country",
      "Intending to pursue a development-related Master's or doctoral degree",
      "Aiming for a career in teaching, research, or sustainable development",
      "Must apply to a participating university programme alongside scholarship application"
    ],
    "educationRequirements": ["Graduate", "Postgraduate"],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded (tuition, living allowance, health insurance, travel)",
    "benefits": [
      "Full tuition coverage at participating university",
      "Monthly living allowance",
      "Health insurance",
      "Travel costs within the region"
    ],
    "duration": "1-3 years (depending on programme)",
    "deadline": "2026-11-12",
    "applicationUrl": "https://portal.meindaad.de",
    "officialSource": "https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarship-programmes/in-country-regional-programme-for-sub-saharan-africa/",
    "sourceName": "DAAD Scholarship Database",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Academic transcripts", "Motivation letter", "CV", "Two academic references", "Admission to participating university programme"],
    "applicationSteps": [
      "Identify a development-related postgraduate programme at a participating Sub-Saharan African university",
      "Apply for university admission simultaneously",
      "Submit scholarship application via DAAD portal (portal.meindaad.de) by November 12, 2026",
      "Scholarship selection by DAAD and partner institutions"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": true
  },

  {
    "id": "opp-au-intern-01",
    "title": "African Union Commission Internship Programme",
    "organization": {
      "id": "org-au-commission",
      "name": "African Union Commission",
      "website": "https://au.int",
      "description": "The secretariat of the African Union, the continental body of 55 member states covering the entire African continent, headquartered in Addis Ababa, Ethiopia.",
      "type": "International Organisation"
    },
    "type": "Internship",
    "description": "The African Union Commission Internship Programme is a full-time professional development opportunity for students and recent graduates from AU Member States. Interns are placed across departments at the AU Commission headquarters in Addis Ababa, Ethiopia, and at AU field offices across the continent. Departments include Peace and Security, Economic Affairs, Social Affairs, Political Affairs, Infrastructure and Energy, and more. The programme provides hands-on exposure to continental policy-making, governance, and programme implementation.",
    "shortDescription": "Full-time internship at the African Union Commission in Addis Ababa and continental offices, open to nationals of all 55 AU member states.",
    "field": ["Governance", "Public Policy", "International Relations", "Social Impact", "Development"],
    "subfields": ["Continental Policy", "Peace and Security", "Economic Policy", "African Union Affairs"],
    "tags": ["African Union", "AU", "internship", "Africa", "all 55 member states", "Addis Ababa", "policy", "governance"],
    "location": "Addis Ababa, Ethiopia / AU Field Offices (Africa)",
    "remoteStatus": "In-Person",
    "eligibility": [
      "National of an African Union Member State",
      "Enrolled in the final year of a Bachelor's degree, or holds a Bachelor's, Master's, or postgraduate qualification",
      "32 years of age or younger at time of selection",
      "Fluent in at least one AU working language: Arabic, English, French, Portuguese, or Kiswahili"
    ],
    "educationRequirements": ["Undergraduate", "Graduate", "Postgraduate"],
    "experienceRequirements": "Beginner",
    "funding": "Unpaid (self-funded travel, accommodation, and living expenses)",
    "benefits": [
      "Direct exposure to continental policy-making processes",
      "Professional network within the African Union system",
      "Certificate of completion from the African Union Commission"
    ],
    "duration": "3-6 months",
    "deadline": "2026-12-31",
    "applicationUrl": "https://careers.au.int",
    "officialSource": "https://au.int/en/internship",
    "sourceName": "African Union Careers Portal",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Online application via AU Careers portal", "AU Personal History Form (PHF)", "CV", "Academic transcripts or degree certificate", "Motivation letter"],
    "applicationSteps": [
      "Create account on AU Careers portal (careers.au.int)",
      "Complete AU Personal History Form (PHF)",
      "Search available internship notices and submit application",
      "Submit before December 31, 2026 deadline"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": false
  },

  {
    "id": "opp-mcf-uct-01",
    "title": "Mastercard Foundation Scholars Program at University of Cape Town (UCT)",
    "organization": {
      "id": "org-uct-mcf",
      "name": "Mastercard Foundation / University of Cape Town",
      "website": "https://www.uct.ac.za/mastercardfdn",
      "description": "The Mastercard Foundation Scholars Program at UCT provides fully funded postgraduate scholarships for outstanding Africans demonstrating academic excellence and commitment to giving back to their communities.",
      "type": "University"
    },
    "type": "Scholarship",
    "description": "The Mastercard Foundation Scholars Program at UCT provides fully funded postgraduate scholarships for academically outstanding students from across Africa who demonstrate commitment to giving back and transforming their communities. The scholarship covers tuition fees, accommodation, meals, a living allowance, and health insurance. It is open to citizens of African countries applying for postgraduate diploma, honours, or coursework master's programmes at the University of Cape Town.",
    "shortDescription": "Fully funded postgraduate scholarship at University of Cape Town for academically excellent African students committed to community transformation.",
    "field": ["Academic Research", "Engineering", "Healthcare", "Business", "Social Impact", "Technology"],
    "subfields": ["Postgraduate Study", "Academic Excellence", "Community Leadership", "Africa-based Higher Education"],
    "tags": ["Mastercard Foundation", "UCT", "South Africa", "scholarship", "Africa", "postgraduate", "fully funded"],
    "location": "Cape Town, South Africa",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Citizen of an African country",
      "Applying for a postgraduate diploma (Health Sciences), honours, or coursework master's programme at UCT",
      "Must separately apply for and receive a UCT admission offer",
      "Demonstrated financial need and commitment to giving back to African communities"
    ],
    "educationRequirements": ["Graduate", "Postgraduate"],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded (tuition, accommodation, meals, living allowance, health insurance)",
    "benefits": [
      "Full tuition fees",
      "University accommodation or accommodation allowance",
      "Meals and living stipend",
      "Health insurance",
      "Leadership development and mentorship"
    ],
    "duration": "Duration of the postgraduate programme",
    "deadline": "2026-10-31",
    "applicationUrl": "https://www.uct.ac.za/mastercardfdn",
    "officialSource": "https://www.uct.ac.za/mastercardfdn",
    "sourceName": "UCT Mastercard Foundation Scholars Programme",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["First, apply to UCT postgraduate programme and receive admission offer", "Scholarship application via UCT Mastercard Foundation portal", "Academic transcripts", "Personal statement on leadership and giving back"],
    "applicationSteps": [
      "Apply for admission to chosen UCT postgraduate programme",
      "On receiving admission offer, submit separate scholarship application",
      "Complete scholarship application by October 31, 2026",
      "Interview for shortlisted candidates"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": true
  },

  {
    "id": "opp-mcf-cam-01",
    "title": "Mastercard Foundation Scholars Program at University of Cambridge",
    "organization": {
      "id": "org-cam-mcf",
      "name": "Mastercard Foundation / University of Cambridge",
      "website": "https://www.postgraduate.study.cam.ac.uk/funding/mastercard-foundation-scholars",
      "description": "The Mastercard Foundation Scholars Program at Cambridge funds African postgraduate scholars to pursue master's degrees at one of the world's leading universities.",
      "type": "University"
    },
    "type": "Scholarship",
    "description": "The Mastercard Foundation Scholars Program at the University of Cambridge provides fully funded scholarships for African students pursuing full-time one-year master's programmes. The scholarship covers course fees, maintenance grant, return airfare, and associated costs. Scholars are integrated into the Cambridge Scholars community and receive leadership development support. Eligible applicants must be citizens of an African country resident in Africa. Most one-year master's programmes are eligible, with a few exceptions (MBA, MCL, MFin, MACC). Application fee waivers are available.",
    "shortDescription": "Fully funded master's scholarship at University of Cambridge for African citizens, covering fees, maintenance, and return flights.",
    "field": ["Academic Research", "Engineering", "Technology", "Public Policy", "Business", "Healthcare", "Social Impact"],
    "subfields": ["Postgraduate Study", "UK Higher Education", "Leadership Development"],
    "tags": ["Mastercard Foundation", "Cambridge", "UK", "scholarship", "Africa", "master's", "fully funded"],
    "location": "Cambridge, United Kingdom",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Citizen of an African country",
      "Resident in an African country (or refugee/IDP status)",
      "Applying for a full-time one-year master's programme at Cambridge",
      "Most master's courses eligible (MBA, MCL, MFin, MACC excluded)"
    ],
    "educationRequirements": ["Graduate"],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded (course fees, maintenance grant, return airfare)",
    "benefits": [
      "Full course fees",
      "Maintenance grant for living costs",
      "Return airfare to Cambridge",
      "Application fee waiver",
      "Leadership development and scholars network"
    ],
    "duration": "1 year (master's programme)",
    "deadline": "2027-01-15",
    "applicationUrl": "https://www.postgraduate.study.cam.ac.uk/funding/mastercard-foundation-scholars",
    "officialSource": "https://www.postgraduate.study.cam.ac.uk/funding/mastercard-foundation-scholars",
    "sourceName": "University of Cambridge Postgraduate Funding",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Postgraduate application via Cambridge course portal", "Scholarship statement within course application", "Application fee waiver request by November 18, 2026 (for fee waiver)", "Academic transcripts and references as required by course"],
    "applicationSteps": [
      "Find chosen course in Cambridge Postgraduate Course Directory",
      "Apply through Cambridge application portal, selecting Mastercard Foundation Scholars funding",
      "Request application fee waiver by November 18, 2026 if needed",
      "Submit full application by course-specific deadline (typically December–January)",
      "Scholarship decisions communicated alongside admissions"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": true
  },

  {
    "id": "opp-aims-sa-01",
    "title": "AIMS South Africa Master of Mathematical Sciences",
    "organization": {
      "id": "org-aims",
      "name": "African Institute for Mathematical Sciences (AIMS)",
      "website": "https://aims.ac.za",
      "description": "AIMS is a pan-African network of centres of excellence for postgraduate training, research, and public engagement in mathematical sciences.",
      "type": "University"
    },
    "type": "Scholarship",
    "description": "The AIMS South Africa Master of Mathematical Sciences programme is a fully funded, intensive one-year postgraduate programme for African students. It provides advanced training in mathematics, statistics, and computing with applications to science, engineering, climate, finance, and data science. The programme is structured around intensive modules taught by international guest lecturers and resident faculty. All accepted students receive full funding covering tuition, accommodation, meals, and a personal stipend.",
    "shortDescription": "Fully funded one-year Master's in Mathematical Sciences at AIMS South Africa, open to African students from across the continent.",
    "field": ["Academic Research", "Technology", "Data Science", "Engineering"],
    "subfields": ["Mathematics", "Statistics", "Computing", "Data Science", "Mathematical Modelling"],
    "tags": ["AIMS", "mathematics", "scholarship", "Africa", "South Africa", "masters", "fully funded", "STEM", "data science"],
    "location": "Cape Town, South Africa (Muizenberg)",
    "remoteStatus": "In-Person",
    "eligibility": [
      "South African national, permanent resident, or refugee residing in South Africa (for January 2027 intake)",
      "Holds or expected to complete a bachelor's degree with strong mathematics component",
      "Strong academic performance in mathematics and sciences",
      "Note: Other AIMS centres in Ghana, Rwanda, Senegal, Cameroon, Tanzania also open to Pan-African applicants — check aims-network.org"
    ],
    "educationRequirements": ["Undergraduate"],
    "experienceRequirements": "Beginner",
    "funding": "Fully funded (tuition, accommodation, meals, personal stipend)",
    "benefits": [
      "Full tuition",
      "On-campus accommodation",
      "Meals included",
      "Monthly personal stipend",
      "International lecturer network"
    ],
    "duration": "1 year",
    "deadline": "2026-11-04",
    "applicationUrl": "https://apply.aims.ac.za",
    "officialSource": "https://aims.ac.za",
    "sourceName": "AIMS South Africa",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Online application via apply.aims.ac.za", "CV", "Motivation letter", "Academic transcripts", "Two academic references"],
    "applicationSteps": [
      "Submit application at apply.aims.ac.za by November 4, 2026",
      "Provide CV, motivation letter, transcripts, and two referee contacts",
      "Shortlisted applicants may be contacted for assessment",
      "Offers communicated on a rolling basis"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": false
  },

  {
    "id": "opp-gif-01",
    "title": "Global Innovation Fund (GIF) — Social Innovation Grants",
    "organization": {
      "id": "org-gif",
      "name": "Global Innovation Fund",
      "website": "https://www.globalinnovation.fund",
      "description": "The Global Innovation Fund is a nonprofit impact investment fund that supports the development, rigorous testing, and scaling of innovations that improve the lives of people living in poverty.",
      "type": "Foundation"
    },
    "type": "Grant",
    "description": "The Global Innovation Fund (GIF) provides grants and investment to support scalable social innovations that improve the lives of people in poverty, primarily in Africa and Asia. GIF operates with rolling open applications — there is no fixed deadline. Current strategic priorities include climate resilience and inclusive economic opportunity. Funding is available at pilot stage (up to $230,000) and test & transition stage (up to approximately $2.3 million). Eligible applicants include nonprofits, social enterprises, for-profit companies, government agencies, and research institutions.",
    "shortDescription": "Rolling open grants of up to $2.3 million for social innovations tackling poverty, with strong focus on Africa and Asia.",
    "field": ["Entrepreneurship", "Social Impact", "Technology", "Climate & Sustainability", "Development"],
    "subfields": ["Social Innovation", "Impact Investment", "Poverty Reduction", "Climate Resilience"],
    "tags": ["GIF", "grant", "social innovation", "Africa", "rolling", "climate", "poverty", "social enterprise"],
    "location": "Worldwide (Africa and Asia focus)",
    "remoteStatus": "Remote",
    "eligibility": [
      "Nonprofits, social enterprises, for-profit companies, government agencies, or research institutions",
      "Individual applicants must apply through an affiliated organisation",
      "Innovation must address global development challenges (poverty, climate, inclusion)",
      "Applications accepted from organisations based in any country"
    ],
    "educationRequirements": ["Any"],
    "experienceRequirements": "Intermediate",
    "funding": "Pilot stage: up to $230,000 USD; Test & Transition: up to $2.3 million USD",
    "benefits": [
      "Grant funding for social innovation pilots",
      "Rigorous evaluation and learning support",
      "Scale-up investment for high-performing innovations",
      "Access to GIF's global network of development funders"
    ],
    "duration": "Varies by stage (pilot to multi-year)",
    "deadline": "2027-12-31",
    "applicationUrl": "https://www.globalinnovation.fund/apply",
    "officialSource": "https://www.globalinnovation.fund",
    "sourceName": "Global Innovation Fund",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Online application via GIF portal", "Innovation description and evidence of impact", "Financial projections", "Team information"],
    "applicationSteps": [
      "Review GIF funding criteria and strategic priorities at globalinnovation.fund",
      "Submit initial application through the online portal (rolling — no fixed deadline)",
      "If shortlisted, participate in follow-on call with GIF team",
      "Approved organisations proceed to full application and due diligence"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": false
  },

  {
    "id": "opp-hult-01",
    "title": "Hult Prize — Student Social Enterprise Competition",
    "organization": {
      "id": "org-hult-prize",
      "name": "Hult Prize Foundation",
      "website": "https://www.hultprize.org",
      "description": "The Hult Prize is the world's largest student social enterprise competition, giving university students the opportunity to pitch solutions to global challenges for a $1 million prize.",
      "type": "Foundation"
    },
    "type": "Competition",
    "description": "The Hult Prize is the world's largest student-led social enterprise competition. Teams of university students develop and pitch business solutions to pressing global challenges for a $1 million USD prize and support to launch their venture. The competition runs through on-campus programmes at universities globally and through an open application track. Teams progress from campus qualifiers to regional finals to the global championship. The 2027 competition is currently active, with campus qualifiers running through early 2027.",
    "shortDescription": "$1 million prize for university student teams with social enterprise solutions to global challenges — campuses worldwide including Africa.",
    "field": ["Entrepreneurship", "Social Impact", "Business", "Technology"],
    "subfields": ["Social Enterprise", "Student Competition", "Impact Investing", "Startup"],
    "tags": ["Hult Prize", "competition", "student", "social enterprise", "million dollar prize", "global", "Africa", "university"],
    "location": "Worldwide (campus programmes across Africa and globally)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "All team members must be currently enrolled university students",
      "All team members must be 18 years of age or older by February 28, 2027",
      "Teams of 3-4 members (maximum)",
      "Open to students from any country including all African nations"
    ],
    "educationRequirements": ["Undergraduate", "Graduate"],
    "experienceRequirements": "Beginner",
    "funding": "$1,000,000 USD prize for global winner; regional prizes for finalists",
    "benefits": [
      "$1 million USD prize for global winning team",
      "Seed funding and venture support for finalists",
      "Mentorship from business leaders",
      "Access to Hult Prize global network",
      "International competition experience"
    ],
    "duration": "6-month competition cycle (October 2026 – September 2027)",
    "deadline": "2027-02-28",
    "applicationUrl": "https://www.hultprize.org",
    "officialSource": "https://www.hultprize.org",
    "sourceName": "Hult Prize Foundation",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Team registration on hultprize.org", "Business plan and solution pitch", "Participation in campus qualifier or open track"],
    "applicationSteps": [
      "Register team at hultprize.org",
      "Check if your university hosts an on-campus programme (or apply via open track)",
      "Participate in campus qualifier (deadlines vary by university, many in early 2027)",
      "Campus winners advance to regional finals",
      "Regional finalists compete at global championship"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": false
  },

  {
    "id": "opp-echoing-01",
    "title": "Echoing Green Fellowship for Early-Stage Social Entrepreneurs",
    "organization": {
      "id": "org-echoing-green",
      "name": "Echoing Green",
      "website": "https://echoinggreen.org",
      "description": "Echoing Green identifies and invests in emerging social entrepreneurs with the ideas and moral courage to create large-scale, systemic change.",
      "type": "Foundation"
    },
    "type": "Fellowship",
    "description": "The Echoing Green Fellowship provides seed funding, leadership development, and a global network to early-stage social entrepreneurs working to create large-scale systemic change. Fellows receive up to $90,000 USD in seed funding over two years, access to a global community of 700+ Echoing Green alumni, and an intensive leadership development programme. The fellowship is open to early-stage social entrepreneurs from all countries, including those working in Africa and other emerging markets. Applications typically open in summer and close in autumn.",
    "shortDescription": "Up to $90,000 USD seed funding and leadership development for early-stage social entrepreneurs from any country, including Africa.",
    "field": ["Entrepreneurship", "Social Impact", "Development"],
    "subfields": ["Social Innovation", "Systems Change", "Early-Stage Venture", "Leadership"],
    "tags": ["Echoing Green", "fellowship", "social entrepreneur", "seed funding", "global", "Africa eligible", "leadership"],
    "location": "Remote (Worldwide) / Fellowship activities in USA",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "18 years or older",
      "Original founder or leading member of founding team with decision-making authority",
      "Working on an early-stage social enterprise or innovation",
      "English proficiency (all programming conducted in English)",
      "Open to applicants from all countries including Africa"
    ],
    "educationRequirements": ["Any"],
    "experienceRequirements": "Beginner",
    "funding": "Up to $90,000 USD over 2 years (seed funding)",
    "benefits": [
      "Up to $90,000 USD in seed funding over two years",
      "Leadership development programme",
      "Access to 700+ Echoing Green alumni network",
      "Ongoing mentorship from senior advisors",
      "Connections to investors and partners"
    ],
    "duration": "2 years",
    "deadline": "2026-11-30",
    "applicationUrl": "https://echoinggreen.org/fellowship/",
    "officialSource": "https://echoinggreen.org/fellowship/",
    "sourceName": "Echoing Green Fellowship",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Online application", "Venture description and impact vision", "Leadership story", "Video submission (if shortlisted)"],
    "applicationSteps": [
      "Review fellowship eligibility and current challenge areas at echoinggreen.org",
      "Submit online application (verify current deadline — typically closes autumn)",
      "Shortlisted applicants participate in interviews",
      "Fellows announced and funding disbursed"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": false
  },

  {
    "id": "opp-acumen-uk-01",
    "title": "Acumen UK Fellowship 2027",
    "organization": {
      "id": "org-acumen",
      "name": "Acumen Academy",
      "website": "https://fellowship.acumenacademy.org",
      "description": "Acumen is a global nonprofit that changes the way the world tackles poverty. The Acumen Fellowship develops leaders who are changing the world through market-based solutions.",
      "type": "Non-Profit"
    },
    "type": "Fellowship",
    "description": "The Acumen UK Fellowship is a 9-month leadership development programme for social entrepreneurs, CEOs, and senior leaders who are building market-based solutions to poverty. Fellows join an intimate cohort of 20–25 leaders from across sectors for an intensive curriculum covering moral leadership, values-based decision making, social change, and community. The programme includes facilitated workshops, deep dialogue, and a final retreat. Applications are accepted from individuals working in the UK or internationally.",
    "shortDescription": "9-month leadership fellowship for senior social entrepreneurs and leaders building market-based solutions to poverty, based in the UK.",
    "field": ["Entrepreneurship", "Social Impact", "Business", "Governance"],
    "subfields": ["Moral Leadership", "Systems Change", "Social Enterprise", "Leadership Development"],
    "tags": ["Acumen", "fellowship", "UK", "social entrepreneurship", "leadership", "poverty", "impact", "market solutions"],
    "location": "United Kingdom (hybrid cohort activities)",
    "remoteStatus": "Hybrid",
    "eligibility": [
      "Social entrepreneur, CEO, or senior leader with a proven track record",
      "Minimum 5 years of professional experience",
      "Currently leading or building a social initiative or enterprise",
      "Strong commitment to tackling poverty and inequality",
      "Applications accepted from UK-based and international candidates"
    ],
    "educationRequirements": ["Any"],
    "experienceRequirements": "Intermediate",
    "funding": "Fellowship is subsidised; application fee applies",
    "benefits": [
      "9-month intensive leadership development curriculum",
      "Cohort of 20-25 high-impact leaders",
      "Access to Acumen's global community of 600+ Fellows",
      "Mentorship and coaching",
      "Deep focus on moral leadership and values"
    ],
    "duration": "9 months (February – October 2027)",
    "deadline": "2026-11-03",
    "applicationUrl": "https://fellowship.acumenacademy.org/apply",
    "officialSource": "https://fellowship.acumenacademy.org",
    "sourceName": "Acumen Academy Fellowship",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Online application via Acumen Academy portal", "Applicant toolkit review recommended before applying", "Organisation and leadership description", "Personal essay on values and leadership"],
    "applicationSteps": [
      "Download and review the Applicant Toolkit on Acumen Academy website",
      "Complete online application at fellowship.acumenacademy.org/apply",
      "Submit by November 3, 2026 deadline",
      "Shortlisted candidates invited to interviews",
      "Programme begins February 2027"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": false
  },

  {
    "id": "opp-aws-restart-01",
    "title": "AWS re/Start — Free Cloud Computing Training (Africa)",
    "organization": {
      "id": "org-aws",
      "name": "Amazon Web Services (AWS)",
      "website": "https://aws.amazon.com/training/restart/",
      "description": "Amazon Web Services is the world's most comprehensive and broadly adopted cloud platform, offering cloud computing training programmes globally.",
      "type": "Company"
    },
    "type": "Programme",
    "description": "AWS re/Start is a free, cohort-based cloud computing workforce development programme that prepares unemployed and underemployed individuals for careers in cloud technology. The 12-week, full-time programme covers cloud computing fundamentals, Linux, Python scripting, networking, security, and databases, alongside professional skills such as resume writing and interview coaching. Graduates are prepared for entry-level cloud roles and AWS certification. The programme operates in Nigeria, Kenya, Ghana, Rwanda, and other African countries through local partner organisations.",
    "shortDescription": "Free 12-week cloud computing training programme preparing unemployed and underemployed Africans for entry-level cloud technology careers.",
    "field": ["Technology", "Software Engineering"],
    "subfields": ["Cloud Computing", "AWS", "Networking", "Python", "Linux"],
    "tags": ["AWS", "cloud computing", "free", "Africa", "Nigeria", "Kenya", "Ghana", "Rwanda", "career change", "technology"],
    "location": "Nigeria, Kenya, Ghana, Rwanda + other African countries (via local partners)",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Unemployed or underemployed individuals",
      "Located in a country where an active re/Start partner operates",
      "Access to a reliable computer and stable internet",
      "Able to commit to full-time participation (Monday–Friday) for 12 weeks",
      "No prior technical experience required"
    ],
    "educationRequirements": ["Any"],
    "experienceRequirements": "Beginner",
    "funding": "Free (sponsored training, no tuition fee)",
    "benefits": [
      "Free 12-week intensive cloud training",
      "AWS certification preparation",
      "Professional skills coaching (resume, interview)",
      "Job placement support through partner network",
      "AWS digital credentials"
    ],
    "duration": "12 weeks (full-time)",
    "deadline": "2027-12-31",
    "applicationUrl": "https://aws.amazon.com/training/restart/how-to-apply/",
    "officialSource": "https://aws.amazon.com/training/restart/",
    "sourceName": "AWS re/Start Programme",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Apply through local partner organisation (vary by country)", "Proof of unemployment or underemployment", "Able to commit full-time for 12 weeks"],
    "applicationSteps": [
      "Visit aws.amazon.com/training/restart/how-to-apply/ and select your country",
      "Find the active collaborating organisation in your country (e.g. AmaliTech in Ghana, Azubi Africa)",
      "Apply directly through the local partner's application process",
      "Complete assessments and enrol in the next available cohort"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": false
  },

  {
    "id": "opp-mandela-washington-01",
    "title": "Mandela Washington Fellowship for Young African Leaders (YALI)",
    "organization": {
      "id": "org-yali",
      "name": "U.S. Department of State / YALI",
      "website": "https://www.mandelawashingtonfellowship.org",
      "description": "The Mandela Washington Fellowship is the U.S. Government's flagship program for young African leaders, administered by the U.S. Department of State.",
      "type": "Government"
    },
    "type": "Fellowship",
    "description": "The Mandela Washington Fellowship is the U.S. Government's flagship exchange programme for young African leaders. Selected Fellows participate in a six-week Leadership Institute at a U.S. university in the summer of 2027, focusing on business and entrepreneurship, civic leadership, or public management. The programme is fully funded, covering international travel, accommodation, meals, and health insurance. Fellows join a network of thousands of alumni across Sub-Saharan Africa.",
    "shortDescription": "Fully funded 6-week leadership institute in the United States for outstanding young leaders from Sub-Saharan Africa.",
    "field": ["Governance", "Entrepreneurship", "Social Impact", "Public Policy", "Business"],
    "subfields": ["Leadership Development", "Civic Leadership", "Public Management", "African Leadership"],
    "tags": ["Mandela Washington", "YALI", "fellowship", "Africa", "Sub-Saharan", "fully funded", "US government", "leadership", "young leaders"],
    "location": "United States (6-week institute) + Sub-Saharan Africa (applicant residence)",
    "remoteStatus": "In-Person",
    "eligibility": [
      "Citizen and resident of an eligible Sub-Saharan African country",
      "Between 25 and 35 years old (exceptional applicants 21–24 may be considered)",
      "English proficiency (reading, writing, speaking)",
      "Eligible for a U.S. J-1 visa",
      "Proven record of leadership in business, governance, technology, or social impact",
      "Not a U.S. citizen, permanent resident, or U.S. government employee or family member"
    ],
    "educationRequirements": ["Any"],
    "experienceRequirements": "Intermediate",
    "funding": "Fully funded (international flights, accommodation, meals, health insurance, programme costs)",
    "benefits": [
      "International travel and accommodation fully covered",
      "Health insurance for programme duration",
      "All programme costs covered",
      "Six weeks at a leading U.S. university",
      "Ongoing access to YALI alumni network across Africa"
    ],
    "duration": "6 weeks (summer 2027)",
    "deadline": "2026-10-13",
    "applicationUrl": "https://apply.mandelawashingtonfellowship.org",
    "officialSource": "https://www.mandelawashingtonfellowship.org",
    "sourceName": "Mandela Washington Fellowship Official Site",
    "lastVerified": "2026-10-11T00:00:00.000Z",
    "verificationStatus": "Verified",
    "requirements": ["Online application via official portal", "Application instructions PDF", "Essay responses on leadership and impact", "Eligibility verification documents"],
    "applicationSteps": [
      "Download 2027 Application Instructions from mandelawashingtonfellowship.org",
      "Complete online application at apply.mandelawashingtonfellowship.org",
      "Submit before deadline: October 13, 2026 at 16:00 GMT",
      "Shortlisted candidates notified and invited to interviews",
      "Final Fellows selected for summer 2027 institute"
    ],
    "status": "open",
    "createdAt": "2026-10-11T00:00:00.000Z",
    "updatedAt": "2026-10-11T00:00:00.000Z",
    "isFeatured": true
  }

] as any;

