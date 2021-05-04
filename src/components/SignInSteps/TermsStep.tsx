import { absoluteRoutes } from '@/config/routes'
import Text from '@/shared/components/Text'
import { SvgGlyphChevronDown } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { StepFooter, StepWrapper } from './SignInSteps.style'
import { TermsBox, TextWrapper, TermsParagraph, TermsOverlay, ScrollButton, ContinueButton } from './TermsStep.style'

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
          <Text variant="h5">Terms and Conditions</Text>
          <TermsParagraph variant="body2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam vero ipsam, ab numquam corrupti magni
            quis aperiam nobis mollitia corporis laudantium maxime tempore quo voluptate, adipisci temporibus
            consequuntur, obcaecati omnis aspernatur ea delectus natus blanditiis. Nulla totam neque recusandae
            distinctio explicabo eos quisquam, at excepturi, quis inventore nesciunt esse atque.
          </TermsParagraph>
          <TermsParagraph variant="body2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam vero ipsam, ab numquam corrupti magni
            quis aperiam nobis mollitia corporis laudantium maxime tempore quo voluptate, adipisci temporibus
            consequuntur, obcaecati omnis aspernatur ea delectus natus blanditiis. Nulla totam neque recusandae
            distinctio explicabo eos quisquam, at excepturi, quis inventore nesciunt esse atque.
          </TermsParagraph>
          <TermsParagraph variant="body2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam vero ipsam, ab numquam corrupti magni
            quis aperiam nobis mollitia corporis laudantium maxime tempore quo voluptate, adipisci temporibus
            consequuntur, obcaecati omnis aspernatur ea delectus natus blanditiis. Nulla totam neque recusandae
            distinctio explicabo eos quisquam, at excepturi, quis inventore nesciunt esse atque.
          </TermsParagraph>
          <TermsParagraph variant="body2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam vero ipsam, ab numquam corrupti magni
            quis aperiam nobis mollitia corporis laudantium maxime tempore quo voluptate, adipisci temporibus
            consequuntur, obcaecati omnis aspernatur ea delectus natus blanditiis. Nulla totam neque recusandae
            distinctio explicabo eos quisquam, at excepturi, quis inventore nesciunt esse atque.
          </TermsParagraph>
          <TermsParagraph variant="body2">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam vero ipsam, ab numquam corrupti magni
            quis aperiam nobis mollitia corporis laudantium maxime tempore quo voluptate, adipisci temporibus
            consequuntur, obcaecati omnis aspernatur ea delectus natus blanditiis. Nulla totam neque recusandae
            distinctio explicabo eos quisquam, at excepturi, quis inventore nesciunt esse atque.
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
