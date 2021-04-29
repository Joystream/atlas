import ImageCropDialog, { ImageCropDialogImperativeHandle } from '@/components/Dialogs/ImageCropDialog'
import { FileType } from '@/types/files'
import React, { useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import FileSelect from '../FileSelect'
import FileStep from '../FileStep'
import { MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.style'
import { SvgGlyphChevronRight } from '@/shared/icons'
import { getVideoMetadata } from '@/utils/video'

type InputFile = {
  url?: string | null
  blob?: Blob | File | null
}

type VideoInputFile = {
  duration?: number
  mediaPixelWidth?: number
  mediaPixelHeight?: number
  mimeType?: string
  size?: number
} & InputFile

type ImageInputFile = {
  originalBlob?: Blob | File | null
} & InputFile

export type InputFilesState = {
  video: VideoInputFile | null
  thumbnail: ImageInputFile | null
}

export type FileErrorType = 'file-too-large' | 'file-invalid-type' | string
export type MultiFileSelectProps = {
  onChange: (filesState: InputFilesState) => void
  files: InputFilesState
  maxImageSize?: number // in bytes
  maxVideoSize?: number // in bytes
  editMode?: boolean
  onError?: (error: FileErrorType | null) => void
  error?: string | null
}

const MultiFileSelect: React.FC<MultiFileSelectProps> = ({
  onChange,
  files,
  maxImageSize,
  maxVideoSize,
  editMode = false,
  onError,
  error,
}) => {
  const dialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const [step, setStep] = useState<FileType>('video')
  const [progress, setProgress] = useState(0)
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
      if (progress < 100) {
        setProgress(progress + 1)
      } else {
        setIsLoading(false)
        setProgress(0)
        setStep('image')
      }
    }, 5)

    return () => clearTimeout(timeout)
  }, [error, isLoading, progress])

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
      }
      onChange({
        ...files,
        video: updatedVideo,
      })
    } catch (e) {
      onError?.('file-invalid-type')
    }
  }

  const updateThumbnailFile = (croppedBlob: Blob, croppedUrl: string) => {
    const updatedThumbnail: ImageInputFile = {
      originalBlob: rawImageFile,
      blob: croppedBlob,
      url: croppedUrl,
    }
    onChange({
      ...files,
      thumbnail: updatedThumbnail,
    })
  }

  const handleUploadFile = (file: File) => {
    if (step === 'video') {
      setIsLoading(true)
      updateVideoFile(file)
    }
    if (step === 'image') {
      setRawImageFile(file)
      dialogRef.current?.open(file)
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
    onChange({ ...files, [fileType === 'video' ? 'video' : 'thumbnail']: null })
    setIsLoading(false)
    setProgress(0)
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
        progress={progress}
        fileType={step}
        title={step === 'video' ? 'Select Video File' : 'Add Thumbnail Image'}
        thumbnailUrl={files.thumbnail?.url}
        paragraph={
          step === 'video'
            ? `Minimum 480p. Accepts any format supported by your browser.`
            : `Maximum 10MB. Accepts any format supported by your browser.`
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
          progress={progress}
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
