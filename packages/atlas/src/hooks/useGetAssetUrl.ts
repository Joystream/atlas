import { useEffect, useState } from 'react'

import { atlasConfig } from '@/config'
import { testAssetDownload } from '@/providers/assets/assets.helpers'
import { ConsoleLogger } from '@/utils/logs'
import { TimeoutError, withTimeout } from '@/utils/misc'

export const getSingleAssetUrl = async (urls: string[] | undefined | null, type: 'image' | 'video' | 'subtitle') => {
  if (!urls || urls[0] === '') {
    return
  }

  for (const distributionAssetUrl of urls) {
    const distributorUrl = distributionAssetUrl.split(`/${atlasConfig.storage.assetPath}/`)[0]

    const assetTestPromise = testAssetDownload(distributionAssetUrl, type)
    const assetTestPromiseWithTimeout = withTimeout(assetTestPromise, atlasConfig.storage.assetResponseTimeout)

    try {
      await assetTestPromiseWithTimeout

      return distributionAssetUrl
    } catch (err) {
      if (err instanceof TimeoutError) {
        // AssetLogger.logDistributorResponseTimeout(eventEntry)
        ConsoleLogger.warn(`Distributor didn't respond in ${atlasConfig.storage.assetResponseTimeout} seconds`, {
          distributorUrl: distributorUrl,
          assetUrl: distributionAssetUrl,
        })
      }
    }
  }
}

export const useGetAssetUrl = (urls: string[] | undefined | null, type: 'image' | 'video' | 'subtitle') => {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (url) {
      return
    }
    const init = async () => {
      setIsLoading(true)
      const resolvedUrl = await getSingleAssetUrl(urls, type)
      setIsLoading(false)
      if (resolvedUrl) {
        setUrl(resolvedUrl)
      }
    }

    init()
  }, [type, url, urls])

  return { url, isLoading }
}
