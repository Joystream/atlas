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
    defaultOverlaySlots: {
      bottomLeft: (
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
      topRight: (
        <IconButton size="small">
          <SvgActionBid />
        </IconButton>
      ),
    },
    hoverOverlaySlots: {
      center: <SvgIllustrativePlay />,
    },
  },
  argTypes: {
    defaultOverlaySlots: { table: { disable: true } },
    hoverOverlaySlots: { table: { disable: true } },
    contentOverlaySlot: { table: { disable: true } },
  },
} as Meta<VideoThumbnailProps>

const Template: Story<VideoThumbnailProps> = (args) => <VideoThumbnail {...args} />
export const Default = Template.bind({})

export const UploadProgress = Template.bind({})
UploadProgress.args = {
  ...UploadProgress.args,
  defaultOverlaySlots: {},
  clickable: false,
  contentOverlaySlot: <UploadProgressBar progress={40} lastStatus="processing" withLoadingIndicator />,
}

export const FailedUpload = Template.bind({})
FailedUpload.args = {
  ...FailedUpload.args,
  defaultOverlaySlots: {
    bottomRight: <Pill label="Failed upload" variant="danger" icon={<SvgAlertsWarning24 />} size="medium" />,
  },
  hoverOverlaySlots: {
    center: <SvgIllustrativeReupload />,
  },
}
export const Draft = Template.bind({})
Draft.args = {
  ...Draft.args,
  defaultOverlaySlots: {
    topRight: (
      <IconButton size="small">
        <SvgActionEdit />
      </IconButton>
    ),
    bottomRight: <Pill label="8:24" />,
    bottomLeft: <Pill label="Draft" />,
  },
  hoverOverlaySlots: {
    center: <SvgIllustrativePlay />,
  },
}
