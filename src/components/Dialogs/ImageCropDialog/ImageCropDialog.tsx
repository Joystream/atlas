import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { ActionDialogProps } from '../ActionDialog'
import {
  HiddenInput,
  CropContainer,
  StyledImage,
  StyledActionDialog,
  HeaderContainer,
  AlignInfoContainer,
  AlignInfo,
  HeaderText,
  ZoomControl,
  StyledSlider,
} from './ImageCropDialog.style'
import { Icon } from '@/shared/components'
import { ImageCropData } from '@/types/cropper'
import { useCropper, CropperImageType } from './cropper'

export type ImageCropDialogProps = {
  imageType: CropperImageType
  onConfirm: (croppedBlob: Blob, croppedUrl: string, imageCropData: ImageCropData) => void
} & Pick<ActionDialogProps, 'onExitClick'>

export type ImageCropDialogImperativeHandle = {
  open: (file?: File) => void
}

const ImageCropDialogComponent: React.ForwardRefRenderFunction<
  ImageCropDialogImperativeHandle,
  ImageCropDialogProps
> = ({ imageType, onConfirm, onExitClick }, ref) => {
  const [showDialog, setShowDialog] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null)
  const [editedImageHref, setEditedImageHref] = useState<string | null>(null)
  const { currentZoom, zoomRange, zoomStep, handleZoomChange, cropImage } = useCropper({ imageEl, imageType })

  // not great - ideally we'd have a data flow trigger this via prop change
  // however, since there's no way to detect whether the file pick succeeds, the component wouldn't be able to report back whether it was actually opened
  // because of that we're letting the consumer trigger the open manually
  useImperativeHandle(ref, () => ({
    open: (file) => {
      if (file) {
        const fileUrl = URL.createObjectURL(file)
        setEditedImageHref(fileUrl)
        setShowDialog(true)
      } else {
        inputRef.current?.click()
      }
    },
  }))

  const imageElRefCallback = (el: HTMLImageElement) => {
    setImageEl(el)
  }

  const resetDialog = useCallback(() => {
    setShowDialog(false)
    setEditedImageHref(null)
    if (inputRef.current) {
      // clear the file input so onChange is triggered if the same file is selected again
      inputRef.current.value = ''
    }
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
    setShowDialog(true)
  }

  const handleConfirmClick = async () => {
    const [blob, url, imageCropData] = await cropImage()
    resetDialog()
    onConfirm(blob, url, imageCropData)
  }

  const zoomControlNode = (
    <ZoomControl>
      <Icon name="zoom-out" />
      <StyledSlider
        value={currentZoom}
        onChange={handleZoomChange}
        min={zoomRange[0]}
        max={zoomRange[1]}
        step={zoomStep}
      />
      <Icon name="zoom-in" />
    </ZoomControl>
  )

  return (
    <>
      <HiddenInput type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
      <StyledActionDialog
        showDialog={showDialog && !!editedImageHref}
        primaryButtonText="Confirm"
        onPrimaryButtonClick={handleConfirmClick}
        onExitClick={resetDialog}
        additionalActionsNode={zoomControlNode}
      >
        <HeaderContainer>
          <HeaderText variant="h6">Crop and position</HeaderText>
        </HeaderContainer>
        <AlignInfoContainer>
          <Icon name="position" />
          <AlignInfo variant="body2">Drag and adjust image position</AlignInfo>
        </AlignInfoContainer>
        {editedImageHref && (
          <CropContainer rounded={imageType === 'avatar'}>
            <StyledImage src={editedImageHref} ref={imageElRefCallback} />
          </CropContainer>
        )}
      </StyledActionDialog>
    </>
  )
}

const ImageCropDialog = forwardRef(ImageCropDialogComponent)
ImageCropDialog.displayName = 'ImageCropDialog'

export default ImageCropDialog
