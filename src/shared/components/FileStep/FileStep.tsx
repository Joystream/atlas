import { FileType } from '@/types/files'
import React from 'react'
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

export type FileStepProps = {
  stepNumber: number
  active: boolean
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  step: FileType
  fileName?: string
  thumbnail?: string | null
  onSelect?: (step: FileType) => void
  overhead?: string
  subtitle?: string
  progress?: number
  disabled?: boolean
}

const FileStep: React.FC<FileStepProps> = ({
  stepNumber = 1,
  active,
  fileName,
  step,
  onDelete,
  thumbnail,
  onSelect,
  overhead,
  subtitle,
  progress = 0,
  disabled,
}) => {
  const handleChangeStep = () => {
    !disabled && onSelect?.(step)
  }
  return (
    <StepWrapper aria-disabled={disabled} active={active} onClick={handleChangeStep}>
      <StepStatus>
        {!fileName && <StepNumber active={active}>{stepNumber}</StepNumber>}
        {fileName &&
          (progress ? (
            <StyledProgress value={progress} maxValue={80} />
          ) : (
            <Thumbnail>
              {step === 'video' && <SvgGlyphFileVideo />}
              {step === 'image' && thumbnail && <img src={thumbnail} alt="thumbnail" />}
            </Thumbnail>
          ))}
        <StepDetails>
          <Overhead variant="overhead">{fileName ? overhead : `Step ${stepNumber}`}</Overhead>
          <FileName variant="subtitle2">{fileName || subtitle}</FileName>
        </StepDetails>
      </StepStatus>
      {fileName && (
        <IconButton variant="tertiary" disabled={disabled} onClick={onDelete}>
          {disabled ? <SvgGlyphLock /> : <SvgGlyphTrash />}
        </IconButton>
      )}
    </StepWrapper>
  )
}

export default FileStep
