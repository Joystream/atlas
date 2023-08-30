import { Meta, StoryFn } from '@storybook/react'

import { BuyMarketTokenModal, BuySaleTokenModalProps } from '@/components/_crt/BuyMarketTokenModal/BuyMarketTokenModal'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'

export default {
  title: 'crt/BuyMarketTokenModal',
  component: BuyMarketTokenModal,
  args: {
    onClose: () => undefined,
    tokenId: '',
  },
  decorators: [
    (Story) => {
      return (
        <JoystreamProvider>
          <OverlayManagerProvider>
            <Story />
          </OverlayManagerProvider>
        </JoystreamProvider>
      )
    },
  ],
} as Meta<BuySaleTokenModalProps>

const Template: StoryFn<BuySaleTokenModalProps> = (args) => <BuyMarketTokenModal {...args} />

export const Default = Template.bind({})
