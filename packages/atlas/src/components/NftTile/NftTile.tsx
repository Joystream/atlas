import React, { useEffect, useMemo, useState } from 'react'

import { Pill, PillGroup } from '@/components/Pill'
import { SvgActionAuction, SvgActionBuyNow, SvgActionNotForSale, SvgActionShow } from '@/components/_icons'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'
import { formatNumberShort } from '@/utils/number'
import { formatDurationShort } from '@/utils/time'

import { Container } from './NftTile.styles'
import { NftTileDetails } from './NftTileDetails'

export type Member = {
  assetUrl?: string | null
  name?: string
  onClick?: () => void
  loading?: boolean
}

export type NftTileProps = {
  nftState?: 'idle' | 'on-sale' | 'auction'
  thumbnail?: VideoThumbnailProps
  title?: string | null
  owner?: Member
  creator?: Member
  loading?: boolean
  timer?: string
  duration?: number | null
  views?: number | null
  buyNowPrice?: number | null
  startingPrice?: number | null
  topBid?: number | null
  timeLeftMs?: number
  role: 'owner' | 'viewer'
  fullWidth?: boolean
  interactable?: boolean
}

export const NftTile: React.FC<NftTileProps> = ({
  nftState,
  thumbnail,
  loading,
  title,
  creator,
  owner,
  duration,
  views,
  buyNowPrice,
  startingPrice,
  topBid,
  timeLeftMs,
  role,
  fullWidth,
  interactable = true,
}) => {
  const [hovered, setHovered] = useState(false)

  const getBottomLeft = useMemo(() => {
    switch (nftState) {
      case 'idle':
        return <Pill icon={<SvgActionNotForSale />} size="medium" variant="overlay" />
      case 'on-sale':
        return <Pill icon={<SvgActionBuyNow />} size="medium" variant="overlay" />
      case 'auction':
        return buyNowPrice ? (
          <PillGroup
            items={[
              {
                icon: <SvgActionAuction />,
                label: timeLeftMs
                  ? calculatedTimeLeft < 60
                    ? 'Less than a minute'
                    : formatDurationShort(timeLeftSec, true)
                  : undefined,
                variant: timeLeftMs && calculatedTimeLeft < 3600 ? 'danger' : 'overlay',
              },
              { icon: <SvgActionBuyNow /> },
            ]}
            size="medium"
          />
        ) : (
          <Pill
            icon={<SvgActionAuction />}
            label={
              timeLeftMs
                ? calculatedTimeLeft < 60
                  ? 'Less than a minute'
                  : formatDurationShort(timeLeftSec, true)
                : undefined
            }
            size="medium"
            variant={timeLeftMs && calculatedTimeLeft < 3600 ? 'danger' : 'overlay'}
          />
        )
    }
  }, [buyNowPrice, calculatedTimeLeft, nftState, timeLeftMs])

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
        videoHref={thumbnail?.videoHref as string}
        hovered={hovered}
        owner={owner}
        nftState={nftState}
        buyNowPrice={buyNowPrice}
        loading={loading}
        topBid={topBid}
        creator={creator}
        role={role}
        title={title}
        startingPrice={startingPrice}
        interactable={interactable}
      />
    </Container>
  )
}
