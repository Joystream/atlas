import { useEffect, useRef, useState } from 'react'

import { atlasConfig } from '@/config'
import { AssetTestOptions, logDistributorPerformance, testAssetDownload } from '@/providers/assets/assets.helpers'
import { useOperatorsContext } from '@/providers/assets/assets.provider'
import { AssetType } from '@/providers/uploads/uploads.types'
import { isMobile } from '@/utils/browser'
import { getVideoCodec } from '@/utils/getVideoCodec'
import { ConsoleLogger, DistributorEventEntry, SentryLogger, UserEventsLogger } from '@/utils/logs'
import { withTimeout } from '@/utils/misc'

const workingUrlMap = new Map<string, string>()
const assetsWithNoDistributions: string[] = []

export const getSingleAssetUrl = async (
  urls: string[] | null | undefined,
  id: string | null | undefined,
  type: AssetType | null,
  timeout?: number,
  opts?: AssetTestOptions
): Promise<string | undefined> => {
  if (!urls || !urls.length || (id && assetsWithNoDistributions.includes(id))) {
    return
  }

  if (id && workingUrlMap.has(id)) {
    return workingUrlMap.get(id)
  }

  const mobile = isMobile()

  for (const distributionAssetUrl of urls) {
    const eventEntry: DistributorEventEntry = {
      dataObjectId: id,
      dataObjectType: type || undefined,
      resolvedUrl: distributionAssetUrl,
    }
    const [assetTestPromise, cleanup] = testAssetDownload(distributionAssetUrl, type, opts)
    const assetTestPromiseWithTimeout = withTimeout(
      assetTestPromise,
      timeout ?? atlasConfig.storage.assetResponseTimeout
    )

    try {
      await assetTestPromiseWithTimeout

      logDistributorPerformance(distributionAssetUrl, eventEntry)

      if (id) {
        workingUrlMap.set(id, distributionAssetUrl)
      }

      return distributionAssetUrl
    } catch (err) {
      cleanup?.()
      if (err instanceof MediaError) {
        let codec = ''
        if (type === 'video' && !mobile) {
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
      const [assetTestPromise] = testAssetDownload(distributionAssetUrl, type)
      promises.push(assetTestPromise)
    }

    Promise.any(promises)
      .then((url) => {
        if (id) {
          workingUrlMap.set(id, url)
        }
        res(url)
      })
      .catch((error) => {
        ConsoleLogger.warn(`Error during fallback asset promise race`, {
          urls,
          error,
        })
        return undefined
      })
  })
}

export const useGetAssetUrl = (urls: string[] | undefined | null, type: AssetType | null, opts?: AssetTestOptions) => {
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const assetPromise = useRef<Promise<string | undefined> | null>(null)
  const { userBenchmarkTime } = useOperatorsContext()
  const id = urls?.[0]?.split('/').pop()
  useEffect(() => {
    // nothing should be done if old promise is still pending
    if (assetPromise.current) {
      return
    }

    if (!urls || (url && urls.includes(url)) || (!url && !urls.length)) {
      setIsLoading(false)
      return
    }

    const init = async () => {
      setUrl(undefined)
      setIsLoading(true)
      assetPromise.current = getSingleAssetUrl(
        urls,
        id,
        type,
        type === 'video' ? 10_000 : userBenchmarkTime.current ?? undefined,
        opts
      )
      const resolvedUrl = await assetPromise.current
      assetPromise.current = null

      setIsLoading(false)
      if (resolvedUrl) {
        setUrl(resolvedUrl)
      } else if (id) {
        assetsWithNoDistributions.push(id)
      }
    }

    init()
  }, [id, opts, type, url, urls, userBenchmarkTime])

  return { url, isLoading }
}
