import { Transform, delegateToSchema } from '@graphql-tools/delegate'
import type { IResolvers, ISchemaLevelResolver } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

import { createLookup } from '@/utils/data'
import { Logger } from '@/utils/logger'

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

import { Channel, ChannelEdge, Video, VideoEdge } from '../queries'

const createResolverWithTransforms = (
  schema: GraphQLSchema,
  fieldName: string,
  transforms: Array<Transform>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ISchemaLevelResolver<any, any> => {
  return async (parent, args, context, info) =>
    delegateToSchema({
      schema,
      operation: 'query',
      operationName: info?.operation?.name?.value,
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
      try {
        const videosResolver = createResolverWithTransforms(queryNodeSchema, 'videos', [RemoveQueryNodeViewsField])
        const videos = await videosResolver(parent, args, context, info)

        const batchedVideoViews = await delegateToSchema({
          schema: orionSchema,
          operation: 'query',
          // operationName has to be manually kept in sync with the query name used
          operationName: 'GetBatchedVideoViews',
          fieldName: ORION_BATCHED_VIEWS_QUERY_NAME,
          args: {
            videoIdList: videos.map((video: Video) => video.id),
          },
          context,
          info,
          transforms: [TransformBatchedOrionViewsField],
        })

        const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])
        return videos.map((video: Video) => ({ ...video, views: viewsLookup[video.id]?.views || 0 }))
      } catch (error) {
        Logger.warn('Failed to resolve videos field', { error })
        return null
      }
    },
    videosConnection: createResolverWithTransforms(queryNodeSchema, 'videosConnection', [RemoveQueryNodeViewsField]),
    // channel queries
    channelByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'channelByUniqueInput', [
      RemoveQueryNodeFollowsField,
    ]),
    channels: async (parent, args, context, info) => {
      try {
        const channelsResolver = createResolverWithTransforms(queryNodeSchema, 'channels', [
          RemoveQueryNodeFollowsField,
        ])
        const channels = await channelsResolver(parent, args, context, info)

        const batchedChannelFollows = await delegateToSchema({
          schema: orionSchema,
          operation: 'query',
          // operationName has to be manually kept in sync with the query name used
          operationName: 'GetBatchedChannelFollows',
          fieldName: ORION_BATCHED_FOLLOWS_QUERY_NAME,
          args: {
            channelIdList: channels.map((channel: Channel) => channel.id),
          },
          context,
          info,
          transforms: [TransformBatchedOrionFollowsField],
        })

        const followsLookup = createLookup<{ id: string; follows: number }>(batchedChannelFollows || [])
        return channels.map((channel: Channel) => ({ ...channel, follows: followsLookup[channel.id]?.follows || 0 }))
      } catch (error) {
        Logger.warn('Failed to resolve channels field', { error })
        return null
      }
    },
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [
      RemoveQueryNodeFollowsField,
    ]),
    // mixed queries
    search: createResolverWithTransforms(queryNodeSchema, 'search', [
      RemoveQueryNodeViewsField,
      RemoveQueryNodeFollowsField,
    ]),
  },
  Video: {
    views: async (parent, args, context, info) => {
      if (parent.views != null) {
        return parent.views
      }
      try {
        return await delegateToSchema({
          schema: orionSchema,
          operation: 'query',
          // operationName has to be manually kept in sync with the query name used
          operationName: 'GetVideoViews',
          fieldName: ORION_VIEWS_QUERY_NAME,
          args: {
            videoId: parent.id,
          },
          context,
          info,
          transforms: [TransformOrionViewsField],
        })
      } catch (error) {
        Logger.warn('Failed to resolve views field', { error })
        return null
      }
    },
  },
  VideoConnection: {
    edges: async (parent, args, context, info) => {
      const batchedVideoViews = await delegateToSchema({
        schema: orionSchema,
        operation: 'query',
        // operationName has to be manually kept in sync with the query name used
        operationName: 'GetBatchedVideoViews',
        fieldName: ORION_BATCHED_VIEWS_QUERY_NAME,
        args: {
          videoIdList: parent.edges.map((edge: VideoEdge) => edge.node.id),
        },
        context,
        info,
        transforms: [TransformBatchedOrionViewsField],
      })

      const viewsLookup = createLookup<{ id: string; views: number }>(batchedVideoViews || [])

      return parent.edges.map((edge: VideoEdge) => ({
        ...edge,
        node: {
          ...edge.node,
          views: viewsLookup[edge.node.id]?.views || 0,
        },
      }))
    },
  },

  ChannelConnection: {
    edges: async (parent, args, context, info) => {
      const batchedChannelFollows = await delegateToSchema({
        schema: orionSchema,
        operation: 'query',
        // operationName has to be manually kept in sync with the query name used
        operationName: 'GetBatchedChannelFollows',
        fieldName: ORION_BATCHED_FOLLOWS_QUERY_NAME,
        args: {
          channelIdList: parent.edges.map((edge: ChannelEdge) => edge.node.id),
        },
        context,
        info,
        transforms: [TransformBatchedOrionFollowsField],
      })

      const followsLookup = createLookup<{ id: string; views: number }>(batchedChannelFollows || [])

      return parent.edges.map((edge: ChannelEdge) => ({
        ...edge,
        node: {
          ...edge.node,
          follows: followsLookup[edge.node.id]?.views || 0,
        },
      }))
    },
  },
  Channel: {
    follows: async (parent, args, context, info) => {
      if (parent.follows != null) {
        return parent.follows
      }
      try {
        return await delegateToSchema({
          schema: orionSchema,
          operation: 'query',
          // operationName has to be manually kept in sync with the query name used
          operationName: 'GetChannelFollows',
          fieldName: ORION_FOLLOWS_QUERY_NAME,
          args: {
            channelId: parent.id,
          },
          context,
          info,
          transforms: [TransformOrionFollowsField],
        })
      } catch (error) {
        Logger.warn('Failed to resolve follows field', { error })
        return null
      }
    },
  },
})
