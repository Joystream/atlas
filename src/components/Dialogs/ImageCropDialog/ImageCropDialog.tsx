import React, { useCallback, useEffect, useRef, useState } from 'react'
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
} from './ImageCropDialog.style'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import { Icon } from '@/shared/components'

export type ImageCropDialogProps = {
  imageType: 'avatar' | 'videoThumbnail' | 'cover'
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
  const imageRef = useRef<HTMLImageElement>(null)
  const [cropper, setCropper] = useState<Cropper | null>(null)
  const [editedImageHref, setEditedImageHref] = useState<string | null>(null)

  useEffect(() => {
    if (!editedImageHref) {
      return
    }

    if (!imageRef.current) {
      console.error('no image ref!')
      return
    }

    const cropper = new Cropper(imageRef.current, {
      viewMode: 1,
      dragMode: 'move',
      cropBoxResizable: false,
      cropBoxMovable: false,
      aspectRatio: 1,
      guides: false,
      center: false,
      background: false,
      autoCropArea: 0.9,
    })
    setCropper(cropper)

    return () => {
      console.log('cropper destroy')
      cropper.destroy()
    }
  }, [editedImageHref])

  const handleDialogEnter = useCallback(() => {
    // open file picker on mount
    if (inputRef.current) {
      inputRef.current.click()
    } else {
      // TODO remove
      console.warn('no current :(')
    }
  }, [])

  const handleDialogExit = useCallback(() => {
    console.log('handleDialogExit')
    setEditedImageHref(null)
  }, [])

  const handleFileChange = () => {
    // TODO: handle no file selected, probably with window focus event
    const files = inputRef.current?.files
    if (!files?.length) {
      console.error('no files selected')
      return
    }
    const selectedFile = files[0]
    const fileUrl = URL.createObjectURL(selectedFile)
    setEditedImageHref(fileUrl)
  }

  const handleConfirmClick = () => {
    if (!cropper) {
      return
    }

    // TODO adjust for different types
    cropper
      .getCroppedCanvas({
        minWidth: 128,
        minHeight: 128,
        width: 256,
        height: 256,
        maxWidth: 1024,
        maxHeight: 1024,
      })
      .toBlob((blob) => {
        if (!blob) {
          console.error('Empty blob from cropped canvas', { blob })
          return
        }
        const url = URL.createObjectURL(blob)
        onConfirm(blob, url)
      })
  }

  return (
    <StyledActionDialog
      showDialog={showDialog}
      primaryButtonText="Confirm"
      onPrimaryButtonClick={handleConfirmClick}
      onEnter={handleDialogEnter}
      onExit={handleDialogExit}
      {...actionDialogProps}
    >
      <HeaderContainer>
        <HeaderText variant="h6">Crop and position</HeaderText>
      </HeaderContainer>
      <AlignInfoContainer>
        <Icon name="drag" />
        <AlignInfo variant="body2">Drag and adjust image position</AlignInfo>
      </AlignInfoContainer>
      {editedImageHref ? (
        <CropContainer rounded={imageType === 'avatar'}>
          <StyledImage src={editedImageHref} ref={imageRef} />
        </CropContainer>
      ) : (
        <CropPlaceholder />
      )}
      <HiddenInput type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
    </StyledActionDialog>
  )
}

export default ImageCropDialog
