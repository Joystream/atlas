import { Meta, Story } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { OwnerPill } from '@/components/OwnerPill'
import { Pill, PillGroup } from '@/components/Pill'
import { Button } from '@/components/_buttons/Button'
import {
  SvgActionCopy,
  SvgActionDraft,
  SvgActionEdit,
  SvgActionPlay,
  SvgActionTrash,
  SvgIllustrativeEdit,
  SvgIllustrativePlay,
} from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { formatDateAgo } from '@/utils/time'

import { VideoTile, VideoTileProps } from '.'

export default {
  title: 'video/VideoTile',
  component: VideoTile,
  argTypes: {
    direction: {
      options: ['vertical', 'horizontal'],
      control: {
        type: 'radio',
      },
    },
    detailsVariant: {
      options: ['withoutChannel', 'withChannelName', 'withChannelNameAndAvatar'],
      control: {
        type: 'radio',
      },
    },
    videoHref: { type: 'string' },
    videoSubTitle: { type: 'string' },
    className: { table: { disable: true } },
    onChannelAvatarClick: { table: { disable: true } },
    onClick: { table: { disable: true } },
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
                label: '24K tJOY',
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
        icon: <SvgActionCopy />,
        title: 'Copy video URL',
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
} as Meta

const Template: Story<VideoTileProps> = (args) => {
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
      icon: <SvgActionEdit />,
      title: 'Edit draft',
    },
    {
      icon: <SvgActionTrash />,
      title: 'Delete draft',
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
        <OwnerPill avatar={{ assetUrl: 'https://thispersondoesnotexist.com/image' }} handle="thishandledoesntexists" />
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
      icon: <SvgActionPlay />,
      title: 'Play in Joystream',
    },
    {
      icon: <SvgActionCopy />,
      title: 'Copy video URL',
    },
    {
      icon: <SvgActionEdit />,
      title: 'Edit video',
    },
    {
      icon: <SvgActionTrash />,
      title: 'Delete video',
    },
  ],
  detailsVariant: 'withoutChannel',
}
