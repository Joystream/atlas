import styled from '@emotion/styled'
import { FC } from 'react'

import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
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

export const VideoGallery: FC<VideoGalleryProps> = ({
  title,
  videos = [],
  loading,
  seeAllUrl,
  hasRanking = false,
  className,
}) => {
  const responsive = [
    {
      breakpoint: parseInt(breakpoints.xxs),
      settings: {
        slidesToShow: 12 / 11,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: parseInt(breakpoints.xs),
      settings: {
        slidesToShow: 12 / 10,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: parseInt(breakpoints.sm),
      settings: {
        slidesToShow: 12 / 7,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: parseInt(breakpoints.md),
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: parseInt(breakpoints.lg),
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: parseInt(breakpoints.xl),
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: parseInt(breakpoints.xxl),
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
  ]

  if (loading === false && videos?.length === 0) {
    return null
  }

  const placeholderItems = createPlaceholderData(loading || !videos?.length ? PLACEHOLDERS_COUNT : 0, {
    id: undefined,
    progress: undefined,
  })

  return (
    <Gallery title={title} responsive={responsive} dotsVisible seeAllUrl={seeAllUrl} className={className}>
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
