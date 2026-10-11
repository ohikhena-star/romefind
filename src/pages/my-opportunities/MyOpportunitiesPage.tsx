import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { Tabs, DeadlineIndicator, ProgressBar, EmptyState, Button } from '@/components/ui';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { OutcomeReportingModal } from '@/components/opportunity/OutcomeReportingModal';
import { ApplicationStatus, Opportunity, TrackedApplication, ApplicationTask } from '@/types/models';
import { cn } from '@/utils/cn';

type WorkflowGroup = 'all' | 'saved' | 'in_progress' | 'submitted' | 'completed';

interface WorkflowCategory {
  id: WorkflowGroup;
  label: string;
  description: string;
  statuses: ApplicationStatus[];
}

const WORKFLOW_CATEGORIES: WorkflowCategory[] = [
  {
    id: 'all',
    label: 'All Items',
    description: 'All saved opportunities and active applications',
    statuses: []
  },
  {
    id: 'saved',
    label: 'Saved',
    description: 'Opportunities you have bookmarked for later review',
    statuses: [ApplicationStatus.Saved, ApplicationStatus.Considering]
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    description: 'Applications you are preparing materials and drafting for',
    statuses: [ApplicationStatus.Preparing, ApplicationStatus.Applying]
  },
  {
    id: 'submitted',
    label: 'Submitted',
    description: 'Applications submitted, awaiting admission or interview decisions',
    statuses: [ApplicationStatus.Submitted]
  },
  {
    id: 'completed',
    label: 'Decided',
    description: 'Final outcomes, acceptance milestones, and closed cycles',
    statuses: [ApplicationStatus.Accepted, ApplicationStatus.Rejected, ApplicationStatus.Result]
  }
];

