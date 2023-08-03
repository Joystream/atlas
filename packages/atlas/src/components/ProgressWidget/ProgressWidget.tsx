import { useRef, useState } from 'react'

import {
  SvgActionChevronB,
  SvgActionChevronL,
  SvgActionChevronR,
  SvgActionChevronT,
  SvgActionPlay,
} from '@/assets/icons'
import { Carousel } from '@/components/Carousel'
import {
  ColumnBox,
  DetailsDrawer,
  DropdownContainer,
  Header,
  ProgressBar,
  RowBox,
  StepCardContainer,
  StepNumber,
} from '@/components/ProgressWidget/ProgressWidget.styles'
import { Text } from '@/components/Text'
import { Button, ButtonProps, TextButton } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

type StepButtonProps = {
  text: string
} & Omit<ButtonProps, 'children'>

type StepProps = {
  title: string
  description: string
  primaryButton: StepButtonProps
}

const step = {
  title: 'Write blblblba',
  description: 'Long description ahahabebeb',
  primaryButton: {
    text: 'Write to me!',
  },
}

export const ProgressWidget = () => {
  const [isVisible, setIsVisible] = useState(false)
  const drawer = useRef<HTMLDivElement>(null)
  const xsMatch = useMediaMatch('xs')
  const smMatch = useMediaMatch('sm')
  console.log(drawer.current?.scrollHeight, 'xd')
  return (
    <div style={{ position: 'relative' }}>
      <Header progressWidth={isVisible ? '0%' : '25%'}>
        <RowBox gap={4}>
          <Text variant="h500" as="h5">
            Your progress
          </Text>
          {!isVisible && (
            <Text variant="t200-strong" as="p">
              (1/4)
            </Text>
          )}
        </RowBox>
        <RowBox gap={2} onClick={() => setIsVisible((prev) => !prev)}>
          {xsMatch && (
            <Text variant="t200-strong" as="p">
              {isVisible ? 'Show less' : 'Show more'}
            </Text>
          )}
          {isVisible ? <SvgActionChevronT /> : <SvgActionChevronB />}
        </RowBox>
      </Header>
      <DetailsDrawer isActive={isVisible} ref={drawer} maxHeight={drawer?.current?.scrollHeight}>
        <DropdownContainer>
          <RowBox gap={12}>
            <ExtendedProgressBar />
            {smMatch && (
              <RowBox gap={4}>
                <Button icon={<SvgActionChevronL />} variant="secondary" />
                <Button icon={<SvgActionChevronR />} variant="secondary" />
              </RowBox>
            )}
          </RowBox>
          <Carousel slidesPerView={3} spaceBetween={12} navigation dotsVisible>
            <StepCard step={step} isActive={true} />
            <StepCard step={step} isActive={true} />
            <StepCard step={step} isActive={true} />
            <StepCard step={step} isActive={true} />
          </Carousel>
        </DropdownContainer>
      </DetailsDrawer>
    </div>
  )
}

const ExtendedProgressBar = () => {
  return (
    <ColumnBox gap={2}>
      <Text variant="t300-strong" as="p">
        Token owner
      </Text>
      <RowBox gap={4}>
        <ProgressBar progress={60} />
        <Text variant="t200-strong" as="p">
          1/4
        </Text>
      </RowBox>
      <RowBox gap={2} style={{ flexWrap: 'wrap' }}>
        <Text variant="t200" as="p">
          Complete 2 more steps to achive
        </Text>
        <TextButton>Token master</TextButton>
      </RowBox>
    </ColumnBox>
  )
}

type StepCardProps = {
  step: StepProps
  isActive: boolean
}

const StepCard = ({ step, isActive }: StepCardProps) => {
  return (
    <StepCardContainer isActive={isActive}>
      <StepNumber>
        <Text variant="t200-strong" as="p">
          2
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

      <RowBox gap={4}>
        <Button {...step.primaryButton}>{step.primaryButton.text}</Button>
        <Button variant="tertiary" _textOnly icon={<SvgActionPlay />} iconPlacement="right">
          Learn more
        </Button>
      </RowBox>
    </StepCardContainer>
  )
}
