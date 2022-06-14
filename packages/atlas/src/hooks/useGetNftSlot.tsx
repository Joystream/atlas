import { differenceInHours, differenceInSeconds, format } from 'date-fns'
import { useCallback } from 'react'

import { NftStatus } from '@/api/hooks'
import { PillGroup } from '@/components/Pill'
import { PillProps } from '@/components/Pill/types'
import { SvgActionAuction, SvgActionBuyNow, SvgActionClock, SvgActionNotForSale } from '@/components/_icons'
import { SlotsObject } from '@/components/_video/VideoThumbnail'
import { formatDurationShort } from '@/utils/time'

import { useMsTimestamp } from './useMsTimestamp'
import { EnglishTimerState } from './useNftState'

type UseGetSlotsOpts = {
  status?: NftStatus['status']
  timerLoading?: boolean
  withNftLabel?: boolean
  startsAtDate?: Date
  auctionPlannedEndDate?: Date
  needsSettling?: boolean
  hasBuyNowPrice?: boolean
  englishTimerState?: EnglishTimerState
}

export const useGetNftSlot = ({
  englishTimerState,
  timerLoading,
  auctionPlannedEndDate,
  hasBuyNowPrice,
  needsSettling,
  startsAtDate,
  withNftLabel,
  status,
}: UseGetSlotsOpts): SlotsObject['bottomLeft'] => {
  const msTimestamp = useMsTimestamp({
    shouldStop: timerLoading || englishTimerState === 'expired' || !englishTimerState,
  })

  const generatePills: () => PillProps[] = useCallback(() => {
    const buyNowPill: PillProps = { icon: <SvgActionBuyNow />, variant: 'overlay', title: 'Buy now' }
    switch (status) {
      case 'idle':
        return [{ icon: <SvgActionNotForSale />, variant: 'overlay', title: 'Not for sale' }]
      case 'buy-now':
        return [buyNowPill]
      case 'auction': {
        const additionalBuyNowPill = hasBuyNowPrice ? [buyNowPill] : []
        if (needsSettling) {
          return [
            {
              icon: <SvgActionAuction />,
              label: 'To be settled',
              variant: 'overlay',
            },
            ...additionalBuyNowPill,
          ]
        }
        if (timerLoading) {
          return [
            {
              icon: <SvgActionAuction />,
              label: 'Loading',
              variant: 'overlay',
            },
            ...additionalBuyNowPill,
          ]
        }
        switch (englishTimerState) {
          case 'upcoming': {
            const diff = startsAtDate && differenceInSeconds(new Date(), startsAtDate) * -1
            const diffTime =
              diff && diff < 3600
                ? `Starts in ${formatDurationShort(diff)}`
                : startsAtDate && ` ${format(startsAtDate, 'd MMM')} at ${format(startsAtDate, 'HH:mm')}`
            return [
              {
                icon: <SvgActionClock />,
                label: diffTime,
                variant: 'overlay',
              },
              ...additionalBuyNowPill,
            ]
          }
          case 'running': {
            const diff = auctionPlannedEndDate && differenceInSeconds(auctionPlannedEndDate, new Date())
            const lessThanMinute = auctionPlannedEndDate && differenceInSeconds(auctionPlannedEndDate, msTimestamp) < 60
            const lessThanHour = auctionPlannedEndDate && differenceInHours(auctionPlannedEndDate, msTimestamp) < 1
            return [
              {
                icon: <SvgActionAuction />,
                label: diff ? (lessThanMinute ? '< 1 min' : formatDurationShort(diff, true)) : undefined,
                variant: lessThanHour ? 'danger' : 'overlay',
              },
              ...additionalBuyNowPill,
            ]
          }
          case 'expired':
            return [
              {
                icon: <SvgActionAuction />,
                label: 'Auction ended',
                variant: 'overlay',
              },
              ...additionalBuyNowPill,
            ]
          default:
            return []
        }
      }
      default:
        return []
    }
  }, [
    status,
    hasBuyNowPrice,
    needsSettling,
    timerLoading,
    englishTimerState,
    startsAtDate,
    auctionPlannedEndDate,
    msTimestamp,
  ])

  const nftPill: PillProps[] = withNftLabel ? [{ label: 'NFT', variant: 'overlay', title: 'NFT' }] : []

  return {
    element: <PillGroup items={[...nftPill, ...generatePills()]} />,
  }
}
