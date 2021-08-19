import React, { useEffect, useState } from 'react'

import { SvgGlyphCheck, SvgGlyphFileVideo, SvgGlyphLock, SvgGlyphTrash } from '@/shared/icons'

import {
  FileName,
  Overhead,
  StepDetails,
  StepNumber,
  StepStatus,
  StepWrapper,
  StyledChevron,
  StyledProgress,
  Thumbnail,
} from './Stepper.styles'

import { IconButton } from '../IconButton'

export type StepperProps = {
  title: string
  variant?: 'file' | 'default'
  completed?: boolean
  withChevron?: boolean
  isFilled?: boolean
  thumbnailUrl?: string | null
  isLoading?: boolean
  isFileSet?: boolean
  type?: 'video' | 'image'
  disabled?: boolean
  active?: boolean
  onClick?: () => void
  onDelete?: () => void
  number?: number
}
export const Stepper: React.FC<StepperProps> = ({
  variant = 'default',
  withChevron,
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
  const defaultVariant = variant === 'default'
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
    <StepWrapper aria-disabled={disabled} active={active} onClick={onClick} fileVariant={variant === 'file'}>
      <StepStatus>
        {!isFileSet && <StepNumber active={active}>{completed ? <SvgGlyphCheck /> : number}</StepNumber>}
        {isFileSet &&
          (isLoading ? (
            <StyledProgress value={circularProgress} maxValue={100} />
          ) : (
            <Thumbnail>
              {type === 'video' && <SvgGlyphFileVideo />}
              {type === 'image' && thumbnailUrl && <img src={thumbnailUrl} alt="thumbnail" />}
            </Thumbnail>
          ))}
        <StepDetails>
          <Overhead variant="caption" secondary>
            Step {number}
          </Overhead>
          <FileName variant="overhead">{title}</FileName>
        </StepDetails>
      </StepStatus>
      {defaultVariant && withChevron && <StyledChevron />}
      {fileVariant && isFileSet && (
        <IconButton variant="tertiary" disabled={disabled} onClick={onDelete}>
          {disabled ? <SvgGlyphLock /> : <SvgGlyphTrash />}
        </IconButton>
      )}
    </StepWrapper>
  )
}
