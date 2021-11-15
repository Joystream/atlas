import React, { forwardRef, useEffect, useState } from 'react'

import { CircularProgress } from '@/components/CircularProgress'
import { SvgGlyphCheck, SvgGlyphLock, SvgGlyphTrash } from '@/components/_icons'

import { Overhead, ProgressContainer, StepDetails, StepNumber, StepStatus, StepTitle, StepWrapper } from './Step.styles'

import { IconButton } from '../_buttons/IconButton'

export type StepProps = {
  title: string
  variant?: 'file' | 'default'
  completed?: boolean
  isLoading?: boolean
  disabled?: boolean
  active?: boolean
  number?: number
  onDelete?: () => void
  className?: string
}
export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ variant = 'default', isLoading, disabled, active, completed, title, number, onDelete, className }, ref) => {
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
      <StepWrapper aria-disabled={disabled} active={active} variant={variant} ref={ref} className={className}>
        <StepStatus>
          {isLoading ? (
            <ProgressContainer>
              <CircularProgress value={circularProgress} maxValue={100} />
            </ProgressContainer>
          ) : (
            <StepNumber active={completed}>{completed || disabled ? <SvgGlyphCheck /> : number}</StepNumber>
          )}
          <StepDetails>
            <Overhead variant="caption" secondary>
              Step {number}
            </Overhead>
            <StepTitle variant="overhead">{title}</StepTitle>
          </StepDetails>
        </StepStatus>
        {((onDelete && completed && !isLoading) || disabled) && (
          <IconButton variant="tertiary" disabled={disabled} onClick={() => !disabled && onDelete?.()}>
            {disabled ? <SvgGlyphLock /> : <SvgGlyphTrash />}
          </IconButton>
        )}
      </StepWrapper>
    )
  }
)
Step.displayName = 'Step'
