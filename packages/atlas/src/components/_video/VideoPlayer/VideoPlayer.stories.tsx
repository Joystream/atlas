import { ApolloProvider } from '@apollo/client'
import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'

import { createApolloClient } from '@/api'
import { cVar } from '@/styles'

import { VideoPlayer, VideoPlayerProps } from './VideoPlayer'

export default {
  title: 'video/VideoPlayer',
  component: VideoPlayer,
  decorators: [
    (Story) => {
      const apolloClient = createApolloClient()

      return (
        <ApolloProvider client={apolloClient}>
          <Story />
        </ApolloProvider>
      )
    },
  ],
} as Meta

const Template: StoryFn<VideoPlayerProps> = (args) => (
  <Wrapper>
    <VideoPlayer {...args} />
  </Wrapper>
)
export const Regular = Template.bind({})
Regular.args = {
  src: ['https://eu-central-1.linodeobjects.com/atlas-assets/videos/1.mp4'],
  fill: true,
}

const Wrapper = styled.div`
  background-color: ${cVar('colorCoreNeutral500')};
  height: 800px;
`
