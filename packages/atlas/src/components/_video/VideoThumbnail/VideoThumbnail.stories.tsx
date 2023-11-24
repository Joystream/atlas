import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import {
  SvgActionBid,
  SvgActionEdit,
  SvgActionPlay,
  SvgAlertsWarning24,
  SvgIllustrativePlay,
  SvgIllustrativeReupload,
} from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { Pill, PillGroup } from '@/components/Pill'
import { Text } from '@/components/Text'
import { UploadProgressBar } from '@/components/UploadProgressBar'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { cVar } from '@/styles'

import { VideoThumbnail, VideoThumbnailProps } from './VideoThumbnail'

export default {
  title: 'video/VideoThumbnail',
  component: VideoThumbnail,
  args: {
    clickable: true,
    loading: false,
    thumbnailUrl: 'https://picsum.photos/320/180',
    thumbnailAlt: 'This person does not exist',
    type: 'thumbnail',
    slots: {
      bottomLeft: {
        element: (
          <PillGroup
            size="medium"
            items={[
              {
                label: 'NFT',
                variant: 'overlay',
              },
              {
                icon: <JoyTokenIcon size={16} variant="regular" />,
                label: `24K ${atlasConfig.joystream.tokenTicker}`,
                variant: 'overlay',
              },
            ]}
          />
        ),
        type: 'default',
      },
      topRight: {
        element: <Button size="small" icon={<SvgActionBid />} />,
        type: 'default',
        clickable: true,
      },
      center: {
        element: <SvgIllustrativePlay />,
        type: 'hover',
      },
    },
  },
  argTypes: {
    slots: { table: { disable: true } },
    type: { table: { disable: true } },
    contentSlot: { table: { disable: true } },
  },
  decorators: [
    // TODO: remove any once SB fixes conditional types support
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => {
      return (
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      )
    },
  ],
} as Meta<VideoThumbnailProps>

// TODO: remove any once SB fixes conditional types support
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: StoryFn<VideoThumbnailProps> = (args: any) => (
  <div style={{ maxWidth: '320px' }}>
    <VideoThumbnail {...args} />
  </div>
)
export const Default = Template.bind({})

export const Playlist = Template.bind({})
Playlist.args = {
  ...Playlist.args,
  type: 'playlist',
  slots: {
    bottomLeft: {
      element: (
        <PillGroup
          size="medium"
          items={[
            {
              label: 'NFT',
              variant: 'overlay',
            },
            {
              icon: <JoyTokenIcon size={16} variant="regular" />,
              label: `24K ${atlasConfig.joystream.tokenTicker}`,
              variant: 'overlay',
            },
          ]}
        />
      ),
      type: 'default',
    },
    center: {
      element: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SvgActionPlay />
          <Text as="span" margin={{ left: 2 }} variant="t200-strong">
            Play all videos
          </Text>
        </div>
      ),
      type: 'hover',
    },
  },
}

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
  type: 'thumbnail',
  slots: {
    bottomRight: {
      element: <Pill label="Failed upload" variant="danger" icon={<SvgAlertsWarning24 />} size="medium" />,
      type: 'default',
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
  type: 'thumbnail',

  slots: {
    topRight: {
      element: <Button size="small" variant="tertiary" icon={<SvgActionEdit />} />,
      type: 'hover',
      clickable: true,
    },
    bottomRight: {
      element: <Pill variant="overlay" label="8:24" />,
      type: 'default',
    },
    bottomLeft: {
      element: <Pill variant="overlay" label="Draft" />,
      type: 'default',
    },
    center: {
      element: <SvgIllustrativePlay />,
      type: 'hover',
    },
  },
}

export const CustomContent = Template.bind({})
CustomContent.args = {
  ...CustomContent.args,
  type: 'thumbnail',
  contentSlot: (
    <div
      style={{
        backgroundColor: cVar('colorCoreGreen700'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: cVar('colorCoreBaseWhite'),
      }}
    >
      Hello world!
    </div>
  ),
  slots: {
    bottomRight: {
      element: <Pill variant="overlay" label="8:24" />,
      type: 'default',
    },
    bottomLeft: {
      element: <Button size="small">Hello</Button>,
      type: 'default',
      clickable: true,
    },
    center: {
      element: <SvgIllustrativePlay />,
      type: 'hover',
    },
  },
}
