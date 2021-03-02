import React from 'react'
import Icon from '../Icon'
import {
  Step,
  StepStatus,
  StepNumber,
  StepDetails,
  DeleteButton,
  FileType,
  FileName,
  TrashIcon,
  Thumbnail,
} from './FileStep.style'

type FileStepProps = {
  step: number
  active: boolean
  file: File | null
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type: 'video' | 'image'
  loading?: boolean
  thumbnailImage?: string
}

const FileStep: React.FC<FileStepProps> = ({ step, active, file, type, onDelete, thumbnailImage }) => {
  const overhead = type === 'video' ? 'Video File' : 'Thumbnail Image'
  const subtitle = type === 'video' ? 'Select Video File' : 'Add Thumbnail Image'
  return (
    <Step active={active}>
      <StepStatus>
        {!file && <StepNumber active={active}>{step}</StepNumber>}
        {file && (
          <Thumbnail>
            {type === 'video' && <Icon name="play-small" />}
            {type === 'image' && thumbnailImage && <img src={thumbnailImage} alt="thumbnail"></img>}
          </Thumbnail>
        )}
        <StepDetails>
          <FileType variant="overhead">{file ? overhead : `Step ${step}`}</FileType>
          <FileName variant="subtitle2">{file ? file.name : subtitle}</FileName>
        </StepDetails>
      </StepStatus>
      {file && (
        <DeleteButton onClick={onDelete}>
          <TrashIcon name="trash-fill" />
        </DeleteButton>
      )}
    </Step>
  )
}

export default FileStep
