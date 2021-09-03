import { ApolloQueryResult, useApolloClient } from '@apollo/client'
import React, { SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { useRef } from 'react'

import { storageWorkersVariables } from '@/api/hooks'
import { BasicWorkerFieldsFragment, GetWorkersDocument, GetWorkersQuery, GetWorkersQueryVariables } from '@/api/queries'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { SentryLogger } from '@/utils/logs'
import { getRandomIntInclusive } from '@/utils/number'

type StorageProvidersPromise = Promise<ApolloQueryResult<GetWorkersQuery>>

type StorageProvidersContextValue = {
  storageProvidersPromiseRef: React.MutableRefObject<StorageProvidersPromise | undefined>
  notWorkingStorageProvidersIds: string[]
  setNotWorkingStorageProvidersIds: React.Dispatch<SetStateAction<string[]>>
}
const StorageProvidersContext = React.createContext<StorageProvidersContextValue | undefined>(undefined)
StorageProvidersContext.displayName = 'StorageProvidersContext'

// ¯\_(ツ)_/¯ for the name
export const StorageProvidersProvider: React.FC = ({ children }) => {
  const [notWorkingStorageProvidersIds, setNotWorkingStorageProvidersIds] = useState<string[]>([])
  const [storageProvidersError, setStorageProvidersError] = useState<unknown>(null)
  const storageProvidersPromiseRef = useRef<StorageProvidersPromise>()

  const client = useApolloClient()

  useEffect(() => {
    const promise = client.query<GetWorkersQuery, GetWorkersQueryVariables>({
      query: GetWorkersDocument,
      fetchPolicy: 'network-only',
      variables: {
        ...storageWorkersVariables,
        limit: 100,
      },
    })
    storageProvidersPromiseRef.current = promise
    promise.catch((error) => {
      SentryLogger.error('Failed to fetch storage providers list', 'StorageProvidersProvider', error)
      setStorageProvidersError(error)
    })
  }, [client])

  if (storageProvidersError) {
    return <ViewErrorFallback />
  }

  return (
    <StorageProvidersContext.Provider
      value={{
        storageProvidersPromiseRef: storageProvidersPromiseRef,
        notWorkingStorageProvidersIds,
        setNotWorkingStorageProvidersIds,
      }}
    >
      {children}
    </StorageProvidersContext.Provider>
  )
}

export const useStorageProviders = () => {
  const ctx = useContext(StorageProvidersContext)

  if (!ctx) {
    throw new Error('useStorageProviders must be used within StorageProvidersProvider')
  }

  const { storageProvidersPromiseRef, notWorkingStorageProvidersIds, setNotWorkingStorageProvidersIds } = ctx

  const getStorageProviders = useCallback(async () => {
    let storageProviders: BasicWorkerFieldsFragment[] = []
    try {
      const storageProvidersData = await storageProvidersPromiseRef.current
      storageProviders = storageProvidersData?.data.workers || []
    } catch {
      // error is handled by the context
      return []
    }

    const workingStorageProviders = storageProviders.filter(
      ({ workerId }) => !notWorkingStorageProvidersIds.includes(workerId)
    )

    if (!workingStorageProviders.length) {
      SentryLogger.error('No storage provider available', 'StorageProvidersProvider', null, {
        providers: {
          allIds: storageProviders.map(({ workerId }) => workerId),
          notWorkingIds: notWorkingStorageProvidersIds,
        },
      })
    }

    return workingStorageProviders
  }, [notWorkingStorageProvidersIds, storageProvidersPromiseRef])

  const getRandomStorageProvider = useCallback(async () => {
    const workingStorageProviders = await getStorageProviders()
    if (!workingStorageProviders || !workingStorageProviders.length) {
      return null
    }
    const randomStorageProviderIdx = getRandomIntInclusive(0, workingStorageProviders.length - 1)
    const randomStorageProvider = workingStorageProviders[randomStorageProviderIdx]

    return {
      id: randomStorageProvider.workerId,
      url: randomStorageProvider.metadata as string,
    }
  }, [getStorageProviders])

  const markStorageProviderNotWorking = useCallback(
    (workerId: string) => {
      setNotWorkingStorageProvidersIds((state) => [...state, workerId])
    },
    [setNotWorkingStorageProvidersIds]
  )

  return { getStorageProviders, getRandomStorageProvider, markStorageProviderNotWorking }
}
