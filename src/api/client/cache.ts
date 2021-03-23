import { InMemoryCache } from '@apollo/client'
import { offsetLimitPagination, relayStylePagination } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'
import { GetVideosQueryVariables } from '../queries'

const getVideoKeyArgs = (args: Record<string, GetVideosQueryVariables['where']> | null) => {
  // make sure queries asking for a specific category are separated in cache
  const channelId = args?.where?.channelId_eq || ''
  const categoryId = args?.where?.categoryId_eq || ''
  const isPublic = args?.where?.isPublic_eq
  const channelIdIn = args?.where?.channelId_in ? JSON.stringify(args.where.channelId_in) : ''
  const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''

  // only for counting videos in HomeView
  if (args?.where?.channelId_in && !args?.first) {
    return `${createdAtGte}:${channelIdIn}`
  }

  return `${channelId}:${categoryId}:${channelIdIn}:${createdAtGte}:${isPublic}`
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        channelsConnection: relayStylePagination(),
        videosConnection: relayStylePagination(getVideoKeyArgs),
        videos: {
          ...offsetLimitPagination(getVideoKeyArgs),
          read: (existing, { args: { offset, limit } }: { args: GetVideosQueryVariables }) => {
            return existing && existing.slice(offset ?? 0, (offset ?? 0) + (limit ?? 0))
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
        createdAt: {
          merge(_, createdAt: string | Date): Date {
            if (typeof createdAt !== 'string') {
              // TODO: investigate further
              // rarely, for some reason the object that arrives here is already a date object
              // in this case parsing attempt will cause an error
              return createdAt
            }
            return parseISO(createdAt)
          },
        },
      },
    },
  },
})

export default cache
