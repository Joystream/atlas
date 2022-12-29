import { useCallback, useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'

import { FileSelect } from '@/components/_inputs/FileSelect'
import { FileErrorType, ImageInputFile } from '@/components/_inputs/MultiFileSelect'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { validateImage } from '@/utils/image'
import { SentryLogger } from '@/utils/logs'

type ImageUploadAndCropProps = {
  onImageChange: (arg: ImageInputFile | null) => void
  editMode?: boolean
  disabled?: boolean
  className?: string
  file?: ImageInputFile
  maxSize?: number
}

export const ImageUploadAndCrop = ({
  file,
  onImageChange,
  editMode,
  disabled,
  maxSize,
  className,
}: ImageUploadAndCropProps) => {
  const dialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const [isImgLoading, setIsImgLoading] = useState(false)
  const [rawImageFile, setRawImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const updateImageFile = (
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
    onImageChange(updatedThumbnail)
    setIsImgLoading(true)
  }

  const handleUploadFile = async (file: File) => {
    try {
      await validateImage(file)
      setRawImageFile(file)
      dialogRef.current?.open(file)
    } catch (error) {
      handleFileSelectError?.('file-invalid-type')
    }
  }

  const handleReAdjustThumbnail = async () => {
    if (!editMode || disabled) {
      return
    }
    if (file?.url && !file?.originalBlob) {
      const newFile = await fetch(file.url)
        .then((r) => r.blob())
        .then((blobFile) => new File([blobFile], 'temporary-file', { type: 'image/png' }))
      setRawImageFile(newFile)
      dialogRef.current?.open(newFile, undefined, true)
    }
    if (file?.originalBlob) {
      dialogRef.current?.open(file.originalBlob, file.imageCropData, true)
    }
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
    handleFileSelectError(firstError.code)
  }

  const handleFileSelectError = useCallback((errorCode: FileErrorType | null) => {
    if (!errorCode) {
      setError(null)
    } else if (errorCode === 'file-invalid-type') {
      setError(`Preferred 16:9 image ratio`)
    } else if (errorCode === 'file-too-large') {
      setError('File too large')
    } else {
      SentryLogger.error('Unknown file select error', 'MultiFileSelect', null, { error: { code: errorCode } })
      setError('Unknown error')
    }
  }, [])

  const handleDeleteFile = useCallback(() => {
    onImageChange(null)
    setIsImgLoading(false)
  }, [onImageChange])

  useEffect(() => {
    if (!isImgLoading) {
      return
    }
    const timeout = setTimeout(() => {
      if (isImgLoading) {
        setIsImgLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [isImgLoading])

  return (
    <div className={className}>
      <FileSelect
        type="playlist-thumbnail"
        thumbnailEditable={editMode && !disabled}
        file={file?.blob as File}
        maxSize={maxSize}
        onUploadFile={handleUploadFile}
        onReAdjustThumbnail={handleReAdjustThumbnail}
        isFileLoading={isImgLoading}
        thumbnailUrl={file?.url}
        error={error}
        onError={setError}
        onDropRejected={handleFileRejections}
      />
      <ImageCropModal
        ref={dialogRef}
        imageType="videoThumbnail"
        onConfirm={updateImageFile}
        onDelete={() => handleDeleteFile()}
      />
    </div>
  )
}
