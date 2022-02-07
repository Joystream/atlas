import React from 'react'

import { useVideosConnection } from '@/api/hooks'
import { CategoryLink } from '@/components/CategoryLink'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { SvgActionChevronR } from '@/components/_icons'
import { VideoTile } from '@/components/_video/VideoTile'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useVideoTileSharedLogic } from '@/hooks/useVideoTileSharedLogic'

import { MoreFrom, MoreVideosContainer, SeeMoreButton } from './VideoView.styles'

type MoreVideosProps = {
  channelId?: string
  channelName?: string | null
  categoryId?: string
  categoryName?: string | null
  type: 'channel' | 'category'
}

const NUMBER_OF_VIDEOS = 6

export const MoreVideos: React.FC<MoreVideosProps> = ({ channelId, channelName, categoryId, categoryName, type }) => {
  const where = type === 'channel' ? { channel: { id_eq: channelId } } : { category: { id_eq: categoryId } }
  const { edges = [], loading } = useVideosConnection({ first: NUMBER_OF_VIDEOS, where })
  const placeholderItems = loading ? Array.from({ length: NUMBER_OF_VIDEOS }, () => ({ id: undefined })) : []
  const displayedItems = loading ? [] : edges.map((edge) => edge.node)
  const gridContent = (
    <>
      {[...displayedItems, ...placeholderItems]?.map((video, idx) => (
        <GridItem key={`more-videos-${idx}`} colSpan={{ xxs: 12, xs: 12, sm: 6, md: 12, xl: 12, xxl: 12 }}>
          <MoreVideosVideoTile key={`videos-${idx}`} id={video.id} />
        </GridItem>
      ))}
    </>
  )
  const linkUrl =
    type === 'channel' ? absoluteRoutes.viewer.channel(channelId) : absoluteRoutes.viewer.category(categoryId)
  return (
    <MoreVideosContainer>
      <MoreFrom>
        {type === 'channel' ? (
          <ChannelLink id={channelId} customTitle={`More from ${channelName}`} textVariant="h400" />
        ) : (
          <CategoryLink name={categoryName} id={categoryId} textVariant="h400" />
        )}
        <Button to={linkUrl} variant="secondary" icon={<SvgActionChevronR />} iconOnly />
      </MoreFrom>
      <LayoutGrid>{gridContent}</LayoutGrid>
      <SeeMoreButton to={linkUrl} variant="tertiary" icon={<SvgActionChevronR />} iconPlacement="right" size="large">
        See the {type === 'channel' ? 'channel' : 'category page'}
      </SeeMoreButton>
    </MoreVideosContainer>
  )
}

type MoreVideosVideoTileProps = {
  id?: string
}

const MoreVideosVideoTile: React.FC<MoreVideosVideoTileProps> = ({ id }) => {
  const lgMatch = useMediaMatch('lg')
  const { isLoadingThumbnail, thumbnailPhotoUrl, loading, video, videoHref } = useVideoTileSharedLogic({
    id,
  })
  return (
    <VideoTile
      detailsVariant="withChannelName"
      videoTitle={video?.title}
      channelTitle={video?.channel.title}
      views={video?.views}
      createdAt={video?.createdAt}
      videoHref={videoHref}
      loadingDetails={loading}
      thumbnailUrl={thumbnailPhotoUrl}
      loadingThumbnail={isLoadingThumbnail}
      channelHref={absoluteRoutes.viewer.channel(video?.channel.id)}
      direction={lgMatch ? 'horizontal' : 'vertical'}
    />
  )
}
