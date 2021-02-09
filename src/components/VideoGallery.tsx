import React, { useState, useMemo, useCallback } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { breakpointsOfGrid, Gallery, MIN_VIDEO_PREVIEW_WIDTH, CAROUSEL_ARROW_HEIGHT } from '@/shared/components'
import VideoPreview from './VideoPreview'
import { sizes } from '@/shared/theme'
import { VideoFieldsFragment } from '@/api/queries'

interface VideoFieldsWithProgress extends VideoFieldsFragment {
  progress?: number
}

type VideoGalleryProps = {
  title?: string
  videos?: VideoFieldsWithProgress[]
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

const VideoGallery: React.FC<VideoGalleryProps> = ({ title, videos = [], loading }) => {
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
  const placeholderItems = Array.from({ length: PLACEHOLDERS_COUNT }, () => ({ id: undefined }))
  return (
    <Gallery
      title={title}
      paddingLeft={sizes(2, true)}
      paddingTop={sizes(2, true)}
      responsive={breakpoints}
      itemWidth={MIN_VIDEO_PREVIEW_WIDTH}
      arrowCss={arrowPosition}
    >
      {[...videos, ...placeholderItems]?.map((video, idx) => (
        <StyledVideoPreview id={video.id} key={idx} onCoverResize={onCoverResize} />
      ))}
    </Gallery>
  )
}

const StyledVideoPreview = styled(VideoPreview)`
  & + & {
    margin-left: ${sizes(6)};
  }

  min-width: ${MIN_VIDEO_PREVIEW_WIDTH};
`

export default VideoGallery
