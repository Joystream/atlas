import { Meta, StoryFn } from '@storybook/react'

import { ConnectionStatusManager } from '@/providers/connectionStatus'
import { Snackbars } from '@/providers/snackbars'

import { NoConnectionIndicator, NoConnectionIndicatorProps } from './NoConnectionIndicator'

export default {
  title: 'overlays/NoConnectionIndicator',
  component: NoConnectionIndicator,
  args: {
    nodeConnectionStatus: 'disconnected',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Snackbars />
        <ConnectionStatusManager />
      </>
    ),
  ],
} as Meta<NoConnectionIndicatorProps>

const Default: StoryFn<NoConnectionIndicatorProps> = ({ ...args }) => {
  return <NoConnectionIndicator {...args} />
}
export const Regular = Default.bind({})
