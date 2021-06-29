import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Snackbars } from '@/providers'

import { NoConnectionIndicator, NoConnectionIndicatorProps } from './NoConnectionIndicator'

export default {
  title: 'General/NoConnectionIndicator',
  component: NoConnectionIndicator,
  argTypes: {
    connectionStatus: { defaultValue: 'disconnected' },
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Snackbars />
      </>
    ),
  ],
} as Meta

const Default: Story<NoConnectionIndicatorProps> = ({ ...args }) => {
  return <NoConnectionIndicator {...args} />
}
export const Regular = Default.bind({})
