import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import {
  SvgActionCopy,
  SvgActionDraft,
  SvgActionEdit,
  SvgActionPlay,
  SvgActionTrash,
  SvgIllustrativeEdit,
  SvgIllustrativePlay,
} from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { OwnerPill } from '@/components/OwnerPill'
import { Pill, PillGroup } from '@/components/Pill'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { formatDateAgo } from '@/utils/time'

import { VideoTile, VideoTileProps } from '.'

export default {
  title: 'video/VideoTile',
  component: VideoTile,
  argTypes: {
    onChannelAvatarClick: { table: { disable: true } },
    onMouseEnter: { table: { disable: true } },
    onMouseLeave: { table: { disable: true } },
    slots: { table: { disable: true } },
    contentSlot: { table: { disable: true } },
    kebabMenuItems: { table: { disable: true } },
  },
  args: {
    direction: 'vertical',
    clickable: true,
    thumbnailUrl: 'https://picsum.photos/320/180',
    slots: {
      bottomLeft: {
        element: (
          <PillGroup
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
        type: 'default',
        clickable: true,
      },
      bottomRight: {
        element: <Pill variant="overlay" label="30:12" />,
      },
      center: {
        element: <SvgIllustrativePlay />,
        type: 'hover',
      },
    },
    channelAvatarUrl: 'https://thispersondoesnotexist.com/image',
    loadingDetails: false,
    loadingThumbnail: false,
    videoTitle:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident distinctio omnis, voluptates molestias temporibus, incidunt tenetur totam impedit sed sunt atque veritatis ratione quisquam cum sapiente molestiae in voluptatibus iusto.',
    views: 20000000,
    createdAt: new Date(Date.now() - 1000000),
    detailsVariant: 'withChannelNameAndAvatar',
    channelTitle:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident distinctio omnis, voluptates molestias temporibus, incidunt tenetur totam impedit sed sunt atque veritatis ratione quisquam cum sapiente molestiae in voluptatibus iusto',
    kebabMenuItems: [
      {
        nodeStart: <SvgActionCopy />,
        label: 'Copy video URL',
      },
    ],
  },
  decorators: [
    (Story) => {
      return (
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      )
    },
  ],
} as Meta<VideoTileProps>

const Template: StoryFn<VideoTileProps> = (args) => {
  return (
    <div style={{ maxWidth: args.direction === 'horizontal' ? 'unset' : '320px' }}>
      <VideoTile {...args} />
    </div>
  )
}

export const Default = Template.bind({})

export const Draft = Template.bind({})

Draft.args = {
  detailsVariant: 'withoutChannel',
  videoTitle: 'Draft',
  kebabMenuItems: [
    {
      nodeStart: <SvgActionEdit />,
      label: 'Edit draft',
    },
    {
      nodeStart: <SvgActionTrash />,
      label: 'Delete draft',
      destructive: true,
    },
  ],
  slots: {
    center: {
      element: <SvgIllustrativeEdit />,
      type: 'hover',
    },
    bottomLeft: {
      element: <Pill icon={<SvgActionDraft />} label="Draft" />,
      type: 'default',
    },
  },
  videoSubTitle: `Last updated ${formatDateAgo(new Date(Date.now() - 3000000))}`,
  contentSlot: (
    <div
      style={{
        background: 'linear-gradient(125deg, rgb(16 18 20) 30%, rgb(34 36 38) 65%, rgb(16 18 20) 100%)',
        width: '100%',
        height: '100%',
      }}
    />
  ),
}

export const Publisher = Template.bind({})

Publisher.args = {
  slots: {
    topLeft: {
      element: (
        <OwnerPill
          avatar={{ assetUrls: ['https://thispersondoesnotexist.com/image'] }}
          handle="thishandledoesntexists"
        />
      ),
      clickable: true,
      halfWidth: true,
    },
    bottomRight: {
      element: <Pill variant="overlay" label="30:12" />,
    },
    topRight: {
      element: <Button size="small" icon={<SvgActionEdit />} />,
      clickable: true,
      type: 'hover',
    },
    center: {
      element: <SvgIllustrativePlay />,
      type: 'hover',
    },
  },
  kebabMenuItems: [
    {
      nodeStart: <SvgActionPlay />,
      label: 'Play in Joystream',
    },
    {
      nodeStart: <SvgActionCopy />,
      label: 'Copy video URL',
    },
    {
      nodeStart: <SvgActionEdit />,
      label: 'Edit video',
    },
    {
      nodeStart: <SvgActionTrash />,
      label: 'Delete video',
    },
  ],
  detailsVariant: 'withoutChannel',
}
