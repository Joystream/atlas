import { QueryHookOptions, QueryResult } from '@apollo/client'
import { useMemo } from 'react'

import {
  AllNftFieldsFragment,
  BasicBidFieldsFragment,
  BasicMembershipFieldsFragment,
  GetNftQuery,
  GetNftQueryVariables,
  GetNftsConnectionQuery,
  GetNftsConnectionQueryVariables,
  useGetNftHistoryQuery,
  useGetNftQuery,
  useGetNftsConnectionQuery,
} from '@/api/queries'

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
      startingPrice: number
      buyNowPrice: number | undefined
      topBid: BasicBidFieldsFragment | undefined
      topBidAmount: number | undefined
      topBidder: BasicMembershipFieldsFragment | undefined
      auctionPlannedEndBlock: number | undefined
      bidLockingTime: number | undefined
      minimalBidStep: number | undefined
      whitelistedMembers: BasicMembershipFieldsFragment[] | undefined
    }
  | {
      status: 'idle'
      lastSalePrice: number | undefined
      lastSaleDate: Date | undefined
    }
  | {
      status: 'buy-now'
      buyNowPrice: number
    }
) &
  CommonNftProperties

export type UseNftData = Omit<QueryResult, 'data'> & { nft?: AllNftFieldsFragment | null; nftStatus?: NftStatus }

export const getNftStatus = (nft?: AllNftFieldsFragment | null): NftStatus | undefined => {
  if (!nft) return undefined
  const commonProperties = {
    title: nft?.video?.title,
    duration: nft?.video?.duration,
    views: nft?.video?.views,
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
      startingPrice: Number(auction.startingPrice) || 0,
      buyNowPrice: Number(auction.buyNowPrice) || undefined,
      topBid: auction.topBid || undefined,
      topBidAmount: Number(auction.topBid?.amount) || undefined,
      topBidder: auction.topBid?.bidder,
      auctionPlannedEndBlock: englishAuction ? englishAuction.plannedEndAtBlock : undefined,
      bidLockingTime: openAuction ? openAuction.bidLockDuration : undefined,
      minimalBidStep: englishAuction ? englishAuction.minimalBidStep : undefined,
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
        buyNowPrice: Number(nft.transactionalStatus.price),
      }
    case 'TransactionalStatusIdle':
      return {
        ...commonProperties,
        status: 'idle',
        lastSalePrice: Number(nft.lastSalePrice) || undefined,
        lastSaleDate: nft.lastSaleDate ? new Date(nft.lastSaleDate) : undefined,
      }
    default:
      return undefined
  }
}

export const useNft = (id: string, opts?: QueryHookOptions<GetNftQuery, GetNftQueryVariables>): UseNftData => {
  const { data, ...rest } = useGetNftQuery({ variables: { id }, skip: !id, ...opts })
  const nft = data?.ownedNftByUniqueInput

  return {
    nft,
    nftStatus: getNftStatus(nft),
    ...rest,
  }
}

export const useNftsConnection = (
  variables?: GetNftsConnectionQueryVariables,
  opts?: QueryHookOptions<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>
) => {
  const { data, ...rest } = useGetNftsConnectionQuery({ variables, ...opts })

  return {
    nfts: data?.ownedNftsConnection.edges.map(({ node }) => node),
    totalCount: data?.ownedNftsConnection.totalCount,
    pageInfo: data?.ownedNftsConnection.pageInfo,
    ...rest,
  }
}

export const useNftHistory = (id: string | null) => {
  const { data, ...rest } = useGetNftHistoryQuery({ variables: { nftId: id || '' }, skip: !id })

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
