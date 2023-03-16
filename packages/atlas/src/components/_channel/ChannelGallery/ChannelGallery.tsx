import { FC, useMemo } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Gallery } from '@/components/Gallery'
import { GliderProps } from '@/components/Glider'
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
    const responsive: GliderProps['responsive'] = {}
    breakpoints.forEach((breakpoint, idx) => {
      if (breakpoint <= CAROUSEL_SMALL_BREAKPOINT && hasRanking) {
        responsive[breakpoint] = {
          perView: idx + 1.5,
          bound: true,
          perSwipe: '|',
        }
      } else {
        responsive[breakpoint] = {
          perView: idx + 1,
          bound: true,
          perSwipe: '|',
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
    <Gallery title={title} responsive={breakpoints} dotsVisible>
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
