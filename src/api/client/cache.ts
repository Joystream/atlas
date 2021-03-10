import { InMemoryCache } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'
import { parseISO } from 'date-fns'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        channelsConnection: relayStylePagination(),
        videosConnection: relayStylePagination((args) => {
          // make sure queries asking for a specific category are separated in cache
          const channelId = args?.where?.channelId_eq || ''
          const categoryId = args?.where?.categoryId_eq || ''
          const channelIdIn = args?.where?.channelId_in ? JSON.stringify(args.where.channelId_in) : ''
          const createdAtGte = args?.where?.createdAt_gte ? JSON.stringify(args.where.createdAt_gte) : ''

          // only for counting videos in HomeView
          if (args?.where?.channelId_in && !args?.first) {
            return `${createdAtGte}:${channelIdIn}`
          }

          return `${channelId}:${categoryId}:${channelIdIn}:${createdAtGte}`
        }),
        videos: {
          read(
            existing,
            {
              args: {
                // Default to returning the entire cached list,
                // if offset and limit are not provided.
                // @ts-ignore not too sure how to type this
                offset = 0,
                // @ts-ignore not too sure how to type this
                limit = existing?.length,
              } = {},
            }
          ) {
            return existing && existing.slice(offset, offset + limit)
          },
          keyArgs: false,
          // @ts-ignore not too sure how to type this
          merge(existing, incoming, { args: { offset = 0 } }) {
            const merged = existing ? existing.slice(0) : []
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i]
            }
            return merged
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
