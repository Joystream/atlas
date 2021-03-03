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
  TrashIcon,
  Thumbnail,
  StyledProgress,
} from './FileStep.style'
import { Step } from './MultiFileSelect'

type FileStepProps = {
  stepNumber: number
  active: boolean
  file: File | null
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  step: Step
  thumbnail?: string
  onChangeStep?: (step: Step) => void
  overhead?: string
  subtitle?: string
  progress?: number
}

const FileStep: React.FC<FileStepProps> = ({
  stepNumber,
  active,
  file,
  step,
  onDelete,
  thumbnail,
  onChangeStep,
  overhead,
  subtitle,
  progress = 0,
}) => {
  return (
    <StepWrapper active={active} onClick={() => onChangeStep?.(step)}>
      <StepStatus>
        {!file && <StepNumber active={active}>{stepNumber}</StepNumber>}
        {file &&
          (progress ? (
            <StyledProgress value={progress} maxValue={80} />
          ) : (
            <Thumbnail>
              {step === 'video' && <Icon name="video-camera" />}
              {step === 'image' && thumbnail && <img src={thumbnail} alt="thumbnail"></img>}
            </Thumbnail>
          ))}
        <StepDetails>
          <FileType variant="overhead">{file ? overhead : `Step ${stepNumber}`}</FileType>
          <FileName variant="subtitle2">{file ? file.name : subtitle}</FileName>
        </StepDetails>
      </StepStatus>
      {file && (
        <DeleteButton onClick={onDelete}>
          <TrashIcon name="trash-fill" />
        </DeleteButton>
      )}
    </StepWrapper>
  )
}

export default FileStep
