import { useEffect, useState } from 'react'

export const usePreloadImg = (imgURL: string | undefined) => {
  const [hasImgLoaded, setHasImgLoaded] = useState(false)
  useEffect(() => {
    if (imgURL) {
      const newImg = new Image()
      newImg.onload = () => setHasImgLoaded(true)
      newImg.src = imgURL
    }
  }, [imgURL])

  return { hasImgLoaded }
}
