import { useEffect, useState } from 'react'

import { atlasConfig } from '@/config'
import { logDistributorPerformance, testAssetDownload } from '@/providers/assets/assets.helpers'
import { useOperatorsContext } from '@/providers/assets/assets.provider'
import { AssetType } from '@/providers/uploads/uploads.types'
import { getVideoCodec } from '@/utils/getVideoCodec'
import { ConsoleLogger, DistributorEventEntry, SentryLogger, UserEventsLogger } from '@/utils/logs'
import { withTimeout } from '@/utils/misc'

export const getSingleAssetUrl = async (
  urls: string[] | null | undefined,
  id: string | null | undefined,
  type: AssetType | null,
  timeout?: number
): Promise<string | undefined> => {
  if (!urls || !urls.length) {
    return
  }

  for (const distributionAssetUrl of urls) {
    const eventEntry: DistributorEventEntry = {
      dataObjectId: id,
      dataObjectType: type || undefined,
      resolvedUrl: distributionAssetUrl,
    }

    const assetTestPromise = testAssetDownload(distributionAssetUrl, type)
    const assetTestPromiseWithTimeout = withTimeout(
      assetTestPromise,
      timeout ?? atlasConfig.storage.assetResponseTimeout
    )

    try {
      await assetTestPromiseWithTimeout

      logDistributorPerformance(distributionAssetUrl, eventEntry)

      return distributionAssetUrl
    } catch (err) {
      if (err instanceof MediaError) {
        let codec = ''
        if (type === 'video') {
          codec = getVideoCodec(distributionAssetUrl)
        }
        UserEventsLogger.logWrongCodecEvent(eventEntry, { assetType: type, ...(type === 'video' ? { codec } : {}) })
        SentryLogger.error('Error during asset download test, media is not supported', 'AssetsManager', err, {
          asset: {
            parent,
            distributionAssetUrl,
            mediaError: err,
            assetType: type,
            ...(type === 'video' ? { codec } : {}),
          },
        })
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

    Promise.any(promises)
      .then(res)
      .catch((error) => {
        ConsoleLogger.warn(`Error during fallback asset promise race`, {
          urls,
          error,
        })
      })
  })
}

export const useGetAssetUrl = (urls: string[] | undefined | null, type: AssetType | null) => {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const { userBenchmarkTime } = useOperatorsContext()
  const id = url?.split('/').pop()
  useEffect(() => {
    if (!urls || (url && urls.includes(url)) || (!url && !urls.length)) {
      setIsLoading(false)
      return
    }
    const init = async () => {
      setUrl(undefined)
      setIsLoading(true)
      const resolvedUrl = await getSingleAssetUrl(urls, id, type, userBenchmarkTime.current ?? undefined)
      setIsLoading(false)
      if (resolvedUrl) {
        setUrl(resolvedUrl)
      }
    }

    init()

    return () => {
      setIsLoading(false)
    }
  }, [id, type, url, urls, userBenchmarkTime])

  return { url, isLoading }
}
