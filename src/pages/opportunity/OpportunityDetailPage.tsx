import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { calculateRelevanceScore } from '@/services/personalization.service';
import { api } from '@/api/client';
import { Button, Tag, DeadlineIndicator, MatchIndicator, Badge, EmptyState, OpportunityDetailSkeleton } from '@/components/ui';
import { OpportunityCard } from '@/components/opportunity';
import { OPPORTUNITY_TYPE_COLORS } from '@/utils/constants';
import { MapPin, Globe, DollarSign, Calendar, ExternalLink, CheckCircle2, AlertCircle, Bookmark, BookmarkCheck, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';
import { Opportunity } from '@/types/models';
import { cn } from '@/utils/cn';

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOpportunityById, opportunities, isLoading } = useOpportunityStore();
  const { user, isAuthenticated } = useAuthStore();
  const { isSaved, saveOpportunity, unsaveOpportunity, addToCompare, removeFromCompare, comparisons, createApplication } = useApplicationStore();

  const [showShareModal, setShowShareModal] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

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
    // Poll every 30s so other users' new posts appear without a manual refresh
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
      // Optimistically prepend the new advice, then re-fetch to confirm
      if (newAdvice && newAdvice.id) {
        setAdviceList(prev => [newAdvice, ...prev]);
      }
      // Re-fetch full list so any other user's posts also appear
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

  const opportunity = useMemo(() => getOpportunityById(id || ''), [id, getOpportunityById]);
  
  const relevance = useMemo(() => {
    if (!isAuthenticated || !user?.profile || !user?.preferences || !opportunity) return null;
    return calculateRelevanceScore(opportunity, user.profile, user.preferences);
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

  const handleStartApplication = () => {
    createApplication(opportunity.id);
    navigate(`/my-opportunities/${opportunity.id}/workspace`);
  };

  return (
    <div className="relative min-h-screen pb-24 lg:pb-12 bg-white dark:bg-surface-950">
      {/* Top Back Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-surface-50 dark:bg-surface-900/50 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Tag label={opportunity.type} />
              {opportunity.verificationStatus && (
                <Badge variant="verified" className="flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Verified Source
                </Badge>
              )}
            </div>
            
            <div className="space-y-1.5">
              {orgWebsite ? (
                <a 
                  href={orgWebsite} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm font-semibold text-rome-600 dark:text-rome-400 hover:underline inline-flex items-center gap-1"
                >
                  {orgName} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-sm font-semibold text-surface-500">{orgName}</span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-50 leading-tight">
                {opportunity.title}
              </h1>
            </div>
            
            <p className="text-base md:text-lg text-surface-600 dark:text-surface-300 max-w-3xl leading-relaxed">
              {opportunity.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {opportunity.field.map((f: string) => (
                <span key={f} className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-200/70 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Action Card Desktop */}
          <div className="hidden lg:block w-[360px] flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800 shadow-card">
              <div className="space-y-6">
                <div className="space-y-4">
                  {opportunity.deadline && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-surface-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-surface-500 mb-0.5 uppercase tracking-wider">Deadline</p>
                        <DeadlineIndicator deadline={opportunity.deadline} />
                      </div>
                    </div>
                  )}
                  {opportunity.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-surface-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-surface-500 mb-0.5 uppercase tracking-wider">Location</p>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{opportunity.location}</p>
                      </div>
                    </div>
                  )}
                  {opportunity.remoteStatus && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-surface-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-surface-500 mb-0.5 uppercase tracking-wider">Work Setup</p>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{opportunity.remoteStatus}</p>
                      </div>
                    </div>
                  )}
                  {opportunity.funding && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-surface-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-surface-500 mb-0.5 uppercase tracking-wider">Funding & Benefits</p>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{opportunity.funding}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-surface-100 dark:border-surface-800 flex flex-col gap-3">
                  <Button 
                    variant="primary" 
                    fullWidth
                    size="lg"
                    onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                    rightIcon={<ExternalLink size={16} />}
                  >
                    Apply on Official Site
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    fullWidth
                    size="md"
                    onClick={handleStartApplication}
                  >
                    Track in Workspace
                  </Button>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 justify-center gap-1.5 text-xs px-2"
                      onClick={() => saved ? unsaveOpportunity(opportunity.id) : saveOpportunity(opportunity.id)}
                    >
                      {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-rome-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                      {saved ? 'Saved' : 'Save'}
                    </Button>
                    <Button 
                      variant={isComparing ? 'secondary' : 'outline'}
                      className="flex-1 justify-center text-xs px-2"
                      onClick={() => isComparing ? removeFromCompare(opportunity.id) : addToCompare(opportunity.id)}
                    >
                      {isComparing ? 'Comparing ✓' : '+ Compare'}
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-center text-xs px-2.5"
                      onClick={() => setShowShareModal(true)}
                      title="Share Opportunity"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <button
                    onClick={() => setShowReportModal(true)}
                    className="text-[11px] text-surface-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center gap-1 mt-1 cursor-pointer"
                  >
                    <AlertCircle size={12} />
                    <span>Report inaccurate info or broken link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl space-y-10">
          
          {/* Personalized Relevance Section */}
          {isAuthenticated && relevance && (
            <section className="bg-rome-50/70 dark:bg-rome-950/20 rounded-2xl p-6 sm:p-8 border border-rome-200 dark:border-rome-900/40">
              <h2 className="text-xl font-bold mb-3 text-surface-900 dark:text-surface-50">
                Why this is relevant to you
              </h2>
              <MatchIndicator score={relevance.score} reasons={relevance.reasons} />
            </section>
          )}

          {/* Benefits */}
          {opportunity.benefits && opportunity.benefits.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-100">What you get</h2>
              <ul className="space-y-2.5">
                {opportunity.benefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm text-surface-700 dark:text-surface-300">
                    <CheckCircle2 className="w-4 h-4 text-rome-500 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Eligibility */}
          {opportunity.eligibility && opportunity.eligibility.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-100">Who can apply</h2>
              <ul className="space-y-2.5">
                {opportunity.eligibility.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm text-surface-700 dark:text-surface-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-rome-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-100">What you'll need</h2>
              <div className="space-y-3">
                {opportunity.requirements.map((req: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-surface-50 dark:bg-surface-900/60 border border-surface-100 dark:border-surface-800">
                    {isAuthenticated && user?.profile ? (
                      idx % 2 === 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-surface-400 mt-2 flex-shrink-0" />
                    )}
                    <p className="text-sm text-surface-800 dark:text-surface-200 font-medium">{req}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Application Steps */}
          {opportunity.applicationSteps && opportunity.applicationSteps.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 text-surface-900 dark:text-surface-100">Application Process</h2>
              <ol className="space-y-3">
                {opportunity.applicationSteps.map((step: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm text-surface-700 dark:text-surface-300">
                    <span className="w-6 h-6 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-100 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Source & Verification */}
          <section className="pt-8 border-t border-surface-200 dark:border-surface-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-surface-500">Official Verification & Transparency</h2>
              <button 
                onClick={() => setShowReportModal(true)}
                className="text-xs text-surface-500 hover:text-red-500 transition-colors inline-flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Report Issue
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-4 bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-800">
              <Badge variant="verified">
                {opportunity.verificationStatus || 'Verified'}
              </Badge>
              <span className="text-xs text-surface-500">
                Source: <strong className="text-surface-800 dark:text-surface-200">{opportunity.sourceName || orgName}</strong>
              </span>
              <a 
                href={opportunity.officialSource} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline ml-auto inline-flex items-center gap-1"
              >
                Official Page <ExternalLink size={12} />
              </a>
            </div>
          </section>

          {/* Candidate Reviews & Applicant Outcomes */}
          <section className="pt-8 border-t border-surface-200 dark:border-surface-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <span>Applicant Reviews & Decision Outcomes</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rome-100 dark:bg-rome-900/50 text-rome-700 dark:text-rome-300">
                    Candidate Experiences
                  </span>
                </h2>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                  Read why candidates were accepted or rejected, interview questions, and lessons learned.
                </p>
              </div>
              <button
                onClick={() => setShowAdviceModal(true)}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                + Post Your Review / Outcome
              </button>
            </div>

            {/* Candidate Experience Cards - Only rendered when actual reviews exist */}
            {adviceList.length === 0 ? (
              <div className="p-8 rounded-2xl bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800 text-center space-y-3">
                <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                  No applicant reviews or outcome notes posted for this opportunity yet.
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 max-w-md mx-auto">
                  Have you applied, interviewed, or received an offer for this program? Share your insights to help the community prepare.
                </p>
                <button
                  onClick={() => setShowAdviceModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs transition-colors cursor-pointer"
                >
                  + Be the first to share your experience
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {adviceList.map((adv) => (
                  <div key={adv.id} className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border",
                          adv.outcomeStatus === 'Accepted'
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                            : adv.outcomeStatus === 'Rejected'
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                            : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                        )}>
                          {adv.outcomeStatus === 'Accepted' ? '🟢 ACCEPTED' : adv.outcomeStatus === 'Rejected' ? '🔴 REJECTED' : '🟡 INTERVIEWED'}
                        </span>
                        <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                          by {adv.authorName} {adv.authorRole ? `(${adv.authorRole})` : ''}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-rome-600 dark:text-rome-400">
                        {adv.adviceType || 'Applicant Insight'}
                      </span>
                    </div>

                    {adv.title && (
                      <h4 className="text-sm font-bold text-surface-900 dark:text-surface-100">{adv.title}</h4>
                    )}

                    <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">{adv.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 dark:border-surface-800 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">Share Opportunity</h3>
              <button onClick={() => setShowShareModal(false)} className="text-surface-400 hover:text-surface-700">✕</button>
            </div>
            <p className="text-xs text-surface-500">
              Share "{opportunity.title}" with fellow researchers, students, and peers.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopyToast(true);
                  setTimeout(() => setCopyToast(false), 2500);
                }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <span className="text-base font-bold">🔗</span>
                <span className="text-xs font-semibold">Copy Link</span>
              </button>
              <button
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this opportunity: ${opportunity.title} on ROMEfind - ${window.location.href}`)}`, '_blank')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <span className="text-base">💬</span>
                <span className="text-xs font-semibold">WhatsApp</span>
              </button>
              <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Found this great opportunity: ${opportunity.title}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <span className="text-base">𝕏</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 dark:border-surface-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">Report an Issue</h3>
              <button onClick={() => setShowReportModal(false)} className="text-surface-400 hover:text-surface-700">✕</button>
            </div>
            {reportSuccess ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-emerald-600 font-bold">✓ Thank you for reporting.</p>
                <p className="text-xs text-surface-500">Our verification editors have queued this opportunity for re-checking.</p>
                <Button variant="outline" size="sm" onClick={() => { setShowReportModal(false); setReportSuccess(false); }}>Close</Button>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
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
                  className="w-full text-xs p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
                />
                <Button type="submit" variant="primary" fullWidth size="sm" isLoading={reportLoading}>
                  Submit Report
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Share Advice Modal */}
      {showAdviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-200 dark:border-surface-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">Contribute Application Advice</h3>
              <button onClick={() => setShowAdviceModal(false)} className="text-surface-400 hover:text-surface-700">✕</button>
            </div>
            <form onSubmit={handleAdviceSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name (or Anonymous)"
                value={adviceAuthorName}
                onChange={(e) => setAdviceAuthorName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
              />
              <input
                type="text"
                placeholder="Your Role / Background (e.g. 2025 Fellow, MSc Applicant)"
                value={adviceAuthorRole}
                onChange={(e) => setAdviceAuthorRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={adviceType}
                  onChange={(e) => setAdviceType(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
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
                  className="w-full text-xs p-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
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
                className="w-full text-xs p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 font-semibold"
              />
              <textarea
                placeholder="Detailed tips for prospective applicants..."
                value={adviceContent}
                onChange={(e) => setAdviceContent(e.target.value)}
                required
                rows={4}
                className="w-full text-xs p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800"
              />
              <Button type="submit" variant="primary" fullWidth size="sm" isLoading={adviceLoading}>
                Publish Community Advice
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Related Opportunities */}
      {relatedOpportunities.length > 0 && (
        <div className="bg-surface-50 dark:bg-surface-900/30 border-t border-surface-200 dark:border-surface-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6 text-surface-900 dark:text-surface-100">You might also explore</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 p-3.5 shadow-elevated z-50">
        <div className="flex gap-2.5 max-w-md mx-auto">
          <Button 
            variant="outline" 
            className="flex-1 justify-center"
            size="md"
            onClick={() => saved ? unsaveOpportunity(opportunity.id) : saveOpportunity(opportunity.id)}
          >
            {saved ? <BookmarkCheck className="w-5 h-5 text-rome-500" /> : <Bookmark className="w-5 h-5" />}
          </Button>
          <Button
            variant="outline"
            className="flex-1 justify-center"
            size="md"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </Button>
          <Button 
            variant="primary" 
            className="flex-[3] justify-center text-sm font-semibold"
            size="md"
            onClick={() => window.open(opportunity.applicationUrl, '_blank')}
            rightIcon={<ExternalLink size={14} />}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}

