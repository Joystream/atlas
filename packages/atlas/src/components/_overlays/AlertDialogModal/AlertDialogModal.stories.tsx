import { Meta, Story } from '@storybook/react'
import { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { AlertDialogModal, AlertDialogModalProps } from './AlertDialogModal'

export default {
  title: 'overlays/AlertDialogModal',
  component: AlertDialogModal,
  argTypes: {
    onSubmit: { table: { disable: true } },
    className: { table: { disable: true } },
    show: { table: { disable: true } },
    onExitClick: { table: { disable: true } },
  },
  args: {
    title: 'There is an information of the utmost importance!',
    description: 'This is description',
    primaryButton: { text: 'Delete video' },
    secondaryButton: { text: 'Cancel' },
    type: 'informative',
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta<AlertDialogModalProps>

const OpenTemplate: Story<AlertDialogModalProps> = ({ ...args }) => {
  return <AlertDialogModal {...args} show={true} />
}
export const Open = OpenTemplate.bind({})

const ToggleableTemplate: Story<AlertDialogModalProps> = ({ ...args }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <AlertDialogModal
        {...args}
        show={open}
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
      />
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
