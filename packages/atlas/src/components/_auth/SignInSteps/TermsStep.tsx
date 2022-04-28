import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronB } from '@/components/_icons'
import { Footer, FooterButtonsContainer } from '@/components/_overlays/Dialog/Dialog.styles'
import { QUERY_PARAMS } from '@/config/routes'
import { transitions } from '@/styles'
import { urlParams } from '@/utils/url'

import { StepWrapper } from './SignInSteps.styles'
import { ScrollButton, TermsBox, TermsOverlay, TextWrapper } from './TermsStep.styles'

import { TermsOfService } from '../../TermsOfService'

export const TermsStep: React.FC = () => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const termsBoxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!termsBoxRef.current) {
      return
    }

    const scrollHeight = termsBoxRef.current.scrollHeight
    const boxHeight = termsBoxRef.current.clientHeight

    if (scrollPosition >= (scrollHeight - boxHeight) * 0.95) {
      setHasScrolledToBottom(true)
    }
  }, [scrollPosition])

  const handleScrollToBottom = () => {
    setHasScrolledToBottom(true)
    if (!termsBoxRef?.current) return
    termsBoxRef?.current?.scrollTo(0, termsBoxRef.current.scrollHeight)
  }

  return (
    <>
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
              <ScrollButton iconOnly icon={<SvgActionChevronB />} variant="secondary" onClick={handleScrollToBottom} />
            </CSSTransition>
          </TermsOverlay>
        </TermsBox>
      </StepWrapper>
      <Footer additionalActionsNodeMobilePosition="top" dividers>
        <FooterButtonsContainer additionalActionsNodeMobilePosition="top">
          <Button to={{ search: urlParams({ [QUERY_PARAMS.LOGIN]: 'member' }) }} disabled={!hasScrolledToBottom}>
            Accept terms
          </Button>
        </FooterButtonsContainer>
      </Footer>
    </>
  )
}
