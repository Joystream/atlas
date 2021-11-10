import styled from '@emotion/styled'
import React, { useMemo } from 'react'

import { VideoFieldsFragment } from '@/api/queries'
import { Gallery } from '@/components/Gallery'
import { breakpointsOfGrid } from '@/components/Grid'
import { RankingNumberTile } from '@/components/RankingNumberTile'
import { VideoTile } from '@/components/_video/VideoTile'
import { media } from '@/theme'
import { AvatarContainer } from '@/views/viewer/ChannelView/ChannelAbout.style'

interface VideoFieldsWithProgress extends VideoFieldsFragment {
  progress?: number
}

type VideoWithIdAndProgress = {
  id: string
  progress?: number
}

type CustomVideosType = VideoFieldsWithProgress[] | VideoWithIdAndProgress[]

type VideoGalleryProps = {
  title?: string
  videos?: CustomVideosType | null
  loading?: boolean
  removeButton?: boolean
  onRemoveButtonClick?: (id: string) => void
  onVideoNotFound?: (id: string) => void
  onVideoClick?: (id: string) => void
  hasRanking?: boolean
  seeAllUrl?: string
  className?: string
}

const PLACEHOLDERS_COUNT = 12
const MIN_VIDEO_PREVIEW_WIDTH = 281
const CAROUSEL_SMALL_BREAKPOINT = 688
const FRACTIONAL_LEVEL = 1.3
const FRACTIONAL_LEVEL_RANKING = 1.4

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  title,
  videos = [],
  loading,
  onVideoClick,
  removeButton,
  onRemoveButtonClick,
  onVideoNotFound,
  seeAllUrl,
  hasRanking = false,
  className,
}) => {
  const breakpoints = useMemo(() => {
    return breakpointsOfGrid({
      breakpoints: 6,
      minItemWidth: 300,
      gridColumnGap: 24,
      viewportContainerDifference: 64,
    }).map((breakpoint, idx) => {
      if (breakpoint <= CAROUSEL_SMALL_BREAKPOINT && hasRanking) {
        return {
          breakpoint,
          settings: {
            slidesToShow: idx + FRACTIONAL_LEVEL,
            slidesToScroll: idx + 1,
          },
        }
      }
      return {
        breakpoint,
        settings: {
          slidesToShow: idx + (breakpoint <= CAROUSEL_SMALL_BREAKPOINT ? FRACTIONAL_LEVEL_RANKING : 1),
          slidesToScroll: idx + 1,
        },
      }
    })
  }, [hasRanking])

  if (loading === false && videos?.length === 0) {
    return null
  }

  const placeholderItems = Array.from({ length: loading || !videos?.length ? PLACEHOLDERS_COUNT : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))
  const createClickHandler = (id?: string) => () => id && onVideoClick && onVideoClick(id)
  const createRemoveButtonClickHandler = (id?: string) => () => id && onRemoveButtonClick && onRemoveButtonClick(id)
  const createNotFoundHandler = (id?: string) => () => id && onVideoNotFound && onVideoNotFound(id)
  return (
    <Gallery
      title={title}
      responsive={breakpoints}
      itemWidth={MIN_VIDEO_PREVIEW_WIDTH}
      dotsVisible
      seeAllUrl={seeAllUrl}
      className={className}
    >
      {[...(videos ? videos : []), ...placeholderItems]?.map((video, idx) =>
        hasRanking ? (
          <RankingNumberTile variant="video" rankingNumber={idx + 1} key={`${idx}-${video.id}`}>
            <StyledVideoTile
              id={video.id}
              progress={video?.progress}
              removeButton={video ? removeButton : false}
              onClick={createClickHandler(video.id)}
              onNotFound={createNotFoundHandler(video.id)}
              onRemoveButtonClick={createRemoveButtonClickHandler(video.id)}
            />
          </RankingNumberTile>
        ) : (
          <StyledVideoTile
            key={`${idx}-${video.id}`}
            id={video.id}
            progress={video?.progress}
            removeButton={video ? removeButton : false}
            onClick={createClickHandler(video.id)}
            onNotFound={createNotFoundHandler(video.id)}
            onRemoveButtonClick={createRemoveButtonClickHandler(video.id)}
          />
        )
      )}
    </Gallery>
  )
}

const StyledVideoTile = styled(VideoTile)`
  justify-content: flex-start;

  ${AvatarContainer} {
    display: none;

    ${media.md} {
      display: block;
    }
  }
`
