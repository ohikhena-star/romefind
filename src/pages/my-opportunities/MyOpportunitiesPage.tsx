import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { Tabs, Badge, DeadlineIndicator, ProgressBar, EmptyState, Select, Button } from '@/components/ui';
import { OutcomeReportingModal } from '@/components/opportunity/OutcomeReportingModal';
import { ApplicationStatus, Opportunity, TrackedApplication, ApplicationTask } from '@/types/models';
import { FolderCheck, Trash2, ArrowUpRight, Trophy, Sparkles } from 'lucide-react';

export default function MyOpportunitiesPage() {
  const navigate = useNavigate();
  const { trackedApplications, savedOpportunities, updateApplicationStatus, removeTrackedApplication, createApplication, addNote } = useApplicationStore();
  const { opportunities } = useOpportunityStore();

  // Auto-sync saved opportunities into tracked applications if not yet tracked
  useEffect(() => {
    savedOpportunities.forEach((oppId: string) => {
      if (!trackedApplications.some((app: TrackedApplication) => app.opportunityId === oppId)) {
        createApplication(oppId);
      }
    });
  }, [savedOpportunities, trackedApplications, createApplication]);

  const [activeTab, setActiveTab] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('deadline');
  const [selectedAppForOutcome, setSelectedAppForOutcome] = useState<{ id: string; opp: Opportunity } | null>(null);

  const STATUSES = ['All', ...Object.values(ApplicationStatus)];

  const getOpportunity = (id: string): Opportunity | undefined => opportunities.find((o: Opportunity) => o.id === id);

  const filteredApps = useMemo(() => {
    let filtered = [...trackedApplications];
    if (activeTab !== 'All') {
      filtered = trackedApplications.filter((app: TrackedApplication) => app.status.toLowerCase() === activeTab.toLowerCase());
    }
    
    return filtered.sort((a: TrackedApplication, b: TrackedApplication) => {
      const oppA = getOpportunity(a.opportunityId);
      const oppB = getOpportunity(b.opportunityId);
      if (sortBy === 'deadline') {
        const dateA = oppA?.deadline ? new Date(oppA.deadline).getTime() : Infinity;
        const dateB = oppB?.deadline ? new Date(oppB.deadline).getTime() : Infinity;
        return dateA - dateB;
      }
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [trackedApplications, activeTab, sortBy, opportunities]);

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

  if (trackedApplications.length === 0 && savedOpportunities.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <EmptyState
          icon={FolderCheck}
          title="Nothing here yet"
          description="Start exploring opportunities and save the ones you want to pursue to build your path."
          actionLabel="Explore opportunities"
          onAction={() => navigate('/explore')}
        />
      </div>
    );
  }

  const tabs = STATUSES.map((status: string) => ({
    id: status,
    label: status,
    count: status === 'All' 
      ? trackedApplications.length 
      : trackedApplications.filter((a: TrackedApplication) => a.status.toLowerCase() === status.toLowerCase()).length
  }));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-950 dark:text-surface-50">My Opportunities</h1>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            Track, prepare, and manage all your active applications in one command center.
          </p>
        </div>
        <div className="w-full md:w-56">
          <Select
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
            options={[
              { value: 'deadline', label: 'Sort by Deadline' },
              { value: 'status', label: 'Sort by Status' },
              { value: 'dateAdded', label: 'Sort by Date Updated' }
            ]}
          />
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app: TrackedApplication) => {
          const opp = getOpportunity(app.opportunityId);
          if (!opp) return null;

          const totalTasks = app.tasks?.length || 0;
          const completedTasks = app.tasks?.filter((t: ApplicationTask) => t.completed).length || 0;
          const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
          const firstUncompletedTask = app.tasks?.find((t: ApplicationTask) => !t.completed);
          
          const isPreparingOrLater = [
            ApplicationStatus.Preparing,
            ApplicationStatus.Applying,
            ApplicationStatus.Submitted,
            ApplicationStatus.Accepted
          ].includes(app.status);

          const isAccepted = app.status === ApplicationStatus.Accepted;

          return (
            <div 
              key={app.id} 
              className={`bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col gap-4 border ${
                isAccepted ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/20' : 'border-surface-200 dark:border-surface-800'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="text-base font-semibold text-surface-950 dark:text-surface-50 line-clamp-1">{opp.title}</h3>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">
                    {typeof opp.organization === 'object' ? opp.organization.name : opp.organization}
                  </p>
                </div>
                <Badge variant="outline">{opp.type}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge status={app.status}>{app.status}</Badge>
                {opp.deadline && <DeadlineIndicator deadline={opp.deadline} />}
                {isAccepted && (
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Trophy size={12} /> Accepted
                  </span>
                )}
              </div>

              {isPreparingOrLater && totalTasks > 0 && !isAccepted && (
                <div className="space-y-1.5 mt-1 bg-surface-50 dark:bg-surface-800/40 p-3 rounded-lg border border-surface-100 dark:border-surface-700/50">
                  <div className="flex justify-between text-xs text-surface-600 dark:text-surface-400 font-medium">
                    <span>Preparation Progress</span>
                    <span>{completedTasks}/{totalTasks} tasks</span>
                  </div>
                  <ProgressBar value={progress} size="sm" />
                  {firstUncompletedTask && (
                    <p className="text-xs text-rome-600 dark:text-rome-400 font-medium truncate pt-1">
                      Next: {firstUncompletedTask.label}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-auto pt-4 flex flex-col gap-2.5 border-t border-surface-100 dark:border-surface-800">
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/my-opportunities/${app.opportunityId}/workspace`)}
                    variant="primary"
                    className="flex-1"
                    size="sm"
                    rightIcon={<ArrowUpRight size={14} />}
                  >
                    Open Workspace
                  </Button>
                  <Button
                    onClick={() => setSelectedAppForOutcome({ id: app.id, opp })}
                    variant="outline"
                    size="sm"
                    className="text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-50 shrink-0 text-xs font-bold"
                    title="Report acceptance outcome"
                  >
                    🎉 Got In!
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-xs pt-1">
                   <select 
                      className="bg-transparent text-surface-600 dark:text-surface-300 font-medium outline-none cursor-pointer hover:text-rome-600"
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
                       <option key={s} value={s}>{s}</option>
                     ))}
                   </select>
                   <button 
                     onClick={() => removeTrackedApplication(app.id)}
                     className="text-surface-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                     title="Remove from tracking"
                   >
                     <Trash2 size={13} />
                     <span>Remove</span>
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredApps.length === 0 && (
        <div className="py-12 flex justify-center">
          <EmptyState
            title={`No ${activeTab.toLowerCase()} opportunities`}
            description="Change your active filter or explore more opportunities to add to your list."
            actionLabel="Explore opportunities"
            onAction={() => navigate('/explore')}
          />
        </div>
      )}

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
