import beazierEasing from 'bezier-easing'
import React, { useCallback, useEffect } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { useTransition } from 'react-spring'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import {
  SvgGlyphUpload,
  SvgIllustrativeFileSelected,
  SvgIllustrativeImage,
  SvgIllustrativeVideo,
} from '@/components/_icons'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { FileType } from '@/types/files'

import {
  ButtonsGroup,
  DragAndDropArea,
  DragDropText,
  InnerContainer,
  Paragraph,
  SelectedFileInfo,
  SelectedFileInfoBackground,
  SelectedFileInfoHeading,
  SelectedFileInfoInnerContainer,
  Thumbnail,
  Title,
} from './FileSelect.styles'

export type FileSelectProps = {
  fileType: FileType
  onUploadFile: (file: File) => void
  title: string
  paragraph: string
  thumbnailUrl?: string | null
  isLoading?: boolean
  onReAdjustThumbnail?: () => void
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onError?: (error: string | null, fileType: FileType) => void
  error?: string | null
  maxSize?: number
}

export const FileSelect: React.FC<FileSelectProps> = ({
  onUploadFile,
  fileType,
  maxSize,
  title,
  paragraph,
  thumbnailUrl,
  onReAdjustThumbnail,
  onDropRejected,
  onError,
  error,
  isLoading,
}) => {
  const selectedFileTransition = useTransition(isLoading, {
    from: { opacity: 0, transform: 'scale(1.5)', x: '0%' },
    enter: { opacity: 1, transform: 'scale(1)', x: '0%' },
    leave: { opacity: 0, transform: 'scale(1)', x: '-200%' },
    config: {
      duration: 400,
      easing: beazierEasing(0, 0, 0.58, 1),
    },
  })

  const innerContainerTransition = useTransition(fileType, {
    from: { x: '200%' },
    enter: { x: '0%' },
    leave: { x: '-200%' },
    immediate: fileType === 'video',
    config: {
      duration: 400,
      easing: beazierEasing(0, 0, 0.58, 1),
    },
  })

  const onDropAccepted: DropzoneOptions['onDropAccepted'] = useCallback(
    (acceptedFiles) => {
      const [file] = acceptedFiles
      onUploadFile(file)
    },
    [onUploadFile]
  )

  const { getRootProps, getInputProps, isDragAccept, isFileDialogActive, open, acceptedFiles } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    multiple: false,
    accept: fileType + '/*',
    maxSize,
    noClick: true,
    noKeyboard: true,
  })

  const [openErrorDialog, closeErrorDialog] = useConfirmationModal()

  useEffect(() => {
    if (!error) {
      return
    }
    openErrorDialog({
      title: 'Unsupported file type selected',
      description: error,
      iconType: 'warning',
      primaryButton: {
        onClick: () => {
          closeErrorDialog()
          onError?.(null, fileType)
          open()
        },
        text: 'Reselect file',
      },
      secondaryButton: {
        text: 'Cancel',
        onClick: () => {
          onError?.(null, fileType)
          closeErrorDialog()
        },
      },
    })
  }, [closeErrorDialog, error, fileType, onError, open, openErrorDialog])

  const handleReAdjustThumbnail = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation()
    onReAdjustThumbnail?.()
  }

  return (
    <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
      <input {...getInputProps()} />
      {selectedFileTransition(
        (styles, item) =>
          item && (
            <SelectedFileInfo style={{ opacity: styles.opacity }}>
              <SelectedFileInfoBackground />
              <SelectedFileInfoInnerContainer style={{ transform: styles.transform, x: styles.x }}>
                <SvgIllustrativeFileSelected />
                <SelectedFileInfoHeading variant="caption">selected</SelectedFileInfoHeading>
                {acceptedFiles.length !== 0 && <Text variant="body2">{acceptedFiles[0].name}</Text>}
              </SelectedFileInfoInnerContainer>
            </SelectedFileInfo>
          )
      )}
      {innerContainerTransition((style, item) =>
        thumbnailUrl && fileType === 'image' ? (
          <Thumbnail
            isLoading={isLoading}
            src={thumbnailUrl}
            alt="video thumbnail"
            onClick={handleReAdjustThumbnail}
            title="Click to readjust"
          />
        ) : (
          <InnerContainer key={item} style={style} isLoading={isLoading}>
            {fileType === 'video' ? <SvgIllustrativeVideo /> : <SvgIllustrativeImage />}
            <Title variant="h5">{title}</Title>
            <Paragraph variant="subtitle2" as="p" secondary>
              {paragraph}
            </Paragraph>
            <ButtonsGroup>
              <DragDropText variant="body2" secondary>
                Drag and drop or
              </DragDropText>
              <Button size="medium" onClick={() => open()} icon={<SvgGlyphUpload />}>
                Select a file
              </Button>
            </ButtonsGroup>
          </InnerContainer>
        )
      )}
    </DragAndDropArea>
  )
}
