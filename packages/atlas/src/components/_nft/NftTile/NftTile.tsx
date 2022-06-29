import BN from 'bn.js'
import { FC, useState } from 'react'

import { NumberFormat } from '@/components/NumberFormat'
import { Pill } from '@/components/Pill'
import { SvgActionShow } from '@/components/_icons'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'
import { useGetNftSlot } from '@/hooks/useGetNftSlot'
import { EnglishTimerState } from '@/hooks/useNftState'
import { HapiBNToTJOYNumber } from '@/utils/number'
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
  buyNowPrice?: BN | null
  startingPrice?: BN | null
  topBidAmount?: BN | null
  fullWidth?: boolean
  interactable?: boolean
  canPutOnSale?: boolean
  canCancelSale?: boolean
  canBuyNow?: boolean
  canMakeBid?: boolean
  canChangePrice?: boolean
  timerLoading?: boolean
  needsSettling?: boolean
  englishTimerState?: EnglishTimerState
  startsAtDate?: Date
  auctionPlannedEndDate?: Date
  onRemoveFromSale?: () => void
  isOwner?: boolean
  isUserTopBidder?: boolean
  onPutOnSale?: () => void
  onChangePrice?: () => void
  onNftPurchase?: () => void
  onNftBuyNow?: () => void
  onSettleAuction?: () => void
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
  canPutOnSale,
  canCancelSale,
  canBuyNow,
  canMakeBid,
  canChangePrice,
  timerLoading,
  needsSettling,
  englishTimerState,
  startsAtDate,
  auctionPlannedEndDate,
  onRemoveFromSale,
  isOwner,
  isUserTopBidder,
  onPutOnSale,
  onChangePrice,
  onNftPurchase,
  onNftBuyNow,
  onSettleAuction,
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
        buyNowPrice={buyNowPrice ? HapiBNToTJOYNumber(buyNowPrice) : undefined}
        loading={loading}
        topBid={topBid ? HapiBNToTJOYNumber(topBid) : undefined}
        creator={creator}
        title={title}
        startingPrice={startingPrice ? HapiBNToTJOYNumber(startingPrice) : undefined}
        interactable={interactable}
        canBuyNow={canBuyNow}
        canCancelSale={canCancelSale}
        canMakeBid={canMakeBid}
        canPutOnSale={canPutOnSale}
        canChangePrice={canChangePrice}
        needsSettling={needsSettling}
        isOwner={isOwner}
        isUserTopBidder={isUserTopBidder}
        onPutOnSale={onPutOnSale}
        onChangePrice={onChangePrice}
        onRemoveFromSale={onRemoveFromSale}
        onBuyNow={onNftBuyNow}
        onMakeBid={onNftPurchase}
        onSettleAuction={onSettleAuction}
      />
    </Container>
  )
}
