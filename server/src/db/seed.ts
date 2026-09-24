import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { organizationsData, learningResourcesData, communityAdvicesData } from './seed-data.js';

async function main() {
  console.log('🌱 Starting ROMEfind Database Seed on Neon PostgreSQL...');

  // 1. Clear existing data in reverse order of foreign keys
  await prisma.opportunityReport.deleteMany().catch(() => {});
  await prisma.communityAdvice.deleteMany().catch(() => {});
  await prisma.userLearningProgress.deleteMany().catch(() => {});
  await prisma.passwordResetToken.deleteMany().catch(() => {});
  await prisma.applicationNote.deleteMany().catch(() => {});
  await prisma.applicationTask.deleteMany().catch(() => {});
  await prisma.trackedApplication.deleteMany().catch(() => {});
  await prisma.savedOpportunity.deleteMany().catch(() => {});
  await prisma.rejectedOpportunity.deleteMany().catch(() => {});
  await prisma.behaviourSignal.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.providerSubmission.deleteMany().catch(() => {});
  await prisma.opportunityChangeHistory.deleteMany().catch(() => {});
  await prisma.opportunity.deleteMany().catch(() => {});
  await prisma.organization.deleteMany().catch(() => {});
  await prisma.learningResource.deleteMany().catch(() => {});
  await prisma.profile.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

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
          bio: 'Passionate about global health data, HCI, and building tools that empower public health practitioners worldwide.',
          currentStatus: 'Graduate Student / Junior Researcher',
          education: JSON.stringify([
            {
              id: 'edu-1',
              degree: 'BSc Computer Science & Health Informatics',
              institution: 'University College London',
              fieldOfStudy: 'Public Health & HCI',
              startDate: '2021',
              endDate: '2024',
              current: false
            }
          ]),
          experience: JSON.stringify([
            {
              id: 'exp-1',
              title: 'Research Assistant',
              company: 'UCL Institute for Global Health',
              location: 'London, UK',
              startDate: '2023-09',
              endDate: '2024-06',
              current: false,
              description: 'Investigated disease surveillance data pipelines and accessible epidemiological dashboards.'
            }
          ]),
          skills: JSON.stringify(['Python', 'TypeScript', 'R', 'Epidemiology', 'Data Analysis', 'PyTorch', 'UX Research']),
          interests: JSON.stringify(['Public Health', 'Artificial Intelligence', 'Global Health', 'Life Sciences', 'Climate']),
          goals: JSON.stringify([
            'Land a funded research fellowship or master track in Public Health & AI',
            'Publish a peer-reviewed paper in CHI or Global Health Informatics',
            'Secure a grant for an open-source disease modeling tool'
          ]),
          portfolioLinks: JSON.stringify(['https://alexchen.dev', 'https://github.com/alexchen', 'https://linkedin.com/in/alexchen']),
          certifications: JSON.stringify(['DeepLearning.AI Machine Learning Specialization', 'Johns Hopkins Epidemiology Certificate']),
          opportunityPreferences: JSON.stringify(['Fellowship', 'Scholarship', 'Grant', 'Research', 'Internship']),
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
          interests: JSON.stringify(['Opportunities', 'Global Education', 'Public Health', 'Impact']),
          goals: JSON.stringify(['Curate 10,000 verified opportunities worldwide']),
          completeness: 100
        }
      }
    }
  });

  const genericDemoUser = await prisma.user.create({
    data: {
      id: 'usr-demo-002',
      email: 'demo@romefind.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'User',
      location: 'San Francisco, CA',
      country: 'United States',
      role: 'USER',
      onboardingCompleted: true,
      profile: {
        create: {
          bio: 'Exploring opportunities in Tech, Design, and Public Health.',
          currentStatus: 'University Student',
          skills: JSON.stringify(['JavaScript', 'Python', 'Product Management', 'Public Health']),
          interests: JSON.stringify(['Technology', 'Public Health', 'Design', 'Artificial Intelligence']),
          goals: JSON.stringify(['Find remote internships and funded fellowships']),
          opportunityPreferences: JSON.stringify(['Internship', 'Fellowship', 'Job']),
          locationPreferences: JSON.stringify(['Remote', 'United States']),
          fundingPreferences: true,
          remotePreferences: JSON.stringify(['Remote']),
          experienceLevel: 'Beginner',
          completeness: 85
        }
      }
    }
  });

  console.log(`👤 Created Demo Users (${demoUser.email}, ${genericDemoUser.email}) and Admin (${adminUser.email})`);

  // 3. Seed Organizations
  for (const org of organizationsData) {
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
  console.log(`🏢 Seeded ${organizationsData.length} Organizations.`);

  // 4. Seed Learning Resources
  for (const lr of learningResourcesData) {
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
  console.log(`📚 Seeded ${learningResourcesData.length} Learning Resources.`);

  // 5. Seed Opportunities from frontend data
  const content = readFileSync(resolve('../src/data/opportunities.ts'), 'utf-8');
  const sanitized = content
    .replace(/import\s+.*?;\s*/g, '')
    .replace(/const org\s*=.*?;/g, '')
    .replace(/export const opportunities: Opportunity\[\]\s*=\s*/, 'const opportunities = ')
    .replace(/org\(['"](.*?)['"]\)/g, '"$1"')
    .replace(/OpportunityType\.(\w+)/g, '"$1"')
    .replace(/RemoteStatus\.(\w+)/g, '"$1"')
    .replace(/EducationLevel\.(\w+)/g, '"$1"')
    .replace(/ExperienceLevel\.(\w+)/g, '"$1"')
    .replace(/VerificationStatus\.(\w+)/g, '"$1"');

  const fn = new Function(sanitized + '\nreturn opportunities;');
  const oppsList = fn();

  for (const opp of oppsList) {
    const orgId = typeof opp.organization === 'string' ? opp.organization : (opp.organization?.id || opp.orgId || 'org-mozilla');
    
    // Normalize opportunity type
    let oppType = opp.type || 'Fellowship';
    if (oppType === 'Conference') oppType = 'Conference/Event';

    // Normalize remote status
    let remoteStatus = opp.remoteStatus || 'In-Person';
    if (remoteStatus === 'InPerson') remoteStatus = 'In-Person';

    await prisma.opportunity.create({
      data: {
        id: opp.id,
        title: opp.title,
        organizationId: orgId,
        opportunityType: oppType,
        description: opp.description,
        shortDescription: opp.shortDescription || opp.description.slice(0, 120),
        field: JSON.stringify(opp.field || []),
        subfields: JSON.stringify(opp.subfields || []),
        location: opp.location || 'Global',
        country: opp.country || 'Global',
        remoteStatus: remoteStatus,
        eligibility: JSON.stringify(opp.eligibility || []),
        educationRequirements: JSON.stringify(opp.educationRequirements || ['Any']),
        experienceRequirements: opp.experienceRequirements || 'Any',
        funding: opp.funding || 'Fully Funded',
        fundingType: opp.fundingType || 'Fully-Funded',
        fundingAmount: opp.fundingAmount || 'Competitive',
        benefits: JSON.stringify(opp.benefits || []),
        duration: opp.duration || 'Flexible',
        deadline: opp.deadline || null,
        startDate: opp.startDate || null,
        applicationUrl: opp.applicationUrl || 'https://romefind.com',
        officialSource: opp.officialSource || opp.applicationUrl || 'https://romefind.com',
        sourceName: opp.sourceName || 'Official Source',
        sourceType: opp.sourceType || 'official_website',
        verificationStatus: 'VERIFIED',
        status: (opp.status || 'OPEN').toUpperCase(),
        requirements: JSON.stringify(opp.requirements || []),
        applicationSteps: JSON.stringify(opp.applicationSteps || []),
        tags: JSON.stringify(opp.tags || []),
        isFeatured: !!opp.isFeatured
      }
    });
  }
  console.log(`🎯 Seeded all ${oppsList.length} Opportunities with full fidelity.`);

  // 6. Seed Community Advice
  for (const advice of communityAdvicesData) {
    await prisma.communityAdvice.create({
      data: {
        opportunityId: advice.opportunityId,
        userId: demoUser.id,
        authorName: advice.authorName,
        authorRole: advice.authorRole,
        outcomeStatus: advice.outcomeStatus,
        adviceType: advice.adviceType,
        title: advice.title,
        content: advice.content,
        upvotes: advice.upvotes,
        isVerified: true
      }
    });
  }
  console.log(`💡 Seeded ${communityAdvicesData.length} Community Advice contributions.`);

  // 7. Seed Demo User Applications & Saved Items
  await prisma.savedOpportunity.create({
    data: { userId: demoUser.id, opportunityId: 'opp-051' } // WHO Internship
  });
  await prisma.savedOpportunity.create({
    data: { userId: demoUser.id, opportunityId: 'opp-053' } // LSHTM Fellowship
  });
  await prisma.savedOpportunity.create({
    data: { userId: demoUser.id, opportunityId: 'opp-001' } // Mozilla
  });

  const app1 = await prisma.trackedApplication.create({
    data: {
      userId: demoUser.id,
      opportunityId: 'opp-051', // WHO Internship
      status: 'PREPARING',
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      tasks: {
        create: [
          { label: 'Draft motivation statement citing WHO Pandemic Hub initiatives', completed: true, order: 1 },
          { label: 'Obtain official academic transcript from UCL registrar', completed: true, order: 2 },
          { label: 'Request recommendation letter from Prof. Davies (Public Health)', completed: false, order: 3 },
          { label: 'Submit profile on WHO Stellis portal before deadline', completed: false, order: 4 }
        ]
      },
      notes: {
        create: [
          { content: 'Spoke with Amina (former Geneva intern). Emphasize R and epidemiological surveillance pipeline experience.' },
          { content: 'Reviewed 2026 WHO Global Health Emergencies annual report for talking points.' }
        ]
      }
    }
  });

  const app2 = await prisma.trackedApplication.create({
    data: {
      userId: demoUser.id,
      opportunityId: 'opp-001', // Mozilla Fellowship
      status: 'SAVED',
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      tasks: {
        create: [
          { label: 'Update GitHub repository with open source accessibility tools', completed: false, order: 1 },
          { label: 'Draft 2-page research proposal on ethical AI and digital inclusion', completed: false, order: 2 }
        ]
      },
      notes: {
        create: [
          { content: 'Need to emphasize open-source community distribution and reproducibility.' }
        ]
      }
    }
  });

  console.log(`📋 Created demo user tracked applications (${app1.id}, ${app2.id})`);

  // 8. Seed Demo User Learning Progress
  await prisma.userLearningProgress.create({
    data: {
      userId: demoUser.id,
      resourceId: 'lr-13', // JHU Epidemiology
      status: 'LEARNING',
      notes: 'Focusing on Section 3: Disease surveillance and outbreak investigation metrics.'
    }
  });

  await prisma.userLearningProgress.create({
    data: {
      userId: demoUser.id,
      resourceId: 'lr-09', // Grant writing
      status: 'WANT_TO_LEARN',
      notes: 'Will complete before applying to Wellcome Trust Early-Career Award.'
    }
  });

  console.log('📈 Seeded demo user learning progress.');

  // 9. Seed Demo Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: 'deadline_reminder',
        title: 'Upcoming Deadline in 4 Weeks',
        message: 'World Health Organization (WHO) Global Internship application closes on April 15, 2027.',
        opportunityId: 'opp-051',
        read: false
      },
      {
        userId: demoUser.id,
        type: 'new_match',
        title: '98% Match: LSHTM Global Public Health Fellowship',
        message: 'A 98% match was found matching your background in Public Health, Epidemiology, and R.',
        opportunityId: 'opp-053',
        read: false
      },
      {
        userId: demoUser.id,
        type: 'learning_recommendation',
        title: 'Skill Booster for WHO Application',
        message: 'Check out "Johns Hopkins: Epidemiology in Public Health Practice" to strengthen your surveillance profile.',
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
