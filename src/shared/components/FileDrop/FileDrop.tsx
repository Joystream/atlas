import React, { useCallback } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import {
  ButtonsGroup,
  DismissButton,
  DragAndDropArea,
  DragDropText,
  ErrorContainer,
  ErrorIcon,
  ErrorText,
  FileDropWrapper,
  InnerContainer,
  Paragraph,
  ProgressBar,
  StyledIcon,
  Thumbnail,
  Title,
  UploadButton,
} from './FileDrop.style'

export type FileDropProps = {
  fileType: string
  accept: string
  onUploadFile: (file: File) => void
  icon: 'video-dnd' | 'image-dnd'
  title: string
  paragraph: string
  thumbnail?: string | null
  progress?: number
  onReAdjustThumbnail?: () => void
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onError?: (error: string | null) => void
  error?: string | null
  maxSize?: number
}

const FileDrop: React.FC<FileDropProps> = ({
  onUploadFile,
  fileType,
  accept,
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

  const { getRootProps, getInputProps, isDragAccept, isFileDialogActive, open } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    multiple: false,
    accept,
    maxSize,
    noClick: true,
    noKeyboard: true,
  })

  const handleReAdjustThumbnail = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation()
    onReAdjustThumbnail?.()
  }

  return (
    <FileDropWrapper>
      <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
        <ProgressBar progress={progress} />
        <input {...getInputProps()} />
        {thumbnail && fileType === 'image' ? (
          <Thumbnail
            src={thumbnail}
            alt="video thumbnail"
            onClick={handleReAdjustThumbnail}
            title="Click to readjust"
          />
        ) : (
          <SwitchTransition>
            <CSSTransition key={fileType} classNames="fade" timeout={100}>
              <InnerContainer>
                <StyledIcon name={icon} />
                <Title variant="h5">{title}</Title>
                <Paragraph variant="subtitle2" as="p">
                  {paragraph}
                </Paragraph>
                <ButtonsGroup>
                  <DragDropText variant="body2">Drag and drop or </DragDropText>
                  <UploadButton onClick={() => open()} icon="upload">
                    Select a file
                  </UploadButton>
                </ButtonsGroup>
              </InnerContainer>
            </CSSTransition>
          </SwitchTransition>
        )}
        {error && (
          <ErrorContainer onClick={(e) => e.stopPropagation()}>
            <ErrorIcon name="error-second" />
            <ErrorText variant="body2">{error}</ErrorText>
            <DismissButton variant="tertiary" icon={'close'} onClick={() => onError?.('')}></DismissButton>
          </ErrorContainer>
        )}
      </DragAndDropArea>
    </FileDropWrapper>
  )
}

export default FileDrop
