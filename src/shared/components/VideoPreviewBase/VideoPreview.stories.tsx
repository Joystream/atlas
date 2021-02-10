import React from 'react'
import VideoPreview, { VideoPreviewProps } from './VideoPreview'
import VideoPreviewBase, { VideoPreviewBaseProps } from './VideoPreviewBase'
import { Meta, Story } from '@storybook/react'
import styled from '@emotion/styled'

export default {
  title: 'Shared/VideoPreview',
  component: VideoPreview,
  argTypes: {
    createdAt: { control: 'date' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
} as Meta

const Template: Story<VideoPreviewProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt)
  return (
    <Wrapper>
      <VideoPreview {...args} createdAt={createdAtDate} />
    </Wrapper>
  )
}
const PlaceholderTemplate: Story<VideoPreviewBaseProps> = (args) => (
  <Wrapper>
    <VideoPreviewBase />
  </Wrapper>
)

export const Regular = Template.bind({})
Regular.args = {
  title: 'Example Video',
  channelName: 'Example Channel',
  channelAvatarURL: '',
  createdAt: new Date(),
  showChannel: true,
  showMeta: true,
  duration: 100,
  progress: 0,
  views: 100,
  posterURL: 'https://source.unsplash.com/7MAjXGUmaPw/640x380',
}
export const Placeholder = PlaceholderTemplate.bind({})

const Wrapper = styled.div`
  max-width: 500px;
`
