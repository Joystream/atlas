import { ApolloClient } from '@apollo/client'
import { wrapSchema } from '@graphql-tools/wrap'
import { mergeSchemas } from '@graphql-tools/merge'
import { buildASTSchema, GraphQLFieldResolver } from 'graphql'
import { SchemaLink } from '@apollo/client/link/schema'

import extendedQueryNodeSchema from '../schemas/extendedQueryNode.graphql'
import orionSchema from '../schemas/orion.graphql'

import cache from './cache'
import { queryNodeStitchingResolvers } from './resolvers'
import { createExecutors } from '@/api/client/executors'
import { delegateToSchema } from '@graphql-tools/delegate'
import { CreateProxyingResolverFn } from '@graphql-tools/delegate/types'

// we do this so that operationName is passed along with the queries
// this is needed for our mocking backend to operate
const createProxyingResolver: CreateProxyingResolverFn = ({
  subschemaConfig,
  operation,
  transformedSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): GraphQLFieldResolver<any, any> => {
  return (_parent, _args, context, info) => {
    return delegateToSchema({
      schema: subschemaConfig,
      operationName: info?.operation?.name?.value,
      operation,
      context,
      info,
      transformedSchema,
    })
  }
}

const createApolloClient = () => {
  const { queryNodeExecutor, orionExecutor } = createExecutors()

  const executableQueryNodeSchema = wrapSchema({
    schema: buildASTSchema(extendedQueryNodeSchema),
    executor: queryNodeExecutor,
    createProxyingResolver,
  })

  const executableOrionSchema = wrapSchema({
    schema: buildASTSchema(orionSchema),
    executor: orionExecutor,
    createProxyingResolver,
  })

  const mergedSchema = mergeSchemas({
    schemas: [executableQueryNodeSchema, executableOrionSchema],
    resolvers: queryNodeStitchingResolvers(executableQueryNodeSchema, executableOrionSchema),
  })

  const link = new SchemaLink({ schema: mergedSchema })

  return new ApolloClient({ link, cache })
}

export default createApolloClient
