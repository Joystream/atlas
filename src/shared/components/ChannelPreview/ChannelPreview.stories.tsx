import React from 'react'
import ChannelPreview, { ChannelPreviewProps } from './ChannelPreview'
import ChannelPreviewBase, { ChannelPreviewBaseProps } from './ChannelPreviewBase'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/ChannelPreview',
  component: ChannelPreview,
  argTypes: {
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
} as Meta

const Template: Story<ChannelPreviewProps> = (args) => <ChannelPreview {...args} />
const PlaceholderTemplate: Story<ChannelPreviewBaseProps> = (args) => <ChannelPreviewBase {...args} />

export const Regular = Template.bind({})
Regular.args = {
  name: 'Test channel',
  avatarURL: 'https://eu-central-1.linodeobjects.com/atlas-assets/channel-avatars/2.jpg',
  animated: true,
}
export const Placeholder = PlaceholderTemplate.bind({})
