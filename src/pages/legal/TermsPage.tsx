import React from 'react';
import { LegalPage, LegalSection, LegalP, LegalUl, LegalCallout, LegalContact } from './LegalLayout';

const SECTIONS = [
  { id: 'using', title: '1. Using ROMEfind' },
  { id: 'accounts', title: '2. Accounts' },
  { id: 'role', title: '3. ROMEfind\'s role' },
  { id: 'opportunity-info', title: '4. Opportunity information' },
  { id: 'external-links', title: '5. External links' },
  { id: 'applications', title: '6. Applications' },
  { id: 'user-content', title: '7. User content' },
  { id: 'community-content', title: '8. Community content' },
  { id: 'ip', title: '9. Intellectual property' },
  { id: 'prohibited', title: '10. Prohibited use' },
  { id: 'availability', title: '11. Availability' },
  { id: 'disclaimer', title: '12. Disclaimer' },
  { id: 'suspension', title: '13. Account suspension & termination' },
  { id: 'changes', title: '14. Changes to the Terms' },
  { id: 'contact', title: '15. Contact' },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These Terms explain the rules for using ROMEfind and the responsibilities of both ROMEfind and its users."
      lastUpdated="24 September 2026"
      sections={SECTIONS}
    >
      <LegalSection id="using" title="1. Using ROMEfind">
        <LegalP>
          By accessing or using ROMEfind, you agree to use the platform responsibly and in accordance with these Terms. These Terms apply to all users of ROMEfind, whether or not you have created an account.
        </LegalP>
        <LegalP>
          If you do not agree with these Terms, please do not use ROMEfind.
        </LegalP>
      </LegalSection>

      <LegalSection id="accounts" title="2. Accounts">
        <LegalP>
          If you create an account on ROMEfind, you are responsible for:
        </LegalP>
        <LegalUl items={[
          'Providing accurate and current information when creating your account',
          'Keeping your account credentials secure and not sharing them with others',
          'Any activity that occurs under your account',
          'Notifying ROMEfind promptly if you suspect unauthorised access to your account',
          'Keeping your profile information reasonably up to date',
        ]} />
        <LegalP>
          ROMEfind reserves the right to suspend or close accounts where there is reason to believe that account information is false, misleading, or that Terms have been violated.
        </LegalP>
      </LegalSection>

      <LegalSection id="role" title="3. ROMEfind's role">
        <LegalP>
          ROMEfind is an opportunity discovery and decision-support platform. ROMEfind may help you:
        </LegalP>
        <LegalUl items={[
          'Discover opportunities across a range of types and fields',
          'Explore alternative paths related to what you are looking for',
          'Compare opportunities to make more informed decisions',
          'Prepare for applications with checklists and relevant information',
          'Track saved opportunities and application progress',
          'Access learning resources relevant to your opportunity goals',
          'Record application outcomes',
        ]} />
        <LegalCallout variant="warn">
          ROMEfind does not guarantee that you will be eligible for, accepted to, funded by, or receive any particular outcome from any opportunity listed on the platform — including employment, scholarships, fellowships, grants, competitions, or any other result.
        </LegalCallout>
        <LegalP>
          Use of ROMEfind is not a substitute for your own research, professional advice, or direct engagement with opportunity providers.
        </LegalP>
      </LegalSection>

      <LegalSection id="opportunity-info" title="4. Opportunity information">
        <LegalP>
          Opportunity information on ROMEfind is sourced from publicly available information. This information may change after it appears on ROMEfind. In particular, the following details may change without notice:
        </LegalP>
        <LegalUl items={[
          'Deadlines and application windows',
          'Eligibility requirements',
          'Funding status and amounts',
          'Application requirements and materials',
          'Location and modality',
          'Benefits and compensation',
          'Application procedures',
          'Whether an opportunity is still open',
        ]} />
        <LegalCallout variant="warn">
          Always verify important opportunity details directly with the official provider before you invest significant time in preparation or before submitting an application.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="external-links" title="5. External links">
        <LegalP>
          ROMEfind may link to external websites, including official opportunity application pages. These external websites are not operated by ROMEfind, and ROMEfind does not control their content, terms, or practices.
        </LegalP>
        <LegalP>
          Users are responsible for reviewing the terms, eligibility criteria, and requirements of any external opportunity provider before applying. ROMEfind is not responsible for the content, accuracy, or availability of external websites.
        </LegalP>
      </LegalSection>

      <LegalSection id="applications" title="6. Applications">
        <LegalP>
          ROMEfind does not submit applications on behalf of users. All applications are completed and submitted directly by the user to the relevant opportunity provider.
        </LegalP>
        <LegalP>
          ROMEfind may help users organise, prepare, and track their application process, but the submission itself remains entirely the user's responsibility. If a future ROMEfind feature explicitly facilitates application submission, that feature will clearly describe what it does and what it does not do.
        </LegalP>
      </LegalSection>

      <LegalSection id="user-content" title="7. User content">
        <LegalP>
          Where ROMEfind provides features for user-generated content — such as recording outcomes or sharing experiences — users are responsible for what they submit. You must not submit content that is:
        </LegalP>
        <LegalUl items={[
          'Fraudulent, false, or deliberately misleading',
          'Harassing, abusive, threatening, or bullying',
          'Illegal under applicable law',
          'Infringing on another person\'s intellectual property',
          'Malicious or designed to harm the platform or its users',
          'Containing another person\'s private or confidential information without permission',
          'Spam, repetitive advertising, or irrelevant promotional content',
        ]} />
        <LegalP>
          By submitting content to ROMEfind, you represent that you have the right to do so and that the content complies with these Terms and the Community Guidelines.
        </LegalP>
      </LegalSection>

      <LegalSection id="community-content" title="8. Community content">
        <LegalP>
          Community experiences and advice shared by ROMEfind users represent the personal perspective and experience of the contributor. Community content:
        </LegalP>
        <LegalUl items={[
          'Is not verified or endorsed by ROMEfind as factually accurate',
          'Does not represent the official position of any opportunity provider',
          'Should not be treated as a guarantee of any particular application experience or outcome',
          'Is clearly distinguished from official opportunity information within the platform',
        ]} />
        <LegalP>
          ROMEfind may moderate or remove community content that violates these Terms or the Community Guidelines.
        </LegalP>
      </LegalSection>

      <LegalSection id="ip" title="9. Intellectual property">
        <LegalP>
          The ROMEfind name, logo, interface, and original platform content are owned by or licensed to ROMEfind. You may not copy, reproduce, distribute, or create derivative works from ROMEfind's proprietary content without permission.
        </LegalP>
        <LegalP>
          ROMEfind does not claim ownership of third-party opportunity information sourced from external providers. That information belongs to its respective owners.
        </LegalP>
        <LegalP>
          Where users contribute original content (such as written experiences or advice), users retain ownership of that content but grant ROMEfind a non-exclusive licence to display it within the platform for the purpose of providing the service.
        </LegalP>
      </LegalSection>

      <LegalSection id="prohibited" title="10. Prohibited use">
        <LegalP>You must not use ROMEfind to:</LegalP>
        <LegalUl items={[
          'Attempt to gain unauthorised access to the platform, its systems, or other users\' accounts',
          'Scrape, crawl, or systematically extract data in ways that overload or harm the platform',
          'Upload or transmit malicious code, viruses, or harmful software',
          'Impersonate another person, organisation, or opportunity provider',
          'Submit knowingly false opportunity information or fabricated community experiences',
          'Harass, abuse, or threaten other users',
          'Circumvent or interfere with security controls',
          'Use the platform for purposes unrelated to opportunity discovery and personal development',
        ]} />
      </LegalSection>

      <LegalSection id="availability" title="11. Availability">
        <LegalP>
          ROMEfind is provided on an "as available" basis. The platform may experience:
        </LegalP>
        <LegalUl items={[
          'Scheduled and unscheduled maintenance',
          'Technical issues or bugs',
          'Temporary or extended outages',
          'Feature changes, additions, or removals',
          'Periods of reduced functionality',
        ]} />
        <LegalP>
          ROMEfind does not guarantee uninterrupted or error-free access to the platform.
        </LegalP>
      </LegalSection>

      <LegalSection id="disclaimer" title="12. Disclaimer">
        <LegalP>
          ROMEfind provides opportunity information and decision-support tools to help users explore and navigate possibilities. The platform is provided in good faith and we work to keep information useful and current. However:
        </LegalP>
        <LegalUl items={[
          'Opportunity information may be incomplete, outdated, or inaccurate',
          'ROMEfind does not guarantee the accuracy of any opportunity details',
          'Decisions about applications, careers, education, or other paths remain entirely the user\'s responsibility',
          'ROMEfind is not a recruitment agency, advisory service, or application agent',
        ]} />
        <LegalP>
          Where important decisions depend on opportunity information, always verify details directly with the official opportunity provider.
        </LegalP>
      </LegalSection>

      <LegalSection id="suspension" title="13. Account suspension & termination">
        <LegalP>
          ROMEfind may restrict, suspend, or terminate access to an account where there is reasonable grounds to do so, including but not limited to:
        </LegalP>
        <LegalUl items={[
          'Serious or repeated violations of these Terms',
          'Fraudulent use of the platform',
          'Abuse or harassment of other users',
          'Security violations or attempts to compromise the platform',
          'Submission of false, malicious, or harmful content',
          'Other legitimate operational or legal reasons',
        ]} />
        <LegalP>
          Where reasonably practicable, we will notify affected users of account actions and the reasons for them. Users may contact ROMEfind to raise concerns about account actions.
        </LegalP>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to the Terms">
        <LegalP>
          These Terms may be updated as ROMEfind evolves or as applicable requirements change. Where material changes are made, we will make reasonable efforts to notify users through the platform. The date at the top of this page reflects the most recent revision.
        </LegalP>
        <LegalP>
          Continued use of ROMEfind after a Terms update constitutes acceptance of the revised Terms.
        </LegalP>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact">
        <LegalP>
          If you have questions about these Terms or want to raise a concern, please contact us:
        </LegalP>
        <LegalContact />
      </LegalSection>
    </LegalPage>
  );
}
