import { Meta, StoryFn } from '@storybook/react'

import { SellTokenModal, SellTokenModalProps } from '@/components/_crt/SellTokenModal/SellTokenModal'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'

export default {
  title: 'crt/SellTokenModal',
  component: SellTokenModal,
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
} as Meta<SellTokenModalProps>

export const Default: StoryFn<SellTokenModalProps> = (args) => <SellTokenModal {...args} />
