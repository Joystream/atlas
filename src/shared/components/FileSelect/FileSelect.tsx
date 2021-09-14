import beazierEasing from 'bezier-easing'
import React, { useCallback } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { useSpring, useTransition } from 'react-spring'

import { SvgGlyphUpload, SvgIllustrativeFileSelected, SvgIllustrativeImage, SvgIllustrativeVideo } from '@/shared/icons'
import { FileType } from '@/types/files'

import {
  ButtonsGroup,
  DragAndDropArea,
  DragDropText,
  InfoBackground,
  InfoContainer,
  InfoHeading,
  InfoInnerContainer,
  InnerContainer,
  Paragraph,
  Thumbnail,
  Title,
} from './FileSelect.style'

import { Button } from '../Button'
import { Text } from '../Text'

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

export const FileSelect: React.FC<FileSelectProps> = ({
  onUploadFile,
  fileType,
  maxSize,
  title,
  paragraph,
  thumbnailUrl,
  onReAdjustThumbnail,
  onDropRejected,
  isLoading,
}) => {
  const infoContainerTransitions = useTransition(isLoading, {
    from: { opacity: 0, transform: 'scale(1.5)', x: '0%' },
    enter: { opacity: 1, transform: 'scale(1)', x: '0%' },
    leave: { opacity: 0, transform: 'scale(1)', x: '-200%' },
    config: {
      duration: 300,
      easing: beazierEasing(0.42, 0, 0.7, 1),
    },
  })

  const innerContainerSpring = useSpring({
    opacity: isLoading ? 0.1 : 1,
    config: {
      duration: 300,
      easing: beazierEasing(0.42, 0, 0.7, 1),
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

  const handleReAdjustThumbnail = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation()
    onReAdjustThumbnail?.()
  }

  return (
    <DragAndDropArea {...getRootProps()} isDragAccept={isDragAccept} isFileDialogActive={isFileDialogActive}>
      <input {...getInputProps()} />
      {infoContainerTransitions(
        (styles, item) =>
          item && (
            <InfoContainer style={{ opacity: styles.opacity }}>
              <InfoBackground />
              <InfoInnerContainer style={{ transform: styles.transform, x: styles.x }}>
                <SvgIllustrativeFileSelected />
                <InfoHeading variant="caption">selected</InfoHeading>
                {acceptedFiles.length !== 0 && <Text variant="body2">{acceptedFiles[0].name}</Text>}
              </InfoInnerContainer>
            </InfoContainer>
          )
      )}
      {thumbnailUrl && fileType === 'image' ? (
        <Thumbnail
          style={innerContainerSpring}
          src={thumbnailUrl}
          alt="video thumbnail"
          onClick={handleReAdjustThumbnail}
          title="Click to readjust"
        />
      ) : (
        <InnerContainer style={innerContainerSpring}>
          {fileType === 'video' ? <SvgIllustrativeVideo /> : <SvgIllustrativeImage />}
          <Title variant="h5">{title}</Title>
          <Paragraph variant="subtitle2" as="p" secondary>
            {paragraph}
          </Paragraph>
          <ButtonsGroup>
            <DragDropText variant="body2" secondary>
              Drag and drop or
            </DragDropText>
            <Button onClick={() => open()} icon={<SvgGlyphUpload />}>
              Select a file
            </Button>
          </ButtonsGroup>
        </InnerContainer>
      )}
    </DragAndDropArea>
  )
}
