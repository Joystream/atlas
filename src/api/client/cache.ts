import { InMemoryCache } from '@apollo/client'
import { offsetLimitPagination, Reference, relayStylePagination, StoreObject } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'
import { AssetAvailability, GetVideosQueryVariables } from '../queries'

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

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        channelsConnection: relayStylePagination(),
        videosConnection: relayStylePagination(getVideoKeyArgs),
        videos: {
          ...offsetLimitPagination(getVideoKeyArgs),
          read(existing, opts) {
            const isPublic = opts.args?.where.isPublic_eq

            const filteredExistingVideos = existing?.filter(
              (v: StoreObject | Reference) => opts.readField('isPublic', v) === isPublic || isPublic === undefined
            )
            // Default to returning the entire cached list,
            // if offset and limit are not provided.
            const offset = opts.args?.offset ?? 0
            const limit = opts.args?.limit ?? filteredExistingVideos?.length

            return filteredExistingVideos?.slice(offset, offset + limit)
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
    Channel: {
      fields: {
        avatarPhotoUrls: createCachedUrlsHandler(),
        coverPhotoUrls: createCachedUrlsHandler(),
        avatarPhotoAvailability: createCachedAvailabilityHandler(),
        coverPhotoAvailability: createCachedAvailabilityHandler(),
      },
    },
  },
})

export default cache
