import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { Badge, DeadlineIndicator, ProgressBar, Button, WorkspaceSkeleton } from '@/components/ui';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { OutcomeReportingModal } from '@/components/opportunity/OutcomeReportingModal';
import { ApplicationStatus, ApplicationTask, ApplicationNote } from '@/types/models';
import { formatRelative } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function ApplicationWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trackedApplications, updateApplicationStatus, toggleTask, addNote, removeNote, createApplication } = useApplicationStore();
  const { opportunities, isLoading } = useOpportunityStore();

  const opp = opportunities.find(o => o.id === id || trackedApplications.some(a => a.id === id && a.opportunityId === o.id));
  let app = trackedApplications.find(a => a.id === id || a.opportunityId === id);

  // If application record doesn't exist yet for this opportunity, create it
  React.useEffect(() => {
    if (!app && opp) {
      createApplication(opp.id, opp);
    }
  }, [app, opp, createApplication]);

  const [newNote, setNewNote] = useState('');
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);

  if (isLoading && !opp) {
    return <WorkspaceSkeleton />;
  }

  if (!opp) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2 text-surface-900 dark:text-surface-100">Application not found</h2>
        <p className="text-xs sm:text-sm text-surface-500 mb-6">The opportunity or application you are trying to view could not be located.</p>
        <Button variant="default" onClick={() => navigate('/my-opportunities')}>
          Back to My Opportunities
        </Button>
      </div>
    );
  }

  const tasks: ApplicationTask[] = app?.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: ApplicationTask) => t.completed).length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const firstUncompletedTask = tasks.find((t: ApplicationTask) => !t.completed);

  const STATUSES = Object.values(ApplicationStatus);

  const handleAddNote = () => {
    if (newNote.trim() && app) {
      addNote(app.id, newNote);
      setNewNote('');
    }
  };

  const handleOutcomeSubmit = async (details: {
    status: ApplicationStatus;
    outcomeType: string;
    startDate?: string;
    stipendReceived?: string;
    reflectionTip: string;
    shareWithCommunity: boolean;
  }) => {
    if (!app) return;
    await updateApplicationStatus(app.id, details.status);

    let noteText = `🎉 ACCEPTANCE OUTCOME: ${details.outcomeType}`;
    if (details.startDate) noteText += `\n📅 Expected Start: ${details.startDate}`;
    if (details.stipendReceived) noteText += `\n💰 Funding/Stipend: ${details.stipendReceived}`;
    if (details.reflectionTip) noteText += `\n💡 Reflection & Tips: ${details.reflectionTip}`;

    await addNote(app.id, noteText);
    setShowOutcomeModal(false);
  };

  const isAccepted = app?.status === ApplicationStatus.Accepted;
  const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;

  return (
    <div className="w-full py-4 sm:py-8 flex flex-col gap-6 animate-in fade-in text-left">
      {/* ─── Breadcrumb Back Navigation ─── */}
      <div className="w-full">
        <button
          onClick={() => navigate('/my-opportunities')}
          aria-label="Back to My Opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors py-1 cursor-pointer"
        >
          <SolarIcon name="alt-arrow-left-linear" size={14} />
          <span>Back to My Opportunities</span>
        </button>
      </div>

      {/* ─── Header & Stage Bar ─── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div>
          <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider block mb-0.5">
            {orgName}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50 leading-tight">
            {opp.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          {isAccepted ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOutcomeModal(true)}
              className="text-xs font-bold border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            >
              <SolarIcon name="cup-star-linear" size={15} />
              <span>Update Acceptance Info</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOutcomeModal(true)}
              className="text-xs font-bold text-surface-700 dark:text-surface-200"
            >
              <SolarIcon name="cup-star-linear" size={15} />
              <span>I Got In! 🎉</span>
            </Button>
          )}
          <Badge variant="outline">{opp.type}</Badge>
          {app && <Badge status={app.status}>{app.status}</Badge>}
        </div>
      </header>

      {/* ─── Accepted Milestone Card ─── */}
      {isAccepted && (
        <section aria-label="Accepted application milestone" className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              <SolarIcon name="cup-star-linear" size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-100">
                Application Accepted! Congratulations!
              </h2>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                Your acceptance milestone is logged in your tracking history. Keep notes or reflection tips below.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowOutcomeModal(true)}
            className="shrink-0 text-xs font-semibold bg-white dark:bg-surface-900 border-emerald-300 text-emerald-800 dark:text-emerald-200"
          >
            Edit Outcome Details
          </Button>
        </section>
      )}

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
        {/* Left Column: Tasks & Notes */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Next Immediate Priority Card */}
          {firstUncompletedTask && !isAccepted && (
            <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 flex items-start gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-rome-500 text-white flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">
                <SolarIcon name="alt-arrow-right-linear" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-rome-700 dark:text-rome-300 bg-rome-100 dark:bg-rome-950/60 px-2 py-0.5 rounded-md">
                    Next Action
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-surface-950 dark:text-white leading-snug">
                  {firstUncompletedTask.label}
                </h2>
              </div>
            </div>
          )}

          {/* Preparation Checklist */}
          <section aria-label="Preparation checklist" className="bg-white dark:bg-surface-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-200 dark:border-surface-800 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-surface-950 dark:text-white">
                  Preparation Checklist
                </h2>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  Track requirements and milestones for this {opp.type.toLowerCase()}.
                </p>
              </div>
              <span className="text-xs font-bold text-surface-700 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-lg border border-surface-200 dark:border-surface-700">
                {completedTasks}/{totalTasks} Complete
              </span>
            </div>

            <ProgressBar value={progress} size="sm" />

            <div className="flex flex-col gap-2.5 pt-1">
              {tasks.map((task: ApplicationTask) => (
                <div
                  key={task.id}
                  onClick={() => app && toggleTask(app.id, task.id)}
                  className={cn(
                    "flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer min-h-[44px]",
                    task.completed
                      ? "bg-surface-50/70 dark:bg-surface-850/40 border-surface-200/80 dark:border-surface-800 opacity-75"
                      : "bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 hover:border-rome-400 shadow-2xs"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center border text-xs font-bold transition-colors mt-0.5 shrink-0",
                    task.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                  )}>
                    {task.completed && "✓"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={cn(
                      "text-xs sm:text-sm font-medium leading-relaxed block",
                      task.completed ? "line-through text-surface-400 dark:text-surface-500" : "text-surface-900 dark:text-surface-100"
                    )}>
                      {task.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes & Journal */}
          <section aria-label="Notes and strategy journal" className="bg-white dark:bg-surface-900 rounded-2xl p-5 sm:p-6 shadow-xs border border-surface-200 dark:border-surface-800 flex flex-col gap-5">
            <div>
              <h2 className="text-base font-bold text-surface-950 dark:text-white">
                Application Notes &amp; Journal
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                Record essay outlines, application questions, mentor feedback, or interview tips.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <label htmlFor="workspace-note-input" className="sr-only">New note</label>
              <textarea
                id="workspace-note-input"
                className="w-full p-3.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/80 text-xs sm:text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/40 font-medium"
                placeholder="Write down notes, drafts, or reminders..."
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex justify-end">
                <Button variant="default" size="sm" onClick={handleAddNote} disabled={!newNote.trim()} className="text-xs font-semibold">
                  Save Note
                </Button>
              </div>
            </div>

            <div className="space-y-2.5">
              {app?.notes?.sort((a: ApplicationNote, b: ApplicationNote) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note: ApplicationNote) => (
                <div key={note.id} className="p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/70 dark:border-surface-700/70 flex justify-between gap-3 group">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-surface-800 dark:text-surface-200 whitespace-pre-wrap font-medium">{note.content}</p>
                    <span className="text-xs text-surface-400 mt-1.5 block font-medium">{formatRelative(note.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => app && removeNote(app.id, note.id)}
                    className="text-surface-400 hover:text-red-500 p-1 cursor-pointer shrink-0"
                    aria-label="Delete note"
                  >
                    <SolarIcon name="trash-bin-minimalistic-linear" size={15} />
                  </button>
                </div>
              ))}
              {(!app?.notes || app.notes.length === 0) && (
                <p className="text-surface-400 italic text-center py-4 text-xs font-medium">No notes recorded yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Status Pipeline, Deadline & Official Link */}
        <aside aria-label="Status and opportunity details" className="flex flex-col gap-5">
          {/* Status Progression Control */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl p-5 shadow-xs border border-surface-200 dark:border-surface-800 space-y-4">
            <div>
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-1">
                Deadline
              </span>
              {opp.deadline ? (
                <DeadlineIndicator deadline={opp.deadline} className="text-sm font-semibold" />
              ) : (
                <p className="text-xs font-medium text-surface-700 dark:text-surface-300">Rolling / Ongoing</p>
              )}
            </div>

            {app && (
              <div>
                <label htmlFor="workspace-status-select" className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">
                  Update Application Stage
                </label>
                <select
                  id="workspace-status-select"
                  className="w-full p-2.5 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-xs sm:text-sm font-semibold cursor-pointer outline-none min-h-[44px]"
                  value={app.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as ApplicationStatus;
                    if (newStatus === ApplicationStatus.Accepted) {
                      setShowOutcomeModal(true);
                    } else {
                      updateApplicationStatus(app.id, newStatus);
                    }
                  }}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOutcomeModal(true)}
              className="w-full justify-center text-xs font-semibold h-10 min-h-[40px] rounded-xl"
            >
              <SolarIcon name="cup-star-linear" size={15} />
              <span>Report Decision Outcome</span>
            </Button>
          </div>

          {/* Quick Facts */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl p-5 shadow-xs border border-surface-200 dark:border-surface-800 space-y-3">
            <h2 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Quick Details</h2>
            <ul className="flex flex-col gap-2 text-xs text-surface-700 dark:text-surface-300">
              {opp.location && <li><strong className="text-surface-500 font-medium">Location:</strong> {opp.location}</li>}
              {opp.duration && <li><strong className="text-surface-500 font-medium">Duration:</strong> {opp.duration}</li>}
              {opp.funding && <li><strong className="text-surface-500 font-medium">Funding:</strong> {opp.funding}</li>}
              {opp.remoteStatus && <li><strong className="text-surface-500 font-medium">Modality:</strong> {opp.remoteStatus}</li>}
            </ul>
          </div>

          {/* Required Materials summary */}
          {opp.requirements && opp.requirements.length > 0 && (
            <div className="bg-white dark:bg-surface-900 rounded-2xl p-5 shadow-xs border border-surface-200 dark:border-surface-800 space-y-2.5">
              <h2 className="text-xs font-bold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
                <SolarIcon name="document-text-linear" size={15} />
                <span>Required Materials</span>
              </h2>
              <ul className="list-disc pl-4 flex flex-col gap-1.5 text-xs text-surface-700 dark:text-surface-300">
                {opp.requirements.map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Application Portal Link */}
          {opp.applicationUrl && (
            <div className="space-y-1.5">
              <Button
                variant="default"
                size="default"
                className="w-full h-11 min-h-[44px] justify-center bg-rome-500 hover:bg-rome-600 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs"
                onClick={() => window.open(opp.applicationUrl, '_blank', 'noopener noreferrer')}
                aria-label={`Go to official application for ${opp.title} (opens in new tab)`}
              >
                <span>Go to Official Application</span>
                <SolarIcon name="arrow-right-up-linear" size={15} />
              </Button>
              <p className="text-xs text-surface-400 text-center">
                Submit directly on the host institution's official site.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Outcome Reporting Modal */}
      <OutcomeReportingModal
        isOpen={showOutcomeModal}
        onClose={() => setShowOutcomeModal(false)}
        opportunityId={opp.id}
        opportunityTitle={opp.title}
        organizationName={typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
        onSubmitOutcome={handleOutcomeSubmit}
      />
    </div>
  );
}
