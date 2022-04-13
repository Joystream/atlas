import { QueryHookOptions, QueryResult } from '@apollo/client'

import {
  AllBidFieldsFragment,
  AllNftFieldsFragment,
  BasicMembershipFieldsFragment,
  GetNftQuery,
  GetNftQueryVariables,
  GetNftsQuery,
  GetNftsQueryVariables,
  VideoCategoryWhereInput,
  VideoOrderByInput,
  useGetNftQuery,
  useGetNftsQuery,
  useGetVideosConnectionQuery,
} from '@/api/queries'
import { createLookup } from '@/utils/data'

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
      auctionPlannedEndBlock?: number
      bidLockingTime: number | undefined
      minimalBidStep: number | undefined
    }
  | {
      status: 'idle'
      lastPrice?: number
      lastTransactionDate?: Date
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
  category?: VideoCategoryWhereInput | null
  sortNftsBy?: VideoOrderByInput
}

export const useChannelNfts = (channelId: string, opts?: ChannelNftsOpts) => {
  // TODO replace videosConnection query with ownedNftsConnection query once the filtering by owner is available in query node
  const {
    data: videosConnectionData,
    loading: videosConnectionLoading,
    ...rest
  } = useGetVideosConnectionQuery({
    variables: {
      orderBy: opts?.sortNftsBy,
      where: {
        channel: { id_eq: channelId },
        nft: {
          metadata_contains: '', // this will filter all the videos with NFT issued.
        },
        isPublic_eq: true,
        isCensored_eq: false,

        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
        ...(opts?.category?.id_in?.length
          ? {
              category: {
                id_in: opts.category.id_in,
              },
            }
          : {}),
      },
    },
  })

  const idIn = videosConnectionData?.videosConnection.edges.map((edge) => edge.node.id) || []

  const { data: nftsData, loading: nftsLoading } = useGetNftsQuery({
    variables: {
      where: {
        id_in: idIn,
      },
    },
    skip: !idIn.length || videosConnectionLoading,
  })

  const nftsDataLookup = nftsData?.ownedNfts ? createLookup(nftsData?.ownedNfts) : {}

  const nfts = videosConnectionData?.videosConnection.edges.map((video) => ({
    ...video.node,
    nft: nftsDataLookup[video.node.id],
  }))

  return {
    nfts: nftsData?.ownedNfts.length ? nfts : undefined,
    totalCount: videosConnectionData?.videosConnection.totalCount,
    pageInfo: videosConnectionData?.videosConnection.pageInfo,
    loading: nftsLoading || videosConnectionLoading,
    ...rest,
  }
}
