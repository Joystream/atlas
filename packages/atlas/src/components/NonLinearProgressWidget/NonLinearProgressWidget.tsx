import { ReactNode, useRef, useState } from 'react'

import {
  SvgActionCheck,
  SvgActionChevronB,
  SvgActionChevronL,
  SvgActionChevronR,
  SvgActionChevronT,
  SvgActionClose,
} from '@/assets/icons'
import { Carousel, SwiperInstance } from '@/components/Carousel'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useMediaMatch } from '@/hooks/useMediaMatch'

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
} from './NonLinearProgressWidget.styles'
import { getProgressPercentage, responsive } from './NonLinearProgressWidget.utils'

type StepProps = {
  title: string
  description: string
  finished?: boolean
}

export type NonLinearProgressWidgetProps = {
  steps: StepProps[]
  activeStep: number
  header: string
  goalComponent: ReactNode
  renderCurrentStepActionButton: (step: number) => ReactNode
  onClose?: () => void
}

export const NonLinearProgressWidget = ({
  header,
  steps,
  activeStep,
  goalComponent,
  renderCurrentStepActionButton,
  onClose,
}: NonLinearProgressWidgetProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const debouncedVisible = useDebounceValue(isVisible, 100)
  const [glider, setGlider] = useState<SwiperInstance | null>(null)
  const drawer = useRef<HTMLDivElement>(null)
  const xsMatch = useMediaMatch('xs')
  const smMatch = useMediaMatch('sm')
  const isDone = activeStep + 1 > steps.length
  const numberOfFinishedSteps = steps.filter((step) => step.finished).length

  return (
    <MainWrapper>
      <Header progressWidth={debouncedVisible ? '0%' : `${getProgressPercentage(activeStep, steps.length)}%`}>
        <RowBox gap={4}>
          <Text variant="h500" as="h5">
            Your progress
          </Text>
          {!isVisible && (
            <Text variant="t200-strong" as="p">
              ({isDone ? steps.length : numberOfFinishedSteps}/{steps.length})
            </Text>
          )}
        </RowBox>
        <FlexBox width="auto" gap={2} alignItems="center">
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
          {onClose && <Button onClick={onClose} icon={<SvgActionClose />} variant="secondary" />}
        </FlexBox>
      </Header>
      <DetailsDrawer isActive={isVisible} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        <DropdownContainer>
          <RowBox gap={12}>
            <ExtendedProgressBar
              header={header}
              activeStep={steps[isDone ? steps.length - 1 : activeStep]}
              activeStepNumber={numberOfFinishedSteps}
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
                status={idx === activeStep ? 'active' : step.finished ? 'done' : 'next'}
                stepNumber={idx + 1}
                button={renderCurrentStepActionButton(idx)}
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
  header: string
}
const ExtendedProgressBar = ({ activeStepNumber, totalSteps, goalComponent, header }: ExtendedProgressBarProps) => {
  const isDone = activeStepNumber + 1 > totalSteps

  return (
    <ColumnBox gap={2}>
      <Text variant="t300-strong" as="p">
        {header}
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
  button: ReactNode
}

const StepCard = ({ step, status, stepNumber, button }: StepCardProps) => {
  // const smMatch = useMediaMatch('xs')

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
        {button}
        {/*<Button variant="tertiary" fullWidth={!smMatch} _textOnly icon={<SvgActionPlay />} iconPlacement="right">*/}
        {/*  Learn more*/}
        {/*</Button>*/}
      </RowBox>
    </StepCardContainer>
  )
}
