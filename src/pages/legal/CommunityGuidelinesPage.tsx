import React from 'react';
import { LegalPage, LegalSection, LegalP, LegalUl, LegalCallout, LegalContact } from './LegalLayout';
import { cn } from '@/utils/cn';

const SECTIONS = [
  { id: 'be-helpful', title: '1. Be helpful' },
  { id: 'be-honest', title: '2. Be honest' },
  { id: 'dont-mislead', title: '3. Don\'t mislead' },
  { id: 'respect', title: '4. Respect people' },
  { id: 'privacy', title: '5. Protect privacy' },
  { id: 'no-spam', title: '6. No spam' },
  { id: 'useful', title: '7. Share useful experiences' },
  { id: 'distinction', title: '8. Official vs community information' },
  { id: 'report', title: '9. Report a problem' },
];

function DistinctionCard({ label, description, accent, bg, border }: {
  label: string; description: string; accent: string; bg: string; border: string;
}) {
  return (
    <div className={cn('rounded-xl border p-5', bg, border)}>
      <p className={cn('text-xs font-black uppercase tracking-widest mb-2', accent)}>{label}</p>
      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage
      title="Community Guidelines"
      intro="ROMEfind is built around the idea that one person's experience can make someone else's path easier. These guidelines help keep shared experiences useful, honest, and respectful."
      lastUpdated="24 September 2026"
      sections={SECTIONS}
    >
      <LegalSection id="be-helpful" title="1. Be helpful">
        <LegalP>
          Share practical information that can genuinely help another person. Think about what you wish you had known before you applied — and share that.
        </LegalP>
        <LegalP>
          Useful contributions include things like how long the application took, what the process involved, what the selection experience was like, and what you would do differently. Specific, grounded experience is more valuable than vague encouragement.
        </LegalP>
      </LegalSection>

      <LegalSection id="be-honest" title="2. Be honest">
        <LegalP>
          Share your genuine experience. Do not exaggerate, minimise, or distort what happened in order to appear more successful, knowledgeable, or authoritative than you are.
        </LegalP>
        <LegalP>
          Clearly distinguish between your personal experience and official information about the opportunity. What you experienced may not be the same as what the next person experiences. That is expected — and it is still valuable.
        </LegalP>
      </LegalSection>

      <LegalSection id="dont-mislead" title="3. Don't mislead">
        <LegalP>
          Do not submit false opportunity information, fabricated application experiences, or invented claims about opportunities or providers. Misleading information can cause real harm to people who are relying on it to make important decisions.
        </LegalP>
        <LegalUl items={[
          'Do not fabricate application outcomes',
          'Do not invent or exaggerate eligibility requirements to discourage others',
          'Do not submit false information about an opportunity\'s deadline, funding, or status',
          'Do not pretend to have applied to or been accepted by an opportunity you have not',
        ]} />
      </LegalSection>

      <LegalSection id="respect" title="4. Respect people">
        <LegalP>
          Every person using ROMEfind is navigating their own path. Treat other users with the same respect you would want for yourself.
        </LegalP>
        <LegalP>The following are not acceptable on ROMEfind:</LegalP>
        <LegalUl items={[
          'Harassment or persistent unwanted contact',
          'Threats or intimidation',
          'Bullying or targeted mockery',
          'Hate speech based on race, gender, religion, nationality, disability, sexual orientation, or any other protected characteristic',
          'Personal attacks or abusive language directed at users or opportunity providers',
          'Content designed to humiliate, shame, or harm a specific individual',
        ]} />
      </LegalSection>

      <LegalSection id="privacy" title="5. Protect privacy">
        <LegalP>
          Do not share another person's private information without their explicit and appropriate consent. This includes:
        </LegalP>
        <LegalUl items={[
          'Phone numbers',
          'Email addresses',
          'Home or work addresses',
          'Private documents or application materials',
          'Personal details not relevant to the shared experience',
          'Any information that could be used to identify or contact a specific private individual',
        ]} />
        <LegalP>
          When sharing your own experience, take care not to inadvertently reveal personal details about others — such as interviewers, assessors, or fellow applicants — who did not consent to being identified.
        </LegalP>
      </LegalSection>

      <LegalSection id="no-spam" title="6. No spam">
        <LegalP>
          Community features in ROMEfind are for sharing genuine experience — not for advertising, self-promotion, or repetitive content. Do not use community features to:
        </LegalP>
        <LegalUl items={[
          'Promote services, courses, or products not relevant to the opportunity',
          'Share repetitive or copy-pasted content across multiple opportunities',
          'Post referral links, affiliate links, or promotional codes',
          'Advertise recruitment services, coaching, or paid help',
        ]} />
      </LegalSection>

      <LegalSection id="useful" title="7. Share useful experiences">
        <LegalP>
          The most valuable contributions are specific and honest. Examples of genuinely useful contributions:
        </LegalP>
        <LegalUl items={[
          'What the application process looked like in practice',
          'How long it took from application to decision',
          'What materials you prepared and whether they were useful',
          'What the interview or assessment process was like',
          'What you wish you had done differently',
          'Portfolio or CV advice specific to this type of opportunity',
          'Tips on meeting eligibility requirements',
          'What the experience was actually like once you joined (if applicable)',
          'Whether the opportunity matched its description',
        ]} />
        <LegalP>
          You do not need to have been accepted to contribute something useful. Being shortlisted, waitlisted, or rejected can be just as informative for someone preparing to apply.
        </LegalP>
      </LegalSection>

      <LegalSection id="distinction" title="8. Official information vs community experience">
        <LegalP>
          ROMEfind keeps three types of information clearly separated:
        </LegalP>
        <div className="space-y-3 my-4">
          <DistinctionCard
            label="Official opportunity information"
            description="Information from the opportunity provider or official source. Always verify this directly with the provider — it may change after it appears on ROMEfind."
            accent="text-rome-700 dark:text-rome-300"
            bg="bg-rome-50 dark:bg-rome-950/20"
            border="border-rome-200 dark:border-rome-800"
          />
          <DistinctionCard
            label="Community experience"
            description="Personal experience and advice contributed by ROMEfind users. This represents the contributor's own perspective. It is not official information from the provider and should not be treated as such."
            accent="text-purple-700 dark:text-purple-300"
            bg="bg-purple-50 dark:bg-purple-950/20"
            border="border-purple-200 dark:border-purple-800"
          />
          <DistinctionCard
            label="Your private notes"
            description="Notes you create within ROMEfind for your own use. These are only visible to you and are never shared with other users."
            accent="text-surface-500 dark:text-surface-400"
            bg="bg-surface-50 dark:bg-surface-800/40"
            border="border-surface-200 dark:border-surface-700"
          />
        </div>
        <LegalCallout>
          Community contributions should never be presented as, or mistaken for, official provider information. If you are quoting official details, make that clear — and always direct people to the official source to verify.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="report" title="9. Report a problem">
        <LegalP>
          If you see content or behaviour that violates these guidelines — or if you encounter incorrect opportunity information, broken links, or anything that looks like abuse — please report it. Reports can be made for:
        </LegalP>
        <LegalUl items={[
          'Incorrect or outdated opportunity information',
          'Broken or misleading links',
          'Misleading or fabricated community experiences',
          'Abusive, harassing, or threatening content',
          'Spam or irrelevant promotion',
          'Privacy violations',
          'Any other concern not covered above',
        ]} />
        <LegalP>
          To report something, please contact us directly:
        </LegalP>
        <LegalContact />
        <LegalP>
          We take reports seriously. We will review them and take appropriate action. We may not always be able to share the outcome of a specific report, but we appreciate every contribution that helps keep ROMEfind useful and trustworthy.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
