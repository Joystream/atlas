import { InMemoryCache } from '@apollo/client'
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common'
import { FieldPolicy, FieldReadFunction } from '@apollo/client/cache/inmemory/policies'
import { offsetLimitPagination, relayStylePagination } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'

import {
  FullChannelFieldsFragment,
  FullVideoFieldsFragment,
  GetNftsConnectionQueryVariables,
  Query,
  QueryChannelsConnectionArgs,
  QueryCommentsConnectionArgs,
  QueryVideosConnectionArgs,
  SearchQueryVariables,
  VideoConnection,
  VideoOrderByInput,
} from '../queries'

const stringifyValue = (value: unknown) => JSON.stringify(value || {})

const getVideoKeyArgs = (args: QueryVideosConnectionArgs | null) => {
  const onlyCount = args?.first === 0
  const channel = stringifyValue(args?.where?.channel)
  const category = stringifyValue(args?.where?.category)
  const language = stringifyValue(args?.where?.language)
  const nft = stringifyValue(args?.where?.nft)
  const idEq = args?.where?.id_eq || ''
  const idIn = args?.where?.id_in || []
  const isPublic = args?.where?.isPublic_eq ?? ''
  const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''
  const sorting = args?.orderBy?.[0] ? args.orderBy[0] : ''
  const isFeatured = args?.where?.isFeatured_eq ?? ''
  const durationGte = args?.where?.duration_gte || ''
  const durationLte = args?.where?.duration_gte || ''

  // only for counting videos in HomeView
  if (args?.where?.channel?.id_in && !args?.first) {
    return `${createdAtGte}:${channel}`
  }

  return `${onlyCount}:${channel}:${category}:${nft}:${language}:${createdAtGte}:${isPublic}:${idEq}:${idIn}:${sorting}:${isFeatured}:${durationGte}:${durationLte}`
}

const getNftKeyArgs = (args: GetNftsConnectionQueryVariables | null) => {
  const OR = stringifyValue(args?.where?.OR)
  const ownerMember = stringifyValue(args?.where?.ownerMember)
  const creatorChannel = stringifyValue(args?.where?.creatorChannel)
  const status = stringifyValue(args?.where?.transactionalStatus_json)
  const auctionStatus = stringifyValue(args?.where?.transactionalStatusAuction)
  const sorting = args?.orderBy?.[0] ? args.orderBy[0] : ''
  const createdAt_gte = stringifyValue(args?.where?.createdAt_gte)
  const video = stringifyValue(args?.where?.video)

  return `${OR}:${ownerMember}:${creatorChannel}:${status}:${auctionStatus}:${sorting}:${createdAt_gte}:${video}`
}

const getChannelKeyArgs = (args: QueryChannelsConnectionArgs | null) => {
  // make sure queries asking for a specific category are separated in cache
  const language = stringifyValue(args?.where?.language)
  const idIn = args?.where?.id_in || []
  const orderBy = args?.orderBy || []

  return `${language}:${idIn}:${orderBy}`
}

const getSearchKeyArgs = (args: SearchQueryVariables | null) => {
  const text = args?.text || ''
  const hasMarketingEq = args?.whereVideo?.hasMarketing_eq ?? ''
  const isExplicitEq = args?.whereVideo?.isExplicit_eq ?? ''
  const language = stringifyValue(args?.whereVideo?.language)
  const category = stringifyValue(args?.whereVideo?.category)
  const createdAtGte = args?.whereVideo?.createdAt_gte ? JSON.stringify(args.whereVideo.createdAt_gte) : ''
  const durationGte = args?.whereVideo?.duration_gte || null
  const durationLte = args?.whereVideo?.duration_lte || null

  return `${text}:${language}:${createdAtGte}:${category}:${isExplicitEq}:${hasMarketingEq}:${durationLte}:${durationGte}`
}

const getCommentKeyArgs = (args: QueryCommentsConnectionArgs | null) => {
  const parentCommentId = args?.where?.parentComment?.id_eq
  const videoId = args?.where?.video?.id_eq
  const orderBy = args?.orderBy || []
  return `${parentCommentId}:${videoId}:${orderBy}`
}

