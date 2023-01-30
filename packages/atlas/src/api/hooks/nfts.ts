import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'
import { useMemo } from 'react'

import {
  BasicBidFieldsFragment,
  BasicMembershipFieldsFragment,
  BasicNftFieldsFragment,
  BasicVideoFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import {
  GetNftQuery,
  GetNftQueryVariables,
  GetNftsConnectionQuery,
  GetNftsConnectionQueryVariables,
  useGetNftQuery,
  useGetNftsConnectionQuery,
} from '@/api/queries/__generated__/nfts.generated'
import {
  GetNftHistoryQuery,
  GetNftHistoryQueryVariables,
  useGetNftHistoryQuery,
} from '@/api/queries/__generated__/notifications.generated'
import { nftFilter } from '@/config/contentFilter'

type CommonNftProperties = {
  title: string | null | undefined
  duration: number | null | undefined
  views: number | undefined
}

export type NftStatus = (
  | {
      status: 'auction'
      auctionId: string
      type: 'open' | 'english'
      startingPrice: BN
      buyNowPrice: BN | undefined
      topBid: BasicBidFieldsFragment | undefined
      topBidAmount: BN | undefined
      topBidder: BasicMembershipFieldsFragment | undefined
      auctionPlannedEndBlock: number | undefined
      bidLockingTime: number | undefined
      minimalBidStep: BN | undefined
      whitelistedMembers: BasicMembershipFieldsFragment[] | undefined
    }
  | {
      status: 'idle'
      lastSalePrice: BN | undefined
      lastSaleDate: Date | undefined
    }
  | {
      status: 'buy-now'
      buyNowPrice: BN
    }
) &
  CommonNftProperties

export const getNftStatus = (
  nft: BasicNftFieldsFragment | null | undefined,
  video: BasicVideoFieldsFragment | null | undefined
): NftStatus | undefined => {
  if (!nft) return undefined
  const commonProperties = {
    title: video?.title,
    duration: video?.duration,
    views: video?.views,
  }

  if (nft?.transactionalStatusAuction) {
    const auction = nft.transactionalStatusAuction
    const englishAuction = auction.auctionType.__typename === 'AuctionTypeEnglish' && auction.auctionType
    const openAuction = auction.auctionType.__typename === 'AuctionTypeOpen' && auction.auctionType
    return {
      ...commonProperties,
      status: 'auction',
      auctionId: auction.id,
      type: openAuction ? 'open' : 'english',
      startingPrice: new BN(auction.startingPrice || 0),
      buyNowPrice: auction.buyNowPrice ? new BN(auction.buyNowPrice) : undefined,
      topBid: auction.topBid || undefined,
      topBidAmount: auction.topBid?.amount ? new BN(auction.topBid?.amount) : undefined,
      topBidder: auction.topBid?.bidder,
      auctionPlannedEndBlock: englishAuction ? englishAuction.plannedEndAtBlock : undefined,
      bidLockingTime: openAuction ? openAuction.bidLockDuration : undefined,
      minimalBidStep: englishAuction ? new BN(englishAuction.minimalBidStep) : undefined,
      whitelistedMembers: auction.whitelistedMembers,
    }
  }

  if (!nft?.transactionalStatus) {
    throw new Error('NFT missing transactional status')
  }
  switch (nft?.transactionalStatus.__typename) {
    case 'TransactionalStatusBuyNow':
      return {
        ...commonProperties,
        status: 'buy-now',
        buyNowPrice: new BN(nft.transactionalStatus.price),
      }
    case 'TransactionalStatusIdle':
      return {
        ...commonProperties,
        status: 'idle',
        lastSalePrice: nft.lastSalePrice ? new BN(nft.lastSalePrice) : undefined,
        lastSaleDate: nft.lastSaleDate ? new Date(nft.lastSaleDate) : undefined,
      }
    default:
      return undefined
  }
}

export const useNft = (id: string, opts?: QueryHookOptions<GetNftQuery, GetNftQueryVariables>) => {
  const { data, ...rest } = useGetNftQuery({ variables: { id }, skip: !id, ...opts })
  const nft = data?.ownedNftByUniqueInput

  return {
    nft,
    nftStatus: getNftStatus(nft, nft?.video),
    ...rest,
  }
}

export const useNftsConnection = (
  variables?: GetNftsConnectionQueryVariables,
  opts?: QueryHookOptions<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>
) => {
  const { data, ...rest } = useGetNftsConnectionQuery({
    variables: {
      ...variables,
      where: { ...variables?.where, ...(nftFilter ? nftFilter : {}) },
    },
    ...opts,
  })

  return {
    nfts: data?.ownedNftsConnection.edges.map(({ node }) => node),
    totalCount: data?.ownedNftsConnection.totalCount,
    pageInfo: data?.ownedNftsConnection.pageInfo,
    ...rest,
  }
}

export const useNftHistory = (
  id: string | null,
  opts?: QueryHookOptions<GetNftHistoryQuery, GetNftHistoryQueryVariables>
) => {
  const { data, ...rest } = useGetNftHistoryQuery({ variables: { nftId: id || '' }, skip: !id, ...opts })

  const sortedEvents = useMemo(() => {
    const allEvents = data
      ? [
          ...data.nftIssuedEvents,
          ...data.openAuctionStartedEvents,
          ...data.englishAuctionStartedEvents,
          ...data.nftSellOrderMadeEvents,
          ...data.auctionBidMadeEvents,
          ...data.bidMadeCompletingAuctionEvents,
          ...data.nftBoughtEvents,
          ...data.englishAuctionSettledEvents,
          ...data.openAuctionBidAcceptedEvents,
          ...data.auctionBidCanceledEvents,
          ...data.auctionCanceledEvents,
          ...data.buyNowCanceledEvents,
          ...data.buyNowPriceUpdatedEvents,
        ]
      : []

    return allEvents.sort((e1, e2) => e2.createdAt.getTime() - e1.createdAt.getTime())
  }, [data])

  return {
    events: sortedEvents,
    ...rest,
  }
}
