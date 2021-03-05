import React, { useState } from 'react'
import VideoPreviewBase, { VideoPreviewBaseProps } from './VideoPreviewBase'
import { Meta, Story } from '@storybook/react'
import styled from '@emotion/styled'
import { BrowserRouter } from 'react-router-dom'
import { OverlayManagerProvider } from '@/hooks'

export default {
  title: 'Shared/VideoPreview',
  component: VideoPreviewBase,
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

const Template: Story<VideoPreviewBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  return (
    <BrowserRouter>
      <OverlayManagerProvider>
        <Wrapper main={args.main}>
          <VideoPreviewBase {...args} createdAt={createdAtDate} />
        </Wrapper>
      </OverlayManagerProvider>
    </BrowserRouter>
  )
}

const Publisher: Story<VideoPreviewBaseProps> = ({ createdAt, ...args }) => {
  const createdAtDate = new Date(createdAt ?? '')
  const [value, setvalue] = useState(false)

  const handler = () => {
    console.log('called')
  }
  return (
    <BrowserRouter>
      <OverlayManagerProvider>
        <Wrapper main={args.main}>
          <VideoPreviewBase
            {...args}
            publisherMode
            isSelected={value}
            isAnyVideoSelected={value}
            onSelectClick={setvalue}
            createdAt={createdAtDate}
            contextMenuCallbacks={{
              onEditVideoClick: handler,
              onCopyVideoURLClick: handler,
              onDeleteVideoClick: handler,
            }}
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
  showChannel: false,
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
  showChannel: false,
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
  showChannel: false,
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
  const handler = () => {
    console.log('called')
  }
  return (
    <BrowserRouter>
      <OverlayManagerProvider>
        <ContainerMix>
          <VideoPreviewBase
            {...args}
            publisherMode
            videoPublishState={'default'}
            isSelected={value2}
            onSelectClick={setvalue2}
            createdAt={createdAtDate}
            isAnyVideoSelected={isAnySelected}
            contextMenuCallbacks={{
              onEditVideoClick: handler,
              onCopyVideoURLClick: handler,
              onDeleteVideoClick: handler,
            }}
          />
          <VideoPreviewBase
            {...args}
            publisherMode
            videoPublishState={'draft'}
            isSelected={value3}
            onSelectClick={setvalue3}
            createdAt={createdAtDate}
            thumbnailUrl={undefined}
            isAnyVideoSelected={isAnySelected}
            contextMenuCallbacks={{
              onEditVideoClick: handler,
              onDeleteVideoClick: handler,
            }}
          />
          <VideoPreviewBase
            {...args}
            publisherMode
            videoPublishState={'unlisted'}
            isSelected={value}
            onSelectClick={setvalue}
            createdAt={createdAtDate}
            isAnyVideoSelected={isAnySelected}
            contextMenuCallbacks={{
              onEditVideoClick: handler,
              onCopyVideoURLClick: handler,
              onDeleteVideoClick: handler,
            }}
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
  channelHandle: 'Example Channel',
  channelAvatarUrl: '',
  createdAt: new Date('2021'),
  showChannel: false,
  showMeta: true,
  duration: 100,
  progress: 50,
  views: 10000,
  publisherMode: true,
  thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
  onClick: () => {
    console.log('Click')
  },
}

const Wrapper = styled.div<{ main?: boolean }>`
  max-width: ${({ main }) => (main ? 1200 : 350)}px;
`

const ContainerMix = styled.div`
  display: flex;
  gap: 24px;
  max-width: ${350 * 3}px;
`
