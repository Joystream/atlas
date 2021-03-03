import ImageCropDialog, { ImageCropDialogImperativeHandle } from '@/components/Dialogs/ImageCropDialog'
import React, { useEffect, useRef, useState } from 'react'
import Icon from '../Icon'
import FileDrop from './FileDrop'
import FileStep from './FileStep'
import { MultiFileSelectContainer, StepDivider, StepsContainer } from './MultiFileSelect.style'

type FileState = {
  video: File | null
  image: File | null
}
export type Step = 'video' | 'image'

const MultiFileSelect = () => {
  const dialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>()
  const [step, setStep] = useState<Step>('video')
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<FileState>({
    video: null,
    image: null,
  })

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
      setFiles({
        ...files,
        video: file,
      })
      setIsLoading(true)
    }
    if (file.type.includes('image')) {
      setFiles({
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

  return (
    <MultiFileSelectContainer>
      <FileDrop
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
      />
      <StepsContainer>
        <FileStep
          overhead="Video File"
          subtitle="Select Video File"
          stepNumber={1}
          active={step === 'video'}
          file={files.video}
          step="video"
          onDelete={() => setFiles({ ...files, video: null })}
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
          file={files.image}
          step="image"
          onDelete={() => {
            setFiles({ ...files, image: null })
            setCroppedImageUrl('')
          }}
          onChangeStep={handleChangeStep}
          thumbnail={croppedImageUrl}
        />
      </StepsContainer>
      <ImageCropDialog
        ref={dialogRef}
        imageType="videoThumbnail"
        onConfirm={(_, croppedImageUrl) => setCroppedImageUrl(croppedImageUrl)}
      />
    </MultiFileSelectContainer>
  )
}

export default MultiFileSelect
