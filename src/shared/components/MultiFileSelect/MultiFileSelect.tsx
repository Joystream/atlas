import ImageCropDialog from '@/components/Dialogs/ImageCropDialog'
import React, { useRef, useState } from 'react'
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
  const [files, setFiles] = useState<FileState>({
    video: null,
    image: null,
  })
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>()

  const dialogRef = useRef(null)

  const [step, setStep] = useState<Step>('video')
  const [image, setImage] = useState<string>()

  const handleUploadFile = (file: File) => {
    if (file.type.includes('video')) {
      setFiles({
        ...files,
        video: file,
      })
      setStep('image')
    }
    if (file.type.includes('image')) {
      setFiles({
        ...files,
        image: file,
      })
      // @ts-ignore for now
      dialogRef.current.open(file)
    }
  }

  return (
    <MultiFileSelectContainer>
      {croppedImageUrl ? (
        <img src={croppedImageUrl} style={{ width: '100%', objectFit: 'cover' }} alt="video thumbnail" />
      ) : (
        <FileDrop
          onUploadFile={handleUploadFile}
          step={step}
          icon={step === 'video' ? 'video-dnd' : 'image-dnd'}
          title={step === 'video' ? 'Select Video File' : 'Add Thumbnail Image'}
          paragraph={
            step === 'video'
              ? `16:9 Ratio preferred. 4K, 1440p, 1080p or 720p. This is example FPO data only.`
              : `Accepting JPG, PNG formats. Can't exceed 20MB (Example data).`
          }
        />
      )}
      <StepsContainer>
        <FileStep
          step={1}
          active={step === 'video'}
          file={files.video}
          type="video"
          onDelete={() => setFiles({ ...files, video: null })}
        />
        <StepDivider>
          <Icon name="chevron-right" />
        </StepDivider>
        <FileStep
          step={2}
          active={step === 'image'}
          file={files.image}
          type="image"
          thumbnailImage={croppedImageUrl}
          onDelete={() => setFiles({ ...files, image: null })}
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
