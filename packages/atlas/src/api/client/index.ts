import { ApolloClient, ApolloLink, FetchResult, HttpLink, Observable, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/env'

import cache from './cache'

const delayLink = new ApolloLink((operation, forward) => {
  const ctx = operation.getContext()
  if (!ctx.delay) {
    return forward(operation)
  }

  return new Observable<FetchResult>((observer) => {
    setTimeout(() => {
      forward(operation).subscribe((value) => {
        observer.next(value)
      })
    }, ctx.delay)
  })
})

const createApolloClient = () => {
  const subscriptionLink = new WebSocketLink({
    uri: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
    options: {
      reconnect: true,
      reconnectionAttempts: 5,
    },
  })

  const orionLink = ApolloLink.from([delayLink, new HttpLink({ uri: ORION_GRAPHQL_URL })])

  const operationSplitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    subscriptionLink,
    orionLink
  )

  return new ApolloClient({ cache, link: operationSplitLink })
}

export default createApolloClient
