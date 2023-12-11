import { InMemoryCache } from '@apollo/client'
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common'
import { FieldPolicy, FieldReadFunction } from '@apollo/client/cache/inmemory/policies'
import { offsetLimitPagination, relayStylePagination } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'

import {
  Query,
  QueryChannelsConnectionArgs,
  QueryCommentsConnectionArgs,
  QueryOwnedNftsConnectionArgs,
  QueryTokenAccountsArgs,
  QueryVideosConnectionArgs,
  VideosConnection,
} from '../queries/__generated__/baseTypes.generated'
import { FullChannelFieldsFragment, FullVideoFieldsFragment } from '../queries/__generated__/fragments.generated'
import { GetFullVideosConnectionQueryVariables } from '../queries/__generated__/videos.generated'

const stringifyValue = (value: unknown) => JSON.stringify(value || {})

const getVideoKeyArgs = (
  args: Partial<QueryVideosConnectionArgs> | null,
  ctx: {
    variables?: Record<string, unknown>
    fieldName: string
  }
) => {
  const offset = ctx.fieldName === 'videos' ? ctx?.variables?.offset ?? '' : ''
  const onlyCount = args?.first === 0
  const channel = stringifyValue(args?.where?.channel)
  const category = stringifyValue(args?.where?.category)
  const language = stringifyValue(args?.where?.language_eq)
  const nft = stringifyValue(args?.where?.nft)
  const idEq = args?.where?.id_eq || ''
  const idIn = args?.where?.id_in || []
  const isPublic = args?.where?.isPublic_eq ?? ''
  const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''
  const createdAtGt = args?.where?.createdAt_gt ? JSON.stringify(args.where.createdAt_gt) : ''
  const createdAtLte = args?.where?.createdAt_lte ? JSON.stringify(args.where.createdAt_lte) : ''
  const createdAtLt = args?.where?.createdAt_lt ? JSON.stringify(args.where.createdAt_lt) : ''
  const durationGte = args?.where?.duration_gte || ''
  const durationLte = args?.where?.duration_gte || ''
  const titleContains = args?.where?.title_contains || ''
  const titleContainsInsensitive = args?.where?.title_containsInsensitive || ''

  const sortingArray = args?.orderBy != null ? (Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy]) : []
  const sorting = stringifyValue(sortingArray)

  // only for counting videos in HomeView
  if (args?.where?.channel?.id_in && !args?.first) {
    return `${createdAtGte}:${channel}`
  }

  return `${onlyCount}:${channel}:${category}:${nft}:${language}:${createdAtGte}:${createdAtLte}:${isPublic}:${idEq}:${idIn}:${sorting}:${durationGte}:${durationLte}:${titleContains}:${titleContainsInsensitive}:${offset}:${createdAtGt}:${createdAtLt}`
}

const getNftKeyArgs = (
  args: Partial<QueryOwnedNftsConnectionArgs> | null,
  ctx: {
    variables?: Record<string, unknown>
    fieldName: string
  }
) => {
  const offset = ctx.fieldName === 'ownedNfts' ? ctx?.variables?.offset ?? '' : ''
  const OR = stringifyValue(args?.where?.OR)
  const AND = stringifyValue(args?.where?.AND)
  const ownerMember = stringifyValue(args?.where?.owner?.member)
  const creatorChannel = stringifyValue(args?.where?.owner?.channel)
  const status = stringifyValue(args?.where?.transactionalStatus)
  const auctionStatus = stringifyValue(args?.where?.transactionalStatus?.auction)
  const sortingArray = args?.orderBy != null ? (Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy]) : []
  const sorting = stringifyValue(sortingArray)
  const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''
  const createdAtLte = args?.where?.createdAt_lte ? JSON.stringify(args.where.createdAt_lte) : ''
  const lastSalePriceGte = args?.where?.lastSalePrice_gte ? JSON.stringify(args.where.lastSalePrice_gte) : ''
  const lastSalePriceLte = args?.where?.lastSalePrice_lte ? JSON.stringify(args.where.lastSalePrice_lte) : ''
  const video = stringifyValue(args?.where?.video)

  return `${OR}:${AND}:${ownerMember}:${creatorChannel}:${status}:${auctionStatus}:${sorting}:${createdAtGte}:${createdAtLte}:${video}:${offset}:${lastSalePriceGte}:${lastSalePriceLte}`
}

const getTokenAccountsKeyArgs = (
  args: Partial<QueryTokenAccountsArgs> | null,
  ctx: {
    variables?: Record<string, unknown>
    fieldName: string
  }
) => {
  const offset = ctx?.variables?.offset ?? ''
  const OR = stringifyValue(args?.where?.OR)
  const AND = stringifyValue(args?.where?.AND)
  const sortingArray = args?.orderBy != null ? (Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy]) : []
  const sorting = stringifyValue(sortingArray)
  const where = stringifyValue(args?.where ?? {})

  return `${OR}:${AND}:${sorting}:${offset}:${where}`
}

