import { FC, useMemo } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { CarouselProps } from '@/components/Carousel'
import { Gallery } from '@/components/Gallery'
import { breakpointsOfGrid } from '@/components/Grid'
import { RankingNumberTile } from '@/components/RankingNumberTile'
import { ChannelCard } from '@/components/_channel/ChannelCard'

type ChannelGalleryProps = {
  title?: string
  channels?: BasicChannelFieldsFragment[] | null
  loading?: boolean
  onChannelClick?: (id: string) => void
  hasRanking?: boolean
}

const PLACEHOLDERS_COUNT = 10
const CAROUSEL_SMALL_BREAKPOINT = 688

export const ChannelGallery: FC<ChannelGalleryProps> = ({ title, channels = [], loading, hasRanking }) => {
  const breakpoints = useMemo(() => {
    const breakpoints = breakpointsOfGrid({
      breakpoints: 6,
      minItemWidth: 300,
      gridColumnGap: 24,
      viewportContainerDifference: 64,
    })
    const responsive: CarouselProps['breakpoints'] = {}
    breakpoints.forEach((breakpoint, idx) => {
      if (breakpoint <= CAROUSEL_SMALL_BREAKPOINT && hasRanking) {
        responsive[breakpoint] = {
          slidesPerView: idx + 1.5,
          slidesPerGroup: idx + 1.5,
        }
      } else {
        responsive[breakpoint] = {
          slidesPerView: idx + 1,
          slidesPerGroup: idx + 1,
        }
      }
    })

    return responsive
  }, [hasRanking])

  if (loading === false && channels?.length === 0) {
    return null
  }

  const placeholderItems = Array.from({ length: loading || !channels?.length ? PLACEHOLDERS_COUNT : 0 }, () => ({
    id: undefined,
  }))
  return (
    <Gallery title={title} breakpoints={breakpoints}>
      {[...(channels ? channels : []), ...placeholderItems].map((channel, idx) =>
        hasRanking ? (
          <RankingNumberTile number={idx + 1} key={idx}>
            <ChannelCard channel={!channel.id ? undefined : channel} />
          </RankingNumberTile>
        ) : (
          <ChannelCard key={idx} channel={!channel.id ? undefined : channel} />
        )
      )}
    </Gallery>
  )
}
