import styled from '@emotion/styled'
import React, { useMemo } from 'react'

import { VideoFieldsFragment } from '@/api/queries'
import { Gallery } from '@/shared/components'
import { breakpointsOfGrid } from '@/shared/components/Grid'
import { AvatarContainer } from '@/shared/components/VideoTileBase/VideoTileBase.styles'
import { media, sizes } from '@/shared/theme'

import { VideoTile } from './VideoTile'

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
  videos?: CustomVideosType
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
            slidesToShow: idx + 1.5,
            slidesToScroll: idx + 1,
          },
        }
      }
      return {
        breakpoint,
        settings: {
          slidesToShow: idx + 1,
          slidesToScroll: idx + 1,
        },
      }
    })
  }, [hasRanking])
  if (!loading && videos?.length === 0) {
    return null
  }
  const placeholderItems = Array.from({ length: loading ? PLACEHOLDERS_COUNT : 0 }, () => ({
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
      {[...videos, ...placeholderItems]?.map((video, idx) => (
        <GalleryWrapper key={`${idx}-${video.id}`} hasRanking={hasRanking}>
          <StyledVideoTile
            id={video.id}
            progress={video?.progress}
            removeButton={video ? removeButton : false}
            onClick={createClickHandler(video.id)}
            onNotFound={createNotFoundHandler(video.id)}
            onRemoveButtonClick={createRemoveButtonClickHandler(video.id)}
            rankingNumber={hasRanking ? idx + 1 : undefined}
          />
        </GalleryWrapper>
      ))}
    </Gallery>
  )
}

const StyledVideoTile = styled(VideoTile)`
  flex-shrink: 0;

  ${AvatarContainer} {
    display: none;

    ${media.medium} {
      display: block;
    }
  }
`

const GalleryWrapper = styled.div<{ hasRanking?: boolean }>`
  position: relative;
  ${({ hasRanking }) => `
    display: ${hasRanking ? 'flex' : 'block'};
    justify-content: ${hasRanking ? 'flex-end' : 'unset'};
  `}

  ${StyledVideoTile} {
    width: ${({ hasRanking }) => (hasRanking ? '78%' : '100%')};
  }

  & + & {
    margin-left: ${sizes(6)};
  }
`
