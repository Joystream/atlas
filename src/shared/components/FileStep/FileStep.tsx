import React from 'react'
import Icon from '../Icon'
import {
  StepWrapper,
  StepStatus,
  StepNumber,
  StepDetails,
  DeleteButton,
  FileType,
  FileName,
  Thumbnail,
  StyledProgress,
} from './FileStep.style'
import { Step } from '../MultiFileSelect'

export type FileStepProps = {
  stepNumber: number
  active: boolean
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  step: Step
  fileName?: string
  thumbnail?: string | null
  onSelect?: (step: Step) => void
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
          <FileType variant="overhead">{fileName ? overhead : `Step ${stepNumber}`}</FileType>
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
