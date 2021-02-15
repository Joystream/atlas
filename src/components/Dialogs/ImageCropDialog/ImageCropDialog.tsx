import React, { useCallback, useEffect, useRef } from 'react'
import ActionDialog, { ActionDialogProps } from '../ActionDialog'
import { HiddenInput } from './ImageCropDialog.style'

// eslint-disable-next-line @typescript-eslint/ban-types
export type ImageCropDialogProps = {
  onCancel: () => void
} & Pick<ActionDialogProps, 'showDialog' | 'onExitClick'>

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({ showDialog, onCancel, ...actionDialogProps }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelectClosed = useCallback(() => {
    const files = inputRef.current?.files

    if (!files || files.length !== 1) {
      if (files && files.length > 1) {
        console.warn('more than 1 file selected')
      }
      onCancel()
      return
    }

    console.log(files)
  }, [onCancel])

  useEffect(() => {
    if (!showDialog) {
      return
    }

    // open file picker on mount
    if (inputRef.current) {
      inputRef.current.click()
      window.addEventListener('focus', handleFileSelectClosed, { once: true })
    } else {
      // TODO remove
      console.warn('no current :(')
    }
  }, [showDialog, handleFileSelectClosed])

  // useEffect(() => {
  //   window.addEventListener('focus', handleWindowFocus)
  //   return () => {
  //     window.removeEventListener('focus', handleWindowFocus)
  //   }
  // }, [handleWindowFocus])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange')
  }

  return (
    <ActionDialog showDialog={showDialog} exitButton {...actionDialogProps}>
      <HiddenInput type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
      This is image crop
    </ActionDialog>
  )
}

export default ImageCropDialog
