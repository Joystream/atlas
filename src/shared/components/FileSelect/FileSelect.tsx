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
  ErrorText,
  InnerContainer,
  Paragraph,
  ProgressBar,
  Thumbnail,
  Title,
} from './FileDrop.style'
import { SvgGlyphClose, SvgAlertError, SvgLargeUploadImage, SvgLargeUploadVideo, SvgGlyphUpload } from '@/shared/icons'

export type FileSelectProps = {
  fileType: FileType
  onUploadFile: (file: File) => void
  title: string
  paragraph: string
  thumbnailUrl?: string | null
  isLoading?: boolean
  onReAdjustThumbnail?: () => void
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onError?: (error: string | null) => void
  error?: string | null
  maxSize?: number
}

const FileSelect: React.FC<FileSelectProps> = ({
  onUploadFile,
  fileType,
  maxSize,
  title,
  paragraph,
  thumbnailUrl,
  onReAdjustThumbnail,
  onDropRejected,
  isLoading,
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
    <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
      <ProgressBar isLoading={isLoading} />
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
              {fileType === 'video' ? <SvgLargeUploadVideo /> : <SvgLargeUploadImage />}
              <Title variant="h5">{title}</Title>
              <Paragraph variant="subtitle2" as="p">
                {paragraph}
              </Paragraph>
              <ButtonsGroup>
                <DragDropText variant="body2">Drag and drop or </DragDropText>
                <Button onClick={() => open()} icon={<SvgGlyphUpload />}>
                  Select a file
                </Button>
              </ButtonsGroup>
            </InnerContainer>
          </CSSTransition>
        </SwitchTransition>
      )}
      {error && (
        <ErrorContainer onClick={(e) => e.stopPropagation()}>
          <SvgAlertError />
          <ErrorText variant="body2">{error}</ErrorText>
          <DismissButton variant="tertiary" onClick={() => onError?.(null)}>
            <SvgGlyphClose />
          </DismissButton>
        </ErrorContainer>
      )}
    </DragAndDropArea>
  )
}

export default FileSelect
