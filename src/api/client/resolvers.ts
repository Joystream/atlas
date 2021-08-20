import { Transform, delegateToSchema } from '@graphql-tools/delegate'
import type { IResolvers, ISchemaLevelResolver } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

import { createLookup } from '@/utils/data'
import { SentryLogger } from '@/utils/logs'

import {
  ORION_BATCHED_FOLLOWS_QUERY_NAME,
  ORION_BATCHED_VIEWS_QUERY_NAME,
  ORION_FOLLOWS_QUERY_NAME,
  ORION_VIEWS_QUERY_NAME,
  RemoveQueryNodeFollowsField,
  RemoveQueryNodeViewsField,
  TransformBatchedOrionFollowsField,
  TransformBatchedOrionViewsField,
  TransformOrionFollowsField,
  TransformOrionViewsField,
} from './transforms'
import {
  ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
  ORION_CHANNEL_VIEWS_QUERY_NAME,
  TransformBatchedChannelOrionViewsField,
  TransformOrionChannelViewsField,
} from './transforms/orionViews'
import { RemoveQueryNodeChannelViewsField } from './transforms/queryNodeViews'

import { Channel, ChannelEdge, SearchFtsOutput, Video, VideoEdge } from '../queries'

const BATCHED_VIDEO_VIEWS_QUERY_NAME = 'GetBatchedVideoViews'
const BATCHED_CHANNEL_VIEWS_QUERY_NAME = 'GetBatchedChannelViews'
const BATCHED_FOLLOWS_VIEWS_QUERY_NAME = 'GetBatchedChannelFollows'

