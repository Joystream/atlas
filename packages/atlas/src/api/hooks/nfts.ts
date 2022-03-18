import { QueryResult } from '@apollo/client'

import {
  AllNftFieldsFragment,
  BasicMembershipFieldsFragment,
  VideoCategoryWhereInput,
  VideoOrderByInput,
  useGetNftQuery,
  useGetNftsQuery,
  useGetVideosConnectionQuery,
} from '@/api/queries'
import { createLookup } from '@/utils/data'

export type NftStatus =
  | {
      status: 'auction'
      type: 'open-auction' | 'english-auction'
      startingPrice: number
      buyNowPrice?: number
      topBid?: number
      topBidder?: BasicMembershipFieldsFragment
      title?: string | null
      duration?: number | null
      views?: number
      auctionPlannedEndBlock?: number
      startsAtDate?: Date
    }
  | {
      title?: string | null
      duration?: number | null
      status: 'idle'
      lastPrice?: number
      lastTransactionDate?: Date
      views?: number
    }
  | {
      title?: string | null
      duration?: number | null
      status: 'buy-now'
      buyNowPrice: number
      views?: number
    }

export type UseNftData = Omit<QueryResult, 'data'> & { nft?: AllNftFieldsFragment | null; nftStatus: NftStatus }

export const useNft = (id: string): UseNftData => {
  const { data, ...rest } = useGetNftQuery({ variables: { id }, skip: !id })
  const nft = data?.ownedNftByUniqueInput

  const commonProperties = {
    title: nft?.video?.title,
    duration: nft?.video?.duration,
    views: nft?.video?.views,
  }

  const getNftProperties = (): NftStatus => {
    switch (nft?.transactionalStatus.__typename) {
      case 'TransactionalStatusAuction': {
        return {
          ...commonProperties,
          status: 'auction',
          type:
            nft.transactionalStatus.auction?.auctionType.__typename === 'AuctionTypeOpen'
              ? 'open-auction'
              : 'english-auction',
          startingPrice: Number(nft.transactionalStatus.auction?.startingPrice) || 0,
          buyNowPrice: Number(nft.transactionalStatus.auction?.buyNowPrice) || undefined,
          topBid: Number(nft.transactionalStatus.auction?.lastBid?.amount),
          topBidder: nft.transactionalStatus.auction?.lastBid?.bidder,
          auctionPlannedEndBlock: nft.transactionalStatus.auction?.plannedEndAtBlock || undefined,
        }
      }
      case 'TransactionalStatusBuyNow':
        return {
          ...commonProperties,
          status: 'buy-now',
          buyNowPrice: Number(nft.transactionalStatus.price),
        }
      default:
        return {
          ...commonProperties,
          status: 'idle',
        }
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
