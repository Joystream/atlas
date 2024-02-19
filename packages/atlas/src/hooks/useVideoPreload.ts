import { useEffect } from 'react'

import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'

export const useVideoPreload = (mediaUrls?: string[]) => {
  const { url } = useGetAssetUrl(mediaUrls, 'video')

  useEffect(() => {
    if (url) {
      const videoElement = document.createElement('video')
      videoElement.src = url
      videoElement.preload = 'auto'
      videoElement.style.display = 'none'
      document.body.appendChild(videoElement)
      videoElement.oncanplaythrough = () => {
        // after video reaches playtrough disable preloading to save resources
        videoElement.preload = 'metadata'
      }

      return () => {
        document.body.removeChild(videoElement)
      }
    }
  }, [url])
}
