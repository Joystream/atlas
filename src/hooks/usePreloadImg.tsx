import { useEffect, useState } from 'react'

export const usePreloadImg = (thumbnailUrl: string | undefined) => {
  const [hasImgLoaded, setHasImgLoaded] = useState(false)
  useEffect(() => {
    if (thumbnailUrl) {
      const newImg = new Image()
      newImg.onload = () => setHasImgLoaded(true)
      newImg.src = thumbnailUrl
    }
  }, [thumbnailUrl])

  return { hasImgLoaded }
}
