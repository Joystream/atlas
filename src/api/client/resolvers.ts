import { GraphQLSchema } from 'graphql'
import { delegateToSchema, Transform } from '@graphql-tools/delegate'
import type { IResolvers, ISchemaLevelResolver } from '@graphql-tools/utils'
import {
  TransformOrionViewsField,
  ORION_VIEWS_QUERY_NAME,
  RemoveQueryNodeViewsField,
  RemoveQueryNodeFollowsField,
  ORION_FOLLOWS_QUERY_NAME,
  TransformOrionFollowsField,
} from './transforms'

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
    videos: createResolverWithTransforms(queryNodeSchema, 'videos', [RemoveQueryNodeViewsField]),
    videosConnection: createResolverWithTransforms(queryNodeSchema, 'videosConnection', [RemoveQueryNodeViewsField]),
    featuredVideos: createResolverWithTransforms(queryNodeSchema, 'featuredVideos', [RemoveQueryNodeViewsField]),
    search: createResolverWithTransforms(queryNodeSchema, 'search', [
      RemoveQueryNodeViewsField,
      RemoveQueryNodeFollowsField,
    ]),
    video: createResolverWithTransforms(queryNodeSchema, 'video', [RemoveQueryNodeViewsField]),
    channelsConnection: createResolverWithTransforms(queryNodeSchema, 'channelsConnection', [
      RemoveQueryNodeFollowsField,
    ]),
    channel: createResolverWithTransforms(queryNodeSchema, 'channel', [RemoveQueryNodeFollowsField]),
  },
  Video: {
    // TODO: Resolve the views count in parallel to the videosConnection query
    // this can be done by writing a resolver for the query itself in which two requests in the same fashion as below would be made
    // then the results could be combined
    views: async (parent, args, context, info) => {
      try {
        return await delegateToSchema({
          schema: orionSchema,
          operation: 'query',
          fieldName: ORION_VIEWS_QUERY_NAME,
          args: {
            videoId: parent.id,
          },
          context,
          info,
          transforms: [TransformOrionViewsField],
        })
      } catch (error) {
        console.warn('Failed to resolve views field', { error })
        return null
      }
    },
  },
  Channel: {
    follows: async (parent, args, context, info) => {
      try {
        return await delegateToSchema({
          schema: orionSchema,
          operation: 'query',
          fieldName: ORION_FOLLOWS_QUERY_NAME,
          args: {
            channelId: parent.id,
          },
          context,
          info,
          transforms: [TransformOrionFollowsField],
        })
      } catch (error) {
        console.warn('Failed to resolve follows field', { error })
        return null
      }
    },
  },
})
