import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { OverlayManagerProvider } from '@/providers/overlayManager'
import { ConsoleLogger } from '@/utils/logs'

import { VideoTileBase, VideoTileBaseProps } from './VideoTileBase'

export default {
  title: 'video/VideoTile',
  component: VideoTileBase,
  argTypes: {
    createdAt: { control: 'date' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    videoHref: { table: { disable: true } },
    channelHref: { table: { disable: true } },
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
    onChannelClick: { table: { disable: true } },
    onCoverResize: { table: { disable: true } },
    publisherMode: { table: { disable: true } },
    isSelected: { table: { disable: true } },
    isAnyVideoSelected: { table: { disable: true } },
    onSelectClick: { table: { disable: true } },
    videoPublishState: { table: { disable: true } },
    contextMenuCallbacks: { table: { disable: true } },
  },
} as Meta

const Template: Story<VideoTileBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  return (
    <BrowserRouter>
      <OverlayManagerProvider>
        <Wrapper>
          <VideoTileBase {...args} createdAt={createdAtDate} />
        </Wrapper>
      </OverlayManagerProvider>
    </BrowserRouter>
  )
}

const Publisher: Story<VideoTileBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')

  const handler = () => {
    ConsoleLogger.log('called')
  }
  return (
    <BrowserRouter>
      <OverlayManagerProvider>
        <Wrapper>
          <VideoTileBase
            {...args}
            publisherMode
            createdAt={createdAtDate}
            onEditVideoClick={handler}
            onCopyVideoURLClick={handler}
            onDeleteVideoClick={handler}
          />
        </Wrapper>
      </OverlayManagerProvider>
    </BrowserRouter>
  )
}

export const Regular = Template.bind({})
Regular.args = {
  isLoading: false,
  title: 'Example Video',
  channelTitle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  publisherMode: false,
  showChannel: true,
  duration: 100,
  progress: 50,
  views: 10000,
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

export const PublisherDefault = Publisher.bind({})
PublisherDefault.args = {
  isLoading: false,
  title: 'Example Video',
  channelTitle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  showChannel: false,
  duration: 100,
  progress: 50,
  views: 10000,
  publisherMode: true,
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

export const PublisherDraft = Publisher.bind({})
PublisherDraft.args = {
  isLoading: false,
  title: 'Example Video',
  channelTitle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  showChannel: false,
  isDraft: true,
  duration: 100,
  progress: 50,
  views: 10000,
  thumbnailUrl: undefined,
}

export const PublisherUnlisted = Publisher.bind({})
PublisherUnlisted.args = {
  isLoading: false,
  title: 'Example Video',
  channelTitle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date(),
  showChannel: false,
  duration: 100,
  progress: 50,
  views: 10000,
  publisherMode: true,
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
}

const Mix: Story<VideoTileBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  const handler = () => {
    ConsoleLogger.log('called')
  }
  return (
    <BrowserRouter>
      <OverlayManagerProvider>
        <ContainerMix>
          <VideoTileBase
            {...args}
            publisherMode
            createdAt={createdAtDate}
            onEditVideoClick={handler}
            onCopyVideoURLClick={handler}
            onDeleteVideoClick={handler}
          />
          <VideoTileBase
            {...args}
            publisherMode
            isDraft
            createdAt={createdAtDate}
            thumbnailUrl={undefined}
            onEditVideoClick={handler}
            onDeleteVideoClick={handler}
          />
          <VideoTileBase
            {...args}
            publisherMode
            isUnlisted
            createdAt={createdAtDate}
            onEditVideoClick={handler}
            onCopyVideoURLClick={handler}
            onDeleteVideoClick={handler}
          />
        </ContainerMix>
      </OverlayManagerProvider>
    </BrowserRouter>
  )
}
export const Mixed = Mix.bind({})
Mixed.args = {
  isLoading: false,
  title: 'Example Video',
  channelTitle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date('2021'),
  showChannel: false,
  duration: 100,
  progress: 50,
  views: 10000,
  publisherMode: true,
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
  onClick: () => {
    ConsoleLogger.log('Click')
  },
}

const Wrapper = styled.div`
  max-width: 350px;
`

const ContainerMix = styled.div`
  display: flex;
  gap: 24px;
  max-width: ${350 * 3}px;
`
