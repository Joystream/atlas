import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionCheck, SvgActionChevronR } from '@/assets/icons'
import { Text } from '@/components/Text'
import { transitions } from '@/styles'

import {
  Container,
  RequiredText,
  Step,
  StepInnerContainer,
  StepState,
  StepsContainer,
  TitleContainer,
} from './ProgressDrawer.styles'

export type Step = { title: string; onClick: () => void; completed: boolean; required?: boolean }
export type ProgressDrawerProps = {
  steps: Step[]
  className?: string
}
export const ProgressDrawer: FC<ProgressDrawerProps> = ({ steps, className }) => {
  const stepsCompletedNumber = steps.filter(({ completed }) => completed).length

  return (
    <Container className={className}>
      <TitleContainer>
        <Text variant="h200" as="p">
          Progress
        </Text>
        <Text variant="t200" as="p">
          {stepsCompletedNumber}/{steps.length}
        </Text>
      </TitleContainer>
      <StepsContainer>
        {steps.map((step, idx) => (
          <Step completed={step.completed} key={step.title + idx} onClick={() => !step.completed && step.onClick()}>
            <StepInnerContainer>
              <StepState completed={step.completed}>
                <SwitchTransition mode="out-in">
                  <CSSTransition
                    key={step.completed ? 'done' : 'not-yet'}
                    in={step.completed}
                    timeout={100}
                    classNames={transitions.names.fade}
                  >
                    {step.completed ? <SvgActionCheck /> : <span>{step.completed ? null : idx + 1}</span>}
                  </CSSTransition>
                </SwitchTransition>
              </StepState>
              <Text as="span" variant="t200">
                {step.title}
                {step.required && (
                  <RequiredText as="span" variant="t300" color="colorTextError">
                    *
                  </RequiredText>
                )}
              </Text>
            </StepInnerContainer>
            <CSSTransition in={!step.completed} timeout={100} classNames={transitions.names.fade} unmountOnExit>
              <SvgActionChevronR />
            </CSSTransition>
          </Step>
        ))}
      </StepsContainer>
    </Container>
  )
}
