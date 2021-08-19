import React, { useEffect, useState } from 'react'

import { SvgGlyphCheck, SvgGlyphFileVideo, SvgGlyphLock, SvgGlyphTrash } from '@/shared/icons'

import {
  Overhead,
  StepDetails,
  StepImage,
  StepNumber,
  StepStatus,
  StepTitle,
  StepWrapper,
  StyledProgress,
} from './Stepper.styles'

import { IconButton } from '../IconButton'

export type StepperProps = {
  title: string
  variant?: 'file' | 'default'
  completed?: boolean
  thumbnailUrl?: string | null
  isLoading?: boolean
  type?: 'video' | 'image'
  isFileSet?: boolean
  disabled?: boolean
  active?: boolean
  number?: number
  onClick?: () => void
  onDelete?: () => void
}
export const Stepper: React.FC<StepperProps> = ({
  variant = 'default',
  thumbnailUrl,
  isLoading,
  type,
  disabled,
  active,
  completed,
  onClick,
  title,
  number,
  isFileSet,
  onDelete,
}) => {
  const fileVariant = variant === 'file'

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
        {!isFileSet && <StepNumber active={active}>{completed ? <SvgGlyphCheck /> : number}</StepNumber>}
        {isFileSet &&
          (isLoading ? (
            <StyledProgress value={circularProgress} maxValue={100} />
          ) : (
            <StepImage>
              {type === 'video' && <SvgGlyphFileVideo />}
              {type === 'image' && thumbnailUrl && <img src={thumbnailUrl} alt="thumbnail" />}
            </StepImage>
          ))}
        <StepDetails>
          <Overhead variant="caption" secondary>
            Step {number}
          </Overhead>
          <StepTitle variant="overhead">{title}</StepTitle>
        </StepDetails>
      </StepStatus>
      {fileVariant && isFileSet && (
        <IconButton variant="tertiary" disabled={disabled} onClick={() => !disabled && onDelete?.()}>
          {disabled ? <SvgGlyphLock /> : <SvgGlyphTrash />}
        </IconButton>
      )}
    </StepWrapper>
  )
}
