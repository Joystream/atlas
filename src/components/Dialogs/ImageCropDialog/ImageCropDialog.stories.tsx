import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import ImageCropDialog, { ImageCropDialogProps } from './ImageCropDialog'
import { Button } from '@/shared/components'
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

  const handleClose = () => {
    setShowDialog(false)
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Open Dialog</Button>
      <ImageCropDialog showDialog={showDialog} onExitClick={handleClose} onCancel={handleClose} />
    </>
  )
}
export const Regular = RegularTemplate.bind({})
