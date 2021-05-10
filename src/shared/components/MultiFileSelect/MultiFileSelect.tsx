import ImageCropDialog, { ImageCropDialogImperativeHandle } from '@/components/Dialogs/ImageCropDialog'
import { FileType } from '@/types/files'
import React, { useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import FileSelect from '../FileSelect'
import FileStep from '../FileStep'
import { MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.style'
import { SvgGlyphChevronRight } from '@/shared/icons'
import { getVideoMetadata } from '@/utils/video'
import { validateImage } from '@/utils/image'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

type InputFile = {
  url?: string | null
  blob?: Blob | File | null
  title?: string
}

export type VideoInputFile = {
  duration?: number
  mediaPixelWidth?: number
  mediaPixelHeight?: number
  mimeType?: string
  size?: number
} & InputFile

export type ImageInputFile = {
  originalBlob?: Blob | File | null
  imageCropData?: ImageCropData
  assetDimensions?: AssetDimensions
} & InputFile

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
}

const MultiFileSelect: React.FC<MultiFileSelectProps> = ({
  onVideoChange,
  onThumbnailChange,
  files,
  maxImageSize,
  maxVideoSize,
  editMode = false,
  onError,
  error,
}) => {
  const dialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const [step, setStep] = useState<FileType>('video')
  const [isLoading, setIsLoading] = useState(false)
  const [rawImageFile, setRawImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (editMode) {
      setStep('image')
    } else {
      setStep('video')
    }
  }, [editMode])

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
    <MultiFileSelectContainer>
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
        <FileStep
          stepNumber={1}
          active={step === 'video'}
          isFileSet={!!files.video}
          disabled={editMode}
          type="video"
          onDelete={() => handleDeleteFile('video')}
          onSelect={handleChangeStep}
          isLoading={isLoading}
        />
        <StepDivider>
          <SvgGlyphChevronRight />
        </StepDivider>
        <FileStep
          stepNumber={2}
          active={step === 'image'}
          isFileSet={!!files.thumbnail}
          type="image"
          onDelete={() => handleDeleteFile('image')}
          onSelect={handleChangeStep}
          thumbnailUrl={files.thumbnail?.url}
        />
      </StepsContainer>
      <ImageCropDialog ref={dialogRef} imageType="videoThumbnail" onConfirm={updateThumbnailFile} />
    </MultiFileSelectContainer>
  )
}

export default MultiFileSelect
