import { QueryHookOptions, QueryResult } from '@apollo/client'

import {
  AllBidFieldsFragment,
  AllNftFieldsFragment,
  BasicMembershipFieldsFragment,
  GetNftQuery,
  GetNftQueryVariables,
  GetNftsQuery,
  GetNftsQueryVariables,
  OwnedNftOrderByInput,
  OwnedNftWhereInput,
  useGetNftQuery,
  useGetNftsConnectionQuery,
  useGetNftsQuery,
} from '@/api/queries'

export const useNfts = (
  variables?: GetNftsQueryVariables,
  opts?: QueryHookOptions<GetNftsQuery, GetNftsQueryVariables>
) => {
  const { data, ...rest } = useGetNftsQuery({ variables, ...opts })

  return {
    nfts: data?.ownedNfts,
    ...rest,
  }
}

type CommonNftProperties = {
  title: string | null | undefined
  duration: number | null | undefined
  views: number | undefined
}

export type NftStatus = (
  | {
      status: 'auction'
      type: 'open' | 'english'
      startingPrice: number
      buyNowPrice: number | undefined
      topBid: AllBidFieldsFragment | undefined
      topBidAmount: number | undefined
      topBidder: BasicMembershipFieldsFragment | undefined
      auctionPlannedEndBlock: number | undefined
      bidLockingTime: number | undefined
      minimalBidStep: number | undefined
      whitelistedMembers: BasicMembershipFieldsFragment[] | undefined
    }
  | {
      status: 'idle'
      lastPrice: number | undefined
      lastTransactionDate: Date | undefined
    }
  | {
      status: 'buy-now'
      buyNowPrice: number
    }
) &
  CommonNftProperties

export type UseNftData = Omit<QueryResult, 'data'> & { nft?: AllNftFieldsFragment | null; nftStatus?: NftStatus }

export const useNft = (id: string, opts?: QueryHookOptions<GetNftQuery, GetNftQueryVariables>): UseNftData => {
  const { data, ...rest } = useGetNftQuery({ variables: { id }, skip: !id, ...opts })
  const nft = data?.ownedNftByUniqueInput

  const commonProperties = {
    title: nft?.video?.title,
    duration: nft?.video?.duration,
    views: nft?.video?.views,
  }

  const getNftProperties = (): NftStatus | undefined => {
    if (!nft) return undefined

    if (nft?.transactionalStatusAuction) {
      const auction = nft.transactionalStatusAuction
      const englishAuction = auction.auctionType.__typename === 'AuctionTypeEnglish' && auction.auctionType
      const openAuction = auction.auctionType.__typename === 'AuctionTypeOpen' && auction.auctionType
      return {
        ...commonProperties,
        status: 'auction',
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
          // TODO: last transaction on iddle
          lastPrice: undefined,
          lastTransactionDate: undefined,
        }
      default:
        return undefined
    }
  }

  return {
    nft,
    nftStatus: getNftProperties(),
    ...rest,
  }
}

type ChannelNftsOpts = {
  sortNftsBy?: OwnedNftOrderByInput
  where?: OwnedNftWhereInput
}

export const useChannelNfts = (channelId: string, opts?: ChannelNftsOpts) => {
  const { data, ...rest } = useGetNftsConnectionQuery({
    variables: {
      orderBy: opts?.sortNftsBy,
      where: {
        ...opts?.where,
        creatorChannel: {
          id_eq: channelId,
        },
      },
    },
  })

  return {
    nfts: data?.ownedNftsConnection.edges.map(({ node }) => node),
    totalCount: data?.ownedNftsConnection.totalCount,
    pageInfo: data?.ownedNftsConnection.pageInfo,
    ...rest,
  }
}
