import { ApolloClient, HttpLink, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

import { NEW_ORION_URL, QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/urls'

import cache from './cache'

const createApolloClient = () => {
  const subscriptionLink = new WebSocketLink({
    uri: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
    options: {
      reconnect: true,
      reconnectionAttempts: 5,
    },
  })

  const orionLink = new HttpLink({ uri: NEW_ORION_URL })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    subscriptionLink,
    orionLink
  )

  return new ApolloClient({ cache, link: splitLink })
}

export default createApolloClient
