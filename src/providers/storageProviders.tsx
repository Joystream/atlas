import React, { SetStateAction, useCallback, useContext, useState } from 'react'

import { useStorageWorkers as useStorageProvidersData } from '@/api/hooks'
import { BasicWorkerFieldsFragment } from '@/api/queries/__generated__/workers.generated'
import { Logger } from '@/utils/logger'
import { getRandomIntInclusive } from '@/utils/number'

type StorageProvidersContextValue = {
  storageProviders: BasicWorkerFieldsFragment[]
  storageProvidersLoading: boolean
  notWorkingStorageProvidersIds: string[]
  setNotWorkingStorageProvidersIds: React.Dispatch<SetStateAction<string[]>>
}
const StorageProvidersContext = React.createContext<StorageProvidersContextValue | undefined>(undefined)
StorageProvidersContext.displayName = 'StorageProvidersContext'

class NoStorageProviderError extends Error {
  storageProviders: string[]
  notWorkingStorageProviders: string[]

  constructor(message: string, storageProviders: string[], notWorkingStorageProviders: string[]) {
    super(message)

    this.storageProviders = storageProviders
    this.notWorkingStorageProviders = notWorkingStorageProviders
  }
}

// ¯\_(ツ)_/¯ for the name
export const StorageProvidersProvider: React.FC = ({ children }) => {
  const [notWorkingStorageProvidersIds, setNotWorkingStorageProvidersIds] = useState<string[]>([])

  const { storageProviders, loading } = useStorageProvidersData(
    { limit: 100 },
    {
      fetchPolicy: 'network-only',
      onError: (error) => Logger.error('Failed to fetch storage providers list', error),
    }
  )

  return (
    <StorageProvidersContext.Provider
      value={{
        storageProvidersLoading: loading,
        storageProviders: storageProviders || [],
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

  const {
    storageProvidersLoading,
    storageProviders,
    notWorkingStorageProvidersIds,
    setNotWorkingStorageProvidersIds,
  } = ctx

  const getStorageProviders = useCallback(() => {
    // make sure we finished fetching providers list
    if (storageProvidersLoading) {
      // TODO: we need to handle that somehow, possibly make it async and block until ready
      Logger.error('Trying to use storage providers while still loading')
      return null
    }

    const workingStorageProviders = storageProviders.filter(
      ({ workerId }) => !notWorkingStorageProvidersIds.includes(workerId)
    )

    if (!workingStorageProviders.length) {
      throw new NoStorageProviderError(
        'No storage provider available',
        storageProviders.map(({ workerId }) => workerId),
        notWorkingStorageProvidersIds
      )
    }

    return workingStorageProviders
  }, [notWorkingStorageProvidersIds, storageProviders, storageProvidersLoading])

  const getRandomStorageProvider = useCallback(() => {
    const workingStorageProviders = getStorageProviders()
    if (!workingStorageProviders) {
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
