import React, { useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'

import { ImageCropDialog, ImageCropDialogImperativeHandle } from '@/components/ImageCropDialog'
import { SvgGlyphChevronRight, SvgGlyphFileVideo } from '@/shared/icons'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { FileType } from '@/types/files'
import { validateImage } from '@/utils/image'
import { getVideoMetadata } from '@/utils/video'

import { MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.style'

import { FileSelect } from '../FileSelect'
import { Step } from '../Step'

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
  onError?: (error: FileErrorType | null) => void
  error?: string | null
  className?: string
}

export const MultiFileSelect: React.FC<MultiFileSelectProps> = ({
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
  const dialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const [step, setStep] = useState<FileType>('video')
  const [isLoading, setIsLoading] = useState(false)
  const [rawImageFile, setRawImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (editMode || files.video) {
      setStep('image')
    } else {
      setStep('video')
    }
  }, [editMode, files.video])

  useEffect(() => {
    if (!isLoading) {
      return
    }
    if (error) {
      setIsLoading(false)
      return
    }
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setStep('image')
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [error, isLoading])

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
      onError?.('file-invalid-type')
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
  }

  const handleUploadFile = async (file: File) => {
    if (step === 'video') {
      setIsLoading(true)
      updateVideoFile(file)
    }
    if (step === 'image') {
      try {
        await validateImage(file)
        setRawImageFile(file)
        dialogRef.current?.open(file)
      } catch (error) {
        onError?.('file-invalid-type')
      }
    }
  }

  const handleReAdjustThumbnail = () => {
    if (files.thumbnail?.originalBlob) {
      dialogRef.current?.open(files.thumbnail.originalBlob)
    }
  }

  const handleChangeStep = (step: FileType) => {
    setStep(step)
  }

  const handleDeleteFile = (fileType: FileType) => {
    if (fileType === 'video') {
      onVideoChange(null)
    }
    if (fileType === 'image') {
      onThumbnailChange(null)
    }
    setIsLoading(false)
  }

  const handleFileRejections = async (fileRejections: FileRejection[]) => {
    if (!fileRejections.length) {
      return
    }

    const { errors } = fileRejections[0]
    if (!errors.length) {
      return
    }

    const firstError = errors[0]
    onError?.(firstError.code)
  }

  return (
    <MultiFileSelectContainer className={className}>
      <FileSelect
        maxSize={step === 'video' ? maxVideoSize : maxImageSize}
        onUploadFile={handleUploadFile}
        onReAdjustThumbnail={handleReAdjustThumbnail}
        isLoading={isLoading}
        fileType={step}
        title={step === 'video' ? 'Select video file' : 'Add thumbnail image'}
        thumbnailUrl={files.thumbnail?.url}
        paragraph={
          step === 'video'
            ? `Maximum 10GB. Accepts any format supported by your browser.`
            : `Accepts any format supported by your browser.`
        }
        onDropRejected={handleFileRejections}
        onError={onError}
        error={error}
      />
      <StepsContainer>
        <Step
          variant="file"
          number={1}
          title={files.video ? 'Video file' : 'Add video file'}
          active={step === 'video'}
          stepPlaceholder={!!files.video && <SvgGlyphFileVideo />}
          disabled={editMode}
          completed={!!files.video}
          onDelete={() => handleDeleteFile('video')}
          onClick={() => handleChangeStep('video')}
          isLoading={isLoading}
        />
        <StepDivider>
          <SvgGlyphChevronRight />
        </StepDivider>
        <Step
          variant="file"
          stepPlaceholder={files.thumbnail?.url ? <img src={files.thumbnail?.url} alt="thumbnail" /> : undefined}
          number={2}
          title={files.thumbnail ? 'Thumbnail image' : 'Add thumbnail image'}
          active={step === 'image'}
          thumbnailUrl={files.thumbnail?.url}
          completed={!!files.thumbnail?.url}
          onDelete={() => handleDeleteFile('image')}
          onClick={() => handleChangeStep('image')}
        />
      </StepsContainer>
      <ImageCropDialog ref={dialogRef} imageType="videoThumbnail" onConfirm={updateThumbnailFile} />
    </MultiFileSelectContainer>
  )
}
