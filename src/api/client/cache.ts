import { InMemoryCache } from '@apollo/client'
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common'
import { FieldPolicy, FieldReadFunction } from '@apollo/client/cache/inmemory/policies'
import { offsetLimitPagination, relayStylePagination } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'

import {
  AllChannelFieldsFragment,
  AssetAvailability,
  GetChannelsConnectionQueryVariables,
  GetVideosConnectionQueryVariables,
  Query,
  SearchQueryVariables,
  VideoConnection,
  VideoFieldsFragment,
  VideoOrderByInput,
} from '../queries'

const getVideoKeyArgs = (args: GetVideosConnectionQueryVariables | null) => {
  // make sure queries asking for a specific category are separated in cache
  const onlyCount = args?.first === 0
  const channelId = args?.where?.channelId_eq || ''
  const categoryId = args?.where?.categoryId_eq || ''
  const idEq = args?.where?.id_eq || ''
  const idIn = args?.where?.id_in || []
  const isPublic = args?.where?.isPublic_eq ?? ''
  const channelIdIn = args?.where?.channelId_in ? JSON.stringify(args.where.channelId_in) : ''
  const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''
  const sorting = args?.orderBy?.[0] ? args.orderBy[0] : ''
  const isFeatured = args?.where?.isFeatured_eq ?? ''

  // only for counting videos in HomeView
  if (args?.where?.channelId_in && !args?.first) {
    return `${createdAtGte}:${channelIdIn}`
  }

  return `${onlyCount}:${channelId}:${categoryId}:${channelIdIn}:${createdAtGte}:${isPublic}:${idEq}:${idIn}:${sorting}:${isFeatured}`
}

const getChannelKeyArgs = (args: Record<string, GetChannelsConnectionQueryVariables['where']> | null) => {
  // make sure queries asking for a specific category are separated in cache
  const languageId = args?.where?.languageId_eq || ''
  const idIn = args?.where?.id_in || []
  const orderBy = args?.orderBy || []

  return `${languageId}:${idIn}:${orderBy}`
}

const getSearchKeyArgs = (args: Record<string, SearchQueryVariables['whereVideo']> | null) => {
  const text = args?.text || ''
  const licenseIdIn = args?.whereVideo?.licenseId_in || []
  const hasMarketingEq = args?.whereVideo?.hasMarketing_eq ?? ''
  const isExplicitEq = args?.whereVideo?.isExplicit_eq ?? ''
  const languageIdEq = args?.whereVideo?.languageId_eq || ''
  const categoryIdIn = args?.whereVideo?.categoryId_in || []
  const createdAtGte = args?.whereVideo?.createdAt_gte ? JSON.stringify(args.whereVideo.createdAt_gte) : ''
  const durationGte = args?.whereVideo?.duration_gte || null
  const durationLte = args?.whereVideo?.duration_lte || null

  return `${text}:${languageIdEq}:${createdAtGte}:${categoryIdIn}:${isExplicitEq}:${hasMarketingEq}:${licenseIdIn}:${durationLte}:${durationGte}`
}

const createDateHandler = () => ({
  merge: (_: unknown, existingData: string | Date): Date => {
    if (typeof existingData !== 'string') {
      // TODO: investigate further
      // rarely, for some reason the object that arrives here is already a date object
      // in this case parsing attempt will cause an error
      return existingData
    }
    return parseISO(existingData)
  },
})

const createCachedUrlsHandler = () => ({
  merge: (existing: string[] | undefined, incoming: string[]) => {
    if (!existing || !existing.length) {
      return incoming
    }

    if (!existing[0].startsWith('blob:')) {
      // regular URL in cache, overwrite
      return incoming
    }

    if (incoming && incoming.length && incoming[0].startsWith('blob:')) {
      // incoming URL is cached asset, overwrite
      return incoming
    }

    // currently using cached URL, keep it
    return existing
  },
})

const createCachedAvailabilityHandler = () => ({
  merge: (existing: AssetAvailability | undefined, incoming: AssetAvailability) => {
    if (incoming === AssetAvailability.Invalid) {
      // if the incoming availability is invalid that means we deleted the asset so we shouldn't care about what's in cache
      return incoming
    }

    if (existing === AssetAvailability.Accepted) {
      // if the asset is already accepted, update most probably means that:
      // fresh fetch is trying to overwrite local optimistically updated data
      // in that case, let's keep it as Accepted to allow usage of cached blob URL
      return existing
    }
    return incoming
  },
})

type CachePolicyFields<T extends string> = Partial<Record<T, FieldPolicy | FieldReadFunction>>

const queryCacheFields: CachePolicyFields<keyof Query> = {
  channelsConnection: relayStylePagination(getChannelKeyArgs),
  mostFollowedChannels: relayStylePagination(getChannelKeyArgs),
  mostFollowedChannelsAllTime: relayStylePagination(getChannelKeyArgs),
  mostViewedChannels: relayStylePagination(getChannelKeyArgs),
  mostViewedChannelsAllTime: relayStylePagination(getChannelKeyArgs),
  videosConnection: {
    ...relayStylePagination(getVideoKeyArgs),
    read(
      existing: VideoConnection,
      { args, readField }: { args: GetVideosConnectionQueryVariables | null; readField: ReadFieldFunction }
    ) {
      const isPublic = args?.where?.isPublic_eq
      const filteredEdges =
        existing?.edges.filter((edge) => readField('isPublic', edge.node) === isPublic || isPublic === undefined) ?? []

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
  mostViewedVideos: {
    ...relayStylePagination(getVideoKeyArgs),
    read(
      existing: VideoConnection,
      { args, readField }: { args: GetVideosConnectionQueryVariables | null; readField: ReadFieldFunction }
    ) {
      const isPublic = args?.where?.isPublic_eq
      const filteredEdges =
        existing?.edges.filter((edge) => readField('isPublic', edge.node) === isPublic || isPublic === undefined) ?? []

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
  mostViewedVideosAllTime: {
    ...relayStylePagination(getVideoKeyArgs),
    read(
      existing: VideoConnection,
      { args, readField }: { args: GetVideosConnectionQueryVariables | null; readField: ReadFieldFunction }
    ) {
      const isPublic = args?.where?.isPublic_eq
      const filteredEdges =
        existing?.edges.filter((edge) => readField('isPublic', edge.node) === isPublic || isPublic === undefined) ?? []

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
  videos: {
    ...offsetLimitPagination(getVideoKeyArgs),
    read(existing, opts) {
      const offset = opts.args?.offset ?? 0
      const limit = opts.args?.limit ?? existing?.length
      return existing?.slice(offset, offset + limit)
    },
  },
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
  search: offsetLimitPagination(getSearchKeyArgs),
}

const videoCacheFields: CachePolicyFields<keyof VideoFieldsFragment> = {
  createdAt: createDateHandler(),
  publishedBeforeJoystream: createDateHandler(),
  thumbnailPhotoUrls: createCachedUrlsHandler(),
  thumbnailPhotoAvailability: createCachedAvailabilityHandler(),
}

const channelCacheFields: CachePolicyFields<keyof AllChannelFieldsFragment> = {
  avatarPhotoUrls: createCachedUrlsHandler(),
  coverPhotoUrls: createCachedUrlsHandler(),
  avatarPhotoAvailability: createCachedAvailabilityHandler(),
  coverPhotoAvailability: createCachedAvailabilityHandler(),
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
  },
})

export default cache
