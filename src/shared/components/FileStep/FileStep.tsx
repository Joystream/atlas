import { FileType } from '@/types/files'
import React, { useEffect, useState } from 'react'
import {
  StepWrapper,
  StepStatus,
  StepNumber,
  StepDetails,
  Overhead,
  FileName,
  Thumbnail,
  StyledProgress,
} from './FileStep.style'
import { IconButton } from '@/shared/components'
import { SvgGlyphFileVideo, SvgGlyphLock, SvgGlyphTrash } from '@/shared/icons'
import { CSSTransition } from 'react-transition-group'

export type FileStepProps = {
  stepNumber: number
  active: boolean
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type: FileType
  isFileSet?: boolean
  thumbnailUrl?: string | null
  onSelect?: (step: FileType) => void
  disabled?: boolean
  isLoading?: boolean
}

const FileStep: React.FC<FileStepProps> = ({
  stepNumber = 1,
  active,
  isFileSet,
  type,
  onDelete,
  thumbnailUrl,
  onSelect,
  isLoading,
  disabled,
}) => {
  const handleChangeStep = () => {
    !disabled && onSelect?.(type)
  }
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

  const stepSubtitle =
    type === 'video'
      ? isFileSet
        ? 'Video file'
        : 'Add video file'
      : isFileSet
      ? 'Thumbnail image'
      : 'Add thumbnail image'

  return (
    <StepWrapper aria-disabled={disabled} active={active} onClick={handleChangeStep}>
      <StepStatus>
        {!isFileSet && <StepNumber active={active}>{stepNumber}</StepNumber>}
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
          <Overhead variant="overhead">Step {stepNumber}</Overhead>
          <FileName variant="subtitle2">{stepSubtitle}</FileName>
        </StepDetails>
      </StepStatus>
      {isFileSet && (
        <IconButton variant="tertiary" disabled={disabled} onClick={onDelete}>
          {disabled ? <SvgGlyphLock /> : <SvgGlyphTrash />}
        </IconButton>
      )}
    </StepWrapper>
  )
}

export default FileStep
