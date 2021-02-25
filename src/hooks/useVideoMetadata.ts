import { useEffect, useState } from 'react'

export type VideoMetaData = {
  type: string
  sizeInBytes: number
  height: number
  width: number
  duration: number
}
export const useVideoMetadata = () => {
  const [file, setFile] = useState<File>()
  const [metadata, setMetadata] = useState<VideoMetaData>()
  useEffect(() => {
    const videoEl = document.createElement('video')
    const type = file?.type ?? ''
    const sizeInBytes = file?.size ?? 0
    const URL = window.URL || window.webkitURL
    const canPlay = videoEl.canPlayType(type)

    const handleLoadeddata = (e: Event) => {
      // Video should now be loaded but we can add a second check
      if (videoEl.readyState >= 3) {
        const height = videoEl.videoHeight
        const width = videoEl.videoWidth
        const duration = videoEl.duration
        setMetadata({ type, sizeInBytes, height, width, duration })
      }
    }

    if (canPlay) {
      const fileURL = URL.createObjectURL(file)
      videoEl.src = fileURL
      videoEl.addEventListener('loadeddata', handleLoadeddata)
    }

    return () => {
      videoEl.removeEventListener('loadeddata', handleLoadeddata)
    }
  }, [file])

  return { setFile, metadata }
}
