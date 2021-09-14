import React, { useCallback, useEffect, useState } from 'react'
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone'
import { useSpring } from 'react-spring'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import {
  SvgAlertError,
  SvgGlyphClose,
  SvgGlyphUpload,
  SvgIllustrativeFileSelected,
  SvgIllustrativeImage,
  SvgIllustrativeVideo,
} from '@/shared/icons'
import { transitions } from '@/shared/theme'
import { FileType } from '@/types/files'

import {
  ButtonsGroup,
  DismissButton,
  DragAndDropArea,
  DragDropText,
  ErrorContainer,
  ErrorText,
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
      <input {...getInputProps()} />
      <CSSTransition unmountOnExit mountOnEnter classNames={transitions.names.fade} timeout={300} in={isLoading}>
        <InfoContainer>
          <InfoBackground />
          <InfoInnerContainer>
            <SvgIllustrativeFileSelected />
            <InfoHeading variant="caption">selected</InfoHeading>
            <Text variant="body2">wild-life-ep-6.mp4</Text>
          </InfoInnerContainer>
        </InfoContainer>
      </CSSTransition>
      {thumbnailUrl && fileType === 'image' ? (
        <Thumbnail
          src={thumbnailUrl}
          alt="video thumbnail"
          onClick={handleReAdjustThumbnail}
          title="Click to readjust"
        />
      ) : (
        // <SwitchTransition>
        //   <CSSTransition key={fileType} classNames="fade" timeout={100}>
        <InnerContainer>
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
        //   </CSSTransition>
        // </SwitchTransition>
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
