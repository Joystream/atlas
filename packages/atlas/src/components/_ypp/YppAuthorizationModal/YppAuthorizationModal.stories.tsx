import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'

import { createApolloClient } from '@/api'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { YppAuthorizationModal, YppAuthorizationModalProps } from './YppAuthorizationModal'

export default {
  title: 'ypp/YppAuthorizationModal',

  component: YppAuthorizationModal,
  argTypes: {
    step: {
      options: ['select-channel', 'requirements', 'details', 'terms-and-conditions', 'summary', 'connect-with-yt'],
      control: { type: 'select' },
    },
    channels: { table: { disable: true } },
  },
  args: {
    show: true,
    step: 'requirements',
    channels: [
      {
        id: '1',
        title: 'The Joystreamers',
        createdAt: new Date(),
        follows: 12332,
        rewardAccount: '',
        channelStateBloatBond: '',
      },
      {
        id: '2',
        title: 'Joystream',
        createdAt: new Date(),
        follows: 987,
        rewardAccount: '',
        channelStateBloatBond: '',
      },
    ],
  },
} as Meta<YppAuthorizationModalProps>

const Template: Story<YppAuthorizationModalProps> = (args) => {
  const apolloClient = createApolloClient()
  return (
    <ApolloProvider client={apolloClient}>
      <OverlayManagerProvider>
        <YppAuthorizationModal {...args} />
      </OverlayManagerProvider>
    </ApolloProvider>
  )
}

export const Default = Template.bind({})
