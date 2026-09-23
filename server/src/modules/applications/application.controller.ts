import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { formatOpportunityResponse } from '../../utils/helpers.js';

// Default tasks when an application is created
const DEFAULT_APPLICATION_TASKS = [
  'Review eligibility criteria & prerequisites',
  'Draft personal statement / research proposal',
  'Request recommendation letters',
  'Prepare CV / portfolio samples',
  'Submit final application before deadline'
];

// GET /api/applications
export const getUserApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    const apps = await prisma.trackedApplication.findMany({
      where: { userId },
      include: {
        opportunity: {
          include: { organization: true }
        },
        tasks: {
          orderBy: { order: 'asc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const formatted = apps.map(app => ({
      id: app.id,
      userId: app.userId,
      opportunityId: app.opportunityId,
      status: app.status,
      startedAt: app.startedAt,
      submittedAt: app.submittedAt,
      result: app.result,
      opportunity: formatOpportunityResponse(app.opportunity),
      tasks: app.tasks,
      notes: app.notes,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications
export const trackOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { opportunityId, status = 'SAVED' } = req.body;

    if (!opportunityId) {
      return res.status(400).json({ success: false, message: 'opportunityId is required' });
    }

    const opp = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    const existing = await prisma.trackedApplication.findUnique({
      where: { userId_opportunityId: { userId, opportunityId } },
      include: { tasks: true, notes: true, opportunity: { include: { organization: true } } }
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'Opportunity already tracked',
        data: {
          ...existing,
          opportunity: formatOpportunityResponse(existing.opportunity)
        }
      });
    }

    const newApp = await prisma.trackedApplication.create({
      data: {
        userId,
        opportunityId,
        status: String(status).toUpperCase(),
        tasks: {
          create: DEFAULT_APPLICATION_TASKS.map((label, idx) => ({
            label,
            completed: false,
            order: idx + 1
          }))
        }
      },
      include: {
        opportunity: { include: { organization: true } },
        tasks: true,
        notes: true
      }
    });

    // Record behavioral signal
    await prisma.behaviourSignal.create({
      data: {
        userId,
        opportunityId,
        eventType: 'application_started',
        metadata: JSON.stringify({ status })
      }
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity tracked in Application Workspace',
      data: {
        ...newApp,
        opportunity: formatOpportunityResponse(newApp.opportunity)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/:id
export const getApplicationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    // Check by application ID or opportunity ID
    const app = await prisma.trackedApplication.findFirst({
      where: {
        userId,
        OR: [{ id }, { opportunityId: id }]
      },
      include: {
        opportunity: { include: { organization: true } },
        tasks: { orderBy: { order: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Tracked application not found' });
    }

    res.json({
      success: true,
      data: {
        ...app,
        opportunity: formatOpportunityResponse(app.opportunity)
      }
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/status
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { status, result } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const validStatuses = ['SAVED', 'CONSIDERING', 'PREPARING', 'APPLYING', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];
    const normalizedStatus = String(status).toUpperCase();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const app = await prisma.trackedApplication.findFirst({
      where: {
        userId,
        OR: [{ id }, { opportunityId: id }]
      }
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Tracked application not found' });
    }

    const updated = await prisma.trackedApplication.update({
      where: { id: app.id },
      data: {
        status: normalizedStatus,
        result: result || app.result,
        submittedAt: normalizedStatus === 'SUBMITTED' ? new Date() : app.submittedAt
      },
      include: {
        opportunity: { include: { organization: true } },
        tasks: { orderBy: { order: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } }
      }
    });

    // Record behavioral signal
    await prisma.behaviourSignal.create({
      data: {
        userId,
        opportunityId: app.opportunityId,
        eventType: normalizedStatus === 'SUBMITTED' ? 'application_submitted' : 'application_updated',
        metadata: JSON.stringify({ oldStatus: app.status, newStatus: normalizedStatus })
      }
    });

    // Create user notification for key milestones
    if (['SUBMITTED', 'ACCEPTED', 'APPLYING'].includes(normalizedStatus)) {
      const title = normalizedStatus === 'ACCEPTED' 
        ? `🎉 Congratulations on ${updated.opportunity?.title || 'your application'}!`
        : normalizedStatus === 'SUBMITTED'
        ? `Application Submitted: ${updated.opportunity?.title || 'Opportunity'}`
        : `Application in progress: ${updated.opportunity?.title || 'Opportunity'}`;

      const message = normalizedStatus === 'ACCEPTED'
        ? `Your status was updated to Accepted. Don't forget to report your outcome details!`
        : `Your application status was changed to ${normalizedStatus}.`;

      await prisma.notification.create({
        data: {
          userId,
          opportunityId: app.opportunityId,
          type: 'status_update',
          title,
          message
        }
      }).catch(() => {});
    }

    res.json({
      success: true,
      message: 'Application status updated',
      data: {
        ...updated,
        opportunity: formatOpportunityResponse(updated.opportunity)
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications/:id/tasks
export const addApplicationTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ success: false, message: 'Task label is required' });
    }

    const app = await prisma.trackedApplication.findFirst({
      where: {
        userId,
        OR: [{ id }, { opportunityId: id }]
      },
      include: { tasks: true }
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Tracked application not found' });
    }

    const task = await prisma.applicationTask.create({
      data: {
        applicationId: app.id,
        label: String(label).trim(),
        order: app.tasks.length + 1,
        completed: false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Task added',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/tasks/:taskId
export const toggleApplicationTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id, taskId } = req.params;
    const { completed, label } = req.body;

    const task = await prisma.applicationTask.findUnique({
      where: { id: taskId },
      include: { application: true }
    });

    if (!task || task.application.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updated = await prisma.applicationTask.update({
      where: { id: taskId },
      data: {
        completed: typeof completed === 'boolean' ? completed : !task.completed,
        label: label ? String(label).trim() : task.label
      }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/applications/:id/tasks/:taskId
export const deleteApplicationTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id, taskId } = req.params;

    const task = await prisma.applicationTask.findUnique({
      where: { id: taskId },
      include: { application: true }
    });

    if (!task || task.application.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await prisma.applicationTask.delete({ where: { id: taskId } });

    res.json({
      success: true,
      message: 'Task removed'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications/:id/notes
export const addApplicationNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Note content is required' });
    }

    const app = await prisma.trackedApplication.findFirst({
      where: {
        userId,
        OR: [{ id }, { opportunityId: id }]
      }
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Tracked application not found' });
    }

    const note = await prisma.applicationNote.create({
      data: {
        applicationId: app.id,
        content: String(content).trim()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Note saved',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/applications/:id/notes/:noteId
export const deleteApplicationNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { noteId } = req.params;

    const note = await prisma.applicationNote.findUnique({
      where: { id: noteId },
      include: { application: true }
    });

    if (!note || note.application.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    await prisma.applicationNote.delete({ where: { id: noteId } });

    res.json({
      success: true,
      message: 'Note deleted'
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/applications/:id
export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const app = await prisma.trackedApplication.findFirst({
      where: {
        userId,
        OR: [{ id }, { opportunityId: id }]
      }
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Tracked application not found' });
    }

    await prisma.trackedApplication.delete({ where: { id: app.id } });

    res.json({
      success: true,
      message: 'Application removed from workspace'
    });
  } catch (error) {
    next(error);
  }
};
