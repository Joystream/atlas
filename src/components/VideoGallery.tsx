import styled from '@emotion/styled'
import React from 'react'

import { VideoFieldsFragment } from '@/api/queries'
import { Gallery } from '@/shared/components'
import { breakpointsOfGrid } from '@/shared/components/Grid'
import { sizes } from '@/shared/theme'

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

const MIN_VIDEO_PREVIEW_WIDTH = 281

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  title,
  videos = [],
  loading,
  onVideoClick,
  removeButton,
  onRemoveButtonClick,
  onVideoNotFound,
}) => {
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
      paddingLeft={sizes(2, true)}
      paddingTop={sizes(2, true)}
      responsive={breakpoints}
      itemWidth={MIN_VIDEO_PREVIEW_WIDTH}
      dotsVisible
    >
      {[...videos, ...placeholderItems]?.map((video, idx) => (
        <StyledVideoTile
          id={video.id}
          progress={video?.progress}
          key={idx}
          removeButton={video ? removeButton : false}
          onClick={createClickHandler(video.id)}
          onNotFound={createNotFoundHandler(video.id)}
          onRemoveButtonClick={createRemoveButtonClickHandler(video.id)}
        />
      ))}
    </Gallery>
  )
}

const StyledVideoTile = styled(VideoTile)`
  & + & {
    margin-left: ${sizes(6)};
  }

  /* MIN_VIDEO_TILE_WIDTH */
  min-width: 300px;
`
