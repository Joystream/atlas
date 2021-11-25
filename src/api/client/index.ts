import { ApolloClient } from '@apollo/client'

import { NEW_ORION_URL } from '@/config/urls'

import cache from './cache'

const createApolloClient = () => {
  // const { queryNodeExecutor, orionExecutor } = createExecutors()

  // const executableQueryNodeSchema = wrapSchema({
  //   schema: buildASTSchema(extendedQueryNodeSchema),
  //   executor: queryNodeExecutor,
  //   createProxyingResolver,
  // })

  // const executableOrionSchema = wrapSchema({
  //   schema: buildASTSchema(orionSchema),
  //   executor: orionExecutor,
  //   createProxyingResolver,
  // })

  // const mergedSchema = mergeSchemas({
  //   schemas: [executableQueryNodeSchema, executableOrionSchema],
  //   resolvers: queryNodeStitchingResolvers(executableQueryNodeSchema, executableOrionSchema),
  // })

  // const queryLink = new SchemaLink({ schema: mergedSchema })
  // const subscriptionLink = new WebSocketLink({
  //   uri: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
  //   options: {
  //     reconnect: true,
  //     reconnectionAttempts: 5,
  //   },
  // })

  // const splitLink = split(
  //   ({ query }) => {
  //     const definition = getMainDefinition(query)
  //     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  //   },
  //   subscriptionLink,
  //   queryLink
  // )

  return new ApolloClient({ cache, uri: NEW_ORION_URL })
}

export default createApolloClient
