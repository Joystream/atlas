import { ApolloClient, ApolloLink, FetchResult, HttpLink, Observable, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/env'
import { useAuthStore } from '@/providers/auth/auth.store'
import { useUserLocationStore } from '@/providers/userLocation'

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

const MAX_ALLOWED_RETRIES = 10
const bannedDistributorUrls: Record<string, number> = {}

const createApolloClient = () => {
  const subscriptionLink = new GraphQLWsLink(
    createClient({
      url: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
      retryAttempts: 5,
    })
  )

  const orionLink = ApolloLink.from([delayLink, new HttpLink({ uri: ORION_GRAPHQL_URL, credentials: 'include' })])

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

export default createApolloClient
