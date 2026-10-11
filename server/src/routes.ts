import { Router } from 'express';
import { authenticateToken, requireAdmin, optionalAuth } from './middleware/auth.middleware.js';
import { authRateLimiter, strictAuthLimiter, adviceRateLimiter } from './middleware/rate-limit.middleware.js';

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
apiRouter.post('/auth/register', authRateLimiter, authController.register);
apiRouter.post('/auth/login', authRateLimiter, authController.login);
apiRouter.get('/auth/me', authenticateToken, authController.getMe);
apiRouter.post('/auth/logout', authenticateToken, authController.logout);
apiRouter.post('/auth/forgot-password', strictAuthLimiter, authController.forgotPassword);
apiRouter.post('/auth/reset-password', authRateLimiter, authController.resetPassword);

// ── Profile Endpoints ───────────────────────────────────────────────────
apiRouter.get('/profiles/me', authenticateToken, profileController.getMyProfile);
apiRouter.put('/profiles/me', authenticateToken, profileController.updateMyProfile);
apiRouter.get('/profiles/:userId', profileController.getProfileByUserId);

// ── Organizations Endpoints ─────────────────────────────────────────────
apiRouter.get('/organizations', organizationController.getOrganizations);
apiRouter.get('/organizations/:id', organizationController.getOrganizationById);

// ── Opportunities Endpoints ─────────────────────────────────────────────
apiRouter.get('/opportunities', optionalAuth, opportunityController.getOpportunities);
apiRouter.get('/opportunities/saved', authenticateToken, opportunityController.getSavedOpportunities);
apiRouter.get('/opportunities/:id', optionalAuth, opportunityController.getOpportunityById);
apiRouter.get('/opportunities/:id/related', opportunityController.getRelatedOpportunities);
apiRouter.post('/opportunities/:id/save', authenticateToken, opportunityController.saveOpportunity);
apiRouter.delete('/opportunities/:id/save', authenticateToken, opportunityController.unsaveOpportunity);
apiRouter.post('/opportunities/:id/reject', authenticateToken, opportunityController.rejectOpportunity);
apiRouter.post('/opportunities/:id/report', optionalAuth, opportunityController.reportOpportunity);
apiRouter.get('/opportunities/:id/advice', opportunityController.getOpportunityAdvice);
apiRouter.post('/opportunities/:id/advice', authenticateToken, adviceRateLimiter, opportunityController.addOpportunityAdvice);
apiRouter.delete('/opportunities/:id/advice/:adviceId', authenticateToken, opportunityController.deleteOpportunityAdvice);


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
apiRouter.get('/learning/progress', authenticateToken, learningController.getUserLearningProgress);
apiRouter.post('/learning/progress', authenticateToken, learningController.updateUserLearningProgress);


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

// ── Admin Dashboard Endpoints ────────────────────────────────────────────────
apiRouter.get('/admin/overview', authenticateToken, requireAdmin, adminController.getAdminOverview);
apiRouter.get('/admin/users', authenticateToken, requireAdmin, adminController.getAdminUsers);
apiRouter.get('/admin/opportunities/quality', authenticateToken, requireAdmin, adminController.getOpportunityQuality);
apiRouter.get('/admin/opportunities', authenticateToken, requireAdmin, adminController.getAdminOpportunities);
apiRouter.get('/admin/fields', authenticateToken, requireAdmin, adminController.getAdminFields);
apiRouter.get('/admin/analytics', authenticateToken, requireAdmin, adminController.getAdminAnalytics);
apiRouter.get('/admin/reviews', authenticateToken, requireAdmin, adminController.getAdminReviews);
apiRouter.get('/admin/reports', authenticateToken, requireAdmin, adminController.getAdminReports);
apiRouter.patch('/admin/reports/:id', authenticateToken, requireAdmin, adminController.updateReportStatus);
apiRouter.get('/admin/system-health', authenticateToken, requireAdmin, adminController.getSystemHealth);
