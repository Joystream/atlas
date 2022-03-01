import React, { useMemo, useState } from 'react'

import { NftTileDetails } from '@/components/NftTileDetails'
import { Pill, PillGroup } from '@/components/Pill'
import { SvgActionAuction, SvgActionBuyNow, SvgActionNotForSale, SvgActionShow } from '@/components/_icons'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { formatNumberShort } from '@/utils/number'
import { formatDurationShort } from '@/utils/time'

import { Container } from './NftTile.styles'

export type Member = {
  assetUrl?: string | null
  name: string
  onClick?: () => void
  loading?: boolean
}

export type NftTileProps = {
  auction?: 'none' | 'minBid' | 'topBid' | 'waiting'
  thumbnail?: VideoThumbnailProps
  title?: string | null
  owner?: Member
  creator?: Member
  loading?: boolean
  duration?: number | null
  views?: number | null
  buyNowPrice?: number | null
  minBid?: number | null
  topBid?: number | null
  expireMsTimestamp?: number
  role: 'owner' | 'viewer'
  fullWidth?: boolean
}

export const NftTile: React.FC<NftTileProps> = ({
  auction,
  thumbnail,
  loading,
  title,
  creator,
  owner,
  duration,
  views,
  buyNowPrice,
  minBid,
  topBid,
  expireMsTimestamp,
  role,
  fullWidth,
}) => {
  const [hovered, setHovered] = useState(false)
  const msTimestamp = useMsTimestamp()
  const secondsLeft = expireMsTimestamp && Math.round((expireMsTimestamp - msTimestamp) / 1000)

  const getBottomLeft = useMemo(() => {
    switch (auction) {
      case 'none':
        return (
          <Pill icon={buyNowPrice ? <SvgActionBuyNow /> : <SvgActionNotForSale />} size="medium" variant="overlay" />
        )
      case 'minBid':
      case 'topBid':
      case 'waiting':
        return buyNowPrice ? (
          <PillGroup
            items={[
              {
                icon: <SvgActionAuction />,
                label: secondsLeft
                  ? secondsLeft < 60
                    ? 'Less than a minute'
                    : formatDurationShort(secondsLeft, true)
                  : undefined,
                variant: secondsLeft && secondsLeft < 3600 ? 'danger' : 'overlay',
              },
              { icon: <SvgActionBuyNow /> },
            ]}
            size="medium"
          />
        ) : (
          <Pill
            icon={<SvgActionAuction />}
            label={
              secondsLeft
                ? secondsLeft < 60
                  ? 'Less than a minute'
                  : formatDurationShort(secondsLeft, true)
                : undefined
            }
            size="medium"
            variant={secondsLeft && secondsLeft < 3600 ? 'danger' : 'overlay'}
          />
        )
    }
  }, [auction, buyNowPrice, secondsLeft])

  return (
    <Container fullWidth={fullWidth}>
      <VideoThumbnail
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
                  <Pill label={formatNumberShort(views)} size="medium" icon={<SvgActionShow />} variant="overlay" />
                ),
              }
            : undefined,
          bottomLeft: { element: getBottomLeft },
          bottomRight: duration
            ? { element: <Pill label={formatDurationShort(duration)} size="medium" variant="overlay" /> }
            : undefined,
        }}
      />
      <NftTileDetails
        hovered={hovered}
        owner={owner}
        auction={auction}
        buyNowPrice={buyNowPrice}
        loading={loading}
        topBid={topBid}
        creator={creator}
        role={role}
        title={title}
        minBid={minBid}
      />
    </Container>
  )
}
