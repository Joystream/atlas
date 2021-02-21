import React, { useState } from 'react'
import VideoPreviewBase, { VideoPreviewBaseProps } from './VideoPreviewBase'
import { Meta, Story } from '@storybook/react'
import styled from '@emotion/styled'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Shared/VideoPreview',
  component: VideoPreviewBase,
  argTypes: {
    createdAt: { control: 'date' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    channelAvatarUrl: { table: { disable: true } },
    thumbnailUrl: { table: { disable: true } },
    videoHref: { table: { disable: true } },
    channelHref: { table: { disable: true } },
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onChannelClick: { table: { disable: true } },
    onCoverResize: { table: { disable: true } },
  },
} as Meta

const Template: Story<VideoPreviewBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  const [value, setvalue] = useState(false)
  return (
    <BrowserRouter>
      <Wrapper main={args.main}>
        <VideoPreviewBase
          {...args}
          publisherMode
          selected={value}
          onSelectClick={(value) => {
            console.log({ value })
            setvalue(value)
          }}
          createdAt={createdAtDate}
        />
      </Wrapper>
    </BrowserRouter>
  )
}

export const Regular = Template.bind({})
Regular.args = {
  isLoading: false,
  title: 'Example Video',
  channelHandle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  publisherMode: false,
  videoPublishState: 'default',
  showChannel: true,
  showMeta: true,
  duration: 100,
  progress: 50,
  views: 10000,
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

export const PublisherDefault = Template.bind({})
PublisherDefault.args = {
  isLoading: false,
  title: 'Example Video',
  channelHandle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  showChannel: true,
  showMeta: true,
  duration: 100,
  progress: 50,
  views: 10000,
  publisherMode: true,
  videoPublishState: 'default',
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

export const PublisherDraft = Template.bind({})
PublisherDraft.args = {
  isLoading: false,
  title: 'Example Video',
  channelHandle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  showChannel: true,
  showMeta: true,
  duration: 100,
  progress: 50,
  views: 10000,
  publisherMode: true,
  videoPublishState: 'draft',
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

export const PublisherUnlisted = Template.bind({})
PublisherUnlisted.args = {
  isLoading: false,
  title: 'Example Video',
  channelHandle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  showChannel: true,
  showMeta: true,
  duration: 100,
  progress: 50,
  views: 10000,
  publisherMode: true,
  videoPublishState: 'unlisted',
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

const Wrapper = styled.div<{ main?: boolean }>`
  max-width: ${({ main }) => (main ? 1200 : 350)}px;
`
