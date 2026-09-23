import { Router } from 'express';
import { authenticateToken, requireAdmin, optionalAuth } from './middleware/auth.middleware.js';

// Controllers
import * as authController from './modules/auth/auth.controller.js';
import * as profileController from './modules/profiles/profile.controller.js';
import * as organizationController from './modules/organizations/organization.controller.js';
import * as opportunityController from './modules/opportunities/opportunity.controller.js';
import * as searchController from './modules/search/search.controller.js';
import * as recommendationController from './modules/recommendations/recommendation.controller.js';
import * as applicationController from './modules/applications/application.controller.js';
import * as learningController from './modules/learning/learning.controller.js';
import * as notificationController from './modules/notifications/notification.controller.js';
import * as ingestionController from './modules/ingestion/ingestion.controller.js';
import * as adminController from './modules/admin/admin.controller.js';

export const apiRouter = Router();

// ── Health Check ────────────────────────────────────────────────────────
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ROMEfind API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ── Auth Endpoints ──────────────────────────────────────────────────────
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);
apiRouter.get('/auth/me', authenticateToken, authController.getMe);
apiRouter.post('/auth/logout', authenticateToken, authController.logout);

// ── Profile Endpoints ───────────────────────────────────────────────────
apiRouter.get('/profiles/me', authenticateToken, profileController.getMyProfile);
apiRouter.put('/profiles/me', authenticateToken, profileController.updateMyProfile);
apiRouter.get('/profiles/:userId', profileController.getProfileByUserId);

// ── Organizations Endpoints ─────────────────────────────────────────────
apiRouter.get('/organizations', organizationController.getOrganizations);
apiRouter.get('/organizations/:id', organizationController.getOrganizationById);

// ── Opportunities Endpoints ─────────────────────────────────────────────
apiRouter.get('/opportunities', optionalAuth, opportunityController.getOpportunities);
apiRouter.get('/opportunities/:id', optionalAuth, opportunityController.getOpportunityById);
apiRouter.get('/opportunities/:id/related', opportunityController.getRelatedOpportunities);
apiRouter.post('/opportunities/:id/save', authenticateToken, opportunityController.saveOpportunity);
apiRouter.delete('/opportunities/:id/save', authenticateToken, opportunityController.unsaveOpportunity);
apiRouter.post('/opportunities/:id/reject', authenticateToken, opportunityController.rejectOpportunity);

// ── Search & Discovery Endpoints ────────────────────────────────────────
apiRouter.get('/search', optionalAuth, searchController.searchOpportunities);
apiRouter.get('/search/suggestions', searchController.getSearchSuggestions);

// ── Intelligence & Recommendations ──────────────────────────────────────
apiRouter.get('/recommendations', authenticateToken, recommendationController.getRecommendations);
apiRouter.get('/recommendations/alternative-paths', optionalAuth, recommendationController.getAlternativePaths);

// ── Application Workspace (Tracking) Endpoints ──────────────────────────
apiRouter.get('/applications', authenticateToken, applicationController.getUserApplications);
apiRouter.post('/applications', authenticateToken, applicationController.trackOpportunity);
apiRouter.get('/applications/:id', authenticateToken, applicationController.getApplicationById);
apiRouter.patch('/applications/:id/status', authenticateToken, applicationController.updateApplicationStatus);
apiRouter.delete('/applications/:id', authenticateToken, applicationController.deleteApplication);

// Tasks & Notes on Tracked Applications
apiRouter.post('/applications/:id/tasks', authenticateToken, applicationController.addApplicationTask);
apiRouter.patch('/applications/:id/tasks/:taskId', authenticateToken, applicationController.toggleApplicationTask);
apiRouter.delete('/applications/:id/tasks/:taskId', authenticateToken, applicationController.deleteApplicationTask);
apiRouter.post('/applications/:id/notes', authenticateToken, applicationController.addApplicationNote);
apiRouter.delete('/applications/:id/notes/:noteId', authenticateToken, applicationController.deleteApplicationNote);

// ── Learning Resources Endpoints ────────────────────────────────────────
apiRouter.get('/learning', learningController.getLearningResources);
apiRouter.get('/learning/recommendations', optionalAuth, learningController.getLearningRecommendations);

// ── Notifications Endpoints ─────────────────────────────────────────────
apiRouter.get('/notifications', authenticateToken, notificationController.getUserNotifications);
apiRouter.patch('/notifications/:id/read', authenticateToken, notificationController.markNotificationAsRead);
apiRouter.post('/notifications/read-all', authenticateToken, notificationController.markAllNotificationsAsRead);
apiRouter.delete('/notifications', authenticateToken, notificationController.deleteAllNotifications);
apiRouter.delete('/notifications/:id', authenticateToken, notificationController.deleteNotification);

// ── Ingestion / Provider Endpoints ──────────────────────────────────────
apiRouter.post('/ingestion/submit', authenticateToken, ingestionController.submitOpportunity);
apiRouter.get('/ingestion/my-submissions', authenticateToken, ingestionController.getMySubmissions);

// ── Admin Endpoints ─────────────────────────────────────────────────────
apiRouter.get('/admin/metrics', authenticateToken, requireAdmin, adminController.getAdminMetrics);
apiRouter.get('/admin/submissions', authenticateToken, requireAdmin, adminController.getPendingSubmissions);
apiRouter.post('/admin/submissions/:id/approve', authenticateToken, requireAdmin, adminController.approveSubmission);
apiRouter.post('/admin/submissions/:id/reject', authenticateToken, requireAdmin, adminController.rejectSubmission);
apiRouter.put('/admin/opportunities/:id', authenticateToken, requireAdmin, adminController.updateAdminOpportunity);
apiRouter.get('/admin/audit-logs', authenticateToken, requireAdmin, adminController.getAuditLogs);
