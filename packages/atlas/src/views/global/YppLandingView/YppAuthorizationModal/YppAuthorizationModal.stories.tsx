import { ApolloProvider } from '@apollo/client'
import { Meta, Story } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { createApolloClient } from '@/api'
import { ConfirmationModalProvider } from '@/providers/confirmationModal'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { UserProvider } from '@/providers/user/user.provider'

import { YppAuthorizationModal, YppAuthorizationModalProps } from './YppAuthorizationModal'
import { YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT } from './YppAuthorizationModal.types'

export default {
  title: 'ypp/YppAuthorizationModal',

  component: YppAuthorizationModal,
  args: {
    step: 'requirements',
  },
  argTypes: {
    currentStepIdx: { table: { disable: true } },
    step: {
      control: { type: 'select', options: YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT },
    },
  },
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()
      return (
        <MemoryRouter>
          <ApolloProvider client={apolloClient}>
            <UserProvider>
              <ConfirmationModalProvider>
                <Story />
              </ConfirmationModalProvider>
            </UserProvider>
          </ApolloProvider>
        </MemoryRouter>
      )
    },
  ],
} as Meta<YppAuthorizationModalProps>

const Template: Story<
  YppAuthorizationModalProps & { step: typeof YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT[0] }
> = (args) => {
  const apolloClient = createApolloClient()
  const stepIdx = args.step ? YPP_AUTHORIZATION_STEPS_WITHOUT_CHANNEL_SELECT.indexOf(args.step) : null
  return (
    <ApolloProvider client={apolloClient}>
      <OverlayManagerProvider>
        <YppAuthorizationModal {...args} currentStepIdx={stepIdx} />
      </OverlayManagerProvider>
    </ApolloProvider>
  )
}

export const Default = Template.bind({})