const createResolverWithTransforms = (
  schema: GraphQLSchema,
  fieldName: string,
  transforms: Array<Transform>,
  operationName?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ISchemaLevelResolver<any, any> => {
  return async (parent, args, context, info) =>
    delegateToSchema({
      schema,
      operation: 'query',
      operationName: operationName ? operationName : info?.operation?.name?.value,
      fieldName,
      args,
      context,
      info,
      transforms,
    })
}

export const queryNodeStitchingResolvers = (
  queryNodeSchema: GraphQLSchema,
  orionSchema: GraphQLSchema
): IResolvers => ({
  Query: {
    // video queries
    videoByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'videoByUniqueInput', [
      RemoveQueryNodeViewsField,
    ]),
    videos: async (parent, args, context, info) => {
      const videosResolver = createResolverWithTransforms(queryNodeSchema, 'videos', [RemoveQueryNodeViewsField])
      const videos = await videosResolver(parent, args, context, info)
      const batchedVideoViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_VIEWS_QUERY_NAME,
        [TransformBatchedOrionViewsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_VIDEO_VIEWS_QUERY_NAME
      )
      try {
        const batchedVideoViews = await batchedVideoViewsResolver(
          parent,
          {
            videoIdList: videos.map((video: Video) => video.id),
          },
          context,
          info
        )

        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])
        return videos.map((video: Video) => ({ ...video, views: viewsLookup[video.id]?.views || 0 }))
      } catch (error) {
        SentryLogger.error('Failed to resolve video views', 'videos resolver', error)
        return videos
      }
    },
    videosConnection: createResolverWithTransforms(queryNodeSchema, 'videosConnection', [RemoveQueryNodeViewsField]),
    // channel queries
    channelByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'channelByUniqueInput', [
      RemoveQueryNodeFollowsField,
      RemoveQueryNodeChannelViewsField,
    ]),
    channels: async (parent, args, context, info) => {
      const channelsResolver = createResolverWithTransforms(queryNodeSchema, 'channels', [
        RemoveQueryNodeFollowsField,
        RemoveQueryNodeChannelViewsField,
      ])
      const channels = await channelsResolver(parent, args, context, info)
      let followsLookup: Record<string, { id: string; follows: number }>
      let viewsLookup: Record<string, { id: string; views: number }>

      const batchedChannelFollowsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_FOLLOWS_QUERY_NAME,
        [TransformBatchedOrionFollowsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_FOLLOWS_VIEWS_QUERY_NAME
      )

      const batchedChannelViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
        [TransformBatchedChannelOrionViewsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_CHANNEL_VIEWS_QUERY_NAME
      )

      try {
        const batchedChannelFollows = await batchedChannelFollowsResolver(
          parent,
          {
            channelIdList: channels.map((channel: Channel) => channel.id),
          },
          context,
          info
        )
        followsLookup = createLookup(batchedChannelFollows || [])
      } catch (error) {
        SentryLogger.error('Failed to resolve channel follows', 'channels resolver', error)
      }

      try {
        const batchedChannelViews = await batchedChannelViewsResolver(
          parent,
          {
            channelIdList: channels.map((channel: Channel) => channel.id),
          },
          context,
          info
        )

        viewsLookup = createLookup<{ id: string; views: number }>(batchedChannelViews || [])
      } catch (error) {
        SentryLogger.error('Failed to resolve channel views', 'channels resolver', error)
        return channels
      }

      return channels.map((channel: Channel) => ({
        ...channel,
        follows: (followsLookup && followsLookup[channel.id]?.follows) || 0,
        views: (viewsLookup && viewsLookup[channel.id]?.views) || 0,
      }))
    },
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [
      RemoveQueryNodeFollowsField,
      RemoveQueryNodeChannelViewsField,
    ]),
    // mixed queries
    search: async (parent, args, context, info) => {
      const searchResolver = createResolverWithTransforms(queryNodeSchema, 'search', [
        RemoveQueryNodeViewsField,
        RemoveQueryNodeFollowsField,
        RemoveQueryNodeChannelViewsField,
      ])
      const search = await searchResolver(parent, args, context, info)

      const channelIdList = search
        .filter((result: SearchFtsOutput) => result.item.__typename === 'Channel')
        .map((result: SearchFtsOutput) => result.item.id)

      const batchedChannelFollowsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_FOLLOWS_QUERY_NAME,
        [TransformBatchedOrionFollowsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_FOLLOWS_VIEWS_QUERY_NAME
      )
      const batchedChannelFollows = await batchedChannelFollowsResolver(
        parent,
        {
          channelIdList,
        },
        context,
        info
      )

      const batchedChannelViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
        [TransformBatchedChannelOrionViewsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_CHANNEL_VIEWS_QUERY_NAME
      )
      const batchedChannelViews = await batchedChannelViewsResolver(
        parent,
        {
          channelIdList,
        },
        context,
        info
      )

      const followsLookup = createLookup<{ id: string; follows: number }>(batchedChannelFollows || [])
      const channelViewsLookup = createLookup<{ id: string; views: number }>(batchedChannelViews || [])

      const videoIdList = search
        .filter((result: SearchFtsOutput) => result.item.__typename === 'Video')
        .map((result: SearchFtsOutput) => result.item.id)

      const batchedVideoViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_VIEWS_QUERY_NAME,
        [TransformBatchedOrionViewsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_VIDEO_VIEWS_QUERY_NAME
      )
      const batchedVideoViews = await batchedVideoViewsResolver(
        parent,
        {
          videoIdList,
        },
        context,
        info
      )

      const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])

      const searchWithFollowsAndViews = search.map((searchOutput: SearchFtsOutput) => {
        if (searchOutput.item.__typename === 'Channel') {
          return {
            ...searchOutput,
            item: {
              ...searchOutput.item,
              follows: followsLookup[searchOutput.item.id]?.follows || 0,
              views: channelViewsLookup[searchOutput.item.id]?.views || 0,
            },
          }
        }
        if (searchOutput.item.__typename === 'Video') {
          return {
            ...searchOutput,
            item: {
              ...searchOutput.item,
              views: viewsLookup[searchOutput.item.id]?.views || 0,
            },
          }
        }
      })

      return searchWithFollowsAndViews
    },
  },
  Video: {
    views: async (parent, args, context, info) => {
      if (parent.views !== undefined) {
        return parent.views
      }
      const orionViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_VIEWS_QUERY_NAME,
        [TransformOrionViewsField],
        // operationName has to be manually kept in sync with the query name used
        'GetVideoViews'
      )
      try {
        return await orionViewsResolver(
          parent,
          {
            videoId: parent.id,
          },
          context,
          info
        )
      } catch (error) {
        SentryLogger.error('Failed to resolve video views', 'Video.views resolver', error)
        return null
      }
    },
  },
  VideoConnection: {
    edges: async (parent, args, context, info) => {
      const batchedVideoViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_VIEWS_QUERY_NAME,
        [TransformBatchedOrionViewsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_VIDEO_VIEWS_QUERY_NAME
      )

      try {
        const batchedVideoViews = await batchedVideoViewsResolver(
          parent,
          { videoIdList: parent.edges.map((edge: VideoEdge) => edge.node.id) },
          context,
          info
        )

        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])

        return parent.edges.map((edge: VideoEdge) => ({
          ...edge,
          node: {
            ...edge.node,
            views: viewsLookup[edge.node.id]?.views || 0,
          },
        }))
      } catch (error) {
        SentryLogger.error('Failed to resolve video views', 'VideoConnection.edges resolver', error)
        return parent.edges
      }
    },
  },
  Channel: {
    views: async (parent, args, context, info) => {
      if (parent.views != null) {
        return parent.views
      }
      const orionViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_CHANNEL_VIEWS_QUERY_NAME,
        [TransformOrionChannelViewsField],
        // operationName has to be manually kept in sync with the query name used
        'GetChannelViews'
      )
      try {
        return await orionViewsResolver(
          parent,
          {
            channelId: parent.id,
          },
          context,
          info
        )
      } catch (error) {
        SentryLogger.error('Failed to resolve channel views', 'Channel.views resolver', error)
        return null
      }
    },
    follows: async (parent, args, context, info) => {
      if (parent.follows !== undefined) {
        return parent.follows
      }
      const orionFollowsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_FOLLOWS_QUERY_NAME,
        [TransformOrionFollowsField],
        'GetChannelFollows'
      )
      try {
        return await orionFollowsResolver(
          parent,
          {
            channelId: parent.id,
          },
          context,
          info
        )
      } catch (error) {
        SentryLogger.error('Failed to resolve channel follows', 'Channel.follows resolver', error)
        return null
      }
    },
  },
  ChannelConnection: {
    edges: async (parent, args, context, info) => {
      const batchedChannelFollowsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_FOLLOWS_QUERY_NAME,
        [TransformBatchedOrionFollowsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_FOLLOWS_VIEWS_QUERY_NAME
      )
      const batchedChannelViewsResolver = createResolverWithTransforms(
        orionSchema,
        ORION_BATCHED_CHANNEL_VIEWS_QUERY_NAME,
        [TransformBatchedChannelOrionViewsField],
        // operationName has to be manually kept in sync with the query name used
        BATCHED_CHANNEL_VIEWS_QUERY_NAME
      )
      let followsLookup: Record<string, { id: string; follows: number }>
      let viewsLookup: Record<string, { id: string; views: number }>

      try {
        const batchedChannelFollows = await batchedChannelFollowsResolver(
          parent,
          {
            channelIdList: parent.edges.map((edge: ChannelEdge) => edge.node.id),
          },
          context,
          info
        )
        followsLookup = createLookup<{ id: string; follows: number }>(batchedChannelFollows || [])
      } catch (error) {
        SentryLogger.error('Failed to resolve channel follows', 'ChannelConnection.edges resolver', error)
      }

      try {
        const batchedChannelViews = await batchedChannelViewsResolver(
          parent,
          {
            channelIdList: parent.edges.map((edge: ChannelEdge) => edge.node.id),
          },
          context,
          info
        )

        viewsLookup = createLookup<{ id: string; views: number }>(batchedChannelViews || [])
      } catch (error) {
        SentryLogger.error('Failed to resolve channel views', 'ChannelConnection.edges resolver', error)
      }

      return parent.edges.map((edge: ChannelEdge) => ({
        ...edge,
        node: {
          ...edge.node,
          follows: (followsLookup && followsLookup[edge.node.id]?.follows) || 0,
          views: (viewsLookup && viewsLookup[edge.node.id]?.views) || 0,
        },
      }))
    },
  },
})
