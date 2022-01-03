import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Pill, PillGroup } from '@/components/Pill'
import {
  SvgActionDraft,
  SvgActionEdit,
  SvgActionJoyToken,
  SvgActionReupload,
  SvgActionTrash,
  SvgIllustrativeEdit,
  SvgIllustrativePlay,
} from '@/components/_icons'
import { formatDateAgo } from '@/utils/time'

import { VideoTile, VideoTileProps } from '.'
import { PullUp } from '../VideoTilePublisher/PullUp'

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
  },
  args: {
    direction: 'vertical',
    thumbnailUrl: 'https://picsum.photos/320/180',
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
      },
      topRight: {
        type: 'default',
        clickable: true,
      },
      center: {
        element: <SvgIllustrativePlay />,
        type: 'hover',
      },
    },
    channelAvatarUrl: 'https://thispersondoesnotexist.com/image',
    loading: false,
    videoTitle:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident distinctio omnis, voluptates molestias temporibus, incidunt tenetur totam impedit sed sunt atque veritatis ratione quisquam cum sapiente molestiae in voluptatibus iusto.',
    views: 20000000,
    createdAt: new Date(Date.now() - 1000000),
    channelTitle:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident distinctio omnis, voluptates molestias temporibus, incidunt tenetur totam impedit sed sunt atque veritatis ratione quisquam cum sapiente molestiae in voluptatibus iusto',
    kebabMenuItems: [
      {
        icon: <SvgActionTrash />,
        title: 'Delete video',
      },
      {
        icon: <SvgActionReupload />,
        title: 'Reupload file',
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
    bottomRight: {
      element: <Pill variant="overlay" label="30:12" />,
    },
    topRight: { element: <PullUp tooltipText="Edit" />, clickable: true, type: 'hover' },
    center: {
      element: <SvgIllustrativePlay />,
      type: 'hover',
    },
  },
  detailsVariant: 'withoutChannel',
}
