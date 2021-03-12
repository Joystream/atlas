import React, { useEffect, useRef, useState } from 'react'
import {
  BrowserIcon,
  CheckboxWrapper,
  ContinueButton,
  ScrollButton,
  StepButton,
  StepSubTitle,
  StepTitle,
  StepWrapper,
  TermsBox,
  TermsOverlay,
  TermsParagraph,
  TextWrapper,
} from './SignInSteps.style'
import Text from '@/shared/components/Text'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { Checkbox } from '@/shared/components'

type CommonStepProps = {
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

type ExtensionStepProps = {
  browser: 'chrome' | 'firefox' | null
} & CommonStepProps

const ExtensionStep: React.FC<ExtensionStepProps> = ({ browser, currentStepIdx, onStepChange }) => {
  return (
    <StepWrapper centered>
      {browser && <BrowserIcon name={browser} />}
      <StepTitle variant="h4">Add polkadot extension</StepTitle>
      <StepSubTitle variant="body2">
        Please enable Polkadot extension or install it using one of the following plugin links.
      </StepSubTitle>
      {browser && (
        <StepButton icon={browser} onClick={() => onStepChange(currentStepIdx + 1)}>
          Add polkadot plugin
        </StepButton>
      )}
    </StepWrapper>
  )
}

type Account = {
  name: string
  img: string
  balance: number
}

const AccountStep = () => {
  const [accounts, checkAccounts] = useState<null | Account[]>()
  return (
    <StepWrapper>
      <StepTitle variant="h4">Waiting for account creation</StepTitle>
    </StepWrapper>
  )
}

const TermsStep = () => {
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
      <CheckboxWrapper>
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
      </CheckboxWrapper>
    </StepWrapper>
  )
}

export { ExtensionStep, AccountStep, TermsStep }
