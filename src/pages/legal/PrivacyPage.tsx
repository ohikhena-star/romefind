import React from 'react';
import { LegalPage, LegalSection, LegalP, LegalUl, LegalCallout, LegalContact } from './LegalLayout';

const SECTIONS = [
  { id: 'about', title: '1. About this policy' },
  { id: 'you-provide', title: '2. Information you provide' },
  { id: 'auto', title: '3. Information collected automatically' },
  { id: 'use', title: '4. How we use information' },
  { id: 'personalization', title: '5. Personalization' },
  { id: 'public-private', title: '6. Public and private information' },
  { id: 'opportunity-info', title: '7. Opportunity information' },
  { id: 'third-party', title: '8. Third-party websites' },
  { id: 'cookies', title: '9. Cookies and similar technologies' },
  { id: 'security', title: '10. Data security' },
  { id: 'retention', title: '11. Data retention' },
  { id: 'rights', title: '12. Your choices and rights' },
  { id: 'children', title: '13. Children\'s privacy' },
  { id: 'changes', title: '14. Changes to this policy' },
  { id: 'contact', title: '15. Contact' },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Your privacy matters. This Privacy Policy explains what information ROMEfind collects, how we use it, and the choices you have when using the platform."
      lastUpdated="24 September 2026"
      sections={SECTIONS}
    >
      <LegalSection id="about" title="1. About this policy">
        <LegalP>
          This Privacy Policy applies to ROMEfind — an opportunity discovery and decision-support platform — and describes how we handle information when people use the platform, including how we collect, store, use, and protect that information.
        </LegalP>
        <LegalP>
          By using ROMEfind, you acknowledge that you have read and understood this policy. If you have questions or concerns, you can contact us at the address provided at the end of this document.
        </LegalP>
        <LegalCallout>
          This policy describes the current ROMEfind implementation. As the platform develops, this policy will be updated. The date at the top of this page reflects when the policy was last revised.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="you-provide" title="2. Information you provide">
        <LegalP>
          When you create an account or use ROMEfind, you may provide information such as:
        </LegalP>
        <LegalUl items={[
          'Name',
          'Email address',
          'Password — stored in hashed form, never as plain text',
          'Location or country',
          'Current role or status (e.g. student, working professional)',
          'Interests and fields you are exploring',
          'Skills',
          'Goals',
          'Opportunity type preferences',
          'Work modality and location preferences',
          'Funding preferences',
          'Experience level',
          'Opportunities you save, track, or compare',
          'Application tracking information you enter into the platform',
          'Notes you create within the platform',
          'Outcomes you choose to record',
          'Information you submit through support or contact channels',
        ]} />
        <LegalP>
          Community experience features — such as sharing advice or application outcomes — may become available as ROMEfind develops. If and when those features are available, any information you share through them will be governed by this policy and the Community Guidelines.
        </LegalP>
        <LegalCallout variant="warn">
          Passwords are hashed using industry-standard methods before storage. ROMEfind does not have access to your plain-text password and will never ask you to share it.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="auto" title="3. Information collected automatically">
        <LegalP>
          When you use ROMEfind, certain technical information may be collected automatically as part of normal server and application operation. This may include:
        </LegalP>
        <LegalUl items={[
          'Device and browser type',
          'IP address',
          'Basic usage information (e.g. pages visited, actions taken)',
          'Server log information',
          'Authentication session information',
        ]} />
        <LegalP>
          ROMEfind does not currently use third-party advertising trackers, cross-site tracking, or sophisticated analytics platforms. This policy will be updated if that changes.
        </LegalP>
      </LegalSection>

      <LegalSection id="use" title="4. How we use information">
        <LegalP>Information collected through ROMEfind may be used to:</LegalP>
        <LegalUl items={[
          'Create and manage your account',
          'Authenticate your identity when you sign in',
          'Personalise opportunity discovery based on your profile and activity',
          'Recommend relevant opportunities',
          'Help you compare opportunities',
          'Track saved opportunities and application progress',
          'Connect learning recommendations to your opportunity goals',
          'Respond to support requests',
          'Maintain and improve platform functionality',
          'Maintain platform security and detect abuse or misuse',
          'Respond to reports from users',
          'Communicate important product or account information',
        ]} />
        <LegalCallout>
          ROMEfind does not sell your personal information to third parties.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="personalization" title="5. Personalization">
        <LegalP>
          Profile information and platform activity may be used to make your experience more relevant. For example, your interests, goals, saved opportunities, viewed opportunities, and application activity may influence the opportunities and paths that ROMEfind surfaces for you.
        </LegalP>
        <LegalP>
          Personalization is based on the information you provide and your in-product activity. ROMEfind does not currently use external AI or machine learning systems to process your data.
        </LegalP>
      </LegalSection>

      <LegalSection id="public-private" title="6. Public and private information">
        <LegalP>
          ROMEfind treats your account and profile information as private by default. The following information is private and not visible to other users:
        </LegalP>
        <LegalUl items={[
          'Your email address and password',
          'Your profile details unless you explicitly share them',
          'Your saved, tracked, or compared opportunities',
          'Your application tracking information',
          'Your private notes',
          'Your outcome records',
        ]} />
        <LegalP>
          If community contribution features are introduced — such as sharing application experiences or advice — you will be given a clear choice about what information, if any, is visible to other users. Community contributions will always be clearly labelled as coming from ROMEfind users rather than official opportunity providers.
        </LegalP>
      </LegalSection>

      <LegalSection id="opportunity-info" title="7. Opportunity information">
        <LegalP>
          ROMEfind may display information about opportunities from external sources. ROMEfind is not the provider of those opportunities and is not responsible for the accuracy, completeness, or currency of external opportunity information. Opportunity details — including deadlines, eligibility, funding, and requirements — may change after they appear on ROMEfind.
        </LegalP>
        <LegalCallout variant="warn">
          Always verify important opportunity details directly with the official provider before applying.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="third-party" title="8. Third-party websites">
        <LegalP>
          ROMEfind may contain links to external websites, including official opportunity application pages. Once you leave ROMEfind, those websites operate under their own privacy policies and terms of use. ROMEfind is not responsible for the privacy practices of external websites.
        </LegalP>
        <LegalP>
          We recommend reviewing the privacy policy of any external website before providing personal information.
        </LegalP>
      </LegalSection>

      <LegalSection id="cookies" title="9. Cookies and similar technologies">
        <LegalP>
          ROMEfind uses session information stored in your browser (such as authentication tokens) to keep you signed in across page visits. This is necessary for the platform to function.
        </LegalP>
        <LegalP>
          ROMEfind does not currently use third-party advertising cookies or tracking pixels. If this changes, this policy will be updated to describe those mechanisms and any available controls.
        </LegalP>
      </LegalSection>

      <LegalSection id="security" title="10. Data security">
        <LegalP>
          ROMEfind applies reasonable technical and organisational measures to help protect information against unauthorised access, disclosure, alteration, or loss. These measures include:
        </LegalP>
        <LegalUl items={[
          'Hashed password storage (passwords are never stored as plain text)',
          'Authenticated API access using JSON Web Tokens',
          'HTTPS encryption for data in transit',
          'Separation of private user data from publicly visible information',
        ]} />
        <LegalCallout variant="warn">
          No method of transmission over the internet or electronic storage is completely secure. While we take reasonable precautions, we cannot guarantee absolute security of your information.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="retention" title="11. Data retention">
        <LegalP>
          ROMEfind retains account and profile information for as long as your account is active, or as long as necessary to provide the service and fulfil the purposes described in this policy.
        </LegalP>
        <LegalP>
          If you request deletion of your account, we will take reasonable steps to remove your personal information, except where retention is required for legitimate operational, legal, or security reasons.
        </LegalP>
        <LegalP>
          Specific retention schedules have not yet been formally established for all data categories. This policy will be updated as those schedules are defined.
        </LegalP>
      </LegalSection>

      <LegalSection id="rights" title="12. Your choices and rights">
        <LegalP>You may be able to:</LegalP>
        <LegalUl items={[
          'Access the personal information associated with your account',
          'Correct inaccurate profile information by updating your profile',
          'Request deletion of your account and associated personal information',
          'Update your profile and preference information at any time',
          'Contact ROMEfind with questions or concerns about your information',
        ]} />
        <LegalP>
          To exercise any of these choices, or if you have questions about your information, please contact us using the details at the end of this policy.
        </LegalP>
        <LegalCallout>
          ROMEfind is currently a developing platform. Some data management features may be implemented progressively. If you have a specific request and it cannot be fulfilled through the platform, contact us directly and we will assist where we are able.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="children" title="13. Children's privacy">
        <LegalP>
          ROMEfind is intended for people exploring educational, career, and personal development opportunities. The platform is not specifically targeted at children. If you are a parent or guardian and believe a minor has provided personal information through ROMEfind without appropriate consent, please contact us and we will take appropriate steps.
        </LegalP>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to this policy">
        <LegalP>
          This Privacy Policy may be updated as ROMEfind evolves, new features are introduced, or applicable requirements change. Material changes will be communicated through the platform where reasonably practicable. The date at the top of this page always reflects the most recent revision.
        </LegalP>
        <LegalP>
          Continued use of ROMEfind after a policy update constitutes acceptance of the revised policy.
        </LegalP>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact">
        <LegalP>
          If you have questions, concerns, or requests relating to this Privacy Policy or your personal information, please contact us:
        </LegalP>
        <LegalContact />
        <LegalP>
          Before publishing these pages as final legal documents, we recommend having the wording reviewed by an appropriately qualified legal or privacy professional — particularly for compliance with applicable Nigerian data protection requirements (NDPR) and any other applicable frameworks.
        </LegalP>
      </LegalSection>
    </LegalPage>
  );
}
