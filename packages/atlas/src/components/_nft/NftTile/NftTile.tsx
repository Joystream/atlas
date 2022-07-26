import { FC, useState } from 'react'

import { ListItemProps } from '@/components/ListItem'
import { NumberFormat } from '@/components/NumberFormat'
import { Pill } from '@/components/Pill'
import { SvgActionShow } from '@/components/_icons'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'
import { useGetNftSlot } from '@/hooks/useGetNftSlot'
import { EnglishTimerState } from '@/hooks/useNftState'
import { formatDurationShort } from '@/utils/time'

import { Container } from './NftTile.styles'
import { Member, NftTileDetails } from './NftTileDetails'

export type NftTileProps = {
  status?: 'idle' | 'buy-now' | 'auction'
  thumbnail?: VideoThumbnailProps
  title?: string | null
  owner?: Member
  creator?: Member
  loading?: boolean
  duration?: number | null
  views?: number | null
  buyNowPrice?: number | null
  startingPrice?: number | null
  topBidAmount?: number | null
  fullWidth?: boolean
  interactable?: boolean
  timerLoading?: boolean
  needsSettling?: boolean
  englishTimerState?: EnglishTimerState
  startsAtDate?: Date
  auctionPlannedEndDate?: Date
  contextMenuItems?: ListItemProps[]
}

export const NftTile: FC<NftTileProps> = ({
  status,
  thumbnail,
  loading,
  title,
  creator,
  owner,
  duration,
  views,
  buyNowPrice,
  startingPrice,
  topBidAmount: topBid,
  fullWidth,
  interactable = true,
  timerLoading,
  needsSettling,
  englishTimerState,
  startsAtDate,
  auctionPlannedEndDate,
  contextMenuItems,
}) => {
  const [hovered, setHovered] = useState(false)
  const leftBottomPills = useGetNftSlot({
    withNftLabel: false,
    hasBuyNowPrice: !!buyNowPrice,
    timerLoading,
    needsSettling,
    status,
    englishTimerState,
    startsAtDate,
    auctionPlannedEndDate,
  })

  return (
    <Container fullWidth={fullWidth}>
      <VideoThumbnail
        type="video"
        videoHref={thumbnail?.videoHref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        loading={loading}
        thumbnailUrl={thumbnail?.thumbnailUrl}
        clickable={false}
        slots={{
          topLeft: views
            ? {
                element: (
                  <Pill
                    label={<NumberFormat as="span" color="inherit" value={views} format="short" />}
                    size="medium"
                    icon={<SvgActionShow />}
                    variant="overlay"
                  />
                ),
              }
            : undefined,
          bottomLeft: leftBottomPills,
          bottomRight: duration
            ? { element: <Pill label={formatDurationShort(duration)} size="medium" variant="overlay" /> }
            : undefined,
        }}
      />
      <NftTileDetails
        videoHref={thumbnail?.videoHref as string}
        hovered={hovered}
        owner={owner}
        nftStatus={status}
        buyNowPrice={buyNowPrice}
        loading={loading}
        topBid={topBid}
        creator={creator}
        title={title}
        startingPrice={startingPrice}
        interactable={interactable}
        contextMenuItems={contextMenuItems}
      />
    </Container>
  )
}
