import React, { useState } from 'react'
import VideoPreviewBase, { VideoPreviewBaseProps } from './VideoPreviewBase'
import { Meta, Story } from '@storybook/react'
import styled from '@emotion/styled'
import { BrowserRouter } from 'react-router-dom'
import { css } from '@emotion/react'

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
    publisherMode: { table: { disable: true } },
  },
} as Meta

const Template: Story<VideoPreviewBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  return (
    <BrowserRouter>
      <Wrapper main={args.main}>
        <VideoPreviewBase {...args} createdAt={createdAtDate} />
      </Wrapper>
    </BrowserRouter>
  )
}

const Publisher: Story<VideoPreviewBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  const [value, setvalue] = useState(false)
  return (
    <BrowserRouter>
      <Wrapper main={args.main}>
        <VideoPreviewBase {...args} publisherMode selected={value} onSelectClick={setvalue} createdAt={createdAtDate} />
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

export const PublisherDefault = Publisher.bind({})
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

export const PublisherDraft = Publisher.bind({})
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
  thumbnailUrl: undefined,
}

export const PublisherUnlisted = Publisher.bind({})
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

const Mix: Story<VideoPreviewBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  const [value, setvalue] = useState(false)
  const [value2, setvalue2] = useState(false)
  const [value3, setvalue3] = useState(false)
  const isAnySelected = value || value2 || value3
  return (
    <BrowserRouter>
      <ContainerMix>
        <VideoPreviewBase
          {...args}
          publisherMode
          videoPublishState={'default'}
          selected={value2}
          onSelectClick={setvalue2}
          createdAt={createdAtDate}
        />
        <VideoPreviewBase
          {...args}
          publisherMode
          videoPublishState={'draft'}
          selected={value3}
          onSelectClick={setvalue3}
          createdAt={createdAtDate}
          thumbnailUrl={undefined}
        />
        <VideoPreviewBase
          {...args}
          publisherMode
          videoPublishState={'unlisted'}
          selected={value}
          onSelectClick={setvalue}
          createdAt={createdAtDate}
        />
      </ContainerMix>
    </BrowserRouter>
  )
}
export const Mixed = Mix.bind({})
Mixed.args = {
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
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

const Wrapper = styled.div<{ main?: boolean }>`
  max-width: ${({ main }) => (main ? 1200 : 350)}px;
`

const ContainerMix = styled.div`
  display: flex;
  gap: 24px;
  max-width: ${350 * 3}px;
`
