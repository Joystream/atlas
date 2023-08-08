import { ApolloClient, ApolloLink, FetchResult, HttpLink, Observable, split } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/env'
import { useUserLocationStore } from '@/providers/userLocation'
import { SentryLogger } from '@/utils/logs'

import { cache } from './cache'

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

const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
  if (graphQLErrors?.some(({ message }) => message === 'Unauthorized')) {
    forward(operation)
    return
  }
  if (networkError?.message === 'Response not successful: Received status code 400') {
    forward(operation)
    return
  }

  SentryLogger.error(
    'Apollo Error',
    'Error Link',
    {
      graphQLErrors,
      networkError,
    },
    {
      data: {
        operation: JSON.stringify(operation),
        response: JSON.stringify(response),
      },
    }
  )
  forward(operation)
})

export const createApolloClient = () => {
  const subscriptionLink = new GraphQLWsLink(
    createClient({
      url: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
      retryAttempts: 5,
    })
  )

  const orionLink = ApolloLink.from([
    errorLink,
    delayLink,
    new HttpLink({ uri: ORION_GRAPHQL_URL, credentials: 'include' }),
  ])

  const operationSplitLink = split(
    ({ query, setContext }) => {
      const locationStore = useUserLocationStore.getState()

      if (
        !locationStore.disableUserLocation &&
        locationStore.coordinates?.latitude &&
        locationStore.coordinates.longitude
      ) {
        setContext(({ headers }: Record<string, object>) => {
          return {
            headers: {
              ...headers,
              'x-client-loc': `${locationStore?.coordinates?.latitude}, ${locationStore.coordinates?.longitude}`,
            },
          }
        })
      }

      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    subscriptionLink,
    orionLink
  )

  return new ApolloClient({
    cache,
    link: operationSplitLink,
  })
}
