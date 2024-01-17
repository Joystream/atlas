import { ApolloClient, ApolloLink, FetchResult, HttpLink, Observable, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/env'
import { useUserLocationStore } from '@/providers/userLocation'

import { cache } from './cache'

const initializePerformanceObserver = () => {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (['fetch', 'xmlhttprequest'].includes((entry as PerformanceResourceTiming).initiatorType)) {
          const queryString = entry.name.split('?')?.[1]
          const params = new URLSearchParams(queryString)
          const queryType = params.get('queryName')
          // eslint-disable-next-line no-console
          console.log(`Query ${queryType ?? entry.name} took ${entry.duration}ms to complete`, entry)
        }
      }
    })
    // Start listening for `resource` entries to be dispatched.
    observer.observe({ type: 'resource', buffered: true })
  } catch (e) {
    // Do nothing if the browser doesn't support this API.
  }
}

initializePerformanceObserver()

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

export const createApolloClient = () => {
  const subscriptionLink = new GraphQLWsLink(
    createClient({
      url: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
      retryAttempts: 5,
    })
  )

  const orionLink = ApolloLink.from([
    delayLink,
    new HttpLink({
      uri: ORION_GRAPHQL_URL,
      credentials: 'include',
      fetch: async (uri, options) => {
        const queryName = options?.headers
          ? (options.headers?.['queryname' as keyof typeof options.headers] as string)
          : null
        const queryString = queryName ? `?queryName=${queryName}` : ''
        return fetch(`${uri}${queryString}`, options)
      },
    }),
  ])

  const operationSplitLink = split(
    ({ query, setContext }) => {
      const locationStore = useUserLocationStore.getState()
      const firstDefinition = query.definitions[0]
      let queryName: string | null | undefined = null
      if (firstDefinition.kind === 'OperationDefinition' && firstDefinition.operation === 'query') {
        queryName = firstDefinition.name?.value
      }

      if (queryName) {
        setContext(({ headers }: Record<string, object>) => {
          return {
            headers: {
              ...headers,
              ...(queryName ? { queryName } : {}),
            },
          }
        })
      }

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