export default function MyOpportunitiesPage() {
  const navigate = useNavigate();
  const {
    trackedApplications,
    savedOpportunities,
    updateApplicationStatus,
    removeTrackedApplication,
    unsaveOpportunity,
    createApplication,
    addNote
  } = useApplicationStore();
  const { opportunities } = useOpportunityStore();

  // Auto-sync saved opportunities into tracked applications if not yet tracked
  useEffect(() => {
    savedOpportunities.forEach((oppId: string) => {
      if (!trackedApplications.some((app: TrackedApplication) => app.opportunityId === oppId)) {
        const found = opportunities.find((o: Opportunity) => o.id === oppId);
        createApplication(oppId, found);
      }
    });
  }, [savedOpportunities, trackedApplications, createApplication, opportunities]);

  const [activeTab, setActiveTab] = useState<WorkflowGroup>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'updated' | 'progress'>('deadline');
  const [selectedAppForOutcome, setSelectedAppForOutcome] = useState<{ id: string; opp: Opportunity } | null>(null);

  const getOpportunity = (id: string): Opportunity | undefined => opportunities.find((o: Opportunity) => o.id === id);

  // Filter items according to the active workflow category
  const activeCategory = WORKFLOW_CATEGORIES.find(c => c.id === activeTab) || WORKFLOW_CATEGORIES[0];

  const filteredApps = useMemo(() => {
    let list = [...trackedApplications];

    if (activeCategory.statuses.length > 0) {
      list = list.filter((app: TrackedApplication) =>
        activeCategory.statuses.some(s => s.toLowerCase() === app.status?.toLowerCase())
      );
    }

    return list.sort((a: TrackedApplication, b: TrackedApplication) => {
      const oppA = getOpportunity(a.opportunityId);
      const oppB = getOpportunity(b.opportunityId);

      if (sortBy === 'deadline') {
        const dateA = oppA?.deadline ? new Date(oppA.deadline).getTime() : Infinity;
        const dateB = oppB?.deadline ? new Date(oppB.deadline).getTime() : Infinity;
        return dateA - dateB;
      }
      if (sortBy === 'progress') {
        const progressA = (a.tasks?.filter((t: ApplicationTask) => t.completed).length || 0) / (a.tasks?.length || 1);
        const progressB = (b.tasks?.filter((t: ApplicationTask) => t.completed).length || 0) / (b.tasks?.length || 1);
        return progressB - progressA;
      }
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });
  }, [trackedApplications, activeCategory, sortBy, opportunities]);

  const handleOutcomeSubmit = async (details: {
    status: ApplicationStatus;
    outcomeType: string;
    startDate?: string;
    stipendReceived?: string;
    reflectionTip: string;
    shareWithCommunity: boolean;
  }) => {
    if (!selectedAppForOutcome) return;
    await updateApplicationStatus(selectedAppForOutcome.id, details.status);

    let noteText = `🎉 ACCEPTANCE OUTCOME: ${details.outcomeType}`;
    if (details.startDate) noteText += `\n📅 Expected Start: ${details.startDate}`;
    if (details.stipendReceived) noteText += `\n💰 Funding/Stipend: ${details.stipendReceived}`;
    if (details.reflectionTip) noteText += `\n💡 Reflection & Tips: ${details.reflectionTip}`;

    await addNote(selectedAppForOutcome.id, noteText);
    setSelectedAppForOutcome(null);
  };

  const handleRemove = async (appId: string, oppId: string) => {
    await removeTrackedApplication(appId);
    await unsaveOpportunity(oppId);
  };

  // Status badge styling adhering strictly to the clean blue & neutral system
  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.Accepted:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
      case ApplicationStatus.Rejected:
        return 'bg-surface-100 text-surface-600 border-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:border-surface-700';
      case ApplicationStatus.Submitted:
      case ApplicationStatus.Result:
        return 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
      case ApplicationStatus.Preparing:
      case ApplicationStatus.Applying:
        return 'bg-rome-50 text-rome-700 border-rome-200/80 dark:bg-rome-950/40 dark:text-rome-300 dark:border-rome-800/60';
      case ApplicationStatus.Considering:
        return 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
      case ApplicationStatus.Saved:
      default:
        return 'bg-surface-100 text-surface-700 border-surface-200/80 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700';
    }
  };

  const tabs = WORKFLOW_CATEGORIES.map(cat => ({
    id: cat.id,
    label: cat.label,
    count: cat.id === 'all'
      ? trackedApplications.length
      : trackedApplications.filter((a: TrackedApplication) =>
          cat.statuses.some(s => s.toLowerCase() === a.status?.toLowerCase())
        ).length
  }));

  // Global Empty State (no items saved or tracked at all)
  if (trackedApplications.length === 0 && savedOpportunities.length === 0) {
    return (
      <div className="w-full py-12 md:py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <EmptyState
          icon="bookmark-linear"
          title="No opportunities saved yet"
          description="Opportunities you bookmark from Discover or Explore will appear here so you can organize preparation steps, checklist tasks, and deadlines."
          actionLabel="Explore opportunities"
          onAction={() => navigate('/explore')}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 py-4 md:py-8 animate-in fade-in">
      {/* ─── 1. Header & Summary ────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-surface-100 dark:border-surface-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50">
            My Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-1">
            Organize, prepare, and track opportunities you've saved and applications you're pursuing.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <label htmlFor="sort-my-opportunities" className="text-xs font-medium text-surface-500 dark:text-surface-400 shrink-0 hidden sm:inline">
            Sort by:
          </label>
          <select
            id="sort-my-opportunities"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort opportunities"
            className="w-full sm:w-auto h-11 min-h-[44px] px-3.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-xs font-semibold text-surface-800 dark:text-surface-200 rounded-xl outline-none focus:ring-2 focus:ring-rome-500/50 shadow-xs cursor-pointer"
          >
            <option value="deadline">Upcoming Deadline</option>
            <option value="updated">Recently Updated</option>
            <option value="progress">Checklist Completion</option>
          </select>
        </div>
      </header>

      {/* ─── 2. Workflow Navigation Tabs ─────────────────────────────────── */}
      <nav aria-label="Opportunity pipeline stages">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as WorkflowGroup)} />
      </nav>

      {/* ─── 3. Opportunities Pipeline List ──────────────────────────────── */}
      <main aria-label="Opportunities list" className="w-full">
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
            {filteredApps.map((app: TrackedApplication) => {
              const opp = getOpportunity(app.opportunityId);
              if (!opp) return null;

              const totalTasks = app.tasks?.length || 0;
              const completedTasks = app.tasks?.filter((t: ApplicationTask) => t.completed).length || 0;
              const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
              const firstUncompletedTask = app.tasks?.find((t: ApplicationTask) => !t.completed);
              const isAccepted = app.status === ApplicationStatus.Accepted;

              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;

              return (
                <article
                  key={app.id}
                  aria-label={`${opp.title} (${app.status})`}
                  className={cn(
                    "w-full bg-white dark:bg-surface-900 rounded-2xl p-5 sm:p-6 transition-all flex flex-col justify-between text-left",
                    "border border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700 shadow-card hover:shadow-card-hover",
                    isAccepted && "border-emerald-300/60 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10"
                  )}
                >
                  <div className="space-y-3">
                    {/* Header Row: Organization & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 truncate uppercase tracking-wider" title={orgName}>
                        {orgName}
                      </span>
                      <span className={cn("px-2.5 py-0.5 rounded-lg text-xs font-semibold border shrink-0 capitalize", getStatusBadgeStyle(app.status))}>
                        {app.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      onClick={() => navigate(`/opportunity/${opp.id}`)}
                      className="text-base sm:text-lg font-bold text-surface-950 dark:text-white line-clamp-2 leading-snug cursor-pointer hover:text-rome-600 dark:hover:text-rome-400 transition-colors"
                      title={opp.title}
                    >
                      {opp.title}
                    </h2>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700">
                        {opp.type}
                      </span>
                      {opp.deadline && (
                        <div className="text-xs">
                          <DeadlineIndicator deadline={opp.deadline} />
                        </div>
                      )}
                    </div>

                    {/* Preparation / Checklist Progress (shown for tracked items with tasks) */}
                    {totalTasks > 0 && !isAccepted && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
                          <span className="font-medium">Preparation checklist</span>
                          <span className="font-semibold text-surface-700 dark:text-surface-300">{completedTasks}/{totalTasks} complete</span>
                        </div>
                        <ProgressBar value={progress} size="sm" />
                        {firstUncompletedTask ? (
                          <p className="text-xs text-rome-600 dark:text-rome-400 font-medium truncate pt-0.5">
                            Next: {firstUncompletedTask.label}
                          </p>
                        ) : (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate pt-0.5">
                            ✓ All checklist tasks completed!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ─── Bottom Actions ─── */}
                  <div className="mt-5 pt-4 border-t border-surface-100 dark:border-surface-800/80 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => navigate(`/my-opportunities/${app.opportunityId}/workspace`)}
                        variant="default"
                        size="default"
                        className="flex-1 justify-center gap-1.5 h-11 min-h-[44px] text-xs sm:text-sm font-semibold rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs"
                      >
                        <span>Workspace</span>
                        <SolarIcon name="alt-arrow-right-linear" size={15} />
                      </Button>

                      {isAccepted ? (
                        <Button
                          onClick={() => setSelectedAppForOutcome({ id: app.id, opp })}
                          variant="outline"
                          size="default"
                          className="h-11 min-h-[44px] px-3 text-xs font-semibold border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl shrink-0"
                          title="Update outcome notes"
                        >
                          <SolarIcon name="cup-star-linear" size={15} />
                          <span>Outcome</span>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSelectedAppForOutcome({ id: app.id, opp })}
                          variant="outline"
                          size="default"
                          className="h-11 min-h-[44px] px-3 text-xs font-semibold text-surface-700 dark:text-surface-300 rounded-xl shrink-0"
                          title="Report outcome or acceptance"
                        >
                          <span>I Got In! 🎉</span>
                        </Button>
                      )}
                    </div>

                    {/* Status dropdown & Unsave/Remove button */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor={`status-select-${app.id}`} className="text-surface-400 text-xs">
                          Status:
                        </label>
                        <select
                          id={`status-select-${app.id}`}
                          aria-label={`Change status for ${opp.title}`}
                          className="bg-transparent text-surface-700 dark:text-surface-300 font-semibold outline-none cursor-pointer hover:text-rome-600 dark:hover:text-rome-400 py-1"
                          value={app.status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const newStatus = e.target.value as ApplicationStatus;
                            if (newStatus === ApplicationStatus.Accepted) {
                              setSelectedAppForOutcome({ id: app.id, opp });
                            } else {
                              updateApplicationStatus(app.id, newStatus);
                            }
                          }}
                        >
                          {Object.values(ApplicationStatus).map((s: ApplicationStatus) => (
                            <option key={s} value={s} className="bg-white dark:bg-surface-900 text-surface-900 dark:text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(app.id, opp.id)}
                        className="text-surface-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-medium min-h-[32px]"
                        title="Remove from tracking and saved items"
                        aria-label={`Remove ${opp.title} from tracked opportunities`}
                      >
                        <SolarIcon name="trash-bin-minimalistic-linear" size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty state for the specific tab */
          <div className="py-16 flex justify-center w-full" aria-live="polite">
            <EmptyState
              icon={activeTab === 'saved' ? 'bookmark-linear' : 'case-linear'}
              title={`No ${activeCategory.label.toLowerCase()} opportunities`}
              description={
                activeTab === 'saved'
                  ? 'Opportunities you bookmark will appear here so you can review them before deciding to apply.'
                  : activeTab === 'in_progress'
                  ? 'Move opportunities here when you begin drafting your CV, statement of purpose, or application materials.'
                  : activeTab === 'submitted'
                  ? 'Keep track of submitted applications and their timeline while waiting for decisions.'
                  : 'Document your completed applications, offers, and decisions here.'
              }
              actionLabel="Explore opportunities"
              onAction={() => navigate('/explore')}
            />
          </div>
        )}
      </main>

      {/* Outcome Reporting Modal */}
      {selectedAppForOutcome && (
        <OutcomeReportingModal
          isOpen={!!selectedAppForOutcome}
          onClose={() => setSelectedAppForOutcome(null)}
          opportunityTitle={selectedAppForOutcome.opp.title}
          organizationName={typeof selectedAppForOutcome.opp.organization === 'object' ? selectedAppForOutcome.opp.organization.name : selectedAppForOutcome.opp.organization}
          onSubmitOutcome={handleOutcomeSubmit}
        />
      )}
    </div>
  );
}
