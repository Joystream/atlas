import { forwardRef, useEffect, useState } from 'react'

import { CircularProgress } from '@/components/CircularProgress'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionCheck, SvgActionLock, SvgActionTrash } from '@/components/_icons'

import {
  Overhead,
  ProgressContainer,
  StepDetails,
  StepNumber,
  StepStatus,
  StepTitle,
  StepType,
  StepVariant,
  StepWrapper,
} from './Step.styles'

export type StepProps = {
  title: string
  variant?: StepVariant
  type?: StepType
  isLoading?: boolean
  disabled?: boolean
  number?: number
  onDelete?: () => void
  className?: string
  showOtherStepsOnMobile?: boolean
}

export const Step = forwardRef<HTMLDivElement, StepProps>(
  (
    {
      type = 'default',
      isLoading,
      disabled,
      title,
      number,
      onDelete,
      className,
      variant = 'current',
      showOtherStepsOnMobile,
    },
    ref
  ) => {
    const [circularProgress, setCircularProgress] = useState(0)

    useEffect(() => {
      if (!isLoading) {
        setCircularProgress(0)
        return
      }
      const timeout = setTimeout(() => {
        setCircularProgress(circularProgress + 20)
      }, 50)

      return () => clearTimeout(timeout)
    }, [circularProgress, isLoading])

    return (
      <StepWrapper
        aria-disabled={disabled}
        stepVariant={variant}
        stepType={type}
        ref={ref}
        className={className}
        showOtherStepsOnMobile={showOtherStepsOnMobile}
      >
        <StepStatus>
          {isLoading ? (
            <ProgressContainer>
              <CircularProgress value={circularProgress} maxValue={100} />
            </ProgressContainer>
          ) : (
            <StepNumber stepVariant={variant}>
              {variant === 'completed' || disabled ? (
                <SvgActionCheck />
              ) : (
                <Text as="span" variant="t200">
                  {number}
                </Text>
              )}
            </StepNumber>
          )}
          <StepDetails>
            <Overhead as="span" variant="t100" color="default">
              Step {number}
            </Overhead>
            <StepTitle as="span" variant="t100-strong" color={variant !== 'current' ? 'default' : undefined}>
              {title}
            </StepTitle>
          </StepDetails>
        </StepStatus>
        {((onDelete && variant === 'completed' && !isLoading) || disabled) && (
          <Button
            icon={disabled ? <SvgActionLock /> : <SvgActionTrash />}
            variant="tertiary"
            disabled={disabled}
            onClick={() => !disabled && onDelete?.()}
          />
        )}
      </StepWrapper>
    )
  }
)

export const getStepVariant = (currentStepIdx: number, idx: number) => {
  if (currentStepIdx === idx) {
    return 'current'
  }
  if (currentStepIdx > idx) {
    return 'completed'
  }
  return 'future'
}

Step.displayName = 'Step'
