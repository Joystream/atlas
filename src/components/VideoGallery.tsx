import React, { useState, useMemo, useCallback } from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

import {
  breakpointsOfGrid,
  Gallery,
  MIN_VIDEO_PREVIEW_WIDTH,
  VideoPreviewBase,
  CAROUSEL_ARROW_HEIGHT,
} from '@/shared/components'
import VideoPreview from './VideoPreviewWithNavigation'
import { VideoFields } from '@/api/queries/__generated__/VideoFields'
import { sizes } from '@/shared/theme'

type VideoGalleryProps = {
  title?: string
  videos?: VideoFields[]
  loading?: boolean
  onVideoClick?: (id: string) => void
}

const PLACEHOLDERS_COUNT = 12

// This is needed since Gliderjs and the Grid have different resizing policies
const breakpoints = breakpointsOfGrid({
  breakpoints: 6,
  minItemWidth: 300,
  gridColumnGap: 24,
  viewportContainerDifference: 64,
}).map((breakpoint, idx) => ({
  breakpoint,
  settings: {
    slidesToShow: idx + 1,
    slidesToScroll: idx + 1,
  },
}))

const VideoGallery: React.FC<VideoGalleryProps> = ({ title, videos, loading, onVideoClick }) => {
  const [coverHeight, setCoverHeight] = useState<number>()
  const onCoverResize = useCallback((_, imgHeight) => {
    setCoverHeight(imgHeight)
  }, [])
  const arrowPosition = useMemo(() => {
    if (!coverHeight) {
      return
    }
    const topPx = (coverHeight - CAROUSEL_ARROW_HEIGHT) / 2
    return css`
      top: ${topPx}px;
    `
  }, [coverHeight])

  if (!loading && videos?.length === 0) {
    return null
  }

  return (
    <Gallery
      title={title}
      paddingLeft={sizes(2, true)}
      paddingTop={sizes(2, true)}
      responsive={breakpoints}
      itemWidth={MIN_VIDEO_PREVIEW_WIDTH}
      arrowCss={arrowPosition}
    >
      {loading
        ? Array.from({ length: PLACEHOLDERS_COUNT }).map((_, idx) => (
            <StyledVideoPreviewBase key={`video-placeholder-${idx}`} />
          ))
        : videos!.map((video) => (
            <StyledVideoPreview
              id={video.id}
              channelId={video.channel.id}
              title={video.title}
              channelName={video.channel.handle}
              channelAvatarURL={video.channel.avatarPhotoUrl}
              views={video.views}
              createdAt={video.createdAt}
              duration={video.duration}
              posterURL={video.thumbnailUrl}
              key={video.id}
              onCoverResize={onCoverResize}
              onClick={() => {
                if (onVideoClick) {
                  onVideoClick(video.id)
                }
              }}
            />
          ))}
    </Gallery>
  )
}

const videoPreviewCss = css`
  & + & {
    margin-left: ${sizes(6)};
  }

  min-width: ${MIN_VIDEO_PREVIEW_WIDTH};
`

const StyledVideoPreviewBase = styled(VideoPreviewBase)`
  ${videoPreviewCss};
`
const StyledVideoPreview = styled(VideoPreview)`
  ${videoPreviewCss};
`

export default VideoGallery
