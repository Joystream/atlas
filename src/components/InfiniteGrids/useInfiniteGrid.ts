import { useEffect, useState } from 'react'
import { ApolloError, useLazyQuery } from '@apollo/client'
import { debounce } from 'lodash'
import { DocumentNode } from 'graphql'
import { TypedDocumentNode } from '@graphql-typed-document-node/core'

type PaginatedData<T> = {
  edges: {
    cursor: string
    node: T
  }[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
  totalCount: number
}
export type PaginatedDataArgs = {
  first?: number | null
  after?: string | null
}

// TODO these types below could be used to get rid of requirement to pass TPaginatedData explicitly
// however this currently is not possible because of constraints of Typescript and our GraphQL codegen
// tldr is that our codegen generates interfaces instead of types and a more specific interface cannot be assigned to a generic one

// type RawData<TData> = { [p: string]: PaginatedData<TData> }
// type PaginatedDataFromRawData<TRawData extends RawData<unknown>> = TRawData[keyof TRawData]
// type ItemTypeFromRawData<TRawData extends RawData<unknown>> = PaginatedDataFromRawData<TRawData>['edges'][0]['node']

type UseInfiniteGridParams<TRawData, TPaginatedData extends PaginatedData<unknown>, TArgs> = {
  query: DocumentNode | TypedDocumentNode<TRawData, TArgs>
  dataAccessor: (rawData?: TRawData) => TPaginatedData | undefined
  isReady: boolean
  targetRowsCount: number
  itemsPerRow: number
  skipCount: number
  onScrollToBottom: () => void
  queryVariables: TArgs
}

type UseInfiniteGridReturn<TPaginatedData extends PaginatedData<unknown>> = {
  displayedItems: TPaginatedData['edges'][0]['node'][]
  placeholdersCount: number
  error?: ApolloError
}

const useInfiniteGrid = <TRawData, TPaginatedData extends PaginatedData<unknown>, TArgs extends PaginatedDataArgs>({
  query,
  dataAccessor,
  isReady,
  targetRowsCount,
  itemsPerRow,
  skipCount,
  onScrollToBottom,
  queryVariables,
}: UseInfiniteGridParams<TRawData, TPaginatedData, TArgs>): UseInfiniteGridReturn<TPaginatedData> => {
  const [cachedQueryVariables, setCachedQueryVariables] = useState(queryVariables)
  const [refetching, setRefetching] = useState(false)

  const [fetchItems, { loading, data: rawData, error, fetchMore, called, refetch }] = useLazyQuery<TRawData, TArgs>(
    query,
    {
      notifyOnNetworkStatusChange: true,
    }
  )

  const targetDisplayedItemsCount = targetRowsCount * itemsPerRow
  const targetLoadedItemsCount = targetDisplayedItemsCount + skipCount

  const data = dataAccessor(rawData)

  const loadedItemsCount = data?.edges.length ?? 0
  const allItemsLoaded = data ? !data.pageInfo.hasNextPage : false
  const endCursor = data?.pageInfo.endCursor

  const queryVariablesChanged = queryVariables !== cachedQueryVariables

  // handle initial data fetch
  useEffect(() => {
    if (isReady && !called) {
      fetchItems({
        variables: {
          ...queryVariables,
          first: targetLoadedItemsCount,
        },
      })
    }
  }, [isReady, called, fetchItems, queryVariables, targetLoadedItemsCount])

  // handle fetching more items
  useEffect(() => {
    if (loading || !fetchMore || allItemsLoaded || refetching || queryVariablesChanged) {
      return
    }

    const missingItemsCount = targetLoadedItemsCount - loadedItemsCount

    if (missingItemsCount <= 0) {
      return
    }

    fetchMore({
      variables: { ...queryVariables, first: missingItemsCount, after: endCursor },
    })
  }, [
    loading,
    fetchMore,
    allItemsLoaded,
    refetching,
    queryVariablesChanged,
    queryVariables,
    targetLoadedItemsCount,
    loadedItemsCount,
    endCursor,
  ])

  // handle query vars change
  useEffect(() => {
    if (!queryVariablesChanged || !refetch || !isReady) {
      return
    }

    setCachedQueryVariables(queryVariables)
    setRefetching(true)

    // refetch will merge new query vars with the one from the previous request
    // we need to explicitly exclude all vars that are not present, otherwise they will get overwritten with stale values
    const refetchVariables = Object.keys(cachedQueryVariables).reduce(
      (variables, key) => {
        if (!variables[key as keyof TArgs]) {
          // @ts-ignore since the key is missing in the new vars, we know it's optional
          variables[key as keyof TArgs] = undefined
        }
        return variables
      },
      { ...queryVariables }
    )

    const refetchPromise = refetch({ ...refetchVariables, first: targetRowsCount * itemsPerRow + skipCount })

    if (refetchPromise) {
      refetchPromise.then(() => setRefetching(false))
    }
  }, [
    queryVariables,
    cachedQueryVariables,
    queryVariablesChanged,
    isReady,
    refetch,
    targetRowsCount,
    itemsPerRow,
    skipCount,
  ])

  // handle scroll to bottom
  useEffect(() => {
    const scrollHandler = debounce(() => {
      const scrolledToBottom =
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight
      if (scrolledToBottom && isReady && !loading && !allItemsLoaded) {
        onScrollToBottom()
      }
    }, 100)

    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [isReady, loading, allItemsLoaded, onScrollToBottom])

  const displayedEdges = data?.edges.slice(skipCount, targetLoadedItemsCount) ?? []
  const displayedItems = displayedEdges.map((edge) => edge.node)

  const displayedItemsCount = data
    ? Math.min(targetDisplayedItemsCount, data.totalCount - skipCount)
    : targetDisplayedItemsCount
  const placeholdersCount = displayedItemsCount - displayedItems.length

  return {
    displayedItems,
    placeholdersCount,
    error,
  }
}

export default useInfiniteGrid
