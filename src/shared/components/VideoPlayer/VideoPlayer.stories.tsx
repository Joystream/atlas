import React from 'react'
import VideoPlayer, { VideoPlayerProps } from './VideoPlayer'
import { Meta, Story } from '@storybook/react'
import styled from '@emotion/styled'
import { colors } from '@/shared/theme'

export default {
  title: 'Shared/VideoPlayer',
  component: VideoPlayer,
} as Meta

const Template: Story<VideoPlayerProps> = (args) => (
  <Wrapper>
    <VideoPlayer {...args} />
  </Wrapper>
)
export const Regular = Template.bind({})
Regular.args = {
  src: 'https://eu-central-1.linodeobjects.com/atlas-assets/videos/1.mp4',
  fill: true,
}

const Wrapper = styled.div`
  background-color: ${colors.gray['500']};
  height: 800px;
`
