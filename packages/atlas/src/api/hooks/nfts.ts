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
      topBid: number | undefined
      topBidder: BasicMembershipFieldsFragment | undefined
      auctionPlannedEndBlock?: number
      startsAtDate: Date | undefined
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
    //TODO:
    const hasBidFromPreviousAuction = true
    const bidFromUser = undefined

    const userBid = nft?.transactionalStatus.auction?.bids.find(
      (bid) => !bid.isCanceled && bid.bidder.id === activeMembership?.id
    )
    const type = nft.transactionalStatus.auction?.auctionType.__typename === 'AuctionTypeOpen' ? 'open' : 'english'
    const canWithdrawBid =
      nft.transactionalStatus.auction?.isCompleted ||
      (nft.transactionalStatus.auction?.auctionType.__typename === 'AuctionTypeOpen' &&
        userBid &&
        nft?.transactionalStatus?.auction?.auctionType.bidLockingTime + userBid.createdInBlock > currentBlock)

    const isExpired =
      !!nft.transactionalStatus.auction?.plannedEndAtBlock &&
      nft.transactionalStatus.auction?.plannedEndAtBlock <= currentBlock
    const isRunning =
      !!nft.transactionalStatus.auction?.startsAtBlock &&
      currentBlock >= nft.transactionalStatus.auction?.startsAtBlock
    const isUpcoming =
      !!nft.transactionalStatus.auction?.startsAtBlock &&
      currentBlock <= nft.transactionalStatus.auction?.startsAtBlock
    const needsSettling = !!nft.transactionalStatus.auction?.lastBid && isExpired

    const startsAtDate = nft.transactionalStatus.auction?.startsAtBlock
      ? new Date(convertBlockToMsTimestamp(nft.transactionalStatus.auction?.startsAtBlock))
      : undefined
    const auctionPlannedEndDate = nft.transactionalStatus.auction?.plannedEndAtBlock
      ? new Date(convertBlockToMsTimestamp(nft.transactionalStatus.auction?.plannedEndAtBlock))
      : undefined
    const englishTimerState: EnglishTimerState = isExpired
      ? 'expired'
      : isRunning
      ? 'running'
      : isUpcoming
      ? 'upcoming'
      : null

        const startsAtDate = nft.transactionalStatus.auction?.startsAtBlock
          ? new Date(convertBlockToMsTimestamp(nft.transactionalStatus.auction?.startsAtBlock))
          : undefined
        return {
          ...commonProperties,
          status: 'auction',
          type: nft.transactionalStatus.auction?.auctionType.__typename === 'AuctionTypeOpen' ? 'open' : 'english',
          startingPrice: Number(nft.transactionalStatus.auction?.startingPrice) || 0,
          buyNowPrice: Number(nft.transactionalStatus.auction?.buyNowPrice) || undefined,
          topBid: Number(nft.transactionalStatus.auction?.lastBid?.amount),
          topBidder: nft.transactionalStatus.auction?.lastBid?.bidder,
          auctionPlannedEndBlock: nft.transactionalStatus.auction?.plannedEndAtBlock || undefined,
          startsAtDate,
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
function convertBlockToMsTimestamp(startsAtBlock: number): string | number | Date {
  throw new Error('Function not implemented.')
}
