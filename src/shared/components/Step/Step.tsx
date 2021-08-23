import React, { useEffect, useState } from 'react'

import { SvgGlyphCheck, SvgGlyphLock, SvgGlyphTrash } from '@/shared/icons'

import {
  Overhead,
  StepDetails,
  StepImage,
  StepNumber,
  StepStatus,
  StepTitle,
  StepWrapper,
  StyledProgress,
} from './Step.styles'

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
}
export const Step: React.FC<StepProps> = ({
  variant = 'default',
  isLoading,
  disabled,
  active,
  completed,
  onClick,
  title,
  number,
  stepPlaceholder,
  onDelete,
}) => {
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
    <StepWrapper aria-disabled={disabled} active={active} onClick={() => !disabled && onClick?.()} variant={variant}>
      <StepStatus>
        {isLoading ? (
          <StyledProgress value={circularProgress} maxValue={100} />
        ) : stepPlaceholder ? (
          <StepImage>{stepPlaceholder}</StepImage>
        ) : (
          <StepNumber active={active}>{completed ? <SvgGlyphCheck /> : number}</StepNumber>
        )}
        <StepDetails>
          <Overhead variant="caption" secondary>
            Step {number}
          </Overhead>
          <StepTitle variant="overhead">{title}</StepTitle>
        </StepDetails>
      </StepStatus>
      {onDelete && completed && !isLoading && (
        <IconButton variant="tertiary" disabled={disabled} onClick={() => !disabled && onDelete()}>
          {disabled ? <SvgGlyphLock /> : <SvgGlyphTrash />}
        </IconButton>
      )}
    </StepWrapper>
  )
}
