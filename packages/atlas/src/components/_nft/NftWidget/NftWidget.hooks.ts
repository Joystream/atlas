import BN from 'bn.js'
import { differenceInCalendarDays, differenceInSeconds } from 'date-fns'
import { useEffect } from 'react'

import { useBids } from '@/api/hooks/bids'
import { useNft, useNftHistory } from '@/api/hooks/nfts'
import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { NftWidgetProps } from '@/components/_nft/NftWidget/NftWidget'
import { atlasConfig } from '@/config'
import { useNftState } from '@/hooks/useNftState'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'
import { convertDateFormat } from '@/utils/time'

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
    startPolling(atlasConfig.features.nft.statusPollingInterval)

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
      bid.auction.winningMember?.id !== memberId
  )
  const bidFromPreviousAuction = unwithdrawnUserBids?.[0]
  const nftOwner = nft?.owner

  const ownerMember = nftOwner?.__typename === 'NftOwnerMember' ? nftOwner.member : null
  const ownerChannel = nftOwner?.__typename === 'NftOwnerChannel' ? nftOwner.channel : null

  const { urls: ownerAvatarUris } = getMemberAvatar(ownerMember)
  const creatorAvatarUri = ownerChannel?.avatarPhoto?.resolvedUrls
  const { urls: topBidderAvatarUris } = getMemberAvatar(
    nftStatus?.status === 'auction' ? nftStatus.topBidder : undefined
  )

  const { entries: nftHistory } = useNftHistoryEntries(video?.id ?? '', {
    skip: !nft,
    pollInterval: atlasConfig.features.nft.statusPollingInterval,
    // TODO Fix me. We use `no-cache` because for unknown reasons cache removes data about owner
    fetchPolicy: 'no-cache',
  })
  const isOwnedByChannel = nftOwner?.__typename === 'NftOwnerChannel'
  const ownerHandle = ownerMember?.handle || ownerChannel?.title
  const ownerAvatar = isOwnedByChannel ? creatorAvatarUri : ownerAvatarUris

  const creatorId = ownerMember?.id || ownerChannel?.id

  switch (nftStatus?.status) {
    case 'auction': {
      return {
        ownerHandle,
        ownerAvatar,
        creatorId,
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
          topBidderAvatarUris,
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
        isOwnedByChannel,
      }
    }
    case 'buy-now':
      return {
        ownerHandle,
        ownerAvatar,
        creatorId,
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
        isOwnedByChannel: nft?.owner.__typename === 'NftOwnerChannel',
      }
    case 'idle':
      return {
        ownerHandle,
        ownerAvatar,
        creatorId,
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
        isOwnedByChannel,
      }
  }

  return null
}

export const useNftHistoryEntries = (videoId: string | null, opts?: Parameters<typeof useNftHistory>[1]) => {
  const { events, ...rest } = useNftHistory(videoId, opts)

  const mappedEvents = events
    ? events?.map((e): NftHistoryEntry => {
        if (e.data.__typename === 'NftIssuedEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member:
              e.data.nftOwner.__typename === 'NftOwnerMember'
                ? e.data.nftOwner?.member
                : e.data.nftOwner?.channel?.ownerMember || null,
            text: 'Minted',
          }
        } else if (
          e.data.__typename === 'OpenAuctionStartedEventData' ||
          e.data.__typename === 'EnglishAuctionStartedEventData'
        ) {
          return {
            date: convertDateFormat(e.timestamp),
            member:
              e.data.nftOwner.__typename === 'NftOwnerMember'
                ? e.data.nftOwner?.member
                : e.data.nftOwner?.channel?.ownerMember || null,
            text: 'Placed on auction',
          }
        } else if (e.data.__typename === 'NftSellOrderMadeEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member:
              e.data.nftOwner.__typename === 'NftOwnerMember'
                ? e.data.nftOwner?.member
                : e.data.nftOwner?.channel?.ownerMember || null,
            text: 'Put on sale',
            joyAmount: new BN(e.data.price),
          }
        } else if (e.data.__typename === 'AuctionBidMadeEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member: e.data.bid.bidder,
            text: 'Bid placed',
            joyAmount: new BN(e.data.bid.amount),
          }
        } else if (e.data.__typename === 'BidMadeCompletingAuctionEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member: e.data.winningBid.bidder,
            text: 'Auction won',
            joyAmount: new BN(e.data.winningBid.amount),
          }
        } else if (e.data.__typename === 'NftBoughtEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member: e.data.buyer,
            text: 'Bought',
            joyAmount: new BN(e.data.price),
          }
        } else if (e.data.__typename === 'EnglishAuctionSettledEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member: e.data.winningBid.bidder,
            text: 'Auction won',
          }
        } else if (e.data.__typename === 'OpenAuctionBidAcceptedEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member: e.data.winningBid.bidder,
            text: 'Auction won',
            joyAmount: e.data.winningBid?.amount ? new BN(e.data.winningBid?.amount) : undefined,
          }
        } else if (e.data.__typename === 'AuctionBidCanceledEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member: e.data.member,
            text: 'Bid withdrawn',
          }
        } else if (e.data.__typename === 'AuctionCanceledEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member:
              e.data.nftOwner.__typename === 'NftOwnerMember'
                ? e.data.nftOwner?.member
                : e.data.nftOwner?.channel?.ownerMember || null,
            text: 'Removed from sale',
          }
        } else if (e.data.__typename === 'BuyNowCanceledEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member:
              e.data.nftOwner.__typename === 'NftOwnerMember'
                ? e.data.nftOwner?.member
                : e.data.nftOwner?.channel?.ownerMember || null,
            text: 'Removed from sale',
          }
        } else if (e.data.__typename === 'BuyNowPriceUpdatedEventData') {
          return {
            date: convertDateFormat(e.timestamp),
            member:
              e.data.nftOwner.__typename === 'NftOwnerMember'
                ? e.data.nftOwner?.member
                : e.data.nftOwner?.channel?.ownerMember || null,
            text: 'Price changed',
            joyAmount: new BN(e.data.newPrice),
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
