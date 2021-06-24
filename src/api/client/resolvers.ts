import { Transform, delegateToSchema } from '@graphql-tools/delegate'
import type { IResolvers, ISchemaLevelResolver } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

import { Logger } from '@/utils/logger'

import {
  ORION_BATCHED_VIEWS_QUERY_NAME,
  ORION_FOLLOWS_QUERY_NAME,
  RemoveQueryNodeFollowsField,
  RemoveQueryNodeViewsField,
  TransformBatchedOrionViewsField,
  TransformOrionFollowsField,
} from './transforms'

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
    ]),
    channels: createResolverWithTransforms(queryNodeSchema, 'channels', [RemoveQueryNodeFollowsField]),
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [
      RemoveQueryNodeFollowsField,
    ]),
    // mixed queries
    search: createResolverWithTransforms(queryNodeSchema, 'search', [
      RemoveQueryNodeViewsField,
      RemoveQueryNodeFollowsField,
    ]),
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

      return parent.edges.map((edge: VideoEdge) => ({
        ...edge,
        node: {
          ...edge.node,
          views:
            batchedVideoViews.find((videoView: { id: string; views: number }) => videoView?.id === edge.node.id)
              ?.views || 0,
        },
      }))
    },
  },
  Channel: {
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
