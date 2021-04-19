import { absoluteRoutes } from '@/config/routes'
import { Checkbox } from '@/shared/components'
import Text from '@/shared/components/Text'
import { SvgGlyphChevronDown } from '@/shared/icons'
import { transitions } from '@/shared/theme'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import { StepFooter, StepTitle, StepWrapper } from './SignInSteps.style'
import { TermsBox, TextWrapper, TermsParagraph, TermsOverlay, ScrollButton, ContinueButton } from './TermsStep.style'

const TermsStep: React.FC = () => {
  const navigate = useNavigate()
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const termsBoxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!termsBoxRef.current) {
      return
    }

    const scrollHeight = termsBoxRef.current.scrollHeight
    const boxHeight = termsBoxRef.current.clientHeight

    if (scrollPosition === scrollHeight - boxHeight) {
      // hide scroll button, show checkbox
      setIsCheckboxVisible(true)
    }
  }, [scrollPosition])

  const handleScrollToBottom = () => {
    if (!termsBoxRef?.current) return
    termsBoxRef?.current?.scrollTo(0, termsBoxRef.current.scrollHeight)
  }

  return (
    <StepWrapper>
      <StepTitle variant="h4">Accept Terms and Conditions</StepTitle>
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
            in={!isCheckboxVisible}
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
        <CSSTransition
          in={isCheckboxVisible}
          timeout={parseInt(transitions.timings.loading)}
          classNames={transitions.names.fade}
          unmountOnExit
        >
          <Checkbox
            value={isAccepted}
            onClick={() => setIsAccepted(!isAccepted)}
            label="I’ve read and accept Terms And Conditions"
          />
        </CSSTransition>
        <ContinueButton to={absoluteRoutes.studio.newMembership()}>Continue</ContinueButton>
      </StepFooter>
    </StepWrapper>
  )
}

export default TermsStep
