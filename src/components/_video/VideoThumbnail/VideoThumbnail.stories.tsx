import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { VideoThumbnail, VideoThumbnailProps } from './VideoThumbnail'

export default {
  title: 'video/VideoThumbnail',
  component: VideoThumbnail,
  args: {
    clickable: true,
    loading: false,
  },
} as Meta<VideoThumbnailProps>

const Template: Story<VideoThumbnailProps> = (args) => (
  <Wrapper>
    <VideoThumbnail {...args} />
  </Wrapper>
)
export const Default = Template.bind({})

const Wrapper = styled.div`
  max-width: 350px;
`
