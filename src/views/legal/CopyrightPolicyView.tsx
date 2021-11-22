import React from 'react'

import { Text } from '@/components/Text'
import { LegalListItem, LegalParagraph } from '@/components/_content/LegalText'

export const CopyrightPolicyView: React.FC = () => {
  return (
    <div>
      <Text variant="h5">DMCA Policy For Content Takedown</Text>
      <LegalParagraph>
        Jsgenesis AS, the developers of the Joystream protocol, have established a copyright infringement policy in
        accordance with the Digital Millennium Copyright Act.
        <br />
        <br />
        Copyright owners and their agents may notify us in cases where content hosted on our testnets (available
        publicly at{' '}
        <a href="https://play.joystream.org" rel="noopener noreferrer" target="_blank">
          play.joystream.org
        </a>{' '}
        and{' '}
        <a href="https://testnet.joystream.org" rel="noopener noreferrer" target="_blank">
          testnet.joystream.org
        </a>
        ) infringes on their copyrights by sending a DMCA notice to us using the contact information below.
        <br />
        <br />
        Upon receipt of a valid and complete notice, we will remove the content from our public-facing applications as
        quickly as possible. We may also suspend the ability of the uploader to participate further on our testnet.
        <br />
        <br />
        Where possible, we will attempt to notify the alleged infringer of the takedown, with a copy of your DMCA
        Notice, using the contact information provided to us.
        <br /> <br />
        You can be held liable for damages, including costs and attorney fees, if you materially misrepresent that
        material or activity infringes on your copyright.
      </LegalParagraph>
      <LegalParagraph header>Requirements for DMCA Notices</LegalParagraph>
      <LegalParagraph>Your DMCA Notice must include all of the following information:</LegalParagraph>
      <ol>
        <LegalListItem>
          A physical or electronic signature of the copyright owner, or a person authorized to act on behalf of the
          copyright owner;
        </LegalListItem>
        <LegalListItem>Identification (URL) of the copyrighted work or material being infringed upon;</LegalListItem>
        <LegalListItem>
          Description of the work or material that you claim to be infringing and would like to be removed, including
          information regarding its location (URL) with enough detail so that we can and verify it;
        </LegalListItem>
        <LegalListItem>
          Your full legal name, mailing address, telephone number, and email address where we can contact you;
        </LegalListItem>
        <LegalListItem>
          A statement that you have a good faith belief that use of the material in the manner complained of is not
          authorized by the copyright owner, its agent, or the law; and
        </LegalListItem>
        <LegalListItem>
          A statement that the information in your DMCA Notice is accurate, and under penalty of perjury, that you are
          the copyright owner or are authorized to act on behalf of the copyright owner.
        </LegalListItem>
      </ol>
      <LegalParagraph header>DMCA Agent Information</LegalParagraph>
      <LegalParagraph>
        Our dedicated email address for DMCA notifications is:{' '}
        <a href="mailto:abuse@jsgenesis.com">abuse@jsgenesis.com</a>.
        <br />
        <br />
        Alternatively you can contact us by post:
        <br />
        <br />
        <address>
          Designated DMCA Agent Jsgenesis AS
          <br />
          CO UMA Workspace Stenersgata 8
          <br />
          Oslo, 0184 Norway
        </address>
        <br />
        <br />
        Or by telephone: <a href="tel:+44789553019">+44789553019</a>
      </LegalParagraph>
      <LegalParagraph header>DMCA Counter Notification</LegalParagraph>
      <LegalParagraph>
        If your content has been mistakenly removed from our testnet, you can submit a DMCA Counter Notification using
        the same contact information shown above.
        <br />
        <br />
        Your DMCA Counter Notification must include all of the following information:
      </LegalParagraph>

      <ol>
        <LegalListItem>Your physical or electronic signature;</LegalListItem>
        <LegalListItem>
          Identification (URL) of the material that has been removed or to which access has been disabled and the
          location at which the material appeared before it was removed or access to it was disabled (the description
          from the DMCA Notice is acceptable);
        </LegalListItem>
        <LegalListItem>
          A statement under penalty of perjury that you have a good faith belief that the material was removed or
          disabled as a result of mistake or misidentification of the material to be removed or disabled;
        </LegalListItem>
        <LegalListItem>
          Your full legal name, mailing address, telephone number, and email address where we can contact you; and
        </LegalListItem>
        <LegalListItem>
          A statement that you consent to the jurisdiction of Federal District Court for the judicial district in which
          your address is located, or if your address is outside of the United States, for any judicial district in
          which Jsgenesis may be found, and that you will accept service of process from the person who provided the
          DMCA Notice or an agent of such person.
        </LegalListItem>
      </ol>
      <LegalParagraph>
        If we receive valid DMCA Counter Notification that meets the above requirements, we will forward a copy to the
        person who filed the original DMCA Notice. If we do not receive notice within 10 business days that the person
        who submitted the DMCA Notice is seeking a court order to prevent the infringement of the content at issue, we
        will replace or re-enable access to the content that was removed.
      </LegalParagraph>
    </div>
  )
}
