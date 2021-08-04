import React, { useMemo } from 'react'

import { BasicChannelFieldsFragment } from '@/api/queries'
import { TempChannelCard } from '@/components/TempChannelCard'
import { Gallery, breakpointsOfGrid } from '@/shared/components'

type ChannelGalleryProps = {
  title?: string
  channels?: BasicChannelFieldsFragment[]
  loading?: boolean
  onChannelClick?: (id: string) => void
  hasRanking?: boolean
}

const PLACEHOLDERS_COUNT = 10
const CAROUSEL_SMALL_BREAKPOINT = 688

export const ChannelGallery: React.FC<ChannelGalleryProps> = ({ title, channels = [], loading, hasRanking }) => {
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

  if (!loading && channels?.length === 0) {
    return null
  }

  const placeholderItems = Array.from({ length: loading ? PLACEHOLDERS_COUNT : 0 }, () => ({ id: undefined }))
  return (
    <Gallery title={title} responsive={breakpoints} itemWidth={350} dotsVisible>
      {[...channels, ...placeholderItems].map((channel, idx) => (
        <TempChannelCard
          key={idx}
          id={channel.id}
          rankingNumber={hasRanking ? idx + 1 : undefined}
          isLoading={loading}
        />
      ))}
    </Gallery>
  )
}
