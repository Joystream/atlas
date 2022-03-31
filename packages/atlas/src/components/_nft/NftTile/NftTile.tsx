import React, { useMemo, useState } from 'react'
import useResizeObserver from 'use-resize-observer'

import { Pill, PillGroup } from '@/components/Pill'
import { SvgActionAuction, SvgActionBuyNow, SvgActionNotForSale, SvgActionShow } from '@/components/_icons'
import { VideoThumbnail, VideoThumbnailProps } from '@/components/_video/VideoThumbnail'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
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
  status?: 'idle' | 'buy-now' | 'auction'
  onNftPurchase?: () => void
  onNftBuyNow?: () => void
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
  fullWidth?: boolean
  interactable?: boolean
  canPutOnSale?: boolean
  canCancelSale?: boolean
  canBuyNow?: boolean
  canMakeBid?: boolean
  onRemoveFromSale?: () => void
  onPutOnSale?: () => void
  onNftChangePrice?: () => void
}

export const NftTile: React.FC<NftTileProps> = ({
  status,
  onNftPurchase,
  onNftBuyNow,
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
  fullWidth,
  interactable = true,
  canPutOnSale,
  canCancelSale,
  canBuyNow,
  canMakeBid,
  onRemoveFromSale,
  onPutOnSale,
  onNftChangePrice,
}) => {
  const [hovered, setHovered] = useState(false)
  const timeLeftSec = timeLeftMs && Math.max(Math.round(timeLeftMs / 1000), 1) // provide 1s fallback if the timer runs slightly faster than the auction end block is processed
  const { width = 0, height = 0, ref } = useResizeObserver({ box: 'border-box' })

  useMsTimestamp() // updates component once a sec

  if (hovered) {
    // normalise touch/mouse
    // const pos = [e.offsetX, e.offsetY];
    const pos = [0, 0]
    // e.preventDefault();
    // if ( e.type === "touchmove" ) {
    //   pos = [ e.touches[0].clientX, e.touches[0].clientY ];
    // }

    // math for mouse position
    const l = pos[0]
    const t = pos[1]

    const px = Math.abs(Math.floor((100 / width) * l) - 100)
    const py = Math.abs(Math.floor((100 / height) * t) - 100)
    const pa = 50 - px + (50 - py)
    // math for gradient / background positions
    const lp = 50 + (px - 50) / 1.5
    const tp = 50 + (py - 50) / 1.5
    const px_spark = 50 + (px - 50) / 7
    const py_spark = 50 + (py - 50) / 7
    const p_opc = 20 + Math.abs(pa) * 1.5
    const ty = ((tp - 50) / 2) * -1
    const tx = ((lp - 50) / 1.5) * 0.5
    // css to apply for active card
    const grad_pos = `background-position: ${lp}% ${tp}%;`
    const sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
    const opc = `opacity: ${p_opc / 100};`
    const tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
    // need to use a <style> tag for psuedo elements
    const style = `
      .card:hover:before { ${grad_pos} }  /* gradient */
      .card:hover:after { ${sprk_pos} ${opc} }   /* sparkles */ 
    `
  }

  const getBottomLeft = useMemo(() => {
    switch (status) {
      case 'idle':
        return <Pill icon={<SvgActionNotForSale />} size="medium" variant="overlay" />
      case 'buy-now':
        return <Pill icon={<SvgActionBuyNow />} size="medium" variant="overlay" />
      case 'auction':
        return buyNowPrice ? (
          <PillGroup
            items={[
              {
                icon: <SvgActionAuction />,
                label: timeLeftSec
                  ? timeLeftSec < 60
                    ? 'Less than a minute'
                    : formatDurationShort(timeLeftSec, true)
                  : undefined,
                variant: timeLeftSec && timeLeftSec < 3600 ? 'danger' : 'overlay',
              },
              { icon: <SvgActionBuyNow /> },
            ]}
            size="medium"
          />
        ) : (
          <Pill
            icon={<SvgActionAuction />}
            label={
              timeLeftSec
                ? timeLeftSec < 60
                  ? 'Less than a minute'
                  : formatDurationShort(timeLeftSec, true)
                : undefined
            }
            size="medium"
            variant={timeLeftSec && timeLeftSec < 3600 ? 'danger' : 'overlay'}
          />
        )
    }
  }, [status, buyNowPrice, timeLeftSec])

  return (
    <Container
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      fullWidth={fullWidth}
    >
      <VideoThumbnail
        videoHref={thumbnail?.videoHref}
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
        onNftPurchase={onNftPurchase}
        onNftBuyNow={onNftBuyNow}
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
        onRemoveFromSale={onRemoveFromSale}
        canBuyNow={canBuyNow}
        canCancelSale={canCancelSale}
        canMakeBid={canMakeBid}
        canPutOnSale={canPutOnSale}
        onPutOnSale={onPutOnSale}
        onNftChangePrice={onNftChangePrice}
      />
    </Container>
  )
}

const useShiny = () => {}
