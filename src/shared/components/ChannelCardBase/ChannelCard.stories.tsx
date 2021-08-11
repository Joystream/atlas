import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ChannelCardBase, ChannelCardBaseProps } from './ChannelCardBase'

export default {
  title: 'Shared/C/ChannelCard',
  component: ChannelCardBase,
  argTypes: {
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
  decorators: [(story) => <BrowserRouter>{story()}</BrowserRouter>],
} as Meta

const Template: Story<ChannelCardBaseProps> = (args) => <ChannelCardBase {...args} />
const SkeletonLoaderTemplate: Story<ChannelCardBaseProps> = (args) => <ChannelCardBase {...args} />

export const Regular = Template.bind({})
Regular.args = {
  title: 'Test channel',
  assetUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
  videoCount: 0,
  loading: false,
}
export const SkeletonLoader = SkeletonLoaderTemplate.bind({})
