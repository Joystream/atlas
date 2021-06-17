import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ConnectionStatusProvider, SnackbarProvider } from '@/hooks'

import { NoConnectionIndicator, NoConnectionIndicatorProps } from './NoConnectionIndicator'

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
