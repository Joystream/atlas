import routes from '@/config/routes'
import { Checkbox } from '@/shared/components'
import Text from '@/shared/components/Text'
import { transitions } from '@/shared/theme'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import { StepTitle, StepWrapper } from './Steps.style'
import {
  TermsBox,
  TextWrapper,
  TermsParagraph,
  TermsOverlay,
  ScrollButton,
  TermsForm,
  ContinueButton,
} from './TermsStep.style'

type TermsStepProps = {
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

const TermsStep: React.FC<TermsStepProps> = ({ onStepChange, currentStepIdx }) => {
  const navigate = useNavigate()
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false)
  const [isRead, setIsRead] = useState(false)
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
      setIsCheckboxVisible(true)
      setIsRead(true)
    } else {
      setIsCheckboxVisible(false)
    }
  }, [scrollPosition])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // do something here
    onStepChange(0)
    navigate(routes.newMembership())
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
            <ScrollButton
              icon="arrow-down"
              onClick={() => {
                if (!termsBoxRef?.current) return
                termsBoxRef?.current?.scrollTo(0, scrollPosition + 150)
              }}
            />
          </CSSTransition>
        </TermsOverlay>
      </TermsBox>
      <TermsForm onSubmit={handleSubmit}>
        <CSSTransition
          in={isRead}
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
        <ContinueButton disabled={!isAccepted}>Continue</ContinueButton>
      </TermsForm>
    </StepWrapper>
  )
}

export default TermsStep
