import React, { useRef, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { computeFileHash } from '@/utils/hashing'

export const AutomaticCrop: React.FC = () => {
  const [cropData, setCropData] = useState<ImageCropData>()
  const [initialHash, setInitialHash] = useState('')
  const [automaticCropHash, setAutomaticCropHash] = useState('')

  const initialCropDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const automaticCropDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const handleInitialCrop = async (
    croppedBlob: Blob,
    url: string,
    assetDimensions: AssetDimensions,
    imageCropData: ImageCropData
  ) => {
    const fileHash = await computeFileHash(croppedBlob)
    setCropData(imageCropData)
    setInitialHash(fileHash)
  }

  const handleAutomaticCrop = async (croppedBlob: Blob) => {
    const fileHash = await computeFileHash(croppedBlob)
    setAutomaticCropHash(fileHash)
  }

  return (
    <>
      <div style={{ display: 'grid', gridGap: '10px', width: '250px' }}>
        <Button onClick={() => initialCropDialogRef.current?.open()}>initial crop</Button>
        <Button onClick={() => automaticCropDialogRef.current?.open(undefined, cropData)}>automatic crop</Button>
      </div>
      <div>
        <p>Initial hash: {initialHash}</p>
        <p>Automatic crop hash: {automaticCropHash}</p>
      </div>
      <ImageCropModal ref={initialCropDialogRef} imageType="avatar" onConfirm={handleInitialCrop} />
      <ImageCropModal ref={automaticCropDialogRef} imageType="avatar" onConfirm={handleAutomaticCrop} />
    </>
  )
}
