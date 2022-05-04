import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { ConfirmationDialogModal, ConfirmationDialogModalProps } from './ConfirmationDialogModal'

export default {
  title: 'overlays/ConfirmationDialogModal',
  component: ConfirmationDialogModal,
  argTypes: {
    onSubmit: { table: { disable: true } },
    onExitClick: { table: { disable: true } },
    as: { table: { disable: true } },
    contentClassName: { table: { disable: true } },
    additionalActionsNode: { table: { disable: true } },
    className: { table: { disable: true } },
    show: { table: { disable: true } },
    headerIcon: { table: { disable: true } },
    description: { type: 'string' },
  },
  args: {
    title: 'There is an information of the utmost importance!',
    primaryButton: { text: 'Confirm' },
    secondaryButton: { text: 'Cancel' },
    dividers: false,
    actionDivider: false,
    noContentPadding: false,
    description: '',
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta<ConfirmationDialogModalProps>

const OpenTemplate: Story<ConfirmationDialogModalProps> = ({ ...args }) => {
  return (
    <ConfirmationDialogModal {...args} show={true} onExitClick={() => null}>
      <p>Content spanning multiple lines</p>
      <p>Content spanning multiple lines</p>
      <p>Content spanning multiple lines</p>
    </ConfirmationDialogModal>
  )
}
export const Open = OpenTemplate.bind({})

const ToggleableTemplate: Story<ConfirmationDialogModalProps> = ({ ...args }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <ConfirmationDialogModal
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
      </ConfirmationDialogModal>
    </>
  )
}
export const Toggleable = ToggleableTemplate.bind({})

export const WithLink = OpenTemplate.bind({})

WithLink.args = {
  primaryButton: {
    text: 'Go to google',
    to: 'https://google.com',
  },
}
