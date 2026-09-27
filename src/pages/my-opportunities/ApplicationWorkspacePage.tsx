import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { ArrowLeft, ExternalLink, Plus, Trash2, CheckCircle2, FileText, Trophy, Sparkles, PartyPopper } from 'lucide-react';
import { Badge, DeadlineIndicator, ProgressBar, Checkbox, Button, WorkspaceSkeleton } from '@/components/ui';
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

  // If application doesn't exist yet for this opportunity, create it
  React.useEffect(() => {
    if (!app && opp) {
      createApplication(opp.id);
    }
  }, [app, opp, createApplication]);

  const [newNote, setNewNote] = useState('');
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);

  if (isLoading && !opp) {
    return <WorkspaceSkeleton />;
  }

  if (!opp) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Workspace not found</h2>
        <p className="text-surface-500 mb-4">The opportunity you are trying to view could not be located.</p>
        <Button variant="primary" onClick={() => navigate('/my-opportunities')}>
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
  };

  const isAccepted = app?.status === ApplicationStatus.Accepted;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/my-opportunities')}
          className="flex items-center gap-2 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 w-fit transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Back to My Opportunities</span>
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-950 dark:text-surface-50">{opp.title}</h1>
            <p className="text-base text-surface-600 dark:text-surface-400 font-medium">
              {typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOutcomeModal(true)}
              className="text-xs font-bold border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50"
              leftIcon={<Trophy className="w-4 h-4 text-amber-500" />}
            >
              {isAccepted ? 'Update Acceptance Info' : 'I Got Accepted! 🎉'}
            </Button>
            <Badge variant="outline">{opp.type}</Badge>
            {app && <Badge status={app.status}>{app.status}</Badge>}
          </div>
        </div>
      </div>

      {/* Accepted Celebration Banner */}
      {isAccepted && (
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 dark:from-amber-950/20 dark:via-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md">
              🏆
            </div>
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-white flex items-center gap-1.5">
                Accepted Opportunity! Congratulations!
              </h3>
              <p className="text-xs text-surface-600 dark:text-surface-300 mt-0.5">
                Your acceptance has been logged in ROMEfind. Thank you for updating the community on your milestone!
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowOutcomeModal(true)}
            className="shrink-0 text-xs font-semibold"
          >
            Edit Outcome Details
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Next Best Action Card */}
          {firstUncompletedTask && !isAccepted && (
            <div className="bg-gradient-to-r from-rome-50 via-sky-50/50 to-emerald-50/30 dark:from-rome-950/40 dark:via-surface-900 dark:to-emerald-950/20 border border-rome-200 dark:border-rome-800/80 rounded-3xl p-6 flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-rome-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-black shadow-xs">
                →
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rome-700 dark:text-rome-300 bg-rome-100 dark:bg-rome-900/60 px-2.5 py-0.5 rounded-full">
                    Priority Task
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                </div>
                <h3 className="text-base font-black text-surface-950 dark:text-white leading-snug">
                  {firstUncompletedTask.label}
                </h3>
              </div>
            </div>
          )}

          {/* Checklist (Image 3 iOS/macOS Task Card Pattern) */}
          <div className="bg-white dark:bg-surface-900 rounded-3xl p-6 sm:p-7 shadow-xs border border-surface-200/90 dark:border-surface-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-black text-surface-950 dark:text-white tracking-tight">Application Checklist</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Track key requirements and materials required for submission.</p>
              </div>
              <span className="text-xs font-black text-surface-800 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 px-3 py-1 rounded-full border border-surface-200/80 dark:border-surface-700">
                {completedTasks}/{totalTasks} Ready
              </span>
            </div>

            <ProgressBar value={progress} className="mb-6" />

            <div className="flex flex-col gap-3">
              {tasks.map((task: ApplicationTask, idx: number) => (
                <div 
                  key={task.id} 
                  onClick={() => app && toggleTask(app.id, task.id)}
                  className={`flex items-start justify-between gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer group shadow-2xs ${
                    task.completed 
                      ? 'bg-surface-50/60 dark:bg-surface-800/30 border-surface-200/80 dark:border-surface-800/80 opacity-80' 
                      : 'bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700/80 hover:border-rome-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-lg flex items-center justify-center border text-xs font-black transition-colors mt-0.5 flex-shrink-0",
                      task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                    )}>
                      {task.completed && "✓"}
                    </div>
                    <div>
                      <span className={`text-sm font-bold ${task.completed ? 'line-through text-surface-400 dark:text-surface-500' : 'text-surface-900 dark:text-surface-100'}`}>
                        {task.label}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-md",
                          task.completed 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" 
                            : idx === 0 
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" 
                              : "bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400"
                        )}>
                          {task.completed ? 'Verified' : idx === 0 ? 'Next Up' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Journal (Image 3 Notes Widget Pattern) */}
          <div className="bg-white dark:bg-surface-900 rounded-3xl p-6 sm:p-7 shadow-xs border border-surface-200/90 dark:border-surface-800 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-surface-950 dark:text-white tracking-tight">Notes &amp; Strategy Journal</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Brainstorm essay hooks, record interview insights, or log feedback.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <textarea 
                className="w-full p-4 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/80 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-rome-500/40 font-medium"
                placeholder="Jot down application notes, mentor feedback, or essay hooks..."
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                  Save Note
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {app?.notes?.sort((a: ApplicationNote, b: ApplicationNote) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note: ApplicationNote) => (
                <div key={note.id} className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/70 dark:border-surface-700/70 flex justify-between gap-4 group hover:border-surface-300 transition-colors shadow-2xs">
                  <div>
                    <p className="text-xs sm:text-sm text-surface-800 dark:text-surface-200 whitespace-pre-wrap font-medium">{note.content}</p>
                    <span className="text-[11px] text-surface-400 mt-2 block font-semibold">{formatRelative(note.createdAt)}</span>
                  </div>
                  <button 
                    onClick={() => app && removeNote(app.id, note.id)}
                    className="text-surface-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                    aria-label="Delete note"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {(!app?.notes || app.notes.length === 0) && (
                <p className="text-surface-400 italic text-center py-6 text-xs font-medium">No journal notes added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Status & Outcome Action */}
          <div className="bg-white dark:bg-surface-900 rounded-lg p-6 shadow-card border border-surface-200 dark:border-surface-800 flex flex-col gap-6">
            <div>
              <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Deadline</h4>
              {opp.deadline ? (
                 <DeadlineIndicator deadline={opp.deadline} className="text-base font-semibold" />
              ) : (
                <p className="text-sm text-surface-700 dark:text-surface-300">No deadline specified</p>
              )}
            </div>

            {app && (
              <div>
                <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Move Status</h4>
                <select 
                  className="w-full p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm font-medium cursor-pointer"
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
              variant="secondary"
              size="sm"
              onClick={() => setShowOutcomeModal(true)}
              className="w-full justify-center text-xs font-bold"
              leftIcon={<Trophy className="w-4 h-4 text-amber-500" />}
            >
              Report Outcome / Acceptance
            </Button>
          </div>

          {/* Quick Info */}
          <div className="bg-white dark:bg-surface-900 rounded-lg p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-4">Quick Facts</h4>
            <ul className="flex flex-col gap-3 text-sm text-surface-800 dark:text-surface-200">
              {opp.location && <li><strong className="text-surface-500 font-medium">Location:</strong> {opp.location}</li>}
              {opp.duration && <li><strong className="text-surface-500 font-medium">Duration:</strong> {opp.duration}</li>}
              {opp.funding && <li><strong className="text-surface-500 font-medium">Funding:</strong> {opp.funding}</li>}
              {opp.remoteStatus && <li><strong className="text-surface-500 font-medium">Remote:</strong> {opp.remoteStatus}</li>}
            </ul>
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-surface-900 rounded-lg p-6 shadow-card border border-surface-200 dark:border-surface-800">
             <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
               <FileText size={15} /> Required Materials
             </h4>
             {opp.requirements?.length ? (
               <ul className="list-disc pl-5 flex flex-col gap-2 text-xs text-surface-700 dark:text-surface-300">
                 {opp.requirements.map((req: string, i: number) => (
                   <li key={i}>{req}</li>
                 ))}
               </ul>
             ) : (
               <p className="text-xs text-surface-500">No specific documents listed.</p>
             )}
          </div>

          {/* Apply Button */}
          <div className="flex flex-col gap-2">
            <a 
              href={opp.applicationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="primary" fullWidth size="lg" rightIcon={<ExternalLink size={16} />}>
                Go to official application
              </Button>
            </a>
            <p className="text-xs text-surface-500 text-center">
              ROMEfind tracks your progress. You will apply directly on the organization's official platform.
            </p>
          </div>

        </div>
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
