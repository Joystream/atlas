import React, { useCallback, useState } from 'react'
import Button from '../Button'
import {
  ButtonsGroup,
  DragAndDropContainer,
  DragAndDropArea,
  InnerContainer,
  Paragraph,
  StyledIcon,
  Title,
  StepsContainer,
  Step,
  StepStatus,
  StepNumber,
  StepDetails,
  DeleteButton,
  FileType,
  FileName,
  TrashIcon,
  StepDivider,
  Thumbnail,
  ProgressBar,
} from './MultiFileSelect.style'
import { useDropzone, DropzoneOptions } from 'react-dropzone'
import Icon from '../Icon'
import { image } from 'faker'

const MultiFileSelect = () => {
  const [files, setFiles] = useState<File[]>([])
  const [fileUploaded, setFileUploaded] = useState(false)

  const onDropAccepted: DropzoneOptions['onDropAccepted'] = useCallback((acceptedFiles) => {
    // Do something with the files
    setFileUploaded(true)
    setTimeout(() => {
      setFileUploaded(false)
    }, 900)
  }, [])
  const onDropRejected: DropzoneOptions['onDropRejected'] = useCallback((acceptedFiles) => {
    console.log('wrong file type')
  }, [])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isFileDialogActive,
    isDragReject,
    acceptedFiles,
    draggedFiles,
    isFocused,
  } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: 'video/*',
    maxFiles: 1,
    multiple: false,
  })
  const loaded = false
  const isMovie = true
  return (
    <DragAndDropContainer>
      <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
        <ProgressBar fileUploaded={fileUploaded} />
        <InnerContainer>
          <StyledIcon name="video-dnd" />
          <Title variant="h5">Select Video File</Title>
          <Paragraph variant="subtitle2" as="p">
            16:9 Ratio preferred. 4K, 1440p, 1080p or 720p. This is example FPO data only.
          </Paragraph>
          <ButtonsGroup>
            <span>Drag and drop or </span>
            <input {...getInputProps()} />
            <Button>Select a file</Button>
          </ButtonsGroup>
        </InnerContainer>
      </DragAndDropArea>
      <StepsContainer>
        <Step>
          <StepStatus>
            <StepNumber>1</StepNumber>
            <Thumbnail>{isMovie ? <Icon name="play-small" /> : <img src="" alt="" />}</Thumbnail>
            <StepDetails>
              <FileType variant="overhead">Video file</FileType>
              <FileName variant="subtitle2">Bla bla.mov</FileName>
            </StepDetails>
          </StepStatus>
          <DeleteButton>
            <TrashIcon name="trash-fill" />
          </DeleteButton>
        </Step>
        <StepDivider>
          <Icon name="chevron-right"></Icon>
        </StepDivider>
        <Step>
          <StepStatus>
            <StepNumber>2</StepNumber>
            <StepDetails>
              <FileType variant="overhead">Video file</FileType>
              <FileName variant="subtitle2">Bla bla.mov</FileName>
            </StepDetails>
          </StepStatus>
          <DeleteButton>
            <TrashIcon name="trash-fill" />
          </DeleteButton>
        </Step>
      </StepsContainer>
    </DragAndDropContainer>
  )
}

export default MultiFileSelect
