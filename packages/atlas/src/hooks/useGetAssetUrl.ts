import { useEffect, useState } from 'react'

import { atlasConfig } from '@/config'
import { testAssetDownload } from '@/providers/assets/assets.helpers'
import { useOperatorsContext } from '@/providers/assets/assets.provider'
import { ConsoleLogger } from '@/utils/logs'
import { TimeoutError, withTimeout } from '@/utils/misc'

export const getSingleAssetUrl = async (
  urls: string[] | undefined | null,
  type: 'image' | 'video' | 'subtitle',
  timeout?: number
): Promise<string | undefined> => {
  if (!urls || !urls.length) {
    return
  }

  for (const distributionAssetUrl of urls) {
    const distributorUrl = distributionAssetUrl.split(`/${atlasConfig.storage.assetPath}/`)[0]

    const assetTestPromise = testAssetDownload(distributionAssetUrl, type)
    const assetTestPromiseWithTimeout = withTimeout(
      assetTestPromise,
      timeout ?? atlasConfig.storage.assetResponseTimeout
    )

    try {
      await assetTestPromiseWithTimeout

      return distributionAssetUrl
    } catch (err) {
      if (err instanceof TimeoutError) {
        // AssetLogger.logDistributorResponseTimeout(eventEntry)
        ConsoleLogger.warn(
          `Distributor didn't respond in ${timeout ?? atlasConfig.storage.assetResponseTimeout} seconds`,
          {
            distributorUrl: distributorUrl,
            assetUrl: distributionAssetUrl,
          }
        )
      }
    }
  }

  // if waterfall logic timeout was too small, fallback to waiting with no timeout
  return new Promise((res) => {
    const promises: Promise<string>[] = []
    for (const distributionAssetUrl of urls) {
      const assetTestPromise = testAssetDownload(distributionAssetUrl, type)
      promises.push(assetTestPromise)
    }

    Promise.race(promises)
      .then(res)
      .catch((error) => {
        ConsoleLogger.warn(`Error during fallback asset promise race`, {
          urls,
          error,
        })
      })
  })
}

export const useGetAssetUrl = (urls: string[] | undefined | null, type: 'image' | 'video' | 'subtitle') => {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const { userBenchmarkTime } = useOperatorsContext()
  useEffect(() => {
    if (!urls || (url && urls.includes(url))) {
      setIsLoading(false)
      return
    }
    const init = async () => {
      setUrl(undefined)
      setIsLoading(true)
      const resolvedUrl = await getSingleAssetUrl(urls, type, userBenchmarkTime ?? undefined)
      setIsLoading(false)
      if (resolvedUrl) {
        setUrl(resolvedUrl)
      }
    }

    init()

    return () => {
      setIsLoading(false)
    }
  }, [type, url, urls, userBenchmarkTime])

  return { url, isLoading }
}
