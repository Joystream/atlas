import { Meta, StoryFn } from '@storybook/react'

import { CloseMarketModal, CloseMarketModalProps } from '@/components/_crt/CloseMarketModal/CloseMarketModal'
import { JoystreamProvider } from '@/providers/joystream/joystream.provider'
import { OverlayManagerProvider } from '@/providers/overlayManager'

export default {
  title: 'crt/CloseMarketModal',
  component: CloseMarketModal,
  decorators: [
    (Story) => (
      <JoystreamProvider>
        <OverlayManagerProvider>
          <Story />
        </OverlayManagerProvider>
      </JoystreamProvider>
    ),
  ],
} as Meta<CloseMarketModalProps>

const Template: StoryFn<CloseMarketModalProps> = (args) => <CloseMarketModal {...args} />

export const Default = Template.bind({})
