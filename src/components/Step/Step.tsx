import React, { forwardRef, useEffect, useState } from 'react'

import { CircularProgress } from '@/components/CircularProgress'
import { SvgActionCheck, SvgActionLock, SvgActionTrash } from '@/components/_icons'

import {
  Overhead,
  ProgressContainer,
  StepDetails,
  StepNumber,
  StepStatus,
  StepTitle,
  StepType,
  StepWrapper,
} from './Step.styles'

import { Text } from '../Text'
import { IconButton } from '../_buttons/IconButton'

export type StepProps = {
  title: string
  variant?: 'file' | 'default'
  stepType?: StepType
  isLoading?: boolean
  disabled?: boolean
  number?: number
  onDelete?: () => void
  className?: string
}

export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ variant = 'default', isLoading, disabled, title, number, onDelete, className, stepType = 'current' }, ref) => {
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
      <StepWrapper aria-disabled={disabled} stepType={stepType} variant={variant} ref={ref} className={className}>
        <StepStatus>
          {isLoading ? (
            <ProgressContainer>
              <CircularProgress value={circularProgress} maxValue={100} />
            </ProgressContainer>
          ) : (
            <StepNumber stepType={stepType}>
              {stepType === 'completed' || disabled ? (
                <SvgActionCheck />
              ) : (
                <Text variant="t200" secondary={stepType === 'future'}>
                  {number}
                </Text>
              )}
            </StepNumber>
          )}
          <StepDetails>
            <Overhead variant="t100" secondary>
              Step {number}
            </Overhead>
            <StepTitle variant="t100-strong">{title}</StepTitle>
          </StepDetails>
        </StepStatus>
        {((onDelete && stepType === 'completed' && !isLoading) || disabled) && (
          <IconButton variant="tertiary" disabled={disabled} onClick={() => !disabled && onDelete?.()}>
            {disabled ? <SvgActionLock /> : <SvgActionTrash />}
          </IconButton>
        )}
      </StepWrapper>
    )
  }
)
Step.displayName = 'Step'
