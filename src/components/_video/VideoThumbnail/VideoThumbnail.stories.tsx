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
    slots: {
      bottomLeft: {
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
        type: 'default',
        clickable: false,
      },
      topRight: {
        element: (
          <IconButton size="small">
            <SvgActionBid />
          </IconButton>
        ),
        type: 'default',
      },
      center: {
        element: <SvgIllustrativePlay />,
        type: 'hover',
      },
    },
  },
  argTypes: {
    slots: { table: { disable: true } },
    contentSlot: { table: { disable: true } },
    onClick: { action: 'clicked' },
  },
} as Meta<VideoThumbnailProps>

const Template: Story<VideoThumbnailProps> = (args) => <VideoThumbnail {...args} />
export const Default = Template.bind({})

export const UploadProgress = Template.bind({})
UploadProgress.args = {
  ...UploadProgress.args,
  slots: {},
  clickable: false,
  contentSlot: <UploadProgressBar progress={40} lastStatus="processing" withLoadingIndicator />,
}

export const FailedUpload = Template.bind({})
FailedUpload.args = {
  ...FailedUpload.args,
  slots: {
    bottomRight: {
      element: <Pill label="Failed upload" variant="danger" icon={<SvgAlertsWarning24 />} size="medium" />,
      type: 'default',
      clickable: false,
    },
    center: {
      element: <SvgIllustrativeReupload />,
      type: 'hover',
    },
  },
}
export const Draft = Template.bind({})
Draft.args = {
  ...Draft.args,
  slots: {
    topRight: {
      element: (
        <IconButton size="small">
          <SvgActionEdit />
        </IconButton>
      ),
      type: 'default',
    },
    bottomRight: {
      element: <Pill label="8:24" />,
      type: 'default',
      clickable: false,
    },
    bottomLeft: {
      element: <Pill label="Draft" />,
      type: 'default',
      clickable: false,
    },
    center: {
      element: <SvgIllustrativePlay />,
      type: 'hover',
    },
  },
}
