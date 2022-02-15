import React from 'react'

import { useBasicVideos } from '@/api/hooks'
import { CategoryLink } from '@/components/CategoryLink'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { ChannelLink } from '@/components/_channel/ChannelLink'
import { SvgActionChevronR } from '@/components/_icons'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { MoreFrom, MoreVideosContainer, SeeMoreButton } from './VideoView.styles'

type MoreVideosProps = {
  channelId?: string
  channelName?: string | null
  categoryId?: string
  categoryName?: string | null
  videoId?: string
  type: 'channel' | 'category'
}

const NUMBER_OF_VIDEOS = 6

export const MoreVideos: React.FC<MoreVideosProps> = ({
  channelId,
  channelName,
  categoryId,
  categoryName,
  videoId,
  type,
}) => {
  const where = type === 'channel' ? { channel: { id_eq: channelId } } : { category: { id_eq: categoryId } }
  // we fetch +1 because we need to filter duplicated video
  const { videos = [], loading } = useBasicVideos({
    where,
    limit: NUMBER_OF_VIDEOS + 1,
  })
  const displayedItems = loading ? [] : videos.filter((video) => video.id !== videoId).slice(0, NUMBER_OF_VIDEOS)
  const placeholderItems =
    loading && !videos.length ? Array.from({ length: NUMBER_OF_VIDEOS }, () => ({ id: undefined })) : []
  const lgMatch = useMediaMatch('lg')
  const gridContent = (
    <>
      {[...displayedItems, ...placeholderItems]?.map((video, idx) => (
        <GridItem key={`more-videos-${idx}`} colSpan={{ xxs: 12, sm: 6, md: 12 }}>
          <VideoTileViewer
            key={`videos-${idx}`}
            id={video.id}
            detailsVariant="withChannelName"
            direction={lgMatch ? 'horizontal' : 'vertical'}
          />
        </GridItem>
      ))}
    </>
  )

  if (!loading && !displayedItems.length) {
    return null
  }

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
