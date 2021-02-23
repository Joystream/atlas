import React, { useCallback, useRef, useState } from 'react'
import { ActionDialogProps } from '../ActionDialog'
import {
  HiddenInput,
  CropContainer,
  StyledImage,
  StyledActionDialog,
  CropPlaceholder,
  HeaderContainer,
  AlignInfoContainer,
  AlignInfo,
  HeaderText,
  ZoomControl,
  StyledSlider,
} from './ImageCropDialog.style'
import { Icon } from '@/shared/components'
import { useCropper, CropperImageType } from './cropper'

export type ImageCropDialogProps = {
  imageType: CropperImageType
  onConfirm: (croppedBlob: Blob, croppedUrl: string) => void
  onCancel: () => void
} & Pick<ActionDialogProps, 'showDialog' | 'onExitClick'>

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  showDialog,
  imageType,
  onConfirm,
  onCancel,
  ...actionDialogProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null)
  const [editedImageHref, setEditedImageHref] = useState<string | null>(null)
  const { cropImage, currentZoom, handleZoomChange } = useCropper({ imageEl, imageType })

  const imageElRefCallback = (el: HTMLImageElement) => {
    setImageEl(el)
  }

  const handleDialogEnter = useCallback(() => {
    // open file picker on dialog open
    inputRef.current?.click()

    const handleWindowFocus = () => {
      // wait a bit so the browser can populate the input's value
      setTimeout(() => {
        const files = inputRef.current?.files
        if (!files?.length) {
          // no file selected, closing
          onCancel()
        }
      }, 500)
    }

    window.addEventListener('focus', handleWindowFocus, { once: true })
  }, [onCancel])

  const handleDialogExit = useCallback(() => {
    setEditedImageHref(null)
  }, [])

  const handleFileChange = () => {
    const files = inputRef.current?.files
    if (!files?.length) {
      console.error('no files selected')
      return
    }
    const selectedFile = files[0]
    const fileUrl = URL.createObjectURL(selectedFile)
    setEditedImageHref(fileUrl)
  }

  const handleConfirmClick = async () => {
    const [blob, url] = await cropImage()
    onConfirm(blob, url)
  }

  const zoomControlNode = (
    <ZoomControl>
      <Icon name="zoom-out" />
      <StyledSlider value={currentZoom} onChange={handleZoomChange} min={0.05} max={0.5} step={0.02} />
      <Icon name="zoom-in" />
    </ZoomControl>
  )

  return (
    <StyledActionDialog
      showDialog={showDialog}
      primaryButtonText="Confirm"
      onPrimaryButtonClick={handleConfirmClick}
      onEnter={handleDialogEnter}
      onExit={handleDialogExit}
      additionalActionsNode={zoomControlNode}
      {...actionDialogProps}
    >
      <HeaderContainer>
        <HeaderText variant="h6">Crop and position</HeaderText>
      </HeaderContainer>
      <AlignInfoContainer>
        <Icon name="position" />
        <AlignInfo variant="body2">Drag and adjust image position</AlignInfo>
      </AlignInfoContainer>
      {editedImageHref ? (
        <CropContainer rounded={imageType === 'avatar'}>
          <StyledImage src={editedImageHref} ref={imageElRefCallback} />
        </CropContainer>
      ) : (
        <CropPlaceholder />
      )}
      <HiddenInput type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
    </StyledActionDialog>
  )
}

export default ImageCropDialog
