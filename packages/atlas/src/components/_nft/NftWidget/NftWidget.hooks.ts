import { differenceInCalendarDays, differenceInSeconds } from 'date-fns'
import { useEffect } from 'react'

import { useNft, useNftHistory } from '@/api/hooks'
import { useBids } from '@/api/hooks/bids'
import { FullVideoFieldsFragment } from '@/api/queries'
import { NftWidgetProps } from '@/components/_nft/NftWidget/NftWidget'
import { NFT_STATUS_POLLING_INTERVAL } from '@/config/nft'
import { useNftState } from '@/hooks/useNftState'
import { useMemberAvatar } from '@/providers/assets'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

import { NftHistoryEntry } from './NftHistory'

type UseNftWidgetReturn = NftWidgetProps | null
export const useNftWidget = (video: FullVideoFieldsFragment | undefined | null): UseNftWidgetReturn => {
  const { memberId } = useUser()
  const { nft, nftStatus, called, startPolling, stopPolling } = useNft(video?.id ?? '', { skip: !video || !video.nft })
  const {
    isOwner,
    englishTimerState,
    canWithdrawBid,
    needsSettling,
    auctionPlannedEndDate,
    userBid,
    startsAtDate,
    isUserTopBidder,
    userBidUnlockDate,
    saleType,
    startsAtBlock,
    canChangeBid,
    isUserWhitelisted,
    plannedEndAtBlock,
    hasTimersLoaded,
  } = useNftState(nft)

  // poll for NFT changes only if the NFT exists
  const hasNft = !!nft
  useEffect(() => {
    if (!called || !hasNft) return
    startPolling(NFT_STATUS_POLLING_INTERVAL)

    return () => {
      stopPolling()
    }
  }, [called, hasNft, startPolling, stopPolling])

  const { bids: userBids } = useBids(
    {
      where: {
        isCanceled_eq: false,
        nft: { id_eq: nft?.id },
        bidder: { id_eq: memberId },
      },
    },
    {
      fetchPolicy: 'cache-and-network',
      skip: !nft?.id || !memberId,
      onError: (error) =>
        SentryLogger.error('Failed to fetch member bids', 'useNftState', error, {
          data: {
            nft: nft?.id,
            member: memberId,
          },
        }),
    }
  )

  const unwithdrawnUserBids = userBids?.filter(
    (bid) =>
      bid.auction.auctionType.__typename === 'AuctionTypeOpen' &&
      (nftStatus?.status !== 'auction' || bid.auction.id !== nftStatus.auctionId) &&
      bid.auction.winningMemberId !== memberId
  )
  const bidFromPreviousAuction = unwithdrawnUserBids?.[0]

  const owner = nft?.ownerMember

  const { url: ownerAvatarUri } = useMemberAvatar(owner)
  const { url: topBidderAvatarUri } = useMemberAvatar(nftStatus?.status === 'auction' ? nftStatus.topBidder : undefined)

  const { entries: nftHistory } = useNftHistoryEntries(video?.id ?? '', {
    skip: !nft,
    pollInterval: NFT_STATUS_POLLING_INTERVAL,
  })

  switch (nftStatus?.status) {
    case 'auction': {
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        bidFromPreviousAuction,
        nftStatus: {
          ...nftStatus,
          startsAtDate,
          canWithdrawBid,
          canChangeBid,
          englishTimerState,
          auctionPlannedEndDate,
          topBidderAvatarUri,
          isUserTopBidder,
          userBidUnlockDate,
          startsAtBlock,
          plannedEndAtBlock,
          hasTimersLoaded,
          auctionBeginsInDays: startsAtDate ? differenceInCalendarDays(startsAtDate, new Date()) : 0,
          auctionBeginsInSeconds: startsAtDate ? differenceInSeconds(startsAtDate, new Date()) : 0,
          topBidderHandle: nftStatus.topBidder?.handle,
          userBidAmount: Number(userBid?.amount) || undefined,
          isUserWhitelisted,
        },
        nftHistory,
        saleType,
      }
    }
    case 'buy-now':
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        bidFromPreviousAuction,
        nftStatus: {
          ...nftStatus,
        },
        nftHistory,
        saleType,
      }
    case 'idle':
      return {
        ownerHandle: owner?.handle,
        ownerAvatarUri,
        isOwner,
        needsSettling,
        bidFromPreviousAuction,
        nftStatus: {
          ...nftStatus,
        },
        nftHistory,
        saleType,
      }
  }

  return null
}

export const useNftHistoryEntries = (videoId: string | null, opts?: Parameters<typeof useNftHistory>[1]) => {
  const { events, ...rest } = useNftHistory(videoId, opts)

  const mappedEvents = events
    ? events.map((e): NftHistoryEntry => {
        if (e.__typename === 'NftIssuedEvent') {
          return {
            date: e.createdAt,
            member: e.ownerMember,
            text: 'Minted',
          }
        } else if (e.__typename === 'OpenAuctionStartedEvent' || e.__typename === 'EnglishAuctionStartedEvent') {
          return {
            date: e.createdAt,
            member: e.ownerMember,
            text: 'Placed on auction',
          }
        } else if (e.__typename === 'NftSellOrderMadeEvent') {
          return {
            date: e.createdAt,
            member: e.ownerMember,
            text: 'Put on sale',
            joyAmount: Number(e.price),
          }
        } else if (e.__typename === 'AuctionBidMadeEvent') {
          return {
            date: e.createdAt,
            member: e.member,
            text: 'Bid placed',
            joyAmount: Number(e.bidAmount),
          }
        } else if (e.__typename === 'BidMadeCompletingAuctionEvent') {
          return {
            date: e.createdAt,
            member: e.member,
            text: 'Auction won',
            joyAmount: Number(e.price),
          }
        } else if (e.__typename === 'NftBoughtEvent') {
          return {
            date: e.createdAt,
            member: e.member,
            text: 'Bought',
            joyAmount: Number(e.price),
          }
        } else if (e.__typename === 'EnglishAuctionSettledEvent') {
          return {
            date: e.createdAt,
            member: e.winner,
            text: 'Auction won',
          }
        } else if (e.__typename === 'OpenAuctionBidAcceptedEvent') {
          return {
            date: e.createdAt,
            member: e.winningBid?.bidder,
            text: 'Auction won',
            joyAmount: Number(e.winningBid?.amount) || undefined,
          }
        } else if (e.__typename === 'AuctionBidCanceledEvent') {
          return {
            date: e.createdAt,
            member: e.member,
            text: 'Bid withdrawn',
          }
        } else if (e.__typename === 'AuctionCanceledEvent') {
          return {
            date: e.createdAt,
            member: e.ownerMember || null,
            text: 'Removed from sale',
          }
        } else if (e.__typename === 'BuyNowCanceledEvent') {
          return {
            date: e.createdAt,
            member: e.ownerMember,
            text: 'Removed from sale',
          }
        } else if (e.__typename === 'BuyNowPriceUpdatedEvent') {
          return {
            date: e.createdAt,
            member: e.ownerMember,
            text: 'Price changed',
            joyAmount: Number(e.newPrice),
          }
        } else {
          throw 'Unknown history event type'
        }
      })
    : []

  return {
    entries: mappedEvents,
    ...rest,
  }
}
