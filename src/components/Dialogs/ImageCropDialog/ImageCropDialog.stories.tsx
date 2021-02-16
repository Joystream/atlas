import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import ImageCropDialog, { ImageCropDialogProps } from './ImageCropDialog'
import { Avatar } from '@/shared/components'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

export default {
  title: 'General/ImageCropDialog',
  component: ImageCropDialog,
  argTypes: {
    showDialog: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<ImageCropDialogProps> = (args) => {
  const [showDialog, setShowDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleConfirm = (blob: Blob, url: string) => {
    setImageUrl(url)
    setShowDialog(false)
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  return (
    <>
      <Avatar imageUrl={imageUrl} editable onEditClick={() => setShowDialog(true)} size="cover" />
      <ImageCropDialog
        imageType="avatar"
        showDialog={showDialog}
        onExitClick={handleClose}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />
    </>
  )
}
export const Regular = RegularTemplate.bind({})
