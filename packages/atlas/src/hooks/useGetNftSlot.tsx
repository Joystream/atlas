import { differenceInHours, differenceInSeconds } from 'date-fns'
import React, { useCallback } from 'react'

import { NftStatus, useNft } from '@/api/hooks'
import { PillGroup } from '@/components/Pill'
import { PillProps } from '@/components/Pill/types'
import { SvgActionAuction, SvgActionBuyNow, SvgActionNotForSale } from '@/components/_icons'
import { SlotsObject } from '@/components/_video/VideoThumbnail'
import { formatDurationShort, getTimeDiffInSeconds } from '@/utils/time'

import { useMsTimestamp } from './useMsTimestamp'
import { useNftState } from './useNftState'

export const useGetNftSlot = (id?: string) => {
  const msTimestamp = useMsTimestamp()
  const { nft, nftStatus } = useNft(id || '')
  const { auctionPlannedEndDate, isExpired } = useNftState(nft)

  const getNftPills = useCallback(
    (nftStatus: NftStatus): PillProps[] => {
      const hasEndDate = auctionPlannedEndDate && !isExpired
      const lessThanMinute = hasEndDate && differenceInSeconds(auctionPlannedEndDate, msTimestamp) < 60
      const lessThanHour = hasEndDate && differenceInHours(auctionPlannedEndDate, msTimestamp) < 1

      const diffTime = auctionPlannedEndDate && formatDurationShort(getTimeDiffInSeconds(auctionPlannedEndDate), true)

      const buyNowPill: PillProps = {
        icon: <SvgActionBuyNow />,
        variant: 'overlay',
        title: 'Buy now',
      }

      switch (nftStatus.status) {
        case 'auction':
          return [
            {
              icon: <SvgActionAuction />,
              title: diffTime && !isExpired ? 'Timed auction' : 'Open auction',
              label: diffTime && !isExpired ? (lessThanMinute ? '< 1 min' : diffTime) : undefined,
              variant: lessThanHour ? 'danger' : 'overlay',
            },
            ...(nftStatus.buyNowPrice ? [buyNowPill] : []),
          ]
        case 'buy-now':
          return [buyNowPill]
        case 'idle':
          return [
            {
              icon: <SvgActionNotForSale />,
              title: 'Not for sale',
              variant: 'overlay' as const,
            },
          ]
        default:
          return []
      }
    },
    [auctionPlannedEndDate, isExpired, msTimestamp]
  )

  const nftBottomLeftSlot: SlotsObject['bottomLeft'] = nft
    ? {
        element: <PillGroup items={[{ label: 'NFT', variant: 'overlay', title: 'NFT' }, ...getNftPills(nftStatus)]} />,
      }
    : undefined

  return nftBottomLeftSlot
}
