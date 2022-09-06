import BN from 'bn.js'
import { differenceInCalendarDays, differenceInSeconds } from 'date-fns'
import { useEffect } from 'react'

import { useBids } from '@/api/hooks/bids'
import { useNft, useNftHistory } from '@/api/hooks/nfts'
import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { NftWidgetProps } from '@/components/_nft/NftWidget/NftWidget'
import { NFT_STATUS_POLLING_INTERVAL } from '@/config/nft'
import { useNftState } from '@/hooks/useNftState'
import { useMemberAvatar } from '@/providers/assets/assets.hooks'
import { useUser } from '@/providers/user/user.hooks'
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
    userBidCreatedAt,
    userBidAmount,
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
          userBidAmount: userBid?.amount ? new BN(userBid?.amount) : undefined,
          isUserWhitelisted,
        },
        nftHistory,
        saleType,
        userBidCreatedAt,
        userBidAmount,
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
        userBidCreatedAt,
        userBidAmount,
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
        userBidCreatedAt,
        userBidAmount,
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
            joyAmount: new BN(e.price),
          }
        } else if (e.__typename === 'AuctionBidMadeEvent') {
          return {
            date: e.createdAt,
            member: e.member,
            text: 'Bid placed',
            joyAmount: new BN(e.bidAmount),
          }
        } else if (e.__typename === 'BidMadeCompletingAuctionEvent') {
          return {
            date: e.createdAt,
            member: e.member,
            text: 'Auction won',
            joyAmount: new BN(e.price),
          }
        } else if (e.__typename === 'NftBoughtEvent') {
          return {
            date: e.createdAt,
            member: e.member,
            text: 'Bought',
            joyAmount: new BN(e.price),
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
            joyAmount: e.winningBid?.amount ? new BN(e.winningBid?.amount) : undefined,
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
            joyAmount: new BN(e.newPrice),
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
