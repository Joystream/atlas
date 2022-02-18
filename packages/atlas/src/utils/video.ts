import { ConsoleLogger } from '@/utils/logs'
import { formatNumber, formatNumberShort } from '@/utils/number'
import { formatDateAgo } from '@/utils/time'

export const formatVideoViews = (views: number | null, { fullViews } = { fullViews: false }): string | null => {
  const formattedViews = views !== null && (fullViews ? formatNumber(views) : formatNumberShort(views))
  return formattedViews ? `${formattedViews} views` : null
}

export const formatVideoDate = (date: Date) => formatDateAgo(date)

export const formatVideoViewsAndDate = (
  views: number | null,
  date: Date,
  { fullViews }: { fullViews: boolean }
): string => {
  const formattedDate = formatVideoDate(date)
  const formattedViews = formatVideoViews(views, { fullViews })
  return formattedViews ? `${formattedDate} • ${formattedViews}` : formattedDate
}

export type VideoMetadata = {
  mimeType: string
  sizeInBytes: number
  height: number
  width: number
  duration: number
}
export const getVideoMetadata = async (file: File): Promise<VideoMetadata> => {
  const videoEl = document.createElement('video')
  const mimeType = file?.type ?? ''
  const sizeInBytes = file?.size ?? 0
  const canPlay = videoEl.canPlayType(mimeType)

  return new Promise((resolve, reject) => {
    const handleLoadedData = () => {
      // Video should now be loaded but we can add a second check
      if (videoEl.readyState >= 3) {
        const height = videoEl.videoHeight
        const width = videoEl.videoWidth
        const duration = videoEl.duration
        resolve({ mimeType, sizeInBytes, height, width, duration })
      } else {
        reject(new Error('There was an error loading the video please try again'))
      }
    }

    if (canPlay) {
      videoEl.src = URL.createObjectURL(file)
      videoEl.addEventListener('loadeddata', handleLoadedData, { once: true })
      videoEl.addEventListener('error', (error) => {
        ConsoleLogger.warn('Cannot get metadata from a given video file', error)
        reject(new Error("Can't play video file"))
      })
    } else {
      reject(new Error("Can't play video file"))
    }
  })
}
