import { ApolloClient, HttpLink, split } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/urls'

import cache from './cache'

const createApolloClient = () => {
  const subscriptionLink = new WebSocketLink({
    uri: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
    options: {
      reconnect: true,
      reconnectionAttempts: 5,
    },
  })

  const orionLink = new HttpLink({ uri: ORION_GRAPHQL_URL })
  const batchedOrionLink = new BatchHttpLink({ uri: ORION_GRAPHQL_URL, batchMax: 10, batchInterval: 300 })

  const orionSplitLink = split(
    ({ operationName }) => {
      return operationName === 'GetBasicVideos'
    },
    batchedOrionLink,
    orionLink
  )

  const operationSplitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    subscriptionLink,
    orionSplitLink
  )

  return new ApolloClient({ cache, link: operationSplitLink })
}

export default createApolloClient
