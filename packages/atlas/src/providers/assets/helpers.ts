import axios from 'axios'

import { DataObjectType, StorageDataObjectFieldsFragment } from '@/api/queries'
import { USER_LOCATION_SERVICE } from '@/config/urls'
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

type CalculateDistanceArgs = {
  lat1: number
  lng1: number
  lat2: number
  lng2: number
}
export const calculateDistance = ({ lat1, lng1, lat2, lng2 }: CalculateDistanceArgs) => {
  const R = 6371e3 // metres
  const latitude1 = (lat1 * Math.PI) / 180
  const latitude2 = (lat2 * Math.PI) / 180
  const deltaLatitude2 = ((lat2 - lat1) * Math.PI) / 180
  const deltaLongitude = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(deltaLatitude2 / 2) * Math.sin(deltaLatitude2 / 2) +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.floor(R * c) // in metres
}

export const getUserLocation = async (): Promise<{ latitude: string; longitude: string }> => {
  const storedLocation = localStorage.getItem('userLocation')
  const parsedLocation = storedLocation && JSON.parse(storedLocation)
  const sevenDaysMs = 604800000
  const now = new Date()
  if (!parsedLocation || now.getTime() > parsedLocation.expiry) {
    const userLocation = await axios.get(USER_LOCATION_SERVICE)
    localStorage.setItem(
      'userLocation',
      JSON.stringify({ value: userLocation.data, expiry: now.getTime() + sevenDaysMs })
    )
  }
  return parsedLocation.value
}
