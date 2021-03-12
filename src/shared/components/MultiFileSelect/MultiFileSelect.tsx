import ImageCropDialog, { ImageCropDialogImperativeHandle } from '@/components/Dialogs/ImageCropDialog'
import { FileType } from '@/types/files'
import React, { useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import FileSelect from '../FileSelect'
import FileStep from '../FileStep'
import Icon from '../Icon'
import { MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.style'

export type FileState = {
  video: File | null
  image: File | null
}

export type MultiFileSelectProps = {
  onChangeFiles: (fileState: FileState) => void
  files: FileState
  onCropImage?: (image: string | null) => void
  croppedImageUrl?: string | null
  maxImageSize?: number // in bytes
  maxVideoSize?: number // in bytes
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onError?: (error: string | null) => void
  error?: string | null
}

const MultiFileSelect: React.FC<MultiFileSelectProps> = ({
  onChangeFiles,
  files,
  croppedImageUrl,
  onCropImage,
  onError,
  onDropRejected,
  error,
  maxImageSize,
  maxVideoSize,
}) => {
  const dialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const [step, setStep] = useState<FileType>('video')
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
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
  }, [isLoading, progress])

  const handleUploadFile = (file: File) => {
    if (step === 'video') {
      onChangeFiles({
        ...files,
        video: file,
      })
      setIsLoading(true)
    }
    if (step === 'image') {
      onChangeFiles({
        ...files,
        image: file,
      })
      dialogRef.current?.open(file)
    }
  }

  const handleReAdjustThumbnail = () => {
    if (files.image) {
      dialogRef.current?.open(files.image)
    }
  }

  const handleChangeStep = (step: FileType) => {
    setStep(step)
  }

  const handleDeleteFile = (fileType: FileType) => {
    onChangeFiles({ ...files, [fileType]: null })
    setIsLoading(false)
    setProgress(0)
    if (fileType === 'image') {
      onCropImage?.(null)
    }
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
        thumbnailUrl={croppedImageUrl}
        paragraph={
          step === 'video'
            ? `Minimum 480p. Accepts any format supported by your browser.`
            : `Maximum 10MB. Accepts any format supported by your browser.`
        }
        onDropRejected={onDropRejected}
        onError={onError}
        error={error}
      />
      <StepsContainer>
        <FileStep
          overhead="Video File"
          subtitle="Select Video File"
          stepNumber={1}
          active={step === 'video'}
          fileName={files.video?.name}
          step="video"
          onDelete={() => handleDeleteFile('video')}
          onSelect={handleChangeStep}
          progress={progress}
        />
        <StepDivider>
          <Icon name="chevron-right" />
        </StepDivider>
        <FileStep
          overhead="Thumbnail Image"
          subtitle="Add Thumbnail Image"
          stepNumber={2}
          active={step === 'image'}
          fileName={files.image?.name}
          step="image"
          onDelete={() => handleDeleteFile('image')}
          onSelect={handleChangeStep}
          thumbnail={croppedImageUrl}
        />
      </StepsContainer>
      <ImageCropDialog
        ref={dialogRef}
        imageType="videoThumbnail"
        onConfirm={(_, croppedImageUrl) => onCropImage?.(croppedImageUrl)}
      />
    </MultiFileSelectContainer>
  )
}

export default MultiFileSelect
