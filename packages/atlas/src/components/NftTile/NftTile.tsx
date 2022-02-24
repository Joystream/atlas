import React, { useEffect, useMemo, useState } from 'react'

import { NftTileDetails } from '@/components/NftTileDetails'
import { Pill, PillGroup } from '@/components/Pill'
import { SvgActionAuction, SvgActionBuyNow, SvgActionNotForSale, SvgActionShow } from '@/components/_icons'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'
import { formatNumberShort } from '@/utils/number'
import { formatDurationShort } from '@/utils/time'

import { Container } from './NftTile.styles'

export type Member = {
  assetUrl?: string | null
  name: string
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
  buyNowPrice?: number | null | undefined
  minBid?: number | null | undefined
  topBid?: number | null | undefined
  timeLeft?: number
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
  timeLeft,
  role,
  fullWidth,
}) => {
  const [calculatedTimeLeft, setCalculatedTimeLeft] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!timeLeft) {
      return
    }

    setCalculatedTimeLeft(timeLeft)
    const timeLeftInterval = setInterval(() => {
      setCalculatedTimeLeft((prevState) => {
        if (prevState <= 1) {
          clearInterval(timeLeftInterval)
        }
        return --prevState
      })
    }, 1000)

    return () => {
      clearInterval(timeLeftInterval)
    }
  }, [timeLeft])

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
                label: timeLeft
                  ? calculatedTimeLeft < 60
                    ? 'Less than a minute'
                    : formatDurationShort(calculatedTimeLeft, true)
                  : undefined,
                variant: timeLeft && calculatedTimeLeft < 3600 ? 'danger' : 'overlay',
              },
              { icon: <SvgActionBuyNow /> },
            ]}
            size="medium"
          />
        ) : (
          <Pill
            icon={<SvgActionAuction />}
            label={
              timeLeft
                ? calculatedTimeLeft < 60
                  ? 'Less than a minute'
                  : formatDurationShort(calculatedTimeLeft, true)
                : undefined
            }
            size="medium"
            variant={timeLeft && calculatedTimeLeft < 3600 ? 'danger' : 'overlay'}
          />
        )
    }
  }, [auction, buyNowPrice, calculatedTimeLeft, timeLeft])

  return (
    <Container fullWidth={fullWidth}>
      <VideoThumbnail
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
