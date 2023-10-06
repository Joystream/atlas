import { FC } from 'react'

import { useMostViewedVideosConnection } from '@/api/hooks/video'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { CarouselProps } from '@/components/Carousel'
import { RankingNumberTile } from '@/components/RankingNumberTile'
import { Section } from '@/components/Section/Section'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicChannelFilter, publicCryptoVideoFilter } from '@/config/contentFilter'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { breakpoints } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
import { SentryLogger } from '@/utils/logs'

type TopTenVideosProps = {
  period: 'week' | 'month'
}

const PLACEHOLDERS_COUNT = 10

const responsive: CarouselProps['breakpoints'] = {
  [parseInt(breakpoints.xs)]: {
    slidesPerView: 1.2,
    slidesPerGroup: 1,
  },
  [parseInt(breakpoints.sm)]: {
    slidesPerView: 2,
    slidesPerGroup: 2,
  },
  [parseInt(breakpoints.md)]: {
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
    slidesPerView: 6,
    slidesPerGroup: 6,
  },
}

export const TopTenVideos: FC<TopTenVideosProps> = ({ period }) => {
  const { videos, loading } = useMostViewedVideosConnection(
    {
      orderBy: VideoOrderByInput.ViewsNumDesc,
      limit: 10,
      periodDays: period === 'week' ? 7 : 30,
      where: {
        ...publicCryptoVideoFilter,
        channel: publicChannelFilter,
      },
    },
    { onError: (error) => SentryLogger.error('Failed to fetch most viewed videos', 'TopTenVideos', error) }
  )

  const placeholderItems = createPlaceholderData(loading || !videos?.length ? PLACEHOLDERS_COUNT : 0, {
    id: undefined,
    progress: undefined,
  })
  const smMatch = useMediaMatch('sm')

  return (
    <Section
      headerProps={{
        start: {
          type: 'title',
          title: `Top 10 this ${period}`,
        },
      }}
      contentProps={{
        type: 'carousel',
        spaceBetween: smMatch ? 24 : 16,
        breakpoints: responsive,
        children: [...(videos ? videos : []), ...placeholderItems]?.map((video, idx) =>
          smMatch ? (
            <RankingNumberTile number={idx + 1} key={`${idx}-${video.id}`}>
              <VideoTileViewer id={video.id} />
            </RankingNumberTile>
          ) : (
            <VideoTileViewer id={video.id} key={`${idx}-${video.id}`} />
          )
        ),
      }}
    />
  )
}
