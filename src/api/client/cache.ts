import { InMemoryCache } from '@apollo/client'
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common'
import { offsetLimitPagination, Reference, relayStylePagination, StoreObject } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'
import { GetVideosQueryVariables, VideoOrderByInput } from '../queries'

const getVideoKeyArgs = (args: Record<string, GetVideosQueryVariables['where']> | null) => {
  // make sure queries asking for a specific category are separated in cache
  const channelId = args?.where?.channelId_eq || ''
  const categoryId = args?.where?.categoryId_eq || ''
  const isPublic = args?.where?.isPublic_eq ?? ''
  const channelIdIn = args?.where?.channelId_in ? JSON.stringify(args.where.channelId_in) : ''
  const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''

  // only for counting videos in HomeView
  if (args?.where?.channelId_in && !args?.first) {
    return `${createdAtGte}:${channelIdIn}`
  }

  return `${channelId}:${categoryId}:${channelIdIn}:${createdAtGte}:${isPublic}`
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

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        channelsConnection: relayStylePagination(),
        videosConnection: relayStylePagination(getVideoKeyArgs),
        videos: {
          ...offsetLimitPagination(getVideoKeyArgs),
          read(existing, { args, readField }: { args: GetVideosQueryVariables | null; readField: ReadFieldFunction }) {
            const isPublic = args?.where?.isPublic_eq
            const filteredExistingVideos = existing?.filter(
              (v: StoreObject | Reference) => readField('isPublic', v) === isPublic || isPublic === undefined
            )

            // Default to returning the entire cached list,
            // if offset and limit are not provided.
            const offset = args?.offset ?? 0
            const limit = args?.limit ?? filteredExistingVideos?.length
            const sortingASC = args?.orderBy === VideoOrderByInput.CreatedAtAsc
            const sortedArray = sortingASC
              ? filteredExistingVideos
                  ?.slice()
                  .sort(
                    (a: Reference, b: Reference) =>
                      (readField('createdAt', b) as Date).getTime() - (readField('createdAt', a) as Date).getTime()
                  )
              : filteredExistingVideos
                  ?.slice()
                  .sort(
                    (a: Reference, b: Reference) =>
                      (readField('createdAt', a) as Date).getTime() - (readField('createdAt', b) as Date).getTime()
                  )

            return sortedArray?.slice(offset, offset + limit)
          },
        },
        channel(existing, { toReference, args }) {
          return (
            existing ||
            toReference({
              __typename: 'Channel',
              id: args?.where.id,
            })
          )
        },
        video(existing, { toReference, args }) {
          return (
            existing ||
            toReference({
              __typename: 'Video',
              id: args?.where.id,
            })
          )
        },
      },
    },
    Video: {
      fields: {
        createdAt: createDateHandler(),
        publishedBeforeJoystream: createDateHandler(),
      },
    },
  },
})

export default cache
