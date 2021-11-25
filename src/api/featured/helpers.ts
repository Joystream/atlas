import localforage from 'localforage'
import { useEffect, useState } from 'react'

import { useEnvironmentStore } from '@/providers/environment'
import { SentryLogger } from '@/utils/logs'

const localforageInstance = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  name: `Joystream-Atlas-${useEnvironmentStore.getState().targetDevEnv}`,
  storeName: 'featured-content-cache',
})

type PersistedDataRecord<T> = {
  data: T
  cachedAt: number
}

export const useGenericFeaturedData = <T>(key: string, memoizedFetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    const initData = async () => {
      const record = await localforageInstance.getItem<PersistedDataRecord<T>>(key)

      if (record) {
        setData(record.data)
      }

      try {
        const data = await memoizedFetchFn()
        const newRecord: PersistedDataRecord<T> = {
          data,
          cachedAt: Date.now(),
        }

        if (!record) {
          // only set data if there is no previous record, otherwise use the previous record until next app visit
          setData(newRecord.data)
        }

        await localforageInstance.setItem<PersistedDataRecord<T>>(key, newRecord)
      } catch (e) {
        SentryLogger.error('Failed to fetch featured data', 'useGenericFeaturedData', e, {
          featuredData: { key },
        })
      }
    }

    initData()
  }, [key, memoizedFetchFn])

  return { data }
}
