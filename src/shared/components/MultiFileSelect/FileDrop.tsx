import React, { useCallback, useRef, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { Step } from './MultiFileSelect'
import Button from '../Button'
import Icon from '../Icon'
import {
  ButtonsGroup,
  DragAndDropArea,
  InnerContainer,
  Paragraph,
  StyledIcon,
  Title,
  ProgressBar,
  ErrorContainer,
  ErrorText,
  DismissButton,
  ErrorIcon,
} from './FileDrop.style'

type FileDropProps = {
  step: Step
  onUploadFile: (file: File) => void
  icon: 'video-dnd' | 'image-dnd'
  title: string
  paragraph: string
}

const FileDrop: React.FC<FileDropProps> = ({ onUploadFile, step, icon, title, paragraph }) => {
  const [fileUploaded, setFileUploaded] = useState(false)
  const [error, setError] = useState<string>()

  const onDropAccepted: DropzoneOptions['onDropAccepted'] = useCallback(
    (acceptedFiles) => {
      const [file] = acceptedFiles
      onUploadFile(file)
    },
    [onUploadFile]
  )

  const onDropRejected: DropzoneOptions['onDropRejected'] = useCallback(() => {
    setError('Wrong file type!')
  }, [])

  const { getRootProps, getInputProps, isDragAccept, isFileDialogActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: step + '/*',
    maxFiles: 1,
    multiple: false,
  })

  return (
    <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
      <ProgressBar fileUploaded={fileUploaded} />
      <InnerContainer>
        <StyledIcon name={icon} />
        <Title variant="h5">{title}</Title>
        <Paragraph variant="subtitle2" as="p">
          {paragraph}
        </Paragraph>
        <ButtonsGroup>
          <span>Drag and drop or </span>
          <input {...getInputProps()} />
          <Button>Select a file</Button>
        </ButtonsGroup>
      </InnerContainer>
      {error && (
        <ErrorContainer onClick={(e) => e.stopPropagation()}>
          <ErrorIcon name="error-second" />
          <ErrorText variant="body2">{error}</ErrorText>
          <DismissButton onClick={() => setError('')}>
            <Icon name="close" />
          </DismissButton>
        </ErrorContainer>
      )}
    </DragAndDropArea>
  )
}

export default FileDrop
