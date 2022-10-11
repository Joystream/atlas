import beazierEasing from 'bezier-easing'
import { FC, MouseEvent, useCallback, useEffect } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { useTransition } from 'react-spring'

import {
  SvgActionUpload,
  SvgIllustrativeEdit,
  SvgIllustrativeFileSelected,
  SvgIllustrativeImage,
  SvgIllustrativeVideo,
} from '@/assets/icons'
import { Text } from '@/components/Text'
import { Button, ButtonVariant } from '@/components/_buttons/Button'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { FileType } from '@/types/files'

import {
  ButtonsGroup,
  Content,
  DragAndDropArea,
  DragDropText,
  EditFileHoverOverlay,
  FileHoverOverlay,
  FileSelectedOverlay,
  InnerContainer,
  Thumbnail,
  Title,
} from './FileSelect.styles'

export type FileSelectProps = {
  type: 'video-thumbnail' | 'playlist-thumbnail' | 'video-file'
  file: File | undefined
  onUploadFile: (file: File) => void
  thumbnailUrl?: string | null
  thumbnailEditable?: boolean
  isFileLoading?: boolean
  onReAdjustThumbnail?: () => void
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onError?: (error: string | null, fileType: FileType) => void
  error?: string | null
  maxSize?: number
}

export const FileSelect: FC<FileSelectProps> = ({
  onUploadFile,
  maxSize,
  thumbnailUrl,
  thumbnailEditable,
  onReAdjustThumbnail,
  onDropRejected,
  onError,
  error,
  isFileLoading,
  type,
  file,
}) => {
  const fileType = type === 'video-file' ? 'video' : 'image'

  const selectedFileTransition = useTransition(isFileLoading, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: 400,
      easing: beazierEasing(0, 0, 0.58, 1),
    },
  })

  const innerContainerTransition = useTransition(fileType, {
    from: { x: '200%' },
    enter: { x: '0%' },
    leave: { x: '-200%' },
    immediate: type !== 'video-thumbnail',
    config: {
      duration: 400,
      easing: beazierEasing(0, 0, 0.58, 1),
    },
  })

  const onDropAccepted = useCallback<NonNullable<DropzoneOptions['onDropAccepted']>>(
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
    accept: {
      [fileType + '/*']: [],
    },
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
      type: 'warning',
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

  const handleReAdjustThumbnail = (e: MouseEvent<HTMLImageElement>) => {
    e.stopPropagation()
    onReAdjustThumbnail?.()
  }

  let title: string
  let paragraph: string
  let buttonVariant: ButtonVariant = 'primary'

  switch (type) {
    case 'playlist-thumbnail':
      title = 'Custom playlist thumbnail'
      paragraph = 'Upload 16:9 thumbnail or select it from any video from your playlist'
      buttonVariant = 'secondary'
      break
    case 'video-thumbnail':
      title = 'Select thumbnail image'
      paragraph = 'Preferred 16:9 image ratio'
      break
    case 'video-file':
      title = 'Select video file'
      paragraph = 'Maximum 10GB. Prefered format is MP4 (H.264) or WEBM (VP8,VP9)'
      break
  }
  return (
    <>
      <DragAndDropArea
        {...getRootProps()}
        isDragAccept={isDragAccept}
        fileAccepted={!!file}
        isFileDialogActive={isFileDialogActive}
      >
        <InnerContainer fileAccepted={!!file}>
          <input {...getInputProps()} />
          {innerContainerTransition((style, item) =>
            thumbnailUrl && fileType === 'image' ? (
              <>
                <Thumbnail
                  isLoading={isFileLoading}
                  src={thumbnailUrl}
                  alt="video thumbnail"
                  onClick={handleReAdjustThumbnail}
                  title="Click to readjust"
                />
                {thumbnailEditable && !isDragAccept && (
                  <EditFileHoverOverlay>
                    <SvgIllustrativeEdit />
                    <Text variant="t200" as="p">
                      Edit thumbnail
                    </Text>
                  </EditFileHoverOverlay>
                )}
              </>
            ) : (
              <Content key={item} style={style} isLoading={isFileLoading}>
                {fileType === 'video' ? <SvgIllustrativeVideo /> : <SvgIllustrativeImage />}
                <Title as="span" variant="h400">
                  {title}
                </Title>
                <Text margin={{ top: 3 }} variant="t200" as="p" color="colorText">
                  {paragraph}
                </Text>
                <ButtonsGroup>
                  <DragDropText as="span" variant="t100" color="colorText">
                    Drag and drop or
                  </DragDropText>
                  <Button variant={buttonVariant} size="medium" onClick={() => open()} icon={<SvgActionUpload />}>
                    Select a file
                  </Button>
                </ButtonsGroup>
              </Content>
            )
          )}
        </InnerContainer>
        <FileHoverOverlay>
          {fileType === 'video' ? <SvgIllustrativeVideo /> : <SvgIllustrativeImage />}
          <Text as="span" margin={{ top: 1 }} variant="t200-strong">
            Drop file here to upload it
          </Text>
        </FileHoverOverlay>
        {selectedFileTransition(
          (styles, item) =>
            !!file &&
            item && (
              <FileSelectedOverlay style={{ opacity: styles.opacity }}>
                <SvgIllustrativeFileSelected />
                <Text as="span" margin={{ top: 2 }} color="colorCoreBlue200" variant="t100">
                  selected
                </Text>
                <Text as="span" margin={{ top: 1 }} variant="t200">
                  {file.name}
                </Text>
              </FileSelectedOverlay>
            )
        )}
      </DragAndDropArea>
    </>
  )
}
