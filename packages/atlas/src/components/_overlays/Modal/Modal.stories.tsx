import { Meta, StoryFn } from '@storybook/react'

import { OverlayManagerProvider } from '@/providers/overlayManager'

import { Modal, ModalProps } from './Modal'

export default {
  title: 'overlays/Modal',
  component: Modal,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: StoryFn<ModalProps> = () => {
  return <Modal show={true}>Modal content</Modal>
}

export const Regular = RegularTemplate.bind({})
