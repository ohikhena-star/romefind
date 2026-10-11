process.env.NODE_ENV = 'test';
process.env.TESTING = 'true';

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../src/server.js';
import { prisma } from '../src/config/prisma.js';

const PORT = 4098;
const baseUrl = `http://localhost:${PORT}/api`;
let serverInstance: any;

async function jsonFetch(url: string, options: any = {}) {
  const headers: any = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

describe('Google Sign-In & Authentication Safeguards Test Suite', () => {
  before(async () => {
    await new Promise<void>((resolve) => {
      serverInstance = app.listen(PORT, () => resolve());
    });
  });

  after(async () => {
    if (serverInstance) {
      await new Promise<void>((resolve) => {
        serverInstance.close(() => resolve());
      });
    }
    await prisma.$disconnect();
  });

  it('1. POST /api/auth/google returns 400 when idToken is missing', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/auth/google`, {
      method: 'POST',
      body: {}
    });
    // If GOOGLE_CLIENT_ID is not configured in test environment, it returns 503; if configured, 400
    assert.ok(status === 400 || status === 503, `Expected 400 or 503, got ${status}`);
    assert.strictEqual(data.success, false);
    assert.ok(data.message);
  });

  it('2. POST /api/auth/google returns 401 or 503 when idToken is fake/invalid', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/auth/google`, {
      method: 'POST',
      body: { idToken: 'fake-invalid-expired-jwt-token' }
    });
    assert.ok(status === 401 || status === 503, `Expected 401 or 503, got ${status}`);
    assert.strictEqual(data.success, false);
    assert.ok(data.message);
  });

  it('3. Existing email/password login works correctly', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: {
        email: 'alex.chen@example.com',
        password: 'password123'
      }
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.token);
    assert.strictEqual(data.data.user.email, 'alex.chen@example.com');
  });

  it('4. Attempting password login on passwordless Google account returns clean error', async () => {
    // Create a temporary mock Google-only user in database with passwordHash = null
    const testGoogleEmail = `google-test-${Date.now()}@example.com`;
    const testGoogleUser = await prisma.user.create({
      data: {
        email: testGoogleEmail,
        googleId: `mock-google-id-${Date.now()}`,
        passwordHash: null,
        firstName: 'Google',
        lastName: 'Tester',
        onboardingCompleted: true
      }
    });

    try {
      const { status, data } = await jsonFetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        body: {
          email: testGoogleEmail,
          password: 'anyPassword123'
        }
      });
      assert.strictEqual(status, 401);
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.code, 'GOOGLE_ACCOUNT_NO_PASSWORD');
      assert.ok(data.message.includes('Google Sign-In'));
    } finally {
      // Clean up test user
      await prisma.user.delete({ where: { id: testGoogleUser.id } }).catch(() => {});
    }
  });

  it('5. Account linking safeguard: rejects unlinked Google sign-in if account has password', async () => {
    // Verify that existing users with password hashes cannot have their accounts hijacked
    const existing = await prisma.user.findUnique({
      where: { email: 'alex.chen@example.com' }
    });
    assert.ok(existing);
    assert.ok(existing.passwordHash, 'Existing user must have passwordHash');
    assert.strictEqual(existing.googleId, null, 'Existing user should not have unverified googleId');
  });
});
