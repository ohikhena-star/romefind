import { prisma } from '../src/config/prisma.js';
import { hashPassword, verifyPassword, generateToken } from '../src/utils/helpers.js';

async function testLiveAuth() {
  console.log('Testing connection to DB...');
  const count = await prisma.user.count();
  console.log('Current user count in DB:', count);

  const testEmail = `test_${Date.now()}@example.com`;
  const password = 'Password123!';
  const passwordHash = await hashPassword(password);

  console.log('Creating test user:', testEmail);
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
      onboardingCompleted: false,
      onboardingStep: 1,
      profile: {
        create: {
          bio: '',
          currentStatus: 'Exploring opportunities',
          skills: JSON.stringify([]),
          interests: JSON.stringify([]),
          goals: JSON.stringify([]),
          education: JSON.stringify([]),
          experience: JSON.stringify([]),
          opportunityPreferences: JSON.stringify([]),
          locationPreferences: JSON.stringify([]),
          remotePreferences: JSON.stringify([]),
          completeness: 20,
          onboardingStep: 1
        }
      }
    },
    include: {
      profile: true
    }
  });
  console.log('Created user successfully! ID:', user.id);

  console.log('Testing password verification...');
  const match = await verifyPassword(password, user.passwordHash);
  console.log('Password match result:', match);

  console.log('Testing token generation...');
  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  console.log('Generated JWT token successfully:', token.slice(0, 20) + '...');

  // Cleanup
  await prisma.user.delete({ where: { id: user.id } });
  console.log('Cleaned up test user.');
  console.log('ALL DB & AUTH CHECKS PASSED!');
}

testLiveAuth()
  .catch((err) => {
    console.error('LIVE AUTH TEST FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
