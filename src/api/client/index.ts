import { ApolloClient, split } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { delegateToSchema } from '@graphql-tools/delegate'
import { CreateProxyingResolverFn } from '@graphql-tools/delegate/types'
import { mergeSchemas } from '@graphql-tools/merge'
import { wrapSchema } from '@graphql-tools/wrap'
import { GraphQLFieldResolver, buildASTSchema } from 'graphql'

import { createExecutors } from '@/api/client/executors'
import { QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/urls'

import cache from './cache'
import { queryNodeStitchingResolvers } from './resolvers'

import extendedQueryNodeSchema from '../schemas/extendedQueryNode.graphql'
import orionSchema from '../schemas/orion.graphql'

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

  const queryLink = new SchemaLink({ schema: mergedSchema })
  const subscriptionLink = new WebSocketLink({
    uri: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
    options: {
      reconnect: true,
    },
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    subscriptionLink,
    queryLink
  )

  return new ApolloClient({ link: splitLink, cache })
}

export default createApolloClient
