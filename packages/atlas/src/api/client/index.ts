import { ApolloClient, ApolloLink, FetchResult, HttpLink, Observable, split } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
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

const retryLink = new RetryLink({
  attempts: {
    max: 5,
    retryIf: async (error, operation) => {
      // For the sign up purposes don't retry when operationName GetNotificationsConnection, which is called constantly
      if (operation.operationName === 'GetNotificationsConnection') {
        return false
      }

      const userId = useAuthStore.getState().anonymousUserId
      const isUnauthorizedError =
        error.statusCode === 400 &&
        error?.result?.errors?.find((err: { message: string }) => err.message === 'Unauthorized')

      if (isUnauthorizedError) {
        try {
          const newUserId = await setAnonymousAuth(userId)
          if (newUserId) {
            useAuthStore.setState({ anonymousUserId: newUserId })
            return true
          }
          return true
        } catch (error) {
          if (isAxiosError(error) && error.response?.status === 401) {
            useAuthStore.setState({ anonymousUserId: null })
          }
          return true
        }
      } else {
        return false
      }
    },
  },
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

  const orionLink = ApolloLink.from([
    delayLink,
    retryLink,
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

export default createApolloClient
