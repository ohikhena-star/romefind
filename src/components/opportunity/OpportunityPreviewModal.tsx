import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Opportunity, RemoteStatus } from '@/types/models';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { Button } from '@/components/ui/Button';
import { DeadlineIndicator } from '@/components/ui';

export interface OpportunityPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  isSaved?: boolean;
  onSaveAttempt?: (oppId: string) => void;
  onTrackAttempt?: (oppId: string) => void;
}

export const OpportunityPreviewModal: React.FC<OpportunityPreviewModalProps> = ({
  isOpen,
  onClose,
  opportunity,
  isSaved = false,
  onSaveAttempt,
  onTrackAttempt
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus primary action when opened
    setTimeout(() => {
      primaryButtonRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !opportunity) return null;

  const orgName = typeof opportunity.organization === 'object'
    ? opportunity.organization?.name
    : String(opportunity.organization || '');

  const displayLocation = opportunity.remoteStatus === RemoteStatus.Remote
    ? 'Remote'
    : (opportunity.location || 'Global / Flexible');

  const hasApplicationUrl = Boolean(opportunity.applicationUrl && opportunity.applicationUrl.trim() !== '');

  const handleViewFullOpportunity = () => {
    onClose();
    navigate(`/opportunity/${opportunity.id}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaveAttempt) {
      onSaveAttempt(opportunity.id);
    }
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTrackAttempt) {
      onTrackAttempt(opportunity.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 border border-surface-200/60 dark:border-surface-700">
              {opportunity.type}
            </span>
            {opportunity.verificationStatus === 'Verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800">
                <SolarIcon name="check-circle-linear" size={12} />
                Verified
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close opportunity preview"
            className="p-1.5 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
          >
            <SolarIcon name="close-circle-linear" size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-5 text-left flex-1">
          {/* Organization & Title */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-500 mb-1">
              <span>Offered by</span>
              <span className="text-surface-800 dark:text-surface-200">{orgName}</span>
            </div>
            <h2
              id="preview-modal-title"
              className="text-xl sm:text-2xl font-bold text-surface-950 dark:text-white leading-snug tracking-tight"
            >
              {opportunity.title}
            </h2>
          </div>

          {/* Description */}
          <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
            {opportunity.shortDescription || opportunity.description}
          </p>

          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-850 border border-surface-200/80 dark:border-surface-800 text-xs">
            {/* Deadline */}
            <div className="space-y-1">
              <span className="text-surface-400 dark:text-surface-500 uppercase tracking-wider font-semibold block">
                Deadline
              </span>
              {opportunity.deadline ? (
                <div className="font-semibold text-surface-900 dark:text-surface-100">
                  <DeadlineIndicator deadline={opportunity.deadline} />
                </div>
              ) : (
                <span className="font-semibold text-surface-800 dark:text-surface-200">
                  Rolling / Open
                </span>
              )}
            </div>

            {/* Location & Remote */}
            <div className="space-y-1">
              <span className="text-surface-400 dark:text-surface-500 uppercase tracking-wider font-semibold block">
                Location & Format
              </span>
              <span className="font-semibold text-surface-800 dark:text-surface-200">
                {displayLocation} {opportunity.remoteStatus ? `(${opportunity.remoteStatus})` : ''}
              </span>
            </div>

            {/* Funding / Award */}
            {opportunity.funding && (
              <div className="space-y-1">
                <span className="text-surface-400 dark:text-surface-500 uppercase tracking-wider font-semibold block">
                  Funding & Support
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {opportunity.funding}
                </span>
              </div>
            )}

            {/* Duration */}
            {opportunity.duration && (
              <div className="space-y-1">
                <span className="text-surface-400 dark:text-surface-500 uppercase tracking-wider font-semibold block">
                  Duration
                </span>
                <span className="font-semibold text-surface-800 dark:text-surface-200">
                  {opportunity.duration}
                </span>
              </div>
            )}
          </div>

          {/* Eligibility Highlights if specified */}
          {opportunity.eligibility && opportunity.eligibility.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                Eligibility Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-surface-600 dark:text-surface-300">
                {opportunity.eligibility.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rome-500 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Website Link (Publicly accessible without registration) */}
          {hasApplicationUrl && (
            <div className="p-3 rounded-xl bg-surface-100/70 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-surface-900 dark:text-surface-100 block">
                  Official Application Link
                </span>
                <span className="text-surface-500 dark:text-surface-400 block text-[11px]">
                  Direct official institution portal
                </span>
              </div>
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rome-600 dark:text-rome-400 hover:text-rome-700 hover:bg-white dark:hover:bg-surface-700 transition-colors"
                aria-label={`Open official portal for ${opportunity.title} in new tab`}
              >
                <span>Visit site</span>
                <SolarIcon name="arrow-right-up-linear" size={13} />
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-surface-50 dark:bg-surface-850 border-t border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveClick}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isSaved
                  ? 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
              }`}
              aria-label={isSaved ? 'Opportunity saved' : 'Save opportunity'}
            >
              <SolarIcon name={isSaved ? "heart-bold" : "heart-linear"} size={16} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {onTrackAttempt && (
              <button
                onClick={handleTrackClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 transition-colors cursor-pointer"
                aria-label="Track application"
              >
                <SolarIcon name="case-linear" size={16} />
                <span>Track</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="default"
              onClick={onClose}
              className="text-xs font-semibold h-10 min-h-[40px] rounded-xl"
            >
              Close
            </Button>

            <Button
              ref={primaryButtonRef}
              variant="default"
              size="default"
              onClick={handleViewFullOpportunity}
              className="bg-rome-500 hover:bg-rome-600 text-white font-semibold text-xs sm:text-sm h-10 min-h-[40px] px-5 rounded-xl shadow-xs"
            >
              <span>View Full Opportunity</span>
              <SolarIcon name="alt-arrow-right-linear" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
