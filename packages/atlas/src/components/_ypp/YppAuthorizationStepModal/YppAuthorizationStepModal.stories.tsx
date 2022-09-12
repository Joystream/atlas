import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'

import { createApolloClient } from '@/api'
import { OverlayManagerProvider } from '@/providers/overlayManager'

import { YppAuthorizationStepModal, YppAuthorizationStepModalProps } from './YppAuthorizationStepModal'

export default {
  title: 'ypp/YppAuthorizationStepModal',

  component: YppAuthorizationStepModal,
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
} as Meta<YppAuthorizationStepModalProps>

const Template: Story<YppAuthorizationStepModalProps> = (args) => {
  const apolloClient = createApolloClient()
  return (
    <ApolloProvider client={apolloClient}>
      <OverlayManagerProvider>
        <YppAuthorizationStepModal {...args} />
      </OverlayManagerProvider>
    </ApolloProvider>
  )
}

export const Default = Template.bind({})
