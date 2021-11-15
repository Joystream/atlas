import { Meta, Story } from '@storybook/react'
import React from 'react'

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

const RegularTemplate: Story<ModalProps> = () => {
  return <Modal show={true}>Modal content</Modal>
}

export const Regular = RegularTemplate.bind({})
