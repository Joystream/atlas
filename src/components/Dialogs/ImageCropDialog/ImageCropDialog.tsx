import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'

import { IconButton } from '@/shared/components'
import { SvgGlyphPan, SvgGlyphZoomIn, SvgGlyphZoomOut } from '@/shared/icons'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { validateImage } from '@/utils/image'
import { Logger } from '@/utils/logger'

import {
  AlignInfo,
  AlignInfoContainer,
  CropContainer,
  HeaderContainer,
  HeaderText,
  HiddenInput,
  StyledActionDialog,
  StyledImage,
  StyledSlider,
  ZoomControl,
} from './ImageCropDialog.style'
import { CropperImageType, useCropper } from './cropper'

import { ActionDialogProps } from '../ActionDialog'

export type ImageCropDialogProps = {
  imageType: CropperImageType
  onConfirm: (
    croppedBlob: Blob,
    croppedUrl: string,
    assetDimensions: AssetDimensions,
    imageCropData: ImageCropData
  ) => void
  onError?: (error: Error) => void
} & Pick<ActionDialogProps, 'onExitClick'>

export type ImageCropDialogImperativeHandle = {
  open: (file?: File | Blob, cropData?: ImageCropData) => void
}

const ImageCropDialogComponent: React.ForwardRefRenderFunction<
  ImageCropDialogImperativeHandle,
  ImageCropDialogProps
> = ({ imageType, onConfirm, onError }, ref) => {
  const [showDialog, setShowDialog] = useState(false)
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
        setShowDialog(true)
      } else {
        inputRef.current?.click()
        if (cropData) setCropData(cropData)
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

  const handleFileChange = async () => {
    const files = inputRef.current?.files
    if (!files?.length) {
      Logger.error('no files selected')
      return
    }
    try {
      const selectedFile = files[0]
      await validateImage(selectedFile)
      const fileUrl = URL.createObjectURL(selectedFile)
      setEditedImageHref(fileUrl)
      setShowDialog(true)
    } catch (error) {
      onError?.(error)
      Logger.error(error)
    }
  }

  const handleConfirmClick = async () => {
    const [blob, url, assetDimensions, imageCropData] = await cropImage()
    resetDialog()
    onConfirm(blob, url, assetDimensions, imageCropData)
  }

  const zoomControlNode = (
    <ZoomControl>
      <IconButton
        variant="tertiary"
        onClick={() => handleZoomChange(currentZoom - zoomStep)}
        disabled={cropEditDisabled}
      >
        <SvgGlyphZoomOut />
      </IconButton>
      <StyledSlider
        value={currentZoom}
        onChange={handleZoomChange}
        min={zoomRange[0]}
        max={zoomRange[1]}
        step={zoomStep}
        disabled={cropEditDisabled}
      />
      <IconButton
        variant="tertiary"
        onClick={() => handleZoomChange(currentZoom + zoomStep)}
        disabled={cropEditDisabled}
      >
        <SvgGlyphZoomIn />
      </IconButton>
    </ZoomControl>
  )

  return (
    <>
      <HiddenInput type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
      <StyledActionDialog
        showDialog={showDialog && !!editedImageHref}
        primaryButton={{ text: 'Confirm', onClick: handleConfirmClick }}
        onExitClick={resetDialog}
        additionalActionsNode={zoomControlNode}
      >
        <HeaderContainer>
          <HeaderText variant="h6">Crop and position</HeaderText>
        </HeaderContainer>
        <AlignInfoContainer>
          <SvgGlyphPan />
          <AlignInfo variant="body2">Drag and adjust image position</AlignInfo>
        </AlignInfoContainer>
        {editedImageHref && (
          <CropContainer rounded={imageType === 'avatar'} disabled={cropEditDisabled}>
            <StyledImage src={editedImageHref} ref={imageElRefCallback} />
          </CropContainer>
        )}
      </StyledActionDialog>
    </>
  )
}

export const ImageCropDialog = forwardRef(ImageCropDialogComponent)
ImageCropDialog.displayName = 'ImageCropDialog'
