import React, { useCallback, useState } from 'react'
import { DropzoneOptions, FileError, useDropzone, FileRejection } from 'react-dropzone'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import Icon from '../Icon'
import {
  ButtonsGroup,
  DismissButton,
  DragAndDropArea,
  DragDropText,
  ErrorContainer,
  ErrorIcon,
  ErrorText,
  InnerContainer,
  Paragraph,
  ProgressBar,
  StyledIcon,
  Thumbnail,
  Title,
  UploadButton,
} from './FileDrop.style'
import { Step } from '../MultiFileSelect'

export type FileDropProps = {
  step: Step
  onUploadFile: (file: File) => void
  icon: 'video-dnd' | 'image-dnd'
  title: string
  paragraph: string
  thumbnail?: string
  progress?: number
  onReAdjustThumbnail?: () => void
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onError?: React.Dispatch<React.SetStateAction<string>>
  error?: string
  maxSize?: number
}

const FileDrop: React.FC<FileDropProps> = ({
  onUploadFile,
  step,
  maxSize,
  icon,
  title,
  paragraph,
  thumbnail,
  onReAdjustThumbnail,
  onDropRejected,
  progress,
  onError,
  error,
}) => {
  const onDropAccepted: DropzoneOptions['onDropAccepted'] = useCallback(
    (acceptedFiles) => {
      const [file] = acceptedFiles
      onUploadFile(file)
    },
    [onUploadFile]
  )

  const { getRootProps, getInputProps, isDragAccept, isFileDialogActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: step + '/*',
    maxFiles: 1,
    multiple: false,
    maxSize,
  })

  const handleReAdjustThumbnail = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation()
    onReAdjustThumbnail?.()
  }

  return (
    <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
      <ProgressBar progress={progress} />
      <input {...getInputProps()} />
      {thumbnail && step === 'image' ? (
        <Thumbnail src={thumbnail} alt="video thumbnail" onClick={handleReAdjustThumbnail} title="Click to readjust" />
      ) : (
        <SwitchTransition>
          <CSSTransition key={step === 'video' ? 'video' : 'image'} classNames="fade" timeout={100}>
            <InnerContainer>
              <StyledIcon name={icon} />
              <Title variant="h5">{title}</Title>
              <Paragraph variant="subtitle2" as="p">
                {paragraph}
              </Paragraph>
              <ButtonsGroup>
                <DragDropText variant="body2">Drag and drop or </DragDropText>
                <UploadButton icon="upload">Select a file</UploadButton>
              </ButtonsGroup>
            </InnerContainer>
          </CSSTransition>
        </SwitchTransition>
      )}
      {error && (
        <ErrorContainer onClick={(e) => e.stopPropagation()}>
          <ErrorIcon name="error-second" />
          <ErrorText variant="body2">{error}</ErrorText>
          <DismissButton onClick={() => onError?.('')}>
            <Icon name="close" />
          </DismissButton>
        </ErrorContainer>
      )}
    </DragAndDropArea>
  )
}

export default FileDrop
