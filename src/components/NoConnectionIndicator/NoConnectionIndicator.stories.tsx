import React from 'react'
import { Story, Meta } from '@storybook/react'
import NoConnectionIndicator, { NoConnectionIndicatorProps } from './NoConnectionIndicator'
import { ConnectionStatusProvider } from '@/hooks'
import { StoreProvider } from '@/hooks/useStore'

export default {
  title: 'General/NoConnectionIndicator',
  component: NoConnectionIndicator,
  argTypes: {
    connectionStatus: { defaultValue: 'disconnected' },
  },
  decorators: [
    (Story) => (
      <StoreProvider>
        <ConnectionStatusProvider>
          <Story />
        </ConnectionStatusProvider>
      </StoreProvider>
    ),
  ],
} as Meta

const Default: Story<NoConnectionIndicatorProps> = ({ ...args }) => {
  return <NoConnectionIndicator {...args} />
}
export const Regular = Default.bind({})
