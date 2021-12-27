import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'

import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionBid, SvgIllustrativePlay } from '@/components/_icons'

import { VideoThumbnail, VideoThumbnailProps } from './VideoThumbnail'

export default {
  title: 'video/VideoThumbnail',
  component: VideoThumbnail,
  args: {
    clickable: true,
    loading: false,
    thumbnailUrl: 'https://thispersondoesnotexist.com/image',
    thumbnailAlt: 'This person does not exist',
    defaultSlots: [
      {
        position: 'top-right',
        element: (
          <IconButton size="small">
            <SvgActionBid />
          </IconButton>
        ),
      },
    ],
    hoverSlots: [
      {
        position: 'center',
        element: <SvgIllustrativePlay />,
      },
    ],
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
