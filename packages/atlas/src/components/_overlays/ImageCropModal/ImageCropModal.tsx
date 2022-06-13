import { ForwardRefRenderFunction, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionPan, SvgActionZoomIn, SvgActionZoomOut } from '@/components/_icons'
import { DialogModalProps } from '@/components/_overlays/DialogModal'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { validateImage } from '@/utils/image'
import { SentryLogger } from '@/utils/logs'

import {
  AlignInfoContainer,
  CropContainer,
  HiddenInput,
  StyledDialogModal,
  StyledImage,
  StyledSlider,
  ZoomControl,
} from './ImageCropModal.styles'
import { CropperImageType, useCropper } from './cropper'

export type ImageCropModalProps = {
  imageType: CropperImageType
  onConfirm: (
    croppedBlob: Blob,
    croppedUrl: string,
    assetDimensions: AssetDimensions,
    imageCropData: ImageCropData
  ) => void
  onError?: (error: Error) => void
} & Pick<DialogModalProps, 'onExitClick'>

export type ImageCropModalImperativeHandle = {
  open: (file?: File | Blob, cropData?: ImageCropData) => void
}

const ImageCropModalComponent: ForwardRefRenderFunction<ImageCropModalImperativeHandle, ImageCropModalProps> = (
  { imageType, onConfirm, onError },
  ref
) => {
  const [showModal, setShowModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null)
  const [editedImageHref, setEditedImageHref] = useState<string | null>(null)
  const [cropData, setCropData] = useState<ImageCropData | null>(null)
  const { currentZoom, zoomRange, zoomStep, handleZoomChange, cropImage } = useCropper({
    imageEl,
    imageType,
    cropData,
  })

  const cropEditDisabled = !!cropData

  // not great - ideally we'd have a data flow trigger this via prop change
  // however, since there's no way to detect whether the file pick succeeds, the component wouldn't be able to report back whether it was actually opened
  // because of that we're letting the consumer trigger the open manually
  useImperativeHandle(ref, () => ({
    open: (file, cropData) => {
      if (file) {
        const fileUrl = URL.createObjectURL(file)
        setEditedImageHref(fileUrl)
        setShowModal(true)
      } else {
        inputRef.current?.click()
        if (cropData) setCropData(cropData)
      }
    },
  }))

  const imageElRefCallback = (el: HTMLImageElement) => {
    setImageEl(el)
  }

  const resetModal = useCallback(() => {
    setShowModal(false)
    setEditedImageHref(null)
    if (inputRef.current) {
      // clear the file input so onChange is triggered if the same file is selected again
      inputRef.current.value = ''
    }
  }, [])

  const handleFileChange = async () => {
    const files = inputRef.current?.files
    if (!files?.length) {
      SentryLogger.error('No files selected for image cropping', 'ImageCropModal')
      return
    }
    const selectedFile = files[0]
    try {
      await validateImage(selectedFile)
      const fileUrl = URL.createObjectURL(selectedFile)
      setEditedImageHref(fileUrl)
      setShowModal(true)
    } catch (error) {
      onError?.(error)
      SentryLogger.error('Failed to load image for image cropping', 'ImageCropModal', error, {
        file: { name: selectedFile.name, type: selectedFile.type, size: selectedFile.size },
      })
    }
  }

  const handleConfirmClick = async () => {
    const [blob, url, assetDimensions, imageCropData] = await cropImage()
    resetModal()
    onConfirm(blob, url, assetDimensions, imageCropData)
  }

  const zoomControlNode = (
    <ZoomControl>
      <Button
        icon={<SvgActionZoomOut />}
        variant="tertiary"
        onClick={() => handleZoomChange(currentZoom - zoomStep)}
        disabled={cropEditDisabled}
      />
      <StyledSlider
        value={currentZoom}
        onChange={handleZoomChange}
        min={zoomRange[0]}
        max={zoomRange[1]}
        step={zoomStep}
        disabled={cropEditDisabled}
      />
      <Button
        icon={<SvgActionZoomIn />}
        variant="tertiary"
        onClick={() => handleZoomChange(currentZoom + zoomStep)}
        disabled={cropEditDisabled}
      />
    </ZoomControl>
  )

  return (
    <>
      <HiddenInput type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
      <StyledDialogModal
        title="Crop and position"
        show={showModal && !!editedImageHref}
        primaryButton={{ text: 'Confirm', onClick: handleConfirmClick }}
        onExitClick={resetModal}
        additionalActionsNode={zoomControlNode}
        dividers
      >
        <AlignInfoContainer>
          <SvgActionPan />
          <Text as="span" variant="t200" margin={{ left: 2 }}>
            Drag and adjust image position
          </Text>
        </AlignInfoContainer>
        {editedImageHref && (
          <CropContainer rounded={imageType === 'avatar'} disabled={cropEditDisabled}>
            <StyledImage src={editedImageHref} ref={imageElRefCallback} />
          </CropContainer>
        )}
      </StyledDialogModal>
    </>
  )
}

export const ImageCropModal = forwardRef(ImageCropModalComponent)
ImageCropModal.displayName = 'ImageCropModal'
