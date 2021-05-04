import { absoluteRoutes } from '@/config/routes'
import Text from '@/shared/components/Text'
import { SvgGlyphChevronDown } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { StepFooter, StepWrapper } from './SignInSteps.style'
import {
  TermsBox,
  TextWrapper,
  TermsParagraph,
  TermsOverlay,
  ScrollButton,
  ContinueButton,
  LastUpdateText,
  TermsListItem,
} from './TermsStep.style'

const TermsStep: React.FC = () => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const termsBoxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!termsBoxRef.current) {
      return
    }

    const scrollHeight = termsBoxRef.current.scrollHeight
    const boxHeight = termsBoxRef.current.clientHeight

    if (scrollPosition === scrollHeight - boxHeight) {
      setHasScrolledToBottom(true)
    }
  }, [scrollPosition])

  const handleScrollToBottom = () => {
    if (!termsBoxRef?.current) return
    termsBoxRef?.current?.scrollTo(0, termsBoxRef.current.scrollHeight)
  }

  return (
    <StepWrapper>
      <TermsBox ref={termsBoxRef} onScroll={(e) => setScrollPosition(e.currentTarget.scrollTop)}>
        <TextWrapper>
          <Text variant="h5">Terms of Service</Text>
          <LastUpdateText>Last updated on the 4th of May 2021</LastUpdateText>
          <TermsParagraph>
            This Terms of Service (&quot;Agreement&quot;) is a binding obligation between you (&quot;User&quot;) and
            Jsgenesis AS (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;) for use of our Joystream
            Player interface (&quot;Atlas&quot;) hosted at play.joystream.org and all other products (collectively
            &quot;Software&quot;) developed and published by Us.
          </TermsParagraph>
          <TermsParagraph header>1. Agreement to Terms</TermsParagraph>
          <TermsParagraph>
            By using Our Software, the User is agreeing to be bound by this Agreement. If you are acting on behalf of
            another company or an employer, you must have the rights to act on their behalf.
          </TermsParagraph>
          <TermsParagraph header>2. Changes to Terms</TermsParagraph>
          <TermsParagraph>
            This Agreement may be modified or updated at the sole discretion of Company without notice. Your continued
            use of our Software is confirmation of your acceptance of the latest Agreement.
          </TermsParagraph>
          <TermsParagraph header>3. Privacy Policy</TermsParagraph>
          <TermsParagraph>
            Please see our{' '}
            <a href="https://www.joystream.org/privacy-policy/" rel="noopener noreferrer" target="_blank">
              privacy policy
            </a>{' '}
            (&quot;Privacy Policy&quot;) for information regarding privacy.
          </TermsParagraph>
          <TermsParagraph header>4. Membership</TermsParagraph>
          <TermsParagraph>
            By generating private/public cryptographic keys (&quot;Keys&quot;) or applying for a membership account
            (&quot;Membership&quot;), you accept the risk of losing access to your Keys and Membership. Reasons include,
            but are not limited to:
          </TermsParagraph>
          <ol>
            <TermsListItem>Losing passwords</TermsListItem>
            <TermsListItem>Losing recovery seeds or mnemonics</TermsListItem>
            <TermsListItem>Deleting accounts and backups</TermsListItem>
            <TermsListItem>Security breaches</TermsListItem>
          </ol>
          <TermsParagraph>
            Under no circumstance will Company take any responsibility for loss resulting from losing access to
            Membership or Keys.
          </TermsParagraph>
          <TermsParagraph header>5. User Conduct</TermsParagraph>
          <TermsParagraph>
            By using Our Software, you agree to not state, write, link to, download, distribute, share or encourage
            other users to state, write, link to, download, distribute, share or encourage anything that:
          </TermsParagraph>
          <ol>
            <TermsListItem>breach or infringe any copyright or intellectual property of any third party.</TermsListItem>
            <TermsListItem>is abusive, malicious, threatening or unlawful in any way.</TermsListItem>
          </ol>
          <TermsParagraph>
            Company has not reviewed all content published on our services, and is not responsible for content submitted
            or provided by individuals or groups not directly tied to them.
          </TermsParagraph>
          <TermsParagraph header>6. Responsibilities and Risks</TermsParagraph>
          <TermsParagraph>
            In no event shall Company, its contractors, employees or owners be liable for any damage or loss of any kind
            to User arising out of the use or inability to use any Software made by Company. In no event shall Company,
            its contractors, employees or owners be liable for any damage or loss of any kind to User resulting of
            clicking links, following guides, using software or doing anything else recommended by Company.
          </TermsParagraph>
          <TermsParagraph header>7. Content Takedown Policy</TermsParagraph>
          <TermsParagraph>
            Jsgenesis has established a policy for content takedowns in accordance with the Digital Millennium Copyright
            Act (DMCA) which can be viewed here.
          </TermsParagraph>
          <TermsParagraph header>8. Governing Law</TermsParagraph>
          <TermsParagraph>
            These terms and conditions are governed by and construed in accordance with the laws of Norway.
          </TermsParagraph>
        </TextWrapper>
        <TermsOverlay>
          <CSSTransition
            in={!hasScrolledToBottom}
            timeout={parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
            unmountOnExit
          >
            <ScrollButton variant="secondary" onClick={handleScrollToBottom}>
              <SvgGlyphChevronDown />
            </ScrollButton>
          </CSSTransition>
        </TermsOverlay>
      </TermsBox>
      <StepFooter>
        <ContinueButton to={absoluteRoutes.studio.newMembership()} disabled={!hasScrolledToBottom}>
          Accept terms
        </ContinueButton>
      </StepFooter>
    </StepWrapper>
  )
}

export default TermsStep
