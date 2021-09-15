import React, { forwardRef, useEffect, useState } from 'react'

import { SvgGlyphCheck, SvgGlyphLock, SvgGlyphTrash } from '@/shared/icons'

import { Overhead, StepDetails, StepNumber, StepStatus, StepTitle, StepWrapper, StyledProgress } from './Step.styles'

import { IconButton } from '../IconButton'

export type StepProps = {
  title: string
  variant?: 'file' | 'default'
  completed?: boolean
  thumbnailUrl?: string | null
  isLoading?: boolean
  disabled?: boolean
  active?: boolean
  number?: number
  stepPlaceholder?: React.ReactNode
  onClick?: () => void
  onDelete?: () => void
  clickable?: boolean
}
export const Step = forwardRef<HTMLDivElement, StepProps>(
  (
    { variant = 'default', isLoading, disabled, active, completed, onClick, title, number, onDelete, clickable = true },
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
        active={active}
        onClick={() => !disabled && clickable && onClick?.()}
        variant={variant}
        ref={ref}
      >
        <StepStatus>
          {isLoading ? (
            <StyledProgress value={circularProgress} maxValue={100} />
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
