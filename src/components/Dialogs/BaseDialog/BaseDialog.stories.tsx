import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { Button } from '@/shared/components'

import { BaseDialogProps, BaseDialog as Dialog } from './BaseDialog'

export default {
  title: 'General/BaseDialog',
  component: Dialog,
  argTypes: {
    exitButton: { defaultValue: true },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<BaseDialogProps> = ({ exitButton }) => {
  return <Dialog exitButton={exitButton} showDialog={true} />
}

export const Regular = RegularTemplate.bind({})

const TransitionTemplate: Story<BaseDialogProps> = ({ exitButton }) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Open Dialog</Button>
      <Dialog exitButton={exitButton} onExitClick={() => setShowDialog(false)} showDialog={showDialog} />
    </>
  )
}

export const Transition = TransitionTemplate.bind({})
