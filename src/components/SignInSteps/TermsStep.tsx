import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import TermsOfService from '@/components/TermsOfService'
import { absoluteRoutes } from '@/config/routes'
import { SvgGlyphChevronDown } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import { StepFooter, StepWrapper } from './SignInSteps.style'
import { TermsBox, TextWrapper, TermsOverlay, ScrollButton, ContinueButton } from './TermsStep.style'

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
          <TermsOfService />
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
