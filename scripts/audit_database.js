const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- AUDITING DATABASE ---');
  
  // 1. Opportunities audit
  const opps = await prisma.opportunity.findMany({
    include: { organization: true }
  });
  console.log('Total Opportunities in DB:', opps.length);

  const ids = opps.map(o => o.id);
  const dupeIds = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  console.log('Duplicate IDs:', dupeIds.length > 0 ? dupeIds : 'None (0)');

  const titles = opps.map(o => o.title.toLowerCase().trim());
  const dupeTitles = titles.filter((t, idx) => titles.indexOf(t) !== idx);
  console.log('Duplicate Titles:', dupeTitles.length > 0 ? dupeTitles : 'None (0)');

  // Missing fields
  const missingUrls = opps.filter(o => !o.applicationUrl || o.applicationUrl.trim() === '');
  console.log('Missing/Empty applicationUrl:', missingUrls.length);

  const missingDeadlines = opps.filter(o => !o.deadline);
  console.log('Missing deadline:', missingDeadlines.length);

  const missingOrg = opps.filter(o => !o.organization || !o.organization.name);
  console.log('Missing organization:', missingOrg.length);

  // Status breakdown
  const statusCounts = {};
  opps.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  console.log('Status counts:', statusCounts);

  // Users audit
  const users = await prisma.user.findMany({
    include: { profile: true }
  });
  console.log('\nTotal Users in DB:', users.length);
  const emails = users.map(u => u.email.toLowerCase().trim());
  const dupeEmails = emails.filter((e, idx) => emails.indexOf(e) !== idx);
  console.log('Duplicate Emails:', dupeEmails.length > 0 ? dupeEmails : 'None (0)');

  // Admin users
  const adminUsers = users.filter(u => u.role === 'ADMIN');
  console.log('Admin Users count:', adminUsers.length, adminUsers.map(u => u.email));

  // Onboarded users
  const onboarded = users.filter(u => u.onboardingCompleted);
  console.log('Onboarded Users count:', onboarded.length, 'Non-onboarded:', users.length - onboarded.length);

  // Users without profiles
  const usersNoProfile = users.filter(u => !u.profile);
  console.log('Users without Profile relation:', usersNoProfile.length);

  // Saves & Tracks
  const totalSaves = await prisma.savedOpportunity.count();
  const totalTracked = await prisma.trackedApplication.count();
  console.log('\nTotal Saved Opportunities:', totalSaves);
  console.log('Total Tracked Applications:', totalTracked);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Audit script error:', e);
  process.exit(1);
});
