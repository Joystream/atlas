import React from 'react'
import ChannelPreviewBase, { ChannelPreviewBaseProps } from './ChannelPreviewBase'
import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Shared/C/ChannelPreview',
  component: ChannelPreviewBase,
  argTypes: {
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
  decorators: [(story) => <BrowserRouter>{story()}</BrowserRouter>],
} as Meta

const Template: Story<ChannelPreviewBaseProps> = (args) => <ChannelPreviewBase {...args} />
const PlaceholderTemplate: Story<ChannelPreviewBaseProps> = (args) => <ChannelPreviewBase {...args} />

export const Regular = Template.bind({})
Regular.args = {
  title: 'Test channel',
  avatarUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
  videoCount: 0,
  loading: false,
}
export const Placeholder = PlaceholderTemplate.bind({})
