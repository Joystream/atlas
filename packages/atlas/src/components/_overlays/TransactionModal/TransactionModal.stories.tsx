import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ExtrinsicStatus } from '@/joystream-lib'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { TransactionModal, TransactionModalProps } from './TransactionModal'

export default {
  title: 'overlays/TransactionModal',
  component: TransactionModal,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<TransactionModalProps> = ({ ...args }) => {
  return <TransactionModal {...args} status={ExtrinsicStatus.Unsigned} />
}
export const Regular = RegularTemplate.bind({})
