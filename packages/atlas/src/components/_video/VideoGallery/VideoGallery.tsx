import styled from '@emotion/styled'
import { FC } from 'react'

import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Gallery } from '@/components/Gallery'
import { GliderProps } from '@/components/Glider'
import { RankingNumberTile } from '@/components/RankingNumberTile'
import { breakpoints } from '@/styles/breakpoints'

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
  const responsive: GliderProps['responsive'] = {
    [parseInt(breakpoints.sm)]: {
      perView: 1,
    },
    [parseInt(breakpoints.md)]: {
      perView: 2,
      perSwipe: '|',
      bound: true,
    },
    [parseInt(breakpoints.lg)]: {
      perView: 3,
      perSwipe: '|',
      bound: true,
    },
    [parseInt(breakpoints.xl)]: {
      perView: 4,
      perSwipe: '|',
      bound: true,
    },
    [parseInt(breakpoints.xxl)]: {
      perView: 5,
      perSwipe: '|',
      bound: true,
    },
  }

  if (loading === false && videos?.length === 0) {
    return null
  }

  const placeholderItems = Array.from({ length: loading || !videos?.length ? PLACEHOLDERS_COUNT : 0 }, () => ({
    id: undefined,
    progress: undefined,
  }))

  return (
    <Gallery perView={3} title={title} responsive={responsive} dotsVisible seeAllUrl={seeAllUrl} className={className}>
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
