import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { Button } from '@/shared/components/Button'

import { DialogModal, DialogModalProps } from './DialogModal'

export default {
  title: 'overlays/DialogModal',
  component: DialogModal,
  args: {
    title: 'There is an information of the utmost importance!',
    primaryButton: { text: 'Confirm' },
    secondaryButton: { text: 'Cancel' },
    iconType: '',
    dividers: false,
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const OpenTemplate: Story<DialogModalProps> = ({ ...args }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <DialogModal {...args} show={true} onExitClick={() => {}}>
      <p>Content spanning multiple lines</p>
      <p>Content spanning multiple lines</p>
      <p>Content spanning multiple lines</p>
    </DialogModal>
  )
}
export const Open = OpenTemplate.bind({})

const ToggleableTemplate: Story<DialogModalProps> = ({ ...args }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <DialogModal
        {...args}
        show={open}
        onExitClick={() => setOpen(false)}
        primaryButton={{
          ...args.primaryButton,
          text: args.primaryButton?.text || 'Default',
          onClick: () => setOpen(false),
        }}
        secondaryButton={{
          ...args.secondaryButton,
          text: args.secondaryButton?.text || 'Default',
          onClick: () => setOpen(false),
        }}
      >
        <p>Content spanning multiple lines</p>
        <p>Content spanning multiple lines</p>
        <p>Content spanning multiple lines</p>
      </DialogModal>
    </>
  )
}
export const Toggleable = ToggleableTemplate.bind({})
