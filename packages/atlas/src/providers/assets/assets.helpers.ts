import { DataObjectType } from '@/api/queries/__generated__/baseTypes.generated'
import { StorageDataObjectFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { ConsoleLogger } from '@/utils/logs'

const imageAssetTypes: DataObjectType['__typename'][] = [
  'DataObjectTypeChannelAvatar',
  'DataObjectTypeChannelCoverPhoto',
  'DataObjectTypeVideoThumbnail',
]
const videoAssetTypes: DataObjectType['__typename'][] = ['DataObjectTypeVideoMedia']

export const testAssetDownload = (url: string, dataObject: StorageDataObjectFieldsFragment): Promise<number> => {
  return new Promise((_resolve, _reject) => {
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

      const performanceEntries = performance.getEntriesByName(url)
      if (performanceEntries.length !== 1) {
        _resolve(0)
        return
      }
      _resolve(performanceEntries[0].duration)
    }

    const reject = () => {
      cleanup()
      _reject()
    }

    if (imageAssetTypes.includes(dataObject.type.__typename)) {
      img = new Image()
      img.addEventListener('error', reject)
      img.addEventListener('load', resolve)
      img.src = url
    } else if (videoAssetTypes.includes(dataObject.type.__typename)) {
      video = document.createElement('video')
      video.addEventListener('error', reject)
      video.addEventListener('loadedmetadata', resolve)
      video.addEventListener('loadeddata', resolve)
      video.addEventListener('canplay', resolve)
      video.addEventListener('progress', resolve)
      video.src = url
    } else {
      ConsoleLogger.warn('Encountered unknown asset type', { ...dataObject })
      reject()
    }
  })
}
