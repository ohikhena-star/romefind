import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TrackedApplication, ApplicationStatus, ApplicationTask, ApplicationNote } from '@/types/models';
import { nanoid } from 'nanoid';
import { DEFAULT_APPLICATION_TASKS } from '@/utils/constants';
import { api } from '@/api/client';

interface ApplicationState {
  savedOpportunities: string[];
  trackedApplications: TrackedApplication[];
  comparisons: string[];
  
  saveOpportunity: (id: string) => Promise<void>;
  unsaveOpportunity: (id: string) => Promise<void>;
  isSaved: (id: string) => boolean;
  
  fetchApplications: () => Promise<void>;
  createApplication: (opportunityId: string) => Promise<void>;
  removeTrackedApplication: (id: string) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  toggleTask: (applicationId: string, taskId: string) => Promise<void>;
  addNote: (applicationId: string, content: string) => Promise<void>;
  removeNote: (applicationId: string, noteId: string) => Promise<void>;
  deleteNote: (applicationId: string, noteId: string) => Promise<void>;
  
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  
  getApplicationByOpportunityId: (oppId: string) => TrackedApplication | undefined;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      savedOpportunities: [],
      trackedApplications: [],
      comparisons: [],

      saveOpportunity: async (id) => {
        set((state) => {
          if (state.savedOpportunities.includes(id)) return state;
          return { savedOpportunities: [...state.savedOpportunities, id] };
        });

        try {
          await api.saveOpportunity(id);
        } catch (e) {
          console.warn('Backend save failure', e);
        }
      },

      unsaveOpportunity: async (id) => {
        set((state) => ({
          savedOpportunities: state.savedOpportunities.filter(oppId => oppId !== id)
        }));

        try {
          await api.unsaveOpportunity(id);
        } catch (e) {
          console.warn('Backend unsave failure', e);
        }
      },

      isSaved: (id) => {
        return get().savedOpportunities.includes(id);
      },

      fetchApplications: async () => {
        try {
          const apps = await api.getApplications();
          if (Array.isArray(apps)) {
            set({
              trackedApplications: apps.map((app: any) => ({
                id: app.id,
                opportunityId: app.opportunityId,
                status: (app.status?.toLowerCase() as ApplicationStatus) || ApplicationStatus.Saved,
                startedAt: app.startedAt || app.createdAt,
                submittedAt: app.submittedAt,
                updatedAt: app.updatedAt,
                tasks: (app.tasks || []).map((t: any) => ({
                  id: t.id,
                  label: t.label,
                  completed: t.completed,
                  order: t.order || 0
                })),
                notes: (app.notes || []).map((n: any) => ({
                  id: n.id,
                  content: n.content,
                  createdAt: n.createdAt
                })),
                documents: []
              }))
            });
          }
        } catch (e) {
          // silently keep local store if offline
        }
      },

      createApplication: async (opportunityId) => {
        set((state) => {
          if (state.trackedApplications.some(app => app.opportunityId === opportunityId)) {
            return state;
          }

          const newApp: TrackedApplication = {
            id: nanoid(),
            opportunityId,
            status: ApplicationStatus.Saved,
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tasks: DEFAULT_APPLICATION_TASKS.map((task: string, index: number) => ({
              id: nanoid(),
              label: task,
              completed: false,
              order: index
            })),
            notes: [],
            documents: []
          };

          return { trackedApplications: [...state.trackedApplications, newApp] };
        });

        try {
          await api.trackOpportunity(opportunityId, 'SAVED');
        } catch (e) {
          console.warn('Backend track failure', e);
        }
      },

      removeTrackedApplication: async (id) => {
        set((state) => ({
          trackedApplications: state.trackedApplications.filter(app => app.id !== id && app.opportunityId !== id)
        }));

        try {
          await api.deleteApplication(id);
        } catch (e) {
          console.warn('Backend delete application failure', e);
        }
      },

