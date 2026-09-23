import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { calculateRelevanceScore } from '@/services/personalization.service';
import { Button, Tag, DeadlineIndicator, MatchIndicator, Badge, EmptyState } from '@/components/ui';
import { OpportunityCard } from '@/components/opportunity';
import { OPPORTUNITY_TYPE_COLORS } from '@/utils/constants';
import { MapPin, Globe, DollarSign, Calendar, ExternalLink, CheckCircle2, AlertCircle, Bookmark, BookmarkCheck, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Opportunity } from '@/types/models';

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOpportunityById, opportunities } = useOpportunityStore();
  const { user, isAuthenticated } = useAuthStore();
  const { isSaved, saveOpportunity, unsaveOpportunity, addToCompare, removeFromCompare, comparisons, createApplication } = useApplicationStore();

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

                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 justify-center gap-1.5 text-xs"
                      onClick={() => saved ? unsaveOpportunity(opportunity.id) : saveOpportunity(opportunity.id)}
                    >
                      {saved ? <BookmarkCheck className="w-4 h-4 text-rome-500" /> : <Bookmark className="w-4 h-4" />}
                      {saved ? 'Saved' : 'Save'}
                    </Button>
                    <Button 
                      variant={isComparing ? 'secondary' : 'outline'}
                      className="flex-1 justify-center text-xs"
                      onClick={() => isComparing ? removeFromCompare(opportunity.id) : addToCompare(opportunity.id)}
                    >
                      {isComparing ? 'Comparing ✓' : '+ Compare'}
                    </Button>
                  </div>
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-3">Official Verification</h2>
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
        </div>
      </div>

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
