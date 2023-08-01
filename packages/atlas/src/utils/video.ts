import { NftIssuanceInputMetadata } from '@/joystream-lib/types'
import { VideoWorkspaceVideoFormFields } from '@/providers/videoWorkspace'
import { ConsoleLogger } from '@/utils/logs'
import { formatDateAgo } from '@/utils/time'

export const formatVideoDate = (date: Date) => formatDateAgo(date)

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

export const createNftInputMetadata = (data: VideoWorkspaceVideoFormFields): NftIssuanceInputMetadata | undefined => {
  return data.mintNft
    ? {
        royalty: data.nftRoyaltiesPercent || undefined,
      }
    : undefined
}
