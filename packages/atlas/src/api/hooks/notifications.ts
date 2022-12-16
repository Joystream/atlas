import { QueryHookOptions } from '@apollo/client'

import {
  GetNftActivitiesQuery,
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
  useGetNftActivitiesQuery,
  useGetNotificationsQuery,
} from '@/api/queries/__generated__/notifications.generated'

import {
  AuctionBidMadeEventData,
  BidMadeCompletingAuctionEventData,
  CommentCreatedEventData,
  EnglishAuctionSettledEventData,
  NftBoughtEventData,
  OpenAuctionBidAcceptedEventData,
} from '../queries/__generated__/baseTypes.generated'

type NotificationEvent = Omit<GetNotificationsQuery['events'][number], 'data'> & {
  data:
    | AuctionBidMadeEventData
    | NftBoughtEventData
    | BidMadeCompletingAuctionEventData
    | OpenAuctionBidAcceptedEventData
    | EnglishAuctionSettledEventData
    | CommentCreatedEventData
}

export const useRawNotifications = (
  channelId: string | null,
  memberId: string | null,
  opts?: QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>
) => {
  const { data, ...rest } = useGetNotificationsQuery({
    variables: {
      limit: 1000,
      channelId: channelId || '',
      memberId: memberId || '',
    },
    skip: !memberId,
    ...opts,
  })

  // todo make sure that everything works
  // const sortedNotifications = useMemo(() => {
  //   const allNotifications = data
  //     ? [
  //         ...data.openAuctionBidAcceptedEvents,
  //         ...data.bidMadeCompletingAuctionEvents,
  //         ...data.nftBoughtEvents,
  //         ...data.auctionBidMadeEvents,
  //         ...data.englishAuctionSettledEvents,
  //         ...data.commentCreatedEvents.filter(({ comment }) => comment.author.id !== memberId),
  //       ]
  //     : []

  //   return allNotifications.sort((n1, n2) => n2.createdAt.getTime() - n1.createdAt.getTime())
  // }, [data, memberId])

  return {
    notifications: (data?.events || []) as NotificationEvent[],
    ...rest,
  }
}

export const createAllNotificationArray = (data: GetNftActivitiesQuery) => {
  return data.events
}

export const useRawActivities = (memberId?: string, sort?: 'createdAt_ASC' | 'createdAt_DESC') => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    variables: {
      limit: 100,
      memberId: memberId || '',
    },
    skip: !memberId,
  })

  return {
    nftsBiddedTotalCount: data?.nftsBidded.totalCount,
    nftsBoughtTotalCount: data?.nftsBought.totalCount,
    nftsSoldTotalCount: data?.nftsSold.totalCount,
    nftsIssuedTotalCount: data?.nftsIssued.totalCount,
    nftsBidded: data?.nftsBidded,
    activities: data?.events,
    ...rest,
  }
}
