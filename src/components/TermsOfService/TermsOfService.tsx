import React from 'react'

import { Text } from '@/components/Text'

import { LegalLastUpdateText, LegalListItem, LegalParagraph } from '../LegalText'

export const TermsOfService: React.FC = () => {
  return (
    <div>
      <Text variant="h5">Terms of Service</Text>
      <LegalLastUpdateText>Last updated on the 4th of May 2021</LegalLastUpdateText>
      <LegalParagraph>
        This Terms of Service (&quot;Agreement&quot;) is a binding obligation between you (&quot;User&quot;) and
        Jsgenesis AS (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;) for use of our Joystream
        Player interface (&quot;Atlas&quot;) hosted at play.joystream.org and all other products (collectively
        &quot;Software&quot;) developed and published by Us.
      </LegalParagraph>
      <LegalParagraph header>1. Agreement to Terms</LegalParagraph>
      <LegalParagraph>
        By using Our Software, the User is agreeing to be bound by this Agreement. If you are acting on behalf of
        another company or an employer, you must have the rights to act on their behalf.
      </LegalParagraph>
      <LegalParagraph header>2. Changes to Terms</LegalParagraph>
      <LegalParagraph>
        This Agreement may be modified or updated at the sole discretion of Company without notice. Your continued use
        of our Software is confirmation of your acceptance of the latest Agreement.
      </LegalParagraph>
      <LegalParagraph header>3. Privacy Policy</LegalParagraph>
      <LegalParagraph>
        Please see our{' '}
        <a href="https://www.joystream.org/privacy-policy/" rel="noopener noreferrer" target="_blank">
          privacy policy
        </a>{' '}
        (&quot;Privacy Policy&quot;) for information regarding privacy.
      </LegalParagraph>
      <LegalParagraph header>4. Membership</LegalParagraph>
      <LegalParagraph>
        By generating private/public cryptographic keys (&quot;Keys&quot;) or applying for a membership account
        (&quot;Membership&quot;), you accept the risk of losing access to your Keys and Membership. Reasons include, but
        are not limited to:
      </LegalParagraph>
      <ol>
        <LegalListItem>Losing passwords</LegalListItem>
        <LegalListItem>Losing recovery seeds or mnemonics</LegalListItem>
        <LegalListItem>Deleting accounts and backups</LegalListItem>
        <LegalListItem>Security breaches</LegalListItem>
      </ol>
      <LegalParagraph>
        Under no circumstance will Company take any responsibility for loss resulting from losing access to Membership
        or Keys.
      </LegalParagraph>
      <LegalParagraph header>5. User Conduct</LegalParagraph>
      <LegalParagraph>
        By using Our Software, you agree to not state, write, link to, download, distribute, share or encourage other
        users to state, write, link to, download, distribute, share or encourage anything that:
      </LegalParagraph>
      <ol>
        <LegalListItem>breach or infringe any copyright or intellectual property of any third party.</LegalListItem>
        <LegalListItem>is abusive, malicious, threatening or unlawful in any way.</LegalListItem>
      </ol>
      <LegalParagraph>
        Company has not reviewed all content published on our services, and is not responsible for content submitted or
        provided by individuals or groups not directly tied to them.
      </LegalParagraph>
      <LegalParagraph header>6. Responsibilities and Risks</LegalParagraph>
      <LegalParagraph>
        In no event shall Company, its contractors, employees or owners be liable for any damage or loss of any kind to
        User arising out of the use or inability to use any Software made by Company. In no event shall Company, its
        contractors, employees or owners be liable for any damage or loss of any kind to User resulting of clicking
        links, following guides, using software or doing anything else recommended by Company.
      </LegalParagraph>
      <LegalParagraph header>7. Content Takedown Policy</LegalParagraph>
      <LegalParagraph>
        Jsgenesis has established a policy for content takedowns in accordance with the Digital Millennium Copyright Act
        (DMCA) which can be viewed{' '}
        <a href="https://play.joystream.org/legal/copyright" rel="noopener noreferrer" target="_blank">
          here.
        </a>
      </LegalParagraph>
      <LegalParagraph header>8. Governing Law</LegalParagraph>
      <LegalParagraph>
        These terms and conditions are governed by and construed in accordance with the laws of Norway.
      </LegalParagraph>
    </div>
  )
}
