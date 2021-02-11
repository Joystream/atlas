import React, { useState } from 'react'
import Dialog, { DialogProps } from './GeneralDialog'
import { Story, Meta } from '@storybook/react'
import { Button } from '@/shared/components'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

export default {
  title: 'General components/General Dialog',
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

const RegularTemplate: Story<DialogProps> = ({ exitButton }) => {
  return <Dialog exitButton={exitButton} showDialog={true} />
}

export const Regular = RegularTemplate.bind({})

const TransitionTemplate: Story<DialogProps> = ({ exitButton }) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Open Dialog</Button>
      <Dialog exitButton={exitButton} handleExit={() => setShowDialog(false)} showDialog={showDialog} />
    </>
  )
}

export const Transition = TransitionTemplate.bind({})
