import React from 'react'
import VideoPreviewBase, { VideoPreviewBaseProps } from './VideoPreviewBase'
import { Meta, Story } from '@storybook/react'
import styled from '@emotion/styled'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Shared/VideoPreview',
  component: VideoPreviewBase,
  argTypes: {
    createdAt: { control: 'date' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
} as Meta

const Template: Story<VideoPreviewBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  return (
    <BrowserRouter>
      <Wrapper>
        <VideoPreviewBase {...args} createdAt={createdAtDate} />
      </Wrapper>
    </BrowserRouter>
  )
}

export const Regular = Template.bind({})
Regular.args = {
  isLoading: true,
  title: 'Example Video',
  channelHandle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  showChannel: true,
  showMeta: true,
  duration: 100,
  progress: 0,
  views: 100,
  thumbnailUrl: 'https://source.unsplash.com/7MAjXGUmaPw/640x380',
}

const Wrapper = styled.div`
  max-width: 500px;
`
