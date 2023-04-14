import styled from '@emotion/styled'
import { FC } from 'react'

import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { CarouselProps } from '@/components/Carousel'
import { Gallery } from '@/components/Gallery'
import { RankingNumberTile } from '@/components/RankingNumberTile'
import { breakpoints } from '@/styles/breakpoints'
import { createPlaceholderData } from '@/utils/data'

import { VideoTileViewer } from '../VideoTileViewer'

interface VideoFieldsWithProgress extends FullVideoFieldsFragment {
  progress?: number
}

type VideoWithIdAndProgress = {
  id: string
  progress?: number
}

type CustomVideosType = VideoFieldsWithProgress[] | VideoWithIdAndProgress[]

export type VideoGalleryProps = {
  title?: string
  videos?: CustomVideosType | null
  loading?: boolean
  onVideoNotFound?: (id: string) => void
  onVideoClick?: (id: string) => void
  hasRanking?: boolean
  seeAllUrl?: string
  className?: string
}

const PLACEHOLDERS_COUNT = 12

const responsive: CarouselProps['breakpoints'] = {
  [parseInt(breakpoints.xs)]: {
    slidesPerView: 1.2,
    slidesPerGroup: 1,
  },
  [parseInt(breakpoints.sm)]: {
    slidesPerView: 2,
    slidesPerGroup: 2,
  },
  [parseInt(breakpoints.lg)]: {
    slidesPerView: 3,
    slidesPerGroup: 3,
  },
  [parseInt(breakpoints.xl)]: {
    slidesPerView: 4,
    slidesPerGroup: 4,
  },
  [parseInt(breakpoints.xxl)]: {
    slidesPerView: 5,
    slidesPerGroup: 5,
  },
}

export const VideoGallery: FC<VideoGalleryProps> = ({
  title,
  videos = [],
  loading,
  seeAllUrl,
  hasRanking = false,
  className,
}) => {
  if (loading === false && videos?.length === 0) {
    return null
  }

  const placeholderItems = createPlaceholderData(loading || !videos?.length ? PLACEHOLDERS_COUNT : 0, {
    id: undefined,
    progress: undefined,
  })

  return (
    <Gallery
      slidesPerView={1}
      title={title}
      breakpoints={responsive}
      dotsVisible
      rewind
      seeAllUrl={seeAllUrl}
      className={className}
    >
      {[...(videos ? videos : []), ...placeholderItems]?.map((video, idx) =>
        hasRanking ? (
          <RankingNumberTile number={idx + 1} key={`${idx}-${video.id}`}>
            <StyledVideoTile id={video.id} />
          </RankingNumberTile>
        ) : (
          <StyledVideoTile key={`${idx}-${video.id}`} id={video.id} />
        )
      )}
    </Gallery>
  )
}

const StyledVideoTile = styled(VideoTileViewer)`
  justify-content: flex-start;
`
