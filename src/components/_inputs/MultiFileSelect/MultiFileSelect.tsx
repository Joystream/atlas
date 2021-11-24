import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { CSSTransition } from 'react-transition-group'

import { Step } from '@/components/Step'
import { SvgActionChevronR } from '@/components/_icons'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { FileType } from '@/types/files'
import { validateImage } from '@/utils/image'
import { getVideoMetadata } from '@/utils/video'

import { AnimatedUnderline, MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.styles'

import { FileSelect } from '../FileSelect'

type InputFile = {
  url?: string | null
  blob?: Blob | File | null
  title?: string
}

export type VideoInputMetadata = {
  duration?: number
  mediaPixelWidth?: number
  mediaPixelHeight?: number
  mimeType?: string
  size?: number
}

export type VideoInputFile = VideoInputMetadata & InputFile

export type ImageInputMetadata = {
  imageCropData?: ImageCropData
  assetDimensions?: AssetDimensions
}

export type ImageInputFile = {
  originalBlob?: Blob | File | null
} & ImageInputMetadata &
  InputFile

export type InputFilesState = {
  video: VideoInputFile | null
  thumbnail: ImageInputFile | null
}

export type FileErrorType = 'file-too-large' | 'file-invalid-type' | string
export type MultiFileSelectProps = {
  onVideoChange: (video: VideoInputFile | null) => void
  onThumbnailChange: (thumbnail: ImageInputFile | null) => void
  files: InputFilesState
  maxImageSize?: number // in bytes
  maxVideoSize?: number // in bytes
  editMode?: boolean
  onError?: (error: FileErrorType | null, fileType: FileType) => void
  error?: string | null
  className?: string
}

const THUMBNAIL_SELECT_TITLE = 'Select thumbnail image'
const VIDEO_SELECT_TITLE = 'Select video file'

export const MultiFileSelect: React.FC<MultiFileSelectProps> = React.memo(
  ({
    onVideoChange,
    onThumbnailChange,
    files,
    maxImageSize,
    maxVideoSize,
    editMode = false,
    onError,
    error,
    className,
  }) => {
    const dialogRef = useRef<ImageCropModalImperativeHandle>(null)
    const [step, setStep] = useState<FileType>('video')
    const [isImgLoading, setIsImgLoading] = useState(false)
    const [isVideoLoading, setIsVideoLoading] = useState(false)
    const [rawImageFile, setRawImageFile] = useState<File | null>(null)
    const thumbnailStepRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (isImgLoading || isVideoLoading) {
        return
      }
      if (editMode || files.video) {
        setStep('image')
      } else {
        setStep('video')
      }
    }, [editMode, files.video, isImgLoading, isVideoLoading])

    useEffect(() => {
      if (!isVideoLoading && !isImgLoading) {
        return
      }
      if (error) {
        setIsVideoLoading(false)
        return
      }
      const timeout = setTimeout(() => {
        if (isVideoLoading) {
          setIsVideoLoading(false)
          setStep('image')
        }
        if (isImgLoading) {
          setIsImgLoading(false)
        }
      }, 1000)

      return () => clearTimeout(timeout)
    }, [error, isImgLoading, isVideoLoading])

    const updateVideoFile = async (file: File) => {
      try {
        const videoMetadata = await getVideoMetadata(file)
        const updatedVideo: VideoInputFile = {
          duration: videoMetadata.duration,
          mediaPixelHeight: videoMetadata.height,
          mediaPixelWidth: videoMetadata.width,
          size: videoMetadata.sizeInBytes,
          mimeType: videoMetadata.mimeType,
          blob: file,
          title: file.name,
        }
        onVideoChange(updatedVideo)
      } catch (e) {
        onError?.('file-invalid-type', step)
      }
    }

    const updateThumbnailFile = (
      croppedBlob: Blob,
      croppedUrl: string,
      assetDimensions: AssetDimensions,
      imageCropData: ImageCropData
    ) => {
      const updatedThumbnail: ImageInputFile = {
        originalBlob: rawImageFile,
        blob: croppedBlob,
        url: croppedUrl,
        assetDimensions,
        imageCropData,
      }
      onThumbnailChange(updatedThumbnail)
      setIsImgLoading(true)
    }

    const handleUploadFile = async (file: File) => {
      if (step === 'video') {
        setIsVideoLoading(true)
        updateVideoFile(file)
      }
      if (step === 'image') {
        try {
          await validateImage(file)
          setRawImageFile(file)
          dialogRef.current?.open(file)
        } catch (error) {
          onError?.('file-invalid-type', step)
        }
      }
    }

    const handleReAdjustThumbnail = () => {
      if (files.thumbnail?.originalBlob) {
        dialogRef.current?.open(files.thumbnail.originalBlob)
      }
    }

    const handleDeleteFile = useCallback(
      (fileType: FileType) => {
        if (fileType === 'video') {
          onVideoChange(null)
          setIsVideoLoading(false)
        }
        if (fileType === 'image') {
          onThumbnailChange(null)
          setIsImgLoading(false)
        }
      },
      [onThumbnailChange, onVideoChange]
    )

    const handleFileRejections = async (fileRejections: FileRejection[]) => {
      if (!fileRejections.length) {
        return
      }

      const { errors } = fileRejections[0]
      if (!errors.length) {
        return
      }

      const firstError = errors[0]
      onError?.(firstError.code, step)
    }
    const stepsActive =
      (editMode && !files.thumbnail?.url) || (!editMode && !(files.thumbnail?.originalBlob && files.video?.blob))

    const handleDeleteVideoFile = () => handleDeleteFile('video')
    const handleDeleteImageFile = () => handleDeleteFile('image')

    return (
      <MultiFileSelectContainer className={className}>
        <FileSelect
          maxSize={step === 'video' ? maxVideoSize : maxImageSize}
          onUploadFile={handleUploadFile}
          onReAdjustThumbnail={handleReAdjustThumbnail}
          isLoading={isVideoLoading || isImgLoading}
          fileType={step}
          title={step === 'video' ? VIDEO_SELECT_TITLE : THUMBNAIL_SELECT_TITLE}
          thumbnailUrl={files.thumbnail?.url}
          paragraph={
            step === 'video'
              ? `Maximum 10GB. Preferred format is WebM (VP9/VP8) or MP4 (H.264)`
              : `Preferred 16:9 image ratio`
          }
          onDropRejected={handleFileRejections}
          onError={onError}
          error={error}
        />
        <StepsContainer>
          <Step
            variant="file"
            number={1}
            title={
              editMode
                ? 'Video file'
                : files.video
                ? (files.video.blob as File).name || 'Video file'
                : VIDEO_SELECT_TITLE
            }
            active={step === 'video' && stepsActive}
            disabled={editMode}
            completed={!!files.video}
            onDelete={handleDeleteVideoFile}
            isLoading={isVideoLoading}
          />
          <StepDivider>
            <SvgActionChevronR />
          </StepDivider>
          <Step
            variant="file"
            number={2}
            title={
              files.thumbnail
                ? files.thumbnail.originalBlob
                  ? (files.thumbnail.originalBlob as File).name
                  : files.thumbnail.url
                  ? 'Thumbnail image'
                  : THUMBNAIL_SELECT_TITLE
                : THUMBNAIL_SELECT_TITLE
            }
            active={step === 'image' && stepsActive}
            completed={!!files.thumbnail?.url}
            onDelete={handleDeleteImageFile}
            ref={thumbnailStepRef}
            isLoading={isImgLoading}
          />
          {stepsActive && (
            <CSSTransition in={step === 'image'} timeout={400} classNames="underline">
              <AnimatedUnderline
                style={{
                  width: thumbnailStepRef?.current?.offsetWidth,
                  left: step === 'image' ? thumbnailStepRef?.current?.offsetLeft : 0,
                }}
              />
            </CSSTransition>
          )}
        </StepsContainer>
        <ImageCropModal ref={dialogRef} imageType="videoThumbnail" onConfirm={updateThumbnailFile} />
      </MultiFileSelectContainer>
    )
  }
)

MultiFileSelect.displayName = 'MultiFileSelect'
