import { InMemoryCache } from '@apollo/client'
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common'
import { FieldPolicy, FieldReadFunction } from '@apollo/client/cache/inmemory/policies'
import { offsetLimitPagination, relayStylePagination } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'

import {
  AllChannelFieldsFragment,
  GetChannelsConnectionQueryVariables,
  GetVideosConnectionQueryVariables,
  Query,
  SearchQueryVariables,
  VideoConnection,
  VideoFieldsFragment,
  VideoOrderByInput,
} from '../queries'

const stringifyValue = (value: unknown) => JSON.stringify(value || {})

const getVideoKeyArgs = (args: GetVideosConnectionQueryVariables | null) => {
  const onlyCount = args?.first === 0
  const channel = stringifyValue(args?.where?.channel)
  const category = stringifyValue(args?.where?.category)
  const idEq = args?.where?.id_eq || ''
  const idIn = args?.where?.id_in || []
  const isPublic = args?.where?.isPublic_eq ?? ''
  const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''
  const sorting = args?.orderBy?.[0] ? args.orderBy[0] : ''
  const isFeatured = args?.where?.isFeatured_eq ?? ''

  // only for counting videos in HomeView
  if (args?.where?.channel?.id_in && !args?.first) {
    return `${createdAtGte}:${channel}`
  }

  return `${onlyCount}:${channel}:${category}:${createdAtGte}:${isPublic}:${idEq}:${idIn}:${sorting}:${isFeatured}`
}

const getChannelKeyArgs = (args: GetChannelsConnectionQueryVariables | null) => {
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
  mostViewedVideosConnection: relayStylePagination(getVideoKeyArgs),
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
  // @ts-ignore Apollo doesn't contain info on args type so Typescript will complain
  search: offsetLimitPagination(getSearchKeyArgs),
}

const videoCacheFields: CachePolicyFields<keyof VideoFieldsFragment> = {
  createdAt: createDateHandler(),
  publishedBeforeJoystream: createDateHandler(),
}

const channelCacheFields: CachePolicyFields<keyof AllChannelFieldsFragment> = {
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
