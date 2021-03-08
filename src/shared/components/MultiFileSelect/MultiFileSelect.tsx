import ImageCropDialog, { ImageCropDialogImperativeHandle } from '@/components/Dialogs/ImageCropDialog'
import React, { useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import FileDrop from '../FileDrop'
import FileStep from '../FileStep'
import Icon from '../Icon'
import { MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.style'

export type FileState = {
  video: File | null
  image: File | null
}

export type MultiFileSelectProps = {
  onChangeFiles: React.Dispatch<React.SetStateAction<FileState>>
  files: FileState
  onCropImage?: React.Dispatch<React.SetStateAction<string>>
  croppedImageUrl?: string
  maxImageSize?: number // in bytes
  maxVideoSize?: number // in bytes
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onError?: React.Dispatch<React.SetStateAction<string>>
  error?: string
}

export type Step = 'video' | 'image'

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
  const [step, setStep] = useState<Step>('video')
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
    if (file.type.includes('video')) {
      onChangeFiles({
        ...files,
        video: file,
      })
      setIsLoading(true)
    }
    if (file.type.includes('image')) {
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

  const handleChangeStep = (step: Step) => {
    setStep(step)
  }

  const handleDeleteFile = (fileType: 'video' | 'image') => {
    onChangeFiles({ ...files, [fileType]: null })
    setIsLoading(false)
    setProgress(0)
    if (fileType === 'image') {
      onCropImage?.('')
    }
  }

  return (
    <MultiFileSelectContainer>
      <FileDrop
        maxSize={step === 'video' ? maxVideoSize : maxImageSize}
        onUploadFile={handleUploadFile}
        onReAdjustThumbnail={handleReAdjustThumbnail}
        progress={progress}
        step={step}
        icon={step === 'video' ? 'video-dnd' : 'image-dnd'}
        title={step === 'video' ? 'Select Video File' : 'Add Thumbnail Image'}
        thumbnail={croppedImageUrl}
        paragraph={
          step === 'video'
            ? `16:9 Ratio preferred. 4K, 1440p, 1080p or 720p. This is example FPO data only.`
            : `Accepting JPG, PNG formats. Can't exceed 20MB (Example data).`
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
          onChangeStep={handleChangeStep}
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
          onChangeStep={handleChangeStep}
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
