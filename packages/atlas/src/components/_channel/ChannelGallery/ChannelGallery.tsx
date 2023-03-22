import { FC, useMemo } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Gallery } from '@/components/Gallery'
import { breakpointsOfGrid } from '@/components/Grid'
import { RankingNumberTile } from '@/components/RankingNumberTile'
import { ChannelCard } from '@/components/_channel/ChannelCard'
import { createPlaceholderData } from '@/utils/data'

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

  if (loading === false && channels?.length === 0) {
    return null
  }

  const placeholderItems = createPlaceholderData(loading || !channels?.length ? PLACEHOLDERS_COUNT : 0)

  return (
    <Gallery title={title} responsive={breakpoints} itemWidth={350} dotsVisible>
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
