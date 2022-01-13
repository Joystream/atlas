import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Grid } from '@/components/Grid'

import { ChannelCardBase, ChannelCardBaseProps } from './ChannelCardBase'

export default {
  title: 'channel/ChannelCard',
  component: ChannelCardBase,
  args: {
    avatarUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
    title: 'Example Channel',
    id: '3',
    follows: 200,
    isLoading: false,
    isLoadingAvatar: false,
  },
  argTypes: {
    onFollow: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta

const Template: Story<ChannelCardBaseProps> = (args) => <ChannelCardBase {...args} />

export const Default = Template.bind({})
export const WithButton = Template.bind({})
WithButton.args = {
  onFollow: () => null,
}

const WithinGrid: Story<ChannelCardBaseProps> = (args) => (
  <Grid>
    <ChannelCardBase {...args} />
    <ChannelCardBase {...args} />
    <ChannelCardBase {...args} />
    <ChannelCardBase {...args} />
    <ChannelCardBase {...args} />
    <ChannelCardBase {...args} />
  </Grid>
)

export const InsideGrid = WithinGrid.bind({})
