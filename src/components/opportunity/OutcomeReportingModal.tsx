import React, { useState } from 'react';
import { Modal, Button, Input } from '@/components/ui';
import { Trophy, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { ApplicationStatus } from '@/types/models';
import { api } from '@/api/client';

export interface OutcomeReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId?: string;
  opportunityTitle: string;
  organizationName: string;
  onSubmitOutcome: (details: {
    status: ApplicationStatus;
    outcomeType: string;
    startDate?: string;
    stipendReceived?: string;
    reflectionTip: string;
    shareWithCommunity: boolean;
  }) => Promise<void>;
}

export const OutcomeReportingModal: React.FC<OutcomeReportingModalProps> = ({
  isOpen,
  onClose,
  opportunityId,
  opportunityTitle,
  organizationName,
  onSubmitOutcome
}) => {
  const [outcomeType, setOutcomeType] = useState('Accepted & Attending');
  const [startDate, setStartDate] = useState('');
  const [stipendReceived, setStipendReceived] = useState('');
  const [reflectionTip, setReflectionTip] = useState('');
  const [shareWithCommunity, setShareWithCommunity] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitOutcome({
        status: ApplicationStatus.Accepted,
        outcomeType,
        startDate: startDate || undefined,
        stipendReceived: stipendReceived || undefined,
        reflectionTip,
        shareWithCommunity
      });

      if (shareWithCommunity && reflectionTip.trim() && opportunityId) {
        await api.addOpportunityAdvice(opportunityId, {
          title: `Key success tip for ${opportunityTitle}`,
          content: reflectionTip.trim(),
          outcomeStatus: outcomeType.includes('Accepted') ? 'Accepted' : 'Applied',
          adviceType: 'What I Wish I Knew'
        }).catch(() => {});
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit outcome', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="">
      {submitted ? (
        <div className="py-10 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Congratulations! 🎉</h2>
          <p className="text-sm text-surface-600 dark:text-surface-300 max-w-sm mx-auto">
            Your outcome has been recorded in your workspace. Your journey and insights inspire future applicants!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2 pb-2 border-b border-surface-100 dark:border-surface-800">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">
              Share Your Acceptance & Outcome
            </h2>
            <p className="text-xs text-surface-500 max-w-md mx-auto">
              Did you get into <strong className="text-surface-800 dark:text-surface-200">{opportunityTitle}</strong> at {organizationName}? Update us on your success!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5 block">
                Outcome Status
              </label>
              <select
                value={outcomeType}
                onChange={(e) => setOutcomeType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm font-medium text-surface-900 dark:text-surface-100"
              >
                <option value="Accepted & Attending">Accepted & Attending (Confirmed)</option>
                <option value="Offer Received">Offer Received (Deciding)</option>
                <option value="Accepted & Declined">Accepted elsewhere (Declined this offer)</option>
                <option value="Waitlisted">Waitlisted / Alternate</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5 block">
                  Expected Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  fullWidth
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5 block">
                  Funding / Stipend Awarded (Optional)
                </label>
                <Input
                  type="text"
                  value={stipendReceived}
                  onChange={(e) => setStipendReceived(e.target.value)}
                  placeholder="e.g. $45,000 stipend or Full Tuition"
                  fullWidth
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-1.5 flex items-center justify-between">
                <span>What helped you succeed? (Tips & Advice)</span>
                <span className="text-[10px] text-surface-400 font-normal">Optional</span>
              </label>
              <textarea
                value={reflectionTip}
                onChange={(e) => setReflectionTip(e.target.value)}
                placeholder="Share advice on essays, interviews, or preparation that made a real difference..."
                rows={3}
                className="w-full p-3 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-1 focus:ring-rome-500"
              />
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-50 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800">
              <input
                type="checkbox"
                id="shareCommunity"
                checked={shareWithCommunity}
                onChange={(e) => setShareWithCommunity(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-surface-300 text-rome-500 focus:ring-rome-400"
              />
              <label htmlFor="shareCommunity" className="text-xs text-surface-600 dark:text-surface-300 cursor-pointer">
                <span className="font-semibold text-surface-900 dark:text-surface-100 block">Help future explorers</span>
                Share your anonymous advice and acceptance timeline with other applicants preparing for this opportunity.
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting} leftIcon={<Sparkles className="w-4 h-4" />}>
              Record Acceptance
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
