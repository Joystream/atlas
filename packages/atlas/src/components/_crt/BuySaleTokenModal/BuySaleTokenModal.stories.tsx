import { Meta, StoryFn } from '@storybook/react'

import { BuySaleTokenModal, BuySaleTokenModalProps } from '@/components/_crt/BuySaleTokenModal/BuySaleTokenModal'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'

export default {
  title: 'crt/BuySaleTokenModal',
  component: BuySaleTokenModal,
  decorators: [
    (Story) => (
      <JoystreamProvider>
        <OverlayManagerProvider>
          <Story />
        </OverlayManagerProvider>
      </JoystreamProvider>
    ),
  ],
} as Meta<BuySaleTokenModalProps>

const Template: StoryFn<BuySaleTokenModalProps> = (args) => <BuySaleTokenModal {...args} />

export const Default = Template.bind({})
