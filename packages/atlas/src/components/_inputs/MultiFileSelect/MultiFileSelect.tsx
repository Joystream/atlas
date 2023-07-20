import { FC, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { CSSTransition } from 'react-transition-group'
import useResizeObserver from 'use-resize-observer'

import { SvgActionChevronR } from '@/assets/icons'
import { Step } from '@/components/Step'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { ImageInputMetadata, MediaInputMetadata } from '@/providers/videoWorkspace'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { FileType } from '@/types/files'
import { validateImage } from '@/utils/image'
import { SentryLogger } from '@/utils/logs'
import { getVideoMetadata } from '@/utils/video'

import { AnimatedUnderline, MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.styles'

import { FileSelect } from '../FileSelect'

type InputFile = {
  url?: string | null
  blob?: Blob | null
  title?: string
}

export type VideoInputFile = MediaInputMetadata & InputFile

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
  disabled?: boolean
  className?: string
}

const THUMBNAIL_SELECT_TITLE = 'Select thumbnail image'
const VIDEO_SELECT_TITLE = 'Select video file'

export const MultiFileSelect: FC<MultiFileSelectProps> = memo(
  ({ onVideoChange, onThumbnailChange, files, maxImageSize, maxVideoSize, editMode = false, disabled, className }) => {
    const dialogRef = useRef<ImageCropModalImperativeHandle>(null)
    const [step, setStep] = useState<FileType>('video')
    const [isImgLoading, setIsImgLoading] = useState(false)
    const [isVideoLoading, setIsVideoLoading] = useState(false)
    const [rawImageFile, setRawImageFile] = useState<File | null>(null)
    const thumbnailStepRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)

    const [underlineWidth, setUnderlineWidth] = useState(0)
    const [underlineLeft, setUnderlineLeft] = useState(0)

    useResizeObserver({
      box: 'border-box',
      ref: thumbnailStepRef,
      onResize: () => {
        setUnderlineWidth(thumbnailStepRef?.current?.offsetWidth || 0)
        setUnderlineLeft(step === 'image' ? thumbnailStepRef?.current?.offsetLeft || 0 : 0)
      },
    })

    useLayoutEffect(() => {
      if (thumbnailStepRef?.current?.offsetWidth) {
        setUnderlineWidth(thumbnailStepRef?.current?.offsetWidth)
      }
    }, [])

    useLayoutEffect(() => {
      if (thumbnailStepRef?.current?.offsetLeft) {
        setUnderlineLeft(step === 'image' ? thumbnailStepRef?.current?.offsetLeft : 0)
      }
    }, [step])

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
        handleFileSelectError?.('file-invalid-type', step)
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
          handleFileSelectError?.('file-invalid-type', step)
        }
      }
    }

    const handleReAdjustThumbnail = async () => {
      if (!editMode || disabled) {
        return
      }
      if (files.thumbnail?.url && !files.thumbnail?.originalBlob) {
        const file = await fetch(files.thumbnail.url)
          .then((r) => r.blob())
          .then((blobFile) => new File([blobFile], 'temporary-file', { type: 'image/png' }))
        setRawImageFile(file)
        dialogRef.current?.open(file, undefined, true)
      }
      if (files.thumbnail?.originalBlob) {
        dialogRef.current?.open(files.thumbnail.originalBlob, files.thumbnail.imageCropData, true)
      }
    }

    const handleFileSelectError = useCallback((errorCode: FileErrorType | null, fileType: FileType) => {
      if (!errorCode) {
        setError(null)
      } else if (errorCode === 'file-invalid-type') {
        setError(
          fileType === 'video'
            ? `Maximum 10GB. Preferred format is WebM (VP9/VP8) or MP4 (H.264)`
            : `Preferred 16:9 image ratio`
        )
      } else if (errorCode === 'file-too-large') {
        setError('File too large')
      } else {
        SentryLogger.error('Unknown file select error', 'MultiFileSelect', null, { error: { code: errorCode } })
        setError('Unknown error')
      }
    }, [])

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
      handleFileSelectError?.(firstError.code, step)
    }
    const stepsActive =
      (editMode && !files.thumbnail?.url) || (!editMode && !(files.thumbnail?.originalBlob && files.video?.blob))

    const handleDeleteVideoFile = () => handleDeleteFile('video')
    const handleDeleteImageFile = () => handleDeleteFile('image')

    return (
      <MultiFileSelectContainer className={className}>
        <FileSelect
          key={step}
          thumbnailEditable={editMode && !disabled}
          file={(step === 'video' ? files.video?.blob : files.thumbnail?.originalBlob) as File}
          maxSize={step === 'video' ? maxVideoSize : maxImageSize}
          onUploadFile={handleUploadFile}
          onReAdjustThumbnail={handleReAdjustThumbnail}
          isFileLoading={isVideoLoading || isImgLoading}
          type={step === 'video' ? 'video-file' : 'video-thumbnail'}
          thumbnailUrl={files.thumbnail?.url}
          error={error}
          onError={setError}
          onDropRejected={handleFileRejections}
        />
        <StepsContainer>
          <Step
            type="file"
            number={1}
            title={
              editMode
                ? 'Video file'
                : files.video
                ? (files.video.blob as File).name || 'Video file'
                : VIDEO_SELECT_TITLE
            }
            variant={getStepVariant(step === 'video' && stepsActive, !!files.video)}
            disabled={editMode || disabled}
            onDelete={handleDeleteVideoFile}
            isLoading={isVideoLoading}
          />
          <StepDivider>
            <SvgActionChevronR />
          </StepDivider>
          <Step
            type="file"
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
            variant={getStepVariant(step === 'image' && stepsActive, !!files.thumbnail?.url)}
            onDelete={handleDeleteImageFile}
            ref={thumbnailStepRef}
            isLoading={isImgLoading}
            disabled={disabled}
          />
          {stepsActive && (
            <CSSTransition in={step === 'image'} timeout={400} classNames="underline">
              <AnimatedUnderline
                style={{
                  width: underlineWidth,
                  left: underlineLeft,
                }}
              />
            </CSSTransition>
          )}
        </StepsContainer>
        <ImageCropModal
          ref={dialogRef}
          imageType="videoThumbnail"
          onConfirm={updateThumbnailFile}
          onDelete={() => handleDeleteFile('image')}
        />
      </MultiFileSelectContainer>
    )
  }
)

const getStepVariant = (current: boolean, completed: boolean) => {
  if (current) {
    return 'current'
  }
  if (completed) {
    return 'completed'
  }
  return 'future'
}

MultiFileSelect.displayName = 'MultiFileSelect'
