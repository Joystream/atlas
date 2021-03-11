import { FileType } from '@/types/files'
import React from 'react'
import Icon from '../Icon'
import {
  StepWrapper,
  StepStatus,
  StepNumber,
  StepDetails,
  DeleteButton,
  Overhead,
  FileName,
  Thumbnail,
  StyledProgress,
} from './FileStep.style'

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
              {step === 'video' && <Icon name="video-camera" />}
              {step === 'image' && thumbnail && <img src={thumbnail} alt="thumbnail"></img>}
            </Thumbnail>
          ))}
        <StepDetails>
          <Overhead variant="overhead">{fileName ? overhead : `Step ${stepNumber}`}</Overhead>
          <FileName variant="subtitle2">{fileName || subtitle}</FileName>
        </StepDetails>
      </StepStatus>
      {fileName && (
        <DeleteButton
          variant="tertiary"
          disabled={disabled}
          onClick={onDelete}
          icon={disabled ? 'padlock' : 'trash-fill'}
        />
      )}
    </StepWrapper>
  )
}

export default FileStep
