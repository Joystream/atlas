import { formatNumber, formatNumberShort } from '@/utils/number'
import { formatDateAgo } from '@/utils/time'

export const formatVideoViewsAndDate = (
  views: number | null,
  date: Date,
  { fullViews } = { fullViews: false }
): string => {
  const formattedDate = formatDateAgo(date)
  const formattedViews = views !== null && (fullViews ? formatNumber(views) : formatNumberShort(views))
  return formattedViews ? `${formattedViews} views • ${formattedDate}` : formattedDate
}

export type VideoMetadata = {
  mimeType: string
  sizeInBytes: number
  height: number
  width: number
  duration: number
}
export const getVideoMetadata = async (
  file?: File
): Promise<{ metadata: VideoMetadata; error?: undefined } | { metadata?: undefined; error: Error }> => {
  const videoEl = document.createElement('video')
  const mimeType = file?.type ?? ''
  const sizeInBytes = file?.size ?? 0
  const Url = URL
  const canPlay = videoEl.canPlayType(mimeType)

  return new Promise((resolve) => {
    const handleLoadeddata = (e: Event) => {
      // Video should now be loaded but we can add a second check
      if (videoEl.readyState >= 3) {
        const height = videoEl.videoHeight
        const width = videoEl.videoWidth
        const duration = videoEl.duration
        resolve({ metadata: { mimeType, sizeInBytes, height, width, duration } })
        videoEl.removeEventListener('loadeddata', handleLoadeddata)
      }
    }

    if (canPlay) {
      const fileURL = Url.createObjectURL(file)
      videoEl.src = fileURL
      videoEl.addEventListener('loadeddata', handleLoadeddata)
    } else {
      resolve({ error: new Error("Can't play video file") })
    }
  })
}