const createDateHandler = () => ({
  merge: (_: unknown, existingData: string | Date): Date => {
    if (typeof existingData !== 'string') {
      return existingData
    }
    return parseISO(existingData)
  },
})

type CachePolicyFields<T extends string> = Partial<Record<T, FieldPolicy | FieldReadFunction>>

const queryCacheFields: CachePolicyFields<keyof Query> = {
  channelsConnection: relayStylePagination(getChannelKeyArgs),
  mostFollowedChannelsConnection: relayStylePagination(getChannelKeyArgs),
  mostViewedChannelsConnection: relayStylePagination(getChannelKeyArgs),
  videosConnection: {
    ...relayStylePagination(getVideoKeyArgs),
    read(
      existing: VideoConnection,
      { args, readField }: { args: QueryVideosConnectionArgs | null; readField: ReadFieldFunction }
    ) {
      const isPublic = args?.where?.isPublic_eq
      const filteredEdges =
        existing?.edges.filter((edge) => {
          if (isPublic == null) return true // ignore if filter not applied
          const nodeFieldValue = readField('isPublic', edge.node)
          if (nodeFieldValue == null) return true // if the node doesn't have isPublic field, ignore filter
          return nodeFieldValue === isPublic
        }) ?? []

      const sortingASC = args?.orderBy?.[0] === VideoOrderByInput.CreatedAtAsc
      const preSortedDESC = (filteredEdges || []).slice().sort((a, b) => {
        return (readField('createdAt', b.node) as Date).getTime() - (readField('createdAt', a.node) as Date).getTime()
      })
      const sortedEdges = sortingASC ? preSortedDESC.reverse() : preSortedDESC

      return (
        existing && {
          ...existing,
          edges: sortedEdges,
        }
      )
    },
  },
  ownedNftsConnection: relayStylePagination(getNftKeyArgs),
  mostViewedVideosConnection: relayStylePagination(getVideoKeyArgs),
  videos: {
    ...offsetLimitPagination(getVideoKeyArgs),
    read(existing, opts) {
      const offset = opts.args?.offset ?? 0
      const limit = opts.args?.limit ?? existing?.length
      return existing?.slice(offset, offset + limit)
    },
  },
  commentsConnection: relayStylePagination(getCommentKeyArgs),
  channelByUniqueInput: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'Channel',
        id: args?.where.id,
      })
    )
  },
  videoByUniqueInput: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'Video',
        id: args?.where.id,
      })
    )
  },
  membershipByUniqueInput: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'Membership',
        id: args?.where.id,
      })
    )
  },
  ownedNftByUniqueInput: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'OwnedNft',
        id: args?.where.id,
      })
    )
  },
  // @ts-ignore Apollo doesn't contain info on args type so Typescript will complain
  search: offsetLimitPagination(getSearchKeyArgs),
  commentByUniqueInput: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'Comment',
        id: args?.where.id,
      })
    )
  },
}

const videoCacheFields: CachePolicyFields<keyof FullVideoFieldsFragment> = {
  createdAt: createDateHandler(),
  publishedBeforeJoystream: createDateHandler(),
}

const channelCacheFields: CachePolicyFields<keyof FullChannelFieldsFragment> = {
  createdAt: createDateHandler(),
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: queryCacheFields,
    },
    Video: {
      fields: videoCacheFields,
    },
    Channel: {
      fields: channelCacheFields,
    },
    OwnedNft: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    NftIssuedEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    OpenAuctionStartedEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    EnglishAuctionStartedEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    NftSellOrderMadeEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    AuctionBidMadeEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    BidMadeCompletingAuctionEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    NftBoughtEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    EnglishAuctionSettledEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    OpenAuctionBidAcceptedEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    AuctionBidCanceledEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    AuctionCanceledEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    BuyNowCanceledEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    BuyNowPriceUpdatedEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    CommentTextUpdatedEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    CommentCreatedEvent: {
      fields: {
        createdAt: createDateHandler(),
      },
    },
    StorageDataObject: {
      fields: {
        size: {
          merge: (_: unknown, existingData: string | number): number => {
            if (typeof existingData === 'string') {
              return parseInt(existingData)
            }
            return existingData
          },
        },
      },
    },
  },
})

export default cache
