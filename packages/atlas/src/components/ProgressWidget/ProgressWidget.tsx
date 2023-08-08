import { ReactNode, useRef, useState } from 'react'

import {
  SvgActionCheck,
  SvgActionChevronB,
  SvgActionChevronL,
  SvgActionChevronR,
  SvgActionChevronT,
  SvgActionPlay,
} from '@/assets/icons'
import { Carousel, SwiperInstance } from '@/components/Carousel'
import {
  ColumnBox,
  DetailsDrawer,
  DropdownContainer,
  Header,
  MainWrapper,
  ProgressBar,
  RowBox,
  StepCardContainer,
  StepNumber,
} from '@/components/ProgressWidget/ProgressWidget.styles'
import { Text } from '@/components/Text'
import { Button, ButtonProps } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { getProgressPercentage, responsive } from './ProgressWidget.utils'

type StepButtonProps = {
  text: string
} & Omit<ButtonProps, 'children'>

type StepProps = {
  title: string
  description: string
  primaryButton: StepButtonProps
}

export type ProgressWidgetProps = {
  steps: StepProps[]
  activeStep: number
  goalComponent: ReactNode
}

export const ProgressWidget = ({ steps, activeStep, goalComponent }: ProgressWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [glider, setGlider] = useState<SwiperInstance | null>(null)
  const drawer = useRef<HTMLDivElement>(null)
  const xsMatch = useMediaMatch('xs')
  const smMatch = useMediaMatch('sm')
  const isDone = activeStep + 1 > steps.length
  return (
    <MainWrapper>
      <Header progressWidth={isVisible ? '0%' : `${getProgressPercentage(activeStep, steps.length)}%`}>
        <RowBox gap={4}>
          <Text variant="h500" as="h5">
            Your progress
          </Text>
          {!isVisible && (
            <Text variant="t200-strong" as="p">
              ({isDone ? steps.length : activeStep}/{steps.length})
            </Text>
          )}
        </RowBox>
        {xsMatch && (
          <Button
            onClick={() => setIsVisible((prev) => !prev)}
            icon={isVisible ? <SvgActionChevronT /> : <SvgActionChevronB />}
            iconPlacement="right"
            variant="tertiary"
          >
            {isVisible ? 'Show less' : 'Show more'}
          </Button>
        )}
      </Header>
      <DetailsDrawer isActive={isVisible} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        <DropdownContainer>
          <RowBox gap={12}>
            <ExtendedProgressBar
              activeStep={steps[isDone ? steps.length - 1 : activeStep]}
              activeStepNumber={activeStep}
              totalSteps={steps.length}
              goalComponent={goalComponent}
            />
            {smMatch && (
              <RowBox gap={4}>
                <Button icon={<SvgActionChevronL />} onClick={() => glider?.slidePrev()} variant="secondary" />
                <Button icon={<SvgActionChevronR />} onClick={() => glider?.slideNext()} variant="secondary" />
              </RowBox>
            )}
          </RowBox>
          <Carousel
            initialSlide={activeStep + 1}
            spaceBetween={12}
            navigation
            dotsVisible
            breakpoints={responsive}
            onSwiper={(swiper) => setGlider(swiper)}
          >
            {steps.map((step, idx) => (
              <StepCard
                key={step.title}
                step={step}
                status={idx === activeStep ? 'active' : idx < activeStep ? 'done' : 'next'}
                stepNumber={idx + 1}
              />
            ))}
          </Carousel>
        </DropdownContainer>
      </DetailsDrawer>
    </MainWrapper>
  )
}
type ExtendedProgressBarProps = {
  activeStep: StepProps
  activeStepNumber: number
  totalSteps: number
  goalComponent: ReactNode
}
const ExtendedProgressBar = ({ activeStep, activeStepNumber, totalSteps, goalComponent }: ExtendedProgressBarProps) => {
  const isDone = activeStepNumber + 1 > totalSteps

  return (
    <ColumnBox gap={2}>
      <Text variant="t300-strong" as="p">
        {activeStep.title}
      </Text>
      <RowBox gap={4}>
        <ProgressBar progress={getProgressPercentage(activeStepNumber, totalSteps)} />
        <Text variant="t200-strong" as="p">
          {isDone ? totalSteps : activeStepNumber}/{totalSteps}
        </Text>
      </RowBox>
      {goalComponent}
    </ColumnBox>
  )
}

type StepCardProps = {
  step: StepProps
  status: 'active' | 'done' | 'next'
  stepNumber: number
}

const StepCard = ({ step, status, stepNumber }: StepCardProps) => {
  const smMatch = useMediaMatch('xs')

  return (
    <StepCardContainer isActive={status === 'active'}>
      <StepNumber className="step-number">
        <Text variant="t200-strong" as="p">
          {status === 'done' ? <SvgActionCheck /> : stepNumber}
        </Text>
      </StepNumber>
      <ColumnBox gap={2}>
        <Text variant="h300" as="h3">
          {step.title}
        </Text>
        <Text variant="t200" as="p">
          {step.description}
        </Text>
      </ColumnBox>

      <RowBox gap={4} wrap>
        <Button
          {...step.primaryButton}
          variant={status === 'active' ? 'primary' : 'secondary'}
          disabled={status === 'done'}
          fullWidth={!smMatch}
        >
          {step.primaryButton.text}
        </Button>
        <Button variant="tertiary" fullWidth={!smMatch} _textOnly icon={<SvgActionPlay />} iconPlacement="right">
          Learn more
        </Button>
      </RowBox>
    </StepCardContainer>
  )
}
