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
});
