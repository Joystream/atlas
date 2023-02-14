import { Meta, Story } from '@storybook/react'

import { OverlayManagerProvider } from '@/providers/overlayManager'

import { ConnectWithYtModal, ConnectWithYtModalProps } from './ConnectWithYtModal'

export default {
  title: 'overlays/ConnectWithYtModal',
  component: ConnectWithYtModal,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta<ConnectWithYtModalProps>

const Template: Story<ConnectWithYtModalProps> = ({ ...args }) => {
  return <ConnectWithYtModal {...args} show={true} />
}
export const Default = Template.bind({})
