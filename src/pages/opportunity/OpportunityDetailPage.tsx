import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { calculateRelevanceScore } from '@/services/personalization.service';
import { api } from '@/api/client';
import { Button, Tag, DeadlineIndicator, Badge, EmptyState } from '@/components/ui';
import { OpportunityDetailSkeleton } from '@/components/ui/composite-skeletons';
import { OpportunityCard } from '@/components/opportunity';
import { Opportunity, RemoteStatus } from '@/types/models';
import { generateOpportunityTasks } from '@/utils/opportunityTasks';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { ContextualSignupModal, ContextualPromptType } from '@/components/auth/ContextualSignupModal';
import { cn } from '@/utils/cn';

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOpportunityById, opportunities, isLoading } = useOpportunityStore();
  const { user, isAuthenticated } = useAuthStore();
  const {
    isSaved,
    saveOpportunity,
    unsaveOpportunity,
    addToCompare,
    removeFromCompare,
    comparisons,
    createApplication,
    trackedApplications,
    toggleTask
  } = useApplicationStore();

  const [showShareModal, setShowShareModal] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  // Contextual signup prompt
  const [contextualPrompt, setContextualPrompt] = useState<{
    isOpen: boolean;
    type: ContextualPromptType;
  }>({ isOpen: false, type: 'save' });

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('link_broken');
  const [reportDetails, setReportDetails] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Community advice state
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [adviceList, setAdviceList] = useState<any[]>([]);
  const [adviceAuthorName, setAdviceAuthorName] = useState('');
  const [adviceAuthorRole, setAdviceAuthorRole] = useState('');
  const [adviceType, setAdviceType] = useState('General');
  const [adviceOutcome, setAdviceOutcome] = useState('Accepted');
  const [adviceTitle, setAdviceTitle] = useState('');
  const [adviceContent, setAdviceContent] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);

  // Delete advice state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteOtherText, setDeleteOtherText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const DELETE_REASONS = [
    'I posted this by mistake',
    'The information I shared is no longer accurate',
    'I want to update it and will repost',
    'Privacy concerns',
    'Other',
  ];

  const location = useLocation();
  const trackedVisitRef = useRef(false);

  // Track shared link visits (?ref=share)
  useEffect(() => {
    if (!id || trackedVisitRef.current) return;
    const params = new URLSearchParams(location.search);
    if (params.get('ref') === 'share') {
      trackedVisitRef.current = true;
      api.trackEvent('shared_link_visit', id, { source: 'share_link' });
      params.delete('ref');
      const cleanSearch = params.toString() ? `?${params.toString()}` : '';
      window.history.replaceState(null, '', `${window.location.pathname}${cleanSearch}${window.location.hash}`);
    }
  }, [id, location.search]);

  useEffect(() => {
    if (!id) return;
    const fetchAdvice = () => {
      api.getOpportunityAdvice(id)
        .then(data => {
          if (Array.isArray(data)) setAdviceList(data);
        })
        .catch(() => {});
    };
    fetchAdvice();
    const interval = setInterval(fetchAdvice, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setReportLoading(true);
    try {
      await api.reportOpportunity(id, reportReason, reportDetails);
      setReportSuccess(true);
      setReportDetails('');
    } catch {
      // fallback
    } finally {
      setReportLoading(false);
    }
  };

  const handleAdviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !adviceTitle || !adviceContent) return;
    setAdviceLoading(true);
    try {
      const newAdvice = await api.addOpportunityAdvice(id, {
        authorName: adviceAuthorName || user?.profile?.name || 'Anonymous Applicant',
        authorRole: adviceAuthorRole || user?.profile?.currentStatus || 'Applicant',
        adviceType,
        outcomeStatus: adviceOutcome,
        title: adviceTitle,
        content: adviceContent
      });
      if (newAdvice && newAdvice.id) {
        setAdviceList(prev => [newAdvice, ...prev]);
      }
      api.getOpportunityAdvice(id).then(fresh => {
        if (Array.isArray(fresh)) setAdviceList(fresh);
      }).catch(() => {});
      setShowAdviceModal(false);
      setAdviceTitle('');
      setAdviceContent('');
      setAdviceAuthorName('');
      setAdviceAuthorRole('');
    } catch (err: any) {
      alert(err?.message || 'Failed to post review. Please make sure you are logged in.');
    } finally {
      setAdviceLoading(false);
    }
  };

  const handleDeleteAdvice = async () => {
    if (!id || !deleteTarget || !deleteReason) return;
    setDeleteLoading(true);
    try {
      await api.deleteOpportunityAdvice(id, deleteTarget.id);
      setAdviceList(prev => prev.filter(a => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteReason('');
      setDeleteOtherText('');
    } catch (err: any) {
      alert(err?.message || 'Failed to remove. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const opportunity = useMemo(() => getOpportunityById(id || ''), [id, getOpportunityById]);

  // Only calculate relevance when the user has enough profile data to produce a meaningful score.
  // Require at least interests or skills — without them the score cannot be personalised.
  const relevance = useMemo(() => {
    if (!isAuthenticated || !user?.profile || !user?.preferences || !opportunity) return null;
    const hasInterests = (user.profile.interests?.length ?? 0) > 0;
    const hasSkills = (user.profile.skills?.length ?? 0) > 0;
    const hasFields = (user.preferences.fields?.length ?? 0) > 0;
    if (!hasInterests && !hasSkills && !hasFields) return null;
    const result = calculateRelevanceScore(opportunity, user.profile, user.preferences);
    // Only surface the score if it's meaningful (above 30) and has at least one reason
    if (result.score < 30 || result.reasons.length === 0) return null;
    return result;
  }, [opportunity, user, isAuthenticated]);

  const relatedOpportunities = useMemo(() => {
    if (!opportunity) return [];
    return opportunities
      .filter((opp: Opportunity) => opp.id !== opportunity.id && (opp.type === opportunity.type || opp.field.some((f: string) => opportunity.field.includes(f))))
      .slice(0, 3);
  }, [opportunity, opportunities]);

  if (isLoading && !opportunity) {
    return <OpportunityDetailSkeleton />;
  }

  if (!opportunity) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <EmptyState
          title="Opportunity not found"
          description="The opportunity you're looking for may have been removed or updated."
          actionLabel="Back to Explore"
          onAction={() => navigate('/explore')}
        />
      </div>
    );
  }

  const saved = isSaved(opportunity.id);
  const isComparing = comparisons.includes(opportunity.id);
  const orgName = typeof opportunity.organization === 'object' ? opportunity.organization.name : opportunity.organization;
  const orgWebsite = typeof opportunity.organization === 'object' ? opportunity.organization.website : opportunity.officialSource;

  // Verification: only show badge when the record is explicitly Verified
  const isVerified = opportunity.verificationStatus === 'Verified';

  const app = trackedApplications.find(a => a.opportunityId === opportunity.id);
  const tasks = useMemo(() => {
    if (app && app.tasks && app.tasks.length > 0) {
      return app.tasks;
    }
    return generateOpportunityTasks(opportunity).map((label, index) => ({
      id: `task-${index}`,
      label,
      completed: false,
      order: index
    }));
  }, [app, opportunity]);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggleTask = (taskId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!app) {
      createApplication(opportunity.id, opportunity);
      setTimeout(() => {
        const created = useApplicationStore.getState().trackedApplications.find(a => a.opportunityId === opportunity.id);
        if (created) {
          const target = created.tasks.find(t => t.id === taskId) || created.tasks[0];
          if (target) toggleTask(created.id, target.id);
        }
      }, 50);
    } else {
      toggleTask(app.id, taskId);
    }
  };

  const handleStartApplication = () => {
    if (!isAuthenticated) {
      setContextualPrompt({ isOpen: true, type: 'track' });
      return;
    }
    if (!app) {
      createApplication(opportunity.id, opportunity);
    }
    navigate(`/my-opportunities/${opportunity.id}/workspace`);
  };

  const hasValidAppUrl = Boolean(opportunity.applicationUrl && opportunity.applicationUrl.trim() !== '');

  const displayLocation = opportunity.remoteStatus === RemoteStatus.Remote
    ? 'Remote'
    : (opportunity.location || 'Global / Flexible');

  const remoteLabel = opportunity.remoteStatus && opportunity.remoteStatus !== RemoteStatus.Remote
    ? opportunity.remoteStatus
    : null;

  return (
    <div className="relative min-h-screen pb-24 lg:pb-10 bg-white dark:bg-surface-950">

      {/* ─── A. COMPACT BACK NAVIGATION ─── */}
      <div className="pt-3 pb-1">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back to opportunities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors py-1 cursor-pointer"
        >
          <SolarIcon name="alt-arrow-left-linear" size={14} />
          <span>Back to discovery</span>
        </button>
      </div>

      <main className="w-full">

        {/* ─── B. OPPORTUNITY HEADER ─── */}
        <div className="border-b border-surface-200 dark:border-surface-800 pb-7 pt-3">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">

            {/* Left: Title block */}
            <div className="flex-1 min-w-0 space-y-3">

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <Tag label={opportunity.type} />
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                    <SolarIcon name="verified-check-linear" size={12} />
                    Verified
                    {opportunity.lastVerified && (
                      <span className="font-normal text-emerald-600 dark:text-emerald-400 ml-0.5">
                        · {new Date(opportunity.lastVerified).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </span>
                )}
                {opportunity.field && opportunity.field.slice(0, 2).map((f: string) => (
                  <span key={f} className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200/60 dark:border-surface-700">
                    {f}
                  </span>
                ))}
              </div>

              {/* Provider */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-surface-400 dark:text-surface-500 font-medium">By</span>
                {orgWebsite ? (
                  <a
                    href={orgWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${orgName} official website`}
                    className="text-sm font-semibold text-rome-600 dark:text-rome-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    {orgName}
                    <SolarIcon name="arrow-right-up-linear" size={11} className="opacity-60" />
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{orgName}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-950 dark:text-white leading-snug tracking-tight">
                {opportunity.title}
              </h1>

              {/* Short description */}
              {opportunity.shortDescription && (
                <p className="text-sm sm:text-base text-surface-600 dark:text-surface-300 leading-relaxed max-w-2xl">
                  {opportunity.shortDescription}
                </p>
              )}
            </div>

            {/* Right: Secondary actions — visible on desktop */}
            <div className="hidden lg:flex items-center gap-2 shrink-0 self-start pt-1">
              <Button
                variant="outline"
                size="default"
                className={cn(
                  "h-9 min-h-[36px] px-3 rounded-xl text-xs font-semibold gap-1.5",
                  saved && "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20"
                )}
                onClick={() => {
                  if (saved) {
                    unsaveOpportunity(opportunity.id);
                  } else {
                    if (!isAuthenticated) {
                      setContextualPrompt({ isOpen: true, type: 'save' });
                      return;
                    }
                    saveOpportunity(opportunity.id);
                  }
                }}
                aria-label={saved ? 'Remove from saved items' : 'Save opportunity'}
              >
                <SolarIcon name={saved ? "heart-bold" : "heart-linear"} size={15} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </Button>

              <Button
                variant={isComparing ? 'secondary' : 'outline'}
                size="default"
                className="h-9 min-h-[36px] px-3 rounded-xl text-xs font-semibold gap-1.5"
                onClick={() => isComparing ? removeFromCompare(opportunity.id) : addToCompare(opportunity.id)}
                aria-label={isComparing ? 'Remove from compare' : 'Add to compare'}
              >
                <SolarIcon name="scale-linear" size={14} />
                <span>{isComparing ? 'Comparing' : 'Compare'}</span>
              </Button>

              <Button
                variant="outline"
                size="default"
                className="w-9 h-9 min-w-[36px] min-h-[36px] p-0 flex items-center justify-center rounded-xl"
                onClick={() => setShowShareModal(true)}
                title="Share opportunity"
                aria-label="Share opportunity"
              >
                <SolarIcon name="share-linear" size={15} />
              </Button>
            </div>
          </div>

          {/* ─── C. KEY INFO STRIP ─── */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm">
              <SolarIcon name="calendar-linear" size={15} className="text-surface-400 shrink-0" />
              <span className="text-surface-500 dark:text-surface-400 text-xs font-medium">Deadline:</span>
              {opportunity.deadline ? (
                <span className="font-semibold text-surface-900 dark:text-surface-100 text-xs">
                  <DeadlineIndicator deadline={opportunity.deadline} />
                </span>
              ) : (
                <span className="font-semibold text-surface-700 dark:text-surface-300 text-xs">Rolling</span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs">
              <SolarIcon name="map-point-linear" size={15} className="text-surface-400 shrink-0" />
              <span className="text-surface-500 dark:text-surface-400 font-medium">Location:</span>
              <span className="font-semibold text-surface-800 dark:text-surface-200 truncate max-w-[220px]" title={displayLocation}>
                {displayLocation}
                {remoteLabel && <span className="font-normal text-surface-500 ml-1">({remoteLabel})</span>}
              </span>
            </div>

            {/* Funding */}
            {opportunity.funding && (
              <div className="flex items-center gap-2 text-xs">
                <SolarIcon name="dollar-minimalistic-linear" size={15} className="text-surface-400 shrink-0" />
                <span className="text-surface-500 dark:text-surface-400 font-medium">Funding:</span>
                <span className="font-semibold text-surface-800 dark:text-surface-200">{opportunity.funding}</span>
              </div>
            )}

            {/* Duration */}
            {opportunity.duration && (
              <div className="flex items-center gap-2 text-xs">
                <SolarIcon name="clock-circle-linear" size={15} className="text-surface-400 shrink-0" />
                <span className="text-surface-500 dark:text-surface-400 font-medium">Duration:</span>
                <span className="font-semibold text-surface-800 dark:text-surface-200">{opportunity.duration}</span>
              </div>
            )}

            {/* Education */}
            {opportunity.educationRequirements && opportunity.educationRequirements.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <SolarIcon name="graduation-cap-linear" size={15} className="text-surface-400 shrink-0" />
                <span className="text-surface-500 dark:text-surface-400 font-medium">Education:</span>
                <span className="font-semibold text-surface-800 dark:text-surface-200 truncate max-w-[200px]" title={opportunity.educationRequirements.join(', ')}>
                  {opportunity.educationRequirements.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ─── D. MAIN CONTENT + SIDEBAR ─── */}
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── MAIN CONTENT (8 cols) ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Profile Match — only when user has enough profile data AND score is meaningful */}
            {isAuthenticated && relevance && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800">
                <SolarIcon name="magic-stick-linear" size={16} className="text-rome-500 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-surface-800 dark:text-surface-200">
                      {relevance.score}% profile match
                    </span>
                    <div className="flex-1 h-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden max-w-[80px]">
                      <div
                        className="h-full rounded-full bg-rome-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, relevance.score)}%` }}
                      />
                    </div>
                  </div>
                  {relevance.reasons.length > 0 && (
                    <ul className="text-xs text-surface-500 dark:text-surface-400 space-y-0.5">
                      {relevance.reasons.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <SolarIcon name="check-circle-linear" size={12} className="text-rome-400 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* 1. Overview */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                Overview
              </h2>
              <div className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed space-y-3">
                {opportunity.description ? (
                  opportunity.description.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{opportunity.shortDescription || 'No description available.'}</p>
                )}
              </div>
            </section>

            {/* 2. Eligibility */}
            {opportunity.eligibility && opportunity.eligibility.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <SolarIcon name="user-check-rounded-linear" size={16} className="text-surface-400" />
                  Eligibility
                </h2>
                <ul className="space-y-2">
                  {opportunity.eligibility.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                      <SolarIcon name="check-circle-linear" size={15} className="text-rome-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 3. Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <SolarIcon name="document-text-linear" size={16} className="text-surface-400" />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                      <SolarIcon name="checklist-minimalistic-linear" size={15} className="text-surface-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 4. Benefits & Funding */}
            {((opportunity.benefits && opportunity.benefits.length > 0) || opportunity.funding) && (
              <section className="space-y-3">
                <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <SolarIcon name="cup-star-linear" size={16} className="text-surface-400" />
                  Benefits &amp; Funding
                </h2>
                {opportunity.funding && (
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    <span className="font-semibold text-surface-900 dark:text-surface-100">Funding: </span>
                    {opportunity.funding}
                  </p>
                )}
                {opportunity.benefits && opportunity.benefits.length > 0 && (
                  <ul className="space-y-2">
                    {opportunity.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-surface-700 dark:text-surface-300">
                        <SolarIcon name="star-linear" size={15} className="text-rome-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* 5. How to Apply */}
            {opportunity.applicationSteps && opportunity.applicationSteps.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <SolarIcon name="sort-from-bottom-to-top-linear" size={16} className="text-surface-400" />
                  How to Apply
                </h2>
                <ol className="space-y-2.5">
                  {opportunity.applicationSteps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-surface-700 dark:text-surface-300">
                      <span className="w-5 h-5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* 6. Official Source */}
            <section className="space-y-3 pt-2 border-t border-surface-100 dark:border-surface-800">
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 pt-3">
                <SolarIcon name="link-circle-linear" size={16} className="text-surface-400" />
                Official Source
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Published from official announcement by{' '}
                <span className="font-semibold text-surface-700 dark:text-surface-300">{opportunity.sourceName || orgName}</span>.
                {!isVerified && (
                  <span className="ml-1 text-surface-400 dark:text-surface-500 italic">
                    — Verification pending.
                  </span>
                )}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {hasValidAppUrl ? (
                  <Button
                    variant="default"
                    size="default"
                    className="bg-rome-500 hover:bg-rome-600 text-white font-semibold text-xs h-10 px-5 rounded-xl shadow-xs"
                    onClick={() => {
                      api.trackEvent('application_link_clicked', opportunity.id, { url: opportunity.applicationUrl });
                      window.open(opportunity.applicationUrl, '_blank', 'noopener noreferrer');
                    }}
                    aria-label={`Apply on official website for ${opportunity.title}`}
                  >
                    <span>Apply on official website</span>
                    <SolarIcon name="arrow-right-up-linear" size={13} />
                  </Button>
                ) : (
                  <p className="text-xs text-surface-500 italic">
                    Official portal link not available — applications are managed directly via rolling institutional contact.
                  </p>
                )}
                {opportunity.officialSource && opportunity.officialSource !== opportunity.applicationUrl && (
                  <a
                    href={opportunity.officialSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View source announcement</span>
                    <SolarIcon name="arrow-right-up-linear" size={11} />
                  </a>
                )}
              </div>
            </section>

            {/* Preparation Checklist — authenticated users only */}
            {isAuthenticated && (
              <section className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                      <SolarIcon name="checklist-minimalistic-linear" size={16} className="text-surface-400" />
                      Preparation Checklist
                    </h2>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                      Check off items as you prepare. Changes sync to your workspace.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-surface-600 dark:text-surface-400 self-start sm:self-auto shrink-0">
                    {completedCount}/{totalCount} done
                  </span>
                </div>

                <div className="w-full bg-surface-100 dark:bg-surface-800 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-rome-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer min-h-[44px]",
                        task.completed
                          ? "bg-surface-50/80 dark:bg-surface-800/40 border-surface-200 dark:border-surface-800/80 opacity-60"
                          : "bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-700 hover:border-rome-400 shadow-2xs"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded flex items-center justify-center border text-xs font-bold transition-colors shrink-0",
                        task.completed ? "bg-rome-500 border-rome-500 text-white" : "border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800"
                      )}>
                        {task.completed && "✓"}
                      </div>
                      <span className={cn(
                        "text-sm leading-relaxed",
                        task.completed
                          ? "line-through text-surface-400 dark:text-surface-500"
                          : "text-surface-900 dark:text-surface-100"
                      )}>
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartApplication}
                    className="text-xs font-semibold h-8 px-3 rounded-xl"
                  >
                    <span>Open in Workspace</span>
                    <SolarIcon name="alt-arrow-right-linear" size={12} />
                  </Button>
                </div>
              </section>
            )}

            {/* Applicant Reviews */}
            <section className="pt-6 border-t border-surface-200 dark:border-surface-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-surface-900 dark:text-surface-100">
                    Applicant Reviews &amp; Outcomes
                  </h2>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                    Real outcomes and tips shared by fellow candidates.
                  </p>
                </div>
                <button
                  onClick={() => setShowAdviceModal(true)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs transition-colors self-start sm:self-auto cursor-pointer shrink-0"
                >
                  + Post Review
                </button>
              </div>

              {adviceList.length === 0 ? (
                <div className="p-5 rounded-xl border border-surface-200 dark:border-surface-800 text-center space-y-1">
                  <p className="text-xs font-semibold text-surface-700 dark:text-surface-300">
                    No reviews posted yet.
                  </p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    Have you applied or interviewed here? Share your outcome to guide future applicants.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adviceList.map((adv) => (
                    <div key={adv.id} className="p-4 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-100 dark:border-surface-800">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border",
                            adv.outcomeStatus === 'Accepted'
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : adv.outcomeStatus === 'Rejected'
                              ? "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700"
                              : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          )}>
                            {adv.outcomeStatus}
                          </span>
                          <span className="text-xs text-surface-500">
                            {adv.authorName}{adv.authorRole ? ` (${adv.authorRole})` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-rome-600 dark:text-rome-400">
                            {adv.adviceType || 'Insight'}
                          </span>
                          {user && adv.userId === user.id && (
                            <button
                              onClick={() => { setDeleteTarget(adv); setDeleteReason(''); setDeleteOtherText(''); }}
                              className="p-1 rounded text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Remove my review"
                            >
                              <SolarIcon name="trash-bin-minimalistic-linear" size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                      {adv.title && (
                        <h3 className="text-sm font-bold text-surface-900 dark:text-surface-100">{adv.title}</h3>
                      )}
                      <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-300 leading-relaxed">{adv.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── SIDEBAR (4 cols) ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 space-y-4">

              {/* Primary action card */}
              <div className="bg-white dark:bg-surface-900 rounded-2xl p-5 border border-surface-200 dark:border-surface-800 shadow-xs space-y-3">

                {/* Primary CTA */}
                {hasValidAppUrl ? (
                  <Button
                    variant="default"
                    size="default"
                    className="w-full h-11 min-h-[44px] justify-center bg-rome-500 hover:bg-rome-600 text-white font-semibold text-sm rounded-xl shadow-xs"
                    onClick={() => {
                      api.trackEvent('application_link_clicked', opportunity.id, { url: opportunity.applicationUrl });
                      window.open(opportunity.applicationUrl, '_blank', 'noopener noreferrer');
                    }}
                    aria-label={`Apply on official website for ${opportunity.title} (opens in new tab)`}
                  >
                    <span>Apply on Official Site</span>
                    <SolarIcon name="arrow-right-up-linear" size={15} />
                  </Button>
                ) : (
                  <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl text-center text-xs text-surface-500 dark:text-surface-400 border border-surface-200 dark:border-surface-700 space-y-0.5">
                    <span className="font-semibold block text-surface-700 dark:text-surface-300">Direct link unavailable</span>
                    <span>Applications managed via rolling contact or host portal.</span>
                  </div>
                )}

                {/* Workspace tracking */}
                <Button
                  variant="outline"
                  size="default"
                  className="w-full h-10 min-h-[40px] justify-center text-xs font-semibold rounded-xl"
                  onClick={handleStartApplication}
                >
                  <SolarIcon name="case-linear" size={14} />
                  <span>Track in My Opportunities</span>
                </Button>

                {/* Secondary actions row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (saved) {
                        unsaveOpportunity(opportunity.id);
                      } else {
                        if (!isAuthenticated) {
                          setContextualPrompt({ isOpen: true, type: 'save' });
                          return;
                        }
                        saveOpportunity(opportunity.id);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer",
                      saved
                        ? "border-rose-200 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                        : "border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800"
                    )}
                    aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
                  >
                    <SolarIcon name={saved ? "heart-bold" : "heart-linear"} size={16} />
                    <span>{saved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => isComparing ? removeFromCompare(opportunity.id) : addToCompare(opportunity.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer",
                      isComparing
                        ? "border-rome-200 bg-rome-50 dark:bg-rome-950/20 text-rome-600 dark:text-rome-400"
                        : "border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800"
                    )}
                    aria-label={isComparing ? 'Remove from compare' : 'Add to compare'}
                  >
                    <SolarIcon name="scale-linear" size={16} />
                    <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 text-xs font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                    aria-label="Share opportunity"
                  >
                    <SolarIcon name="share-linear" size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Key Details card */}
              <div className="bg-white dark:bg-surface-900 rounded-2xl p-5 border border-surface-200 dark:border-surface-800 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Details</h3>

                <dl className="space-y-2.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-surface-500 dark:text-surface-400 font-medium shrink-0">Provider</dt>
                    <dd className="font-semibold text-surface-800 dark:text-surface-200 text-right">{orgName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-surface-500 dark:text-surface-400 font-medium shrink-0">Category</dt>
                    <dd className="font-semibold text-surface-800 dark:text-surface-200 text-right">{opportunity.type}</dd>
                  </div>
                  {opportunity.experienceRequirements && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-surface-500 dark:text-surface-400 font-medium shrink-0">Experience</dt>
                      <dd className="font-semibold text-surface-800 dark:text-surface-200 text-right">{opportunity.experienceRequirements}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-surface-500 dark:text-surface-400 font-medium shrink-0">Deadline</dt>
                    <dd className="font-semibold text-surface-800 dark:text-surface-200 text-right">
                      {opportunity.deadline ? (
                        <DeadlineIndicator deadline={opportunity.deadline} />
                      ) : (
                        'Rolling'
                      )}
                    </dd>
                  </div>
                  {opportunity.duration && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-surface-500 dark:text-surface-400 font-medium shrink-0">Duration</dt>
                      <dd className="font-semibold text-surface-800 dark:text-surface-200 text-right">{opportunity.duration}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-surface-500 dark:text-surface-400 font-medium shrink-0">Location</dt>
                    <dd className="font-semibold text-surface-800 dark:text-surface-200 text-right truncate max-w-[140px]" title={displayLocation}>{displayLocation}</dd>
                  </div>
                  {opportunity.funding && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-surface-500 dark:text-surface-400 font-medium shrink-0">Funding</dt>
                      <dd className="font-semibold text-surface-800 dark:text-surface-200 text-right">{opportunity.funding}</dd>
                    </div>
                  )}
                </dl>

                {isVerified && (
                  <div className="pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <SolarIcon name="verified-check-linear" size={14} />
                    <span>Verified by ROMEfind</span>
                  </div>
                )}
              </div>

              {/* Report issue link */}
              <div className="text-center">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-xs text-surface-400 hover:text-red-500 dark:hover:text-red-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <SolarIcon name="danger-circle-linear" size={12} />
                  <span>Report issue or outdated info</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Related Opportunities ─── */}
      {relatedOpportunities.length > 0 && (
        <aside aria-label="Similar opportunities" className="mt-12 pt-8 border-t border-surface-200 dark:border-surface-800">
          <h2 className="text-lg font-bold mb-6 text-surface-900 dark:text-surface-100">
            Similar opportunities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedOpportunities.map((opp: Opportunity) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                compact
                showSaveButton
                isSaved={isSaved(opp.id)}
                onSave={() => saveOpportunity(opp.id)}
                onUnsave={() => unsaveOpportunity(opp.id)}
                onClick={() => navigate(`/opportunity/${opp.id}`)}
              />
            ))}
          </div>
        </aside>
      )}

      {/* ─── Mobile Bottom Floating Action Bar ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-t border-surface-200 dark:border-surface-800 p-3 shadow-elevated z-40">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <Button
            variant="outline"
            size="default"
            className={cn(
              "w-11 h-11 min-w-[44px] min-h-[44px] p-0 flex items-center justify-center rounded-xl",
              saved && "text-rose-600 dark:text-rose-400 border-rose-200 bg-rose-50/50"
            )}
            onClick={() => {
              if (saved) {
                unsaveOpportunity(opportunity.id);
              } else {
                if (!isAuthenticated) {
                  setContextualPrompt({ isOpen: true, type: 'save' });
                  return;
                }
                saveOpportunity(opportunity.id);
              }
            }}
            aria-label={saved ? 'Remove from saved' : 'Save opportunity'}
          >
            <SolarIcon name={saved ? "heart-bold" : "heart-linear"} size={18} />
          </Button>

          <Button
            variant="outline"
            size="default"
            className="w-11 h-11 min-w-[44px] min-h-[44px] p-0 flex items-center justify-center rounded-xl"
            onClick={() => setShowShareModal(true)}
            aria-label="Share opportunity"
          >
            <SolarIcon name="share-linear" size={17} />
          </Button>

          {hasValidAppUrl ? (
            <Button
              variant="default"
              size="default"
              className="flex-1 justify-center text-xs sm:text-sm font-semibold h-11 min-h-[44px] rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs"
              onClick={() => {
                api.trackEvent('application_link_clicked', opportunity.id, { url: opportunity.applicationUrl });
                window.open(opportunity.applicationUrl, '_blank', 'noopener noreferrer');
              }}
              aria-label={`Apply to ${opportunity.title}`}
            >
              <span>Apply on Official Site</span>
              <SolarIcon name="arrow-right-up-linear" size={15} />
            </Button>
          ) : (
            <Button
              variant="default"
              size="default"
              className="flex-1 justify-center text-xs sm:text-sm font-semibold h-11 min-h-[44px] rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs"
              onClick={handleStartApplication}
            >
              <span>Track in Workspace</span>
            </Button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 dark:border-surface-800 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Share Opportunity</h3>
              <button onClick={() => setShowShareModal(false)} className="text-surface-400 hover:text-surface-700 p-1">✕</button>
            </div>
            <p className="text-xs text-surface-500">
              Share "{opportunity.title}" with fellow applicants and peers.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/opportunities/${opportunity.id}?ref=share`;
                  api.trackEvent('share_action', opportunity.id, { shareMethod: 'copy_link' });
                  navigator.clipboard.writeText(shareUrl);
                  setCopyToast(true);
                  setTimeout(() => setCopyToast(false), 2500);
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              >
                <SolarIcon name="link-linear" size={20} />
                <span className="text-xs font-semibold">Copy Link</span>
              </button>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/opportunities/${opportunity.id}?ref=share`;
                  api.trackEvent('share_action', opportunity.id, { shareMethod: 'whatsapp' });
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this opportunity: ${opportunity.title} on ROMEfind - ${shareUrl}`)}`, '_blank');
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              >
                <SolarIcon name="chat-round-linear" size={20} />
                <span className="text-xs font-semibold">WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  const shareUrl = `${window.location.origin}/opportunities/${opportunity.id}?ref=share`;
                  api.trackEvent('share_action', opportunity.id, { shareMethod: 'twitter' });
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Found this great opportunity: ${opportunity.title}`)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              >
                <SolarIcon name="share-circle-linear" size={20} />
                <span className="text-xs font-semibold">Twitter/X</span>
              </button>
            </div>
            {copyToast && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-center">
                ✓ Link copied to clipboard!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 dark:border-surface-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Report an Issue</h3>
              <button onClick={() => setShowReportModal(false)} className="text-surface-400 hover:text-surface-700 p-1">✕</button>
            </div>
            {reportSuccess ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-emerald-600 font-bold text-sm">✓ Thank you for reporting.</p>
                <p className="text-xs text-surface-500">Our verification editors have queued this opportunity for review.</p>
                <Button variant="outline" size="sm" onClick={() => { setShowReportModal(false); setReportSuccess(false); }}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 outline-none"
                >
                  <option value="link_broken">Broken / inaccessible application link</option>
                  <option value="closed">Deadline passed / programme closed</option>
                  <option value="inaccurate_info">Inaccurate funding / eligibility info</option>
                  <option value="other">Other issue</option>
                </select>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Additional context (optional)..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 outline-none"
                />
                <Button type="submit" variant="default" className="w-full h-10" size="sm" disabled={reportLoading}>
                  {reportLoading ? 'Submitting...' : 'Submit Report'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Share Advice Modal */}
      {showAdviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 dark:border-surface-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Contribute Application Advice</h3>
              <button onClick={() => setShowAdviceModal(false)} className="text-surface-400 hover:text-surface-700 p-1">✕</button>
            </div>
            <form onSubmit={handleAdviceSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name (or Anonymous)"
                value={adviceAuthorName}
                onChange={(e) => setAdviceAuthorName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 outline-none"
              />
              <input
                type="text"
                placeholder="Your Role / Background (e.g. 2025 Fellow, MSc Applicant)"
                value={adviceAuthorRole}
                onChange={(e) => setAdviceAuthorRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={adviceType}
                  onChange={(e) => setAdviceType(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 outline-none"
                >
                  <option value="General">General Advice</option>
                  <option value="Interview">Interview Tips</option>
                  <option value="CV/Portfolio">CV / Portfolio</option>
                  <option value="Preparation">Preparation</option>
                  <option value="What I Wish I Knew">What I Wish I Knew</option>
                </select>
                <select
                  value={adviceOutcome}
                  onChange={(e) => setAdviceOutcome(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 outline-none"
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Key Takeaway Title (e.g. Focus on returning impact)"
                value={adviceTitle}
                onChange={(e) => setAdviceTitle(e.target.value)}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 font-semibold outline-none"
              />
              <textarea
                placeholder="Detailed tips for prospective applicants..."
                value={adviceContent}
                onChange={(e) => setAdviceContent(e.target.value)}
                required
                rows={4}
                className="w-full text-xs p-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 outline-none"
              />
              <Button type="submit" variant="default" className="w-full h-10" size="sm" disabled={adviceLoading}>
                {adviceLoading ? 'Publishing...' : 'Publish Community Advice'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Advice Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 dark:border-surface-800 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Remove your review?</h3>
                <p className="text-xs text-surface-500 mt-0.5">Please let us know why you're removing this.</p>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="text-surface-400 hover:text-surface-700 p-1">✕</button>
            </div>

            <div className="space-y-2">
              {DELETE_REASONS.map(reason => (
                <button
                  key={reason}
                  onClick={() => { setDeleteReason(reason); setDeleteOtherText(''); }}
                  className={cn(
                    'w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer',
                    deleteReason === reason
                      ? 'border-red-400 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300'
                      : 'border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:border-surface-300'
                  )}
                >
                  {deleteReason === reason ? '● ' : '○ '}{reason}
                </button>
              ))}
            </div>

            {deleteReason === 'Other' && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                <textarea
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-700 bg-transparent text-xs text-surface-900 dark:text-surface-100 outline-none"
                  rows={2}
                  value={deleteOtherText}
                  onChange={e => setDeleteOtherText(e.target.value)}
                  placeholder="Briefly describe your reason…"
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDeleteAdvice}
                disabled={!deleteReason || (deleteReason === 'Other' && !deleteOtherText.trim()) || deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {deleteLoading ? 'Removing…' : 'Remove Review'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Contextual Signup Prompt Modal ─── */}
      <ContextualSignupModal
        isOpen={contextualPrompt.isOpen}
        onClose={() => setContextualPrompt(prev => ({ ...prev, isOpen: false }))}
        type={contextualPrompt.type}
        opportunityId={opportunity.id}
        returnUrl={`/opportunity/${opportunity.id}`}
      />
    </div>
  );
}
