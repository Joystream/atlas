import { FileType } from '@/types/files'
import React, { useCallback } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import Button from '../Button'
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
} from './FileDrop.style'

export type FileDropProps = {
  fileType: FileType
  onUploadFile: (file: File) => void
  title: string
  paragraph: string
  thumbnailUrl?: string | null
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
  maxSize,
  title,
  paragraph,
  thumbnailUrl,
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
    accept: fileType + '/*',
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
        {thumbnailUrl && fileType === 'image' ? (
          <Thumbnail
            src={thumbnailUrl}
            alt="video thumbnail"
            onClick={handleReAdjustThumbnail}
            title="Click to readjust"
          />
        ) : (
          <SwitchTransition>
            <CSSTransition key={fileType} classNames="fade" timeout={100}>
              <InnerContainer>
                <StyledIcon name={fileType === 'video' ? 'video-dnd' : 'image-dnd'} />
                <Title variant="h5">{title}</Title>
                <Paragraph variant="subtitle2" as="p">
                  {paragraph}
                </Paragraph>
                <ButtonsGroup>
                  <DragDropText variant="body2">Drag and drop or </DragDropText>
                  <Button onClick={() => open()} icon="upload">
                    Select a file
                  </Button>
                </ButtonsGroup>
              </InnerContainer>
            </CSSTransition>
          </SwitchTransition>
        )}
        {error && (
          <ErrorContainer onClick={(e) => e.stopPropagation()}>
            <ErrorIcon name="error-second" />
            <ErrorText variant="body2">{error}</ErrorText>
            <DismissButton variant="tertiary" icon={'close'} onClick={() => onError?.(null)}></DismissButton>
          </ErrorContainer>
        )}
      </DragAndDropArea>
    </FileDropWrapper>
  )
}

export default FileDrop