      removeApplication: async (id) => {
        set((state) => ({
          trackedApplications: state.trackedApplications.filter(app => app.id !== id && app.opportunityId !== id)
        }));

        try {
          await api.deleteApplication(id);
        } catch (e) {
          console.warn('Backend delete application failure', e);
        }
      },

      updateApplicationStatus: async (id, status) => {
        set((state) => ({
          trackedApplications: state.trackedApplications.map(app => 
            (app.id === id || app.opportunityId === id)
              ? { 
                  ...app, 
                  status,
                  updatedAt: new Date().toISOString(),
                  submittedAt: status === ApplicationStatus.Submitted && !app.submittedAt ? new Date().toISOString() : app.submittedAt 
                } 
              : app
          )
        }));

        try {
          await api.updateApplicationStatus(id, status.toUpperCase());
        } catch (e) {
          console.warn('Backend update status failure', e);
        }
      },

      toggleTask: async (applicationId, taskId) => {
        let isNowCompleted = false;
        set((state) => ({
          trackedApplications: state.trackedApplications.map(app => {
            if (app.id !== applicationId && app.opportunityId !== applicationId) return app;
            return {
              ...app,
              tasks: app.tasks.map((task: ApplicationTask) => {
                if (task.id === taskId) {
                  isNowCompleted = !task.completed;
                  return { ...task, completed: !task.completed };
                }
                return task;
              }),
              updatedAt: new Date().toISOString()
            };
          })
        }));

        try {
          await api.toggleApplicationTask(applicationId, taskId, isNowCompleted);
        } catch (e) {
          console.warn('Backend toggle task failure', e);
        }
      },

      addNote: async (applicationId, content) => {
        const newNoteId = nanoid();
        set((state) => ({
          trackedApplications: state.trackedApplications.map(app => {
            if (app.id !== applicationId && app.opportunityId !== applicationId) return app;
            return {
              ...app,
              notes: [
                ...app.notes,
                { id: newNoteId, content, createdAt: new Date().toISOString() }
              ],
              updatedAt: new Date().toISOString()
            };
          })
        }));

        try {
          await api.addApplicationNote(applicationId, content);
        } catch (e) {
          console.warn('Backend add note failure', e);
        }
      },

      removeNote: async (applicationId, noteId) => {
        set((state) => ({
          trackedApplications: state.trackedApplications.map(app => {
            if (app.id !== applicationId && app.opportunityId !== applicationId) return app;
            return {
              ...app,
              notes: app.notes.filter((note: ApplicationNote) => note.id !== noteId),
              updatedAt: new Date().toISOString()
            };
          })
        }));

        try {
          await api.deleteApplicationNote(applicationId, noteId);
        } catch (e) {
          console.warn('Backend delete note failure', e);
        }
      },

      deleteNote: async (applicationId, noteId) => {
        set((state) => ({
          trackedApplications: state.trackedApplications.map(app => {
            if (app.id !== applicationId && app.opportunityId !== applicationId) return app;
            return {
              ...app,
              notes: app.notes.filter((note: ApplicationNote) => note.id !== noteId),
              updatedAt: new Date().toISOString()
            };
          })
        }));

        try {
          await api.deleteApplicationNote(applicationId, noteId);
        } catch (e) {
          console.warn('Backend delete note failure', e);
        }
      },

      addToCompare: (id) => {
        set((state) => {
          if (state.comparisons.includes(id)) return state;
          if (state.comparisons.length >= 4) {
            return { comparisons: [...state.comparisons.slice(1), id] };
          }
          return { comparisons: [...state.comparisons, id] };
        });
      },

      removeFromCompare: (id) => {
        set((state) => ({
          comparisons: state.comparisons.filter(compId => compId !== id)
        }));
      },

      getApplicationByOpportunityId: (oppId) => {
        return get().trackedApplications.find(app => app.opportunityId === oppId);
      }
    }),
    {
      name: 'romefind-applications-storage'
    }
  )
);
