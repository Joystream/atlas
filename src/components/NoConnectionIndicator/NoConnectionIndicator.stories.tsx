import React from 'react'
import { Story, Meta } from '@storybook/react'
import NoConnectionIndicator, { NoConnectionIndicatorProps } from './NoConnectionIndicator'
import { ConnectionStatusProvider, SnackbarProvider } from '@/hooks'

export default {
  title: 'General/NoConnectionIndicator',
  component: NoConnectionIndicator,
  argTypes: {
    connectionStatus: { defaultValue: 'disconnected' },
  },
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <ConnectionStatusProvider>
          <Story />
        </ConnectionStatusProvider>
      </SnackbarProvider>
    ),
  ],
} as Meta

const Default: Story<NoConnectionIndicatorProps> = ({ ...args }) => {
  return <NoConnectionIndicator {...args} />
}
export const Regular = Default.bind({})
