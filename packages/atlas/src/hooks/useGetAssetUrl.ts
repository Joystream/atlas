// import { init as initApm } from '@elastic/apm-rum'
import { useEffect, useState } from 'react'

import { atlasConfig } from '@/config'
import { logDistributorPerformance, testAssetDownload } from '@/providers/assets/assets.helpers'
import { useOperatorsContext } from '@/providers/assets/assets.provider'
import { getVideoCodec } from '@/utils/getVideoCodec'
import { ConsoleLogger, DistributorEventEntry, SentryLogger, UserEventsLogger } from '@/utils/logs'
import { withTimeout } from '@/utils/misc'

// const apm = initApm({
//   serviceName: 'gleev',
//
//   // Set custom APM Server URL (default: http://localhost:8200)
//   serverUrl: `https://atlas-services.joystream.org/apm`,
//
//   // Set service version (required for sourcemap feature)
//   serviceVersion: '',
//   environment: 'development'
// })

export const getSingleAssetUrl = async (
  urls: string[] | null | undefined,
  type: 'image' | 'video' | 'subtitle',
  timeout?: number
): Promise<string | undefined> => {
  if (!urls || !urls.length) {
    return
  }

  for (const distributionAssetUrl of urls) {
    const eventEntry: DistributorEventEntry = {
      dataObjectId: '1',
      dataObjectType: 'DataObjectTypeChannelAvatar',
      resolvedUrl: distributionAssetUrl,
    }

    const assetTestPromise = testAssetDownload(distributionAssetUrl, type)
    const assetTestPromiseWithTimeout = withTimeout(
      assetTestPromise,
      timeout ?? atlasConfig.storage.assetResponseTimeout
    )

    try {
      // const transaction = apm.startTransaction('Application start', 'custom')
      // const httpSpan = transaction?.startSpan('GET ' + distributionAssetUrl, 'external.http')

      await assetTestPromiseWithTimeout

      // httpSpan?.end()
      // transaction?.end()
      logDistributorPerformance(distributionAssetUrl, eventEntry)

      return distributionAssetUrl
    } catch (err) {
      if (err instanceof MediaError) {
        const codec = getVideoCodec(distributionAssetUrl)
        UserEventsLogger.logWrongCodecEvent(eventEntry, { codec })
        SentryLogger.error('Error during asset download test, media is not supported', 'AssetsManager', err, {
          asset: { parent, distributionAssetUrl, mediaError: err, codec },
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

export const useGetAssetUrl = (urls: string[] | undefined | null, type: 'image' | 'video' | 'subtitle') => {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const { userBenchmarkTime } = useOperatorsContext()
  useEffect(() => {
    if (!urls || (url && urls.includes(url)) || (!url && !urls.length)) {
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