const getChannelKeyArgs = (args: Partial<QueryChannelsConnectionArgs> | null) => {
  // make sure queries asking for a specific category are separated in cache
  const language = stringifyValue(args?.where?.language_eq)
  const idIn = args?.where?.id_in || []
  const sortingArray = args?.orderBy != null ? (Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy]) : []
  const sorting = stringifyValue(sortingArray)
  const titleContains = args?.where?.title_contains || ''

  return `${language}:${idIn}:${sorting}:${titleContains}`
}

const getCommentKeyArgs = (
  args: Partial<QueryCommentsConnectionArgs> | null,
  ctx: {
    variables?: Record<string, unknown>
  }
) => {
  const parentCommentId = args?.where?.parentComment?.id_eq
  const videoId = args?.where?.video?.id_eq ?? ctx.variables?.videoId
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
  extendedChannels: (existing, { toReference, args, canRead }) => {
    if (args?.where?.id_eq) {
      // get single channel
      const channelRef = toReference({
        __typename: 'Channel',
        id: args?.where.id_eq,
      })
      if (canRead(channelRef)) {
        return [channelRef]
      } else {
        return undefined
      }
    } else {
      return existing
    }
  },
  videosConnection: {
    ...relayStylePagination(getVideoKeyArgs),
    read(
      existing: VideosConnection,
      { args, readField }: { args: GetFullVideosConnectionQueryVariables | null; readField: ReadFieldFunction }
    ) {
      const isPublic = args?.where?.isPublic_eq
      const filteredEdges =
        existing?.edges.filter((edge) => {
          if (isPublic == null) return true // ignore if filter not applied
          const nodeFieldValue = readField('isPublic', edge.node)
          if (nodeFieldValue == null) return true // if the node doesn't have isPublic field, ignore filter
          return nodeFieldValue === isPublic
        }) ?? []

      return (
        existing && {
          ...existing,
          edges: filteredEdges,
        }
      )
    },
  },
  ownedNftsConnection: relayStylePagination(getNftKeyArgs),
  ownedNfts: {
    ...offsetLimitPagination(getNftKeyArgs),
    read(existing, { args, toReference, canRead }) {
      if (args?.where?.id_eq) {
        // get single nft
        const nftRef = toReference({
          __typename: 'OwnedNft',
          id: args?.where?.id_eq,
        })
        if (canRead(nftRef)) {
          return [nftRef]
        } else {
          return undefined
        }
      }
      const offset = args?.offset ?? 0
      const limit = args?.limit ?? existing?.length
      return existing?.slice(offset, offset + limit)
    },
  },
  mostViewedVideosConnection: relayStylePagination(getVideoKeyArgs),
  videos: {
    ...offsetLimitPagination(getVideoKeyArgs),
    read(existing, { args, toReference, canRead }) {
      if (args?.where?.id_eq) {
        // get single video
        const videoRef = toReference({
          __typename: 'Video',
          id: args?.where.id_eq,
        })
        if (canRead(videoRef)) {
          return [videoRef]
        } else {
          return undefined
        }
      }
      const offset = args?.offset ?? 0
      const limit = args?.limit ?? existing?.length
      return existing?.slice(offset, offset + limit)
    },
  },
  commentsConnection: relayStylePagination(getCommentKeyArgs),
  channelById: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'Channel',
        id: args?.id,
      })
    )
  },
  videoById: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'Video',
        id: args?.id,
      })
    )
  },
  ownedNftById: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'OwnedNft',
        id: args?.id,
      })
    )
  },
  tokenAccounts: {
    ...offsetLimitPagination(getTokenAccountsKeyArgs),
    read(existing, { args, toReference, canRead }) {
      if (args?.where?.id_eq) {
        const holderRef = toReference({
          __typename: 'TokenAccount',
          id: args?.where.id_eq,
        })
        if (canRead(holderRef)) {
          return [holderRef]
        } else {
          return undefined
        }
      }
      const offset = args?.offset ?? 0
      const limit = args?.limit ?? existing?.length
      return existing?.slice(offset, offset + limit)
    },
  },
  commentById: (existing, { toReference, args }) => {
    return (
      existing ||
      toReference({
        __typename: 'Comment',
        id: args?.id,
      })
    )
  },
}

const videoCacheFields: CachePolicyFields<keyof FullVideoFieldsFragment> = {
  createdAt: createDateHandler(),
  publishedBeforeJoystream: createDateHandler(),
  subtitles: {
    merge: (existing, incoming) => incoming,
  },
}

const channelCacheFields: CachePolicyFields<keyof FullChannelFieldsFragment> = {
  createdAt: createDateHandler(),
}

const cache = new InMemoryCache({
  possibleTypes: {
    NftOwner: ['NftOwnerChannel', 'NftOwnerMember'],
  },
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
    Event: {
      fields: {
        timestamp: createDateHandler(),
      },
    },
    StorageDataObject: {
      fields: {
        resolvedUrls: {
          read: (resolvedUrls, { readField }) => {
            const isAccepted = readField('isAccepted')
            return isAccepted ? resolvedUrls : []
          },
        },
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
