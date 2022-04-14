import { useMemo } from 'react'

import { useGetNftNotificationsQuery } from '@/api/queries'

export const useRawNotifications = (memberId: string | null) => {
  const { data, ...rest } = useGetNftNotificationsQuery({
    variables: {
      limit: 1000,
      memberId: memberId || '',
    },
    skip: !memberId,
  })

  const sortedNotifications = useMemo(() => {
    const allNotifications = data
      ? [
          ...data.openAuctionBidAcceptedEvents,
          ...data.bidMadeCompletingAuctionEvents,
          ...data.nftBoughtEvents,
          ...data.auctionBidMadeEvents,
        ]
      : []

    return allNotifications.sort((n1, n2) => n2.createdAt.getTime() - n1.createdAt.getTime())
  }, [data])

  return {
    notifications: sortedNotifications,
    ...rest,
  }
}
