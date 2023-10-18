import { axiosInstance } from '@/api/axios'
import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { BUILD_ENV } from '@/config/env'
import { AssetType } from '@/providers/uploads/uploads.types'
import { ConsoleLogger, DistributorEventEntry, DistributorEventMetric, UserEventsLogger } from '@/utils/logs'
import { wait } from '@/utils/misc'

export const getMemberAvatar = (member?: Pick<BasicMembershipFieldsFragment, 'metadata'> | null) => {
  const avatar = member?.metadata?.avatar

  if (avatar?.__typename === 'AvatarUri') {
    return { urls: [avatar.avatarUri], isLoadingAsset: false }
  } else if (avatar?.__typename === 'AvatarObject') {
    return { urls: avatar.avatarObject.resolvedUrls, isLoadingAsset: false }
  }
  // if avatar is `undefined` it means that avatar is not loaded yet, If it's `null` it means that it's not set
  return { urls: null, isLoadingAsset: avatar !== null }
}

export const testAssetDownload = (url: string, type: AssetType | null): Promise<string> => {
  return new Promise((_resolve, _reject) => {
    const isImageType = type && ['thumbnail', 'avatar', 'cover'].includes(type)
    let img: HTMLImageElement | null = null
    let video: HTMLVideoElement | null = null

    const cleanup = () => {
      if (img) {
        img.removeEventListener('error', reject)
        img.removeEventListener('load', resolve)
        img.remove()
        img = null
      }
      if (video) {
        video.removeEventListener('error', reject)
        video.removeEventListener('loadedmetadata', resolve)
        video.removeEventListener('loadeddata', resolve)
        video.removeEventListener('canplay', resolve)
        video.removeEventListener('progress', resolve)
        video.remove()
        video = null
      }
    }

    const resolve = () => {
      cleanup()

      _resolve(url)
    }

    const reject = (err?: unknown) => {
      cleanup()
      UserEventsLogger.logAssetUploadFailedEvent({ resolvedUrl: url }, err as Error)
      _reject(err)
    }

    if (isImageType) {
      img = new Image()
      img.addEventListener('load', (e) => {
        e.preventDefault()
        resolve()
      })
      img.addEventListener('error', reject)
      img.src = url
    } else if (type === 'video') {
      video = document.createElement('video')
      video.addEventListener('loadedmetadata', resolve)
      video.addEventListener('loadeddata', resolve)
      video.addEventListener('canplay', resolve)
      video.addEventListener('progress', resolve)
      video.addEventListener('error', async (err) => {
        if (err.target) {
          reject((err.target as HTMLVideoElement).error)
        } else {
          reject(err)
        }
      })
      video.src = url
    } else if (type === 'subtitles') {
      fetch(url, { method: 'HEAD', mode: 'cors', cache: 'no-store' })
        .then((response) => {
          if (!response.ok) {
            UserEventsLogger.logAssetUploadFailedEvent({ resolvedUrl: url }, new Error(response.statusText))
          }
          resolve()
        })
        .catch(reject)
    } else {
      ConsoleLogger.warn('Encountered unknown asset type', { url, type })
      reject()
    }
  })
}

export const logDistributorPerformance = async (assetUrl: string, eventEntry: DistributorEventEntry) => {
  if (!UserEventsLogger) return

  // delay execution for 1s to make sure performance entries get populated
  await wait(1000)

  const performanceEntries = window.performance.getEntriesByName(assetUrl)
  const performanceEntry = performanceEntries[0] as PerformanceResourceTiming

  if (!performanceEntry && BUILD_ENV === 'production') {
    ConsoleLogger.debug('Performance entry not found', { assetUrl })
    return
  }

  const { decodedBodySize, transferSize, fetchStart, responseStart, responseEnd } = performanceEntry

  if (decodedBodySize / transferSize > 5) {
    // if resource size is considerably larger than over-the-wire transfer size, we can assume we got the result from the cache
    return
  }
  const metric: DistributorEventMetric = {
    initialResponseTime: responseStart - fetchStart,
    fullResponseTime: responseEnd - fetchStart,
    downloadSpeed: decodedBodySize / (responseEnd - responseStart),
  }
  UserEventsLogger.logDistributorResponseTime(eventEntry, metric)
}

export const getFastestImageUrl = async (urls: string[]) => {
  const promises = urls.map((url) => {
    return axiosInstance
      .head(url, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .catch((error) => ConsoleLogger.warn('Failed while performing performance download', error))
  })
  return Promise.any(promises)
}
