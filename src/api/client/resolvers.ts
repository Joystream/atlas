import { Transform, delegateToSchema } from '@graphql-tools/delegate'
import type { IResolvers, ISchemaLevelResolver } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

import { createLookup } from '@/utils/data'
import { Logger } from '@/utils/logger'

import {
  ORION_BATCHED_VIEWS_QUERY_NAME,
  ORION_FOLLOWS_QUERY_NAME,
  RemoveQueryNodeFollowsField,
  RemoveQueryNodeViewsField,
  TransformBatchedOrionViewsField,
  TransformOrionFollowsField,
} from './transforms'
import {
  ORION_CHANNEL_VIEWS_QUERY_NAME,
  ORION_VIEWS_QUERY_NAME,
  TransformOrionChannelViewsField,
  TransformOrionViewsField,
} from './transforms/orionViews'
import { RemoveQueryNodeChanneliewsField } from './transforms/queryNodeViews'

import { VideoEdge } from '../queries'

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
    videos: createResolverWithTransforms(queryNodeSchema, 'videos', [RemoveQueryNodeViewsField]),
    videosConnection: createResolverWithTransforms(queryNodeSchema, 'videosConnection', [RemoveQueryNodeViewsField]),
    // channel queries
    channelByUniqueInput: createResolverWithTransforms(queryNodeSchema, 'channelByUniqueInput', [
      RemoveQueryNodeFollowsField,
      RemoveQueryNodeChanneliewsField,
    ]),
    channels: createResolverWithTransforms(queryNodeSchema, 'channels', [
      RemoveQueryNodeFollowsField,
      RemoveQueryNodeChanneliewsField,
    ]),
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [
      RemoveQueryNodeFollowsField,
      RemoveQueryNodeChanneliewsField,
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

  Channel: {
    views: async (parent, args, context, info) => {
      if (parent.views != null) {
        return parent.views
      }
      try {
        return await delegateToSchema({
          schema: orionSchema,
          operation: 'query',
          // operationName has to be manually kept in sync with the query name used
          operationName: 'GetChannelViews',
          fieldName: ORION_CHANNEL_VIEWS_QUERY_NAME,
          args: {
            channelId: parent.id,
          },
          context,
          info,
          transforms: [TransformOrionChannelViewsField],
        })
      } catch (error) {
        Logger.warn('Failed to resolve views field', { error })
        return null
      }
    },
    follows: async (parent, args, context, info) => {
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
