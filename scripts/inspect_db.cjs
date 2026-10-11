const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    let guestUser = await prisma.user.findUnique({
      where: { id: 'usr-guest-anonymous' }
    });
    console.log('Guest user exists:', guestUser);
    if (!guestUser) {
      guestUser = await prisma.user.upsert({
        where: { email: 'guest@system.romefind.internal' },
        update: {},
        create: {
          id: 'usr-guest-anonymous',
          email: 'guest@system.romefind.internal',
          passwordHash: 'not-for-login',
          firstName: 'Guest',
          lastName: 'Visitor',
          role: 'USER',
          onboardingCompleted: true
        }
      });
      console.log('Created guest system user:', guestUser);
    }
  } catch (err) {
    console.error('Error with guest user:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
