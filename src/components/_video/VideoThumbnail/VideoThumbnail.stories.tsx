import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Pill, PillGroup } from '@/components/Pill'
import { UploadProgressBar } from '@/components/UploadProgressBar'
import { IconButton } from '@/components/_buttons/IconButton'
import {
  SvgActionBid,
  SvgActionEdit,
  SvgActionJoyToken,
  SvgAlertsWarning24,
  SvgIllustrativePlay,
  SvgIllustrativeReupload,
} from '@/components/_icons'

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
        position: 'bottom-left',
        element: (
          <PillGroup
            size="small"
            items={[
              {
                label: 'NFT',
              },
              {
                icon: <SvgActionJoyToken />,
                label: '24K tJOY',
              },
            ]}
          />
        ),
      },
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

const Template: Story<VideoThumbnailProps> = (args) => <VideoThumbnail {...args} />
export const Default = Template.bind({})

export const UploadProgress = Template.bind({})
UploadProgress.args = {
  ...UploadProgress.args,
  defaultSlots: [],
  clickable: false,
  contentSlot: <UploadProgressBar progress={40} lastStatus="processing" withLoadingIndicator />,
}

export const FailedUpload = Template.bind({})
FailedUpload.args = {
  ...FailedUpload.args,
  defaultSlots: [
    {
      position: 'bottom-right',
      element: <Pill label="Failed upload" variant="danger" icon={<SvgAlertsWarning24 />} size="medium" />,
    },
  ],
  hoverSlots: [
    {
      position: 'center',
      element: <SvgIllustrativeReupload />,
    },
  ],
}
export const Draft = Template.bind({})
Draft.args = {
  ...Draft.args,
  defaultSlots: [
    {
      position: 'top-right',
      element: (
        <IconButton>
          <SvgActionEdit />
        </IconButton>
      ),
    },
    {
      position: 'bottom-right',
      element: <Pill label="8:24" />,
    },
    {
      position: 'bottom-left',
      element: <Pill label="Draft" />,
    },
  ],
  hoverSlots: [
    {
      position: 'center',
      element: <SvgIllustrativePlay />,
    },
  ],
}
