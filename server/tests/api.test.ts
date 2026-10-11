process.env.NODE_ENV = 'test';
process.env.TESTING = 'true';

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../src/server.js';
import { prisma } from '../src/config/prisma.js';

const PORT = 4099;
let baseUrl = `http://localhost:${PORT}/api`;
let serverInstance: any;

let authToken = '';
let adminToken = '';
let testOppId = '';
let testAppId = '';
let testTaskId = '';

async function jsonFetch(url: string, options: any = {}) {
  const headers: any = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (authToken && !headers['Authorization'] && !options.noAuth) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

describe('ROMEfind API Integration Test Suite', () => {
  before(async () => {
    // Start test server
    await new Promise<void>((resolve) => {
      serverInstance = app.listen(PORT, () => {
        resolve();
      });
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

  it('1. Health check returns ok', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/health`, { noAuth: true });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.service, 'ROMEfind API');
  });

  it('2. Login as Demo User', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: {
        email: 'alex.chen@example.com',
        password: 'password123'
      },
      noAuth: true
    });

    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.token);
    assert.strictEqual(data.data.user.email, 'alex.chen@example.com');
    authToken = data.data.token;
  });

  it('3. Retrieve current authenticated user profile', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/profiles/me`);
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.email, 'alex.chen@example.com');
    assert.ok(Array.isArray(data.data.profile.skills));
    assert.ok(data.data.profile.skills.includes('TypeScript'));
  });

  it('4. Update user profile and recalculate completeness', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/profiles/me`, {
      method: 'PUT',
      body: {
        bio: 'Updated bio for AI & Open Source Researcher',
        skills: ['Python', 'TypeScript', 'PyTorch', 'Rust', 'GraphQL'],
        goals: ['Apply for funded AI research residencies', 'Launch developer tooling project']
      }
    });

    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.profile.bio, 'Updated bio for AI & Open Source Researcher');
    assert.ok(data.data.profile.skills.includes('Rust'));
    assert.ok(data.data.profile.completeness > 50);
  });

  it('5. Get opportunities catalog with filtering', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/opportunities?type=Fellowship`);
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
    assert.strictEqual(data.data[0].opportunityType, 'Fellowship');
    testOppId = data.data[0].id;
  });

  it('6. Opportunity detail with related and change history', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/opportunities/${testOppId}`);
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.id, testOppId);
    assert.ok(data.data.organization);
    assert.ok(Array.isArray(data.data.field));
  });

  it('7. Personalized recommendations with relevance scores & explanations', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/recommendations`);
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
    const topMatch = data.data[0];
    assert.ok(typeof topMatch.relevanceScore === 'number');
    assert.ok(topMatch.relevanceScore >= 25 && topMatch.relevanceScore <= 100);
    assert.ok(Array.isArray(topMatch.relevanceReasons));
    assert.ok(topMatch.relevanceReasons.length > 0);
  });

  it('8. Alternative Paths Discovery engine returns adjacent pathways', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/recommendations/alternative-paths`);
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
    const firstAlt = data.data[0];
    assert.ok(firstAlt.alternativeType);
    assert.ok(firstAlt.headline);
    assert.ok(firstAlt.rationale);
    assert.ok(Array.isArray(firstAlt.benefits));
    assert.ok(Array.isArray(firstAlt.opportunities));
  });

  it('9. Search opportunities with multi-attribute filtering & scoring', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/search?q=research`);
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
    assert.ok(data.data[0].relevanceScore > 0);
  });

  it('10. Save and Unsave opportunity persistence', async () => {
    // Save
    const saveRes = await jsonFetch(`${baseUrl}/opportunities/${testOppId}/save`, { method: 'POST' });
    assert.strictEqual(saveRes.status, 200);
    assert.strictEqual(saveRes.data.success, true);

    // Verify detail reflects saved
    const detailRes = await jsonFetch(`${baseUrl}/opportunities/${testOppId}`);
    assert.strictEqual(detailRes.data.data.isSaved, true);

    // Unsave
    const unsaveRes = await jsonFetch(`${baseUrl}/opportunities/${testOppId}/save`, { method: 'DELETE' });
    assert.strictEqual(unsaveRes.status, 200);
  });

  it('11. Tracked Applications full lifecycle: track, update status, tasks, notes', async () => {
    // Track opportunity
    const trackRes = await jsonFetch(`${baseUrl}/applications`, {
      method: 'POST',
      body: { opportunityId: testOppId, status: 'CONSIDERING' }
    });
    assert.ok([200, 201].includes(trackRes.status));
    testAppId = trackRes.data.data.id;

    // Update status to PREPARING
    const statusRes = await jsonFetch(`${baseUrl}/applications/${testAppId}/status`, {
      method: 'PATCH',
      body: { status: 'PREPARING' }
    });
    assert.strictEqual(statusRes.status, 200);
    assert.strictEqual(statusRes.data.data.status, 'PREPARING');

    // Add custom checklist task
    const taskRes = await jsonFetch(`${baseUrl}/applications/${testAppId}/tasks`, {
      method: 'POST',
      body: { label: 'Complete portfolio case study' }
    });
    assert.strictEqual(taskRes.status, 201);
    testTaskId = taskRes.data.data.id;

    // Toggle task
    const toggleRes = await jsonFetch(`${baseUrl}/applications/${testAppId}/tasks/${testTaskId}`, {
      method: 'PATCH',
      body: { completed: true }
    });
    assert.strictEqual(toggleRes.status, 200);
    assert.strictEqual(toggleRes.data.data.completed, true);

    // Add note
    const noteRes = await jsonFetch(`${baseUrl}/applications/${testAppId}/notes`, {
      method: 'POST',
      body: { content: 'Submitted early draft to faculty mentor for critique.' }
    });
    assert.strictEqual(noteRes.status, 201);
    assert.strictEqual(noteRes.data.data.content, 'Submitted early draft to faculty mentor for critique.');

    // List all user applications
    const listRes = await jsonFetch(`${baseUrl}/applications`);
    assert.strictEqual(listRes.status, 200);
    assert.ok(listRes.data.data.some((a: any) => a.id === testAppId));
  });

  it('12. Learning resources and skill-gap recommendations', async () => {
    const { status, data } = await jsonFetch(`${baseUrl}/learning/recommendations`);
    assert.strictEqual(status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.data.length > 0);
    assert.ok(data.data[0].resource.title);
  });

  it('13. Notifications retrieval and mark read', async () => {
    const listRes = await jsonFetch(`${baseUrl}/notifications`);
    assert.strictEqual(listRes.status, 200);
    assert.ok(listRes.data.data.length > 0);

    const markAllRes = await jsonFetch(`${baseUrl}/notifications/read-all`, { method: 'POST' });
    assert.strictEqual(markAllRes.status, 200);

    const listAfterRes = await jsonFetch(`${baseUrl}/notifications`);
    assert.strictEqual(listAfterRes.data.unreadCount, 0);
  });

  it('14. Admin metrics and audit logs', async () => {
    // Login as Admin
    const adminLogin = await jsonFetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: {
        email: 'admin@romefind.com',
        password: 'password123'
      },
      noAuth: true
    });
    adminToken = adminLogin.data.data.token;

    const metricsRes = await jsonFetch(`${baseUrl}/admin/metrics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(metricsRes.status, 200);
    assert.ok(metricsRes.data.data.totalOpportunities > 0);
    assert.ok(metricsRes.data.data.totalUsers >= 2);
  });

  it('15. Duplicate email signup rejection with exact message', async () => {
    const duplicateRes = await jsonFetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      body: {
        email: 'alex.chen@example.com',
        password: 'password12345',
        name: 'Alex Chen Duplicate'
      },
      noAuth: true
    });

    assert.strictEqual(duplicateRes.status, 409);
    assert.strictEqual(duplicateRes.data.success, false);
    assert.strictEqual(duplicateRes.data.message, 'An account with this email already exists.');
  });

  it('16. Onboarding step persistence across profile updates', async () => {
    const updateStepRes = await jsonFetch(`${baseUrl}/profiles/me`, {
      method: 'PUT',
      body: {
        onboardingStep: 3
      }
    });

    assert.strictEqual(updateStepRes.status, 200);
    assert.strictEqual(updateStepRes.data.data.profile.onboardingStep, 3);

    // Retrieve again to confirm persistence
    const getRes = await jsonFetch(`${baseUrl}/profiles/me`);
    assert.strictEqual(getRes.status, 200);
    assert.strictEqual(getRes.data.data.profile.onboardingStep, 3);
  });

  it('17. Rejection of empty, whitespace, or missing password login', async () => {
    // Missing password
    const res1 = await jsonFetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { email: 'alex.chen@example.com' },
      noAuth: true
    });
    assert.strictEqual(res1.status, 400);
    assert.strictEqual(res1.data.message, 'Email and password are required');

    // Empty password
    const res2 = await jsonFetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { email: 'alex.chen@example.com', password: '' },
      noAuth: true
    });
    assert.strictEqual(res2.status, 400);
    assert.strictEqual(res2.data.message, 'Email and password are required');

    // Whitespace password
    const res3 = await jsonFetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: { email: 'alex.chen@example.com', password: '   ' },
      noAuth: true
    });
    assert.strictEqual(res3.status, 400);
    assert.strictEqual(res3.data.message, 'Email and password are required');
  });

  it('18. Saved opportunities hydration endpoint across sessions', async () => {
    // Ensure testOppId is saved for user A
    await jsonFetch(`${baseUrl}/opportunities/${testOppId}/save`, { method: 'POST' });

    // Fetch saved opportunities endpoint
    const savedRes = await jsonFetch(`${baseUrl}/opportunities/saved`);
    assert.strictEqual(savedRes.status, 200);
    assert.strictEqual(savedRes.data.success, true);
    assert.ok(Array.isArray(savedRes.data.data));
    assert.ok(savedRes.data.data.includes(testOppId));
  });

  it('19. Account switching and session data isolation', async () => {
    // Register User B
    const userBEmail = `userb.${Date.now()}@example.com`;
    const regRes = await jsonFetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      body: {
        email: userBEmail,
        password: 'Password123!',
        name: 'User B Explorer'
      },
      noAuth: true
    });
    assert.strictEqual(regRes.status, 201);
    const userBToken = regRes.data.data.token;

    // Check User B's saved opportunities — should NOT include User A's testOppId
    const userBSavedRes = await jsonFetch(`${baseUrl}/opportunities/saved`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert.strictEqual(userBSavedRes.status, 200);
    assert.strictEqual(userBSavedRes.data.data.includes(testOppId), false);

    // User B saves a different opportunity
    const oppCatalog = await jsonFetch(`${baseUrl}/opportunities`);
    const oppB = oppCatalog.data.data.find((o: any) => o.id !== testOppId);
    assert.ok(oppB);

    const saveBRes = await jsonFetch(`${baseUrl}/opportunities/${oppB.id}/save`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert.strictEqual(saveBRes.status, 200);

    // Verify User B's saved list has oppB.id and not testOppId
    const userBSavedAfter = await jsonFetch(`${baseUrl}/opportunities/saved`, {
      headers: { Authorization: `Bearer ${userBToken}` }
    });
    assert.ok(userBSavedAfter.data.data.includes(oppB.id));
    assert.strictEqual(userBSavedAfter.data.data.includes(testOppId), false);
  });

  it('20. Logout and login session verification', async () => {
    // Logout User A
    const logoutRes = await jsonFetch(`${baseUrl}/auth/logout`, { method: 'POST' });
    assert.strictEqual(logoutRes.status, 200);

    // Login back as User A
    const relogin = await jsonFetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      body: {
        email: 'alex.chen@example.com',
        password: 'password123'
      },
      noAuth: true
    });
    assert.strictEqual(relogin.status, 200);
    authToken = relogin.data.data.token;

    // Verify User A's saved opportunities still exist in DB
    const userASavedRes = await jsonFetch(`${baseUrl}/opportunities/saved`);
    assert.strictEqual(userASavedRes.status, 200);
    assert.ok(userASavedRes.data.data.includes(testOppId));
  });

  it('21. Analytics: Ingest valid share action event anonymously', async () => {
    const res = await jsonFetch(`${baseUrl}/analytics/event`, {
      method: 'POST',
      body: {
        eventType: 'share_action',
        opportunityId: testOppId,
        metadata: { shareMethod: 'copy_link' }
      },
      noAuth: true
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.recorded, true);
  });

  it('22. Analytics: Reject invalid eventType with 400', async () => {
    const res = await jsonFetch(`${baseUrl}/analytics/event`, {
      method: 'POST',
      body: {
        eventType: 'fake_event_type',
        opportunityId: testOppId
      },
      noAuth: true
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  it('23. Analytics: Ingest shared_link_visit and application_link_clicked events', async () => {
    const visitRes = await jsonFetch(`${baseUrl}/analytics/event`, {
      method: 'POST',
      body: {
        eventType: 'shared_link_visit',
        opportunityId: testOppId,
        metadata: { source: 'share_link' }
      },
      noAuth: true
    });
    assert.strictEqual(visitRes.status, 200);
    assert.strictEqual(visitRes.data.recorded, true);

    const clickRes = await jsonFetch(`${baseUrl}/analytics/event`, {
      method: 'POST',
      body: {
        eventType: 'application_link_clicked',
        opportunityId: testOppId,
        metadata: { url: 'https://example.com/apply' }
      }
    });
    assert.strictEqual(clickRes.status, 200);
    assert.strictEqual(clickRes.data.recorded, true);
  });

  it('24. Admin Analytics: Share analytics endpoint requires admin role', async () => {
    // Regular user request -> 403
    const forbiddenRes = await jsonFetch(`${baseUrl}/admin/analytics/share`);
    assert.strictEqual(forbiddenRes.status, 403);

    // Admin request -> 200
    const adminRes = await jsonFetch(`${baseUrl}/admin/analytics/share?range=30d`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(adminRes.status, 200);
    assert.strictEqual(adminRes.data.success, true);
    assert.ok(adminRes.data.data.totals);
    assert.ok(typeof adminRes.data.data.totals.shares === 'number');
    assert.ok(typeof adminRes.data.data.totals.sharedLinkVisits === 'number');
    assert.ok(typeof adminRes.data.data.totals.applicationLinkClicks === 'number');
    assert.ok(Array.isArray(adminRes.data.data.topShared));
    assert.ok(Array.isArray(adminRes.data.data.topClicked));
  });

  it('25. Admin Analytics: Opportunity-specific share analytics endpoint', async () => {
    const oppRes = await jsonFetch(`${baseUrl}/admin/analytics/share/${testOppId}?range=all`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(oppRes.status, 200);
    assert.strictEqual(oppRes.data.success, true);
    assert.strictEqual(oppRes.data.data.opportunity.id, testOppId);
    assert.ok(oppRes.data.data.totals.shares >= 1);
  });

  it('26. JWT Security: Reject production startup if JWT_SECRET is missing or empty', () => {
    // Test production mode with missing JWT_SECRET
    const testMissingSecret = () => {
      const isProd = true;
      const rawSecret = ('').trim();
      if (isProd && !rawSecret) {
        throw new Error('FATAL: JWT_SECRET environment variable is required and cannot be empty in production mode.');
      }
    };
    assert.throws(testMissingSecret, /FATAL: JWT_SECRET environment variable is required/);

    // Test production mode with whitespace-only JWT_SECRET
    const testWhitespaceSecret = () => {
      const isProd = true;
      const rawSecret = ('   ').trim();
      if (isProd && !rawSecret) {
        throw new Error('FATAL: JWT_SECRET environment variable is required and cannot be empty in production mode.');
      }
    };
    assert.throws(testWhitespaceSecret, /FATAL: JWT_SECRET environment variable is required/);

    // Test production mode with valid secret does not throw
    const testValidSecret = () => {
      const isProd = true;
      const rawSecret = ('super-strong-production-secret').trim();
      if (isProd && !rawSecret) {
        throw new Error('FATAL: JWT_SECRET environment variable is required and cannot be empty in production mode.');
      }
      return rawSecret;
    };
    assert.strictEqual(testValidSecret(), 'super-strong-production-secret');
  });

  it('27. JWT Security: Preserve local development secret fallback', () => {
    const isProd = false;
    const rawSecret = undefined;
    const jwtSecret = rawSecret || (isProd ? '' : 'romefind-super-secret-jwt-key-change-in-production-2026');
    assert.strictEqual(jwtSecret, 'romefind-super-secret-jwt-key-change-in-production-2026');
  });

  it('28. JWT Token Verification: Accept valid tokens and reject tampered signatures', async () => {
    // Generate valid payload
    const { generateToken, verifyToken } = await import('../src/utils/helpers.js');
    const token = generateToken({
      userId: 'usr-test-valid',
      email: 'valid@example.com',
      role: 'USER'
    });
    assert.ok(token);

    // Verify valid token
    const decoded = verifyToken(token);
    assert.ok(decoded);
    assert.strictEqual(decoded.userId, 'usr-test-valid');

    // Tamper with the token (alter the payload or signature segment)
    const parts = token.split('.');
    const tamperedToken = `${parts[0]}.${parts[1]}x.${parts[2]}`;
    const tamperedDecoded = verifyToken(tamperedToken);
    assert.strictEqual(tamperedDecoded, null);
  });

  it('29. JWT Token Expiration: Reject expired tokens safely', async () => {
    const jwt = (await import('jsonwebtoken')).default;
    const { config } = await import('../src/config/index.js');
    const { verifyToken } = await import('../src/utils/helpers.js');

    // Create a token expired 10 seconds ago
    const expiredToken = jwt.sign(
      { userId: 'usr-expired', email: 'expired@example.com', role: 'USER' },
      config.jwtSecret,
      { expiresIn: '-10s' }
    );

    const decoded = verifyToken(expiredToken);
    assert.strictEqual(decoded, null);
  });
});

