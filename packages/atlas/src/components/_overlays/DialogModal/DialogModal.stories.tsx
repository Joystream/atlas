import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { DialogModal, DialogModalProps } from './DialogModal'

export default {
  title: 'overlays/DialogModal',
  component: DialogModal,
  argTypes: {
    onSubmit: { table: { disable: true } },
    onExitClick: { table: { disable: true } },
    contentClassName: { table: { disable: true } },
    additionalActionsNode: { table: { disable: true } },
    show: { table: { disable: true } },
    headerIcon: { table: { disable: true } },
  },
  args: {
    title: 'There is an information of the utmost importance!',
    primaryButton: { text: 'Confirm' },
    secondaryButton: { text: 'Cancel' },
    dividers: false,
    actionDivider: false,
    noContentPadding: false,
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta<DialogModalProps>

const OpenTemplate: StoryFn<DialogModalProps> = ({ ...args }) => {
  return (
    <DialogModal {...args} show={true} onExitClick={() => null}>
      <p>Content spanning multiple lines</p>
      <p>Content spanning multiple lines</p>
      <p>Content spanning multiple lines</p>
    </DialogModal>
  )
}
export const Open = OpenTemplate.bind({})

const ToggleableTemplate: StoryFn<DialogModalProps> = ({ ...args }) => {
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
          text: args.primaryButton && 'text' in args.primaryButton ? args.primaryButton?.text : 'Default',
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

export const WithLink = OpenTemplate.bind({})

WithLink.args = {
  primaryButton: {
    text: 'Go to google',
    to: 'https://google.com',
  },
}

export const WithAdditionalNode = OpenTemplate.bind({})
WithAdditionalNode.args = {
  additionalActionsNodeMobilePosition: 'bottom',
  additionalActionsNode: (
    <Button
      size="medium"
      variant="tertiary"
      to="https://joystream.gitbook.io/testnet-workspace/system/fees"
      openLinkInNewTab
    >
      Learn more
    </Button>
  ),
}
