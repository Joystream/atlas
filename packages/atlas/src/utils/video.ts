import { ConsoleLogger } from '@/utils/logs'
import { formatNumber, formatNumberShort } from '@/utils/number'
import { formatDateAgo } from '@/utils/time'

export const formatVideoViewsAndDate = (
  views: number | null,
  date: Date,
  { fullViews } = { fullViews: false }
): string => {
  const formattedDate = formatDateAgo(date)
  const formattedViews = views !== null && (fullViews ? formatNumber(views) : formatNumberShort(views))
  return formattedViews ? `${formattedDate} • ${formattedViews} views` : formattedDate
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
      const fileURL = URL.createObjectURL(file)
      videoEl.src = fileURL
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
