import { ApolloProvider } from '@apollo/client'
import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { AssetsManager } from '@/providers/assets/assets.manager'
import { OperatorsContextProvider } from '@/providers/assets/assets.provider'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'

import { ChannelLink, ChannelLinkProps } from './ChannelLink'

export default {
  title: 'channel/ChannelLink',
  component: ChannelLink,
  argTypes: {
    onClick: { table: { disable: true } },
    onNotFound: { table: { disable: true } },
    overrideChannel: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    id: '11',
    hideHandle: false,
    hideAvatar: false,
    noLink: false,
    textSecondary: false,
    followButton: false,
  },
} as Meta

const Template: StoryFn<ChannelLinkProps> = (args) => {
  const apolloClient = createApolloClient()
  return (
    <BrowserRouter>
      <ConfirmationModalProvider>
        <ApolloProvider client={apolloClient}>
          <OperatorsContextProvider>
            <AssetsManager />
            <ChannelLink {...args} />
          </OperatorsContextProvider>
        </ApolloProvider>
      </ConfirmationModalProvider>
    </BrowserRouter>
  )
}

export const Default = Template.bind({})
