import { Asset } from '@/api/queries'

export const getImageUrlFromAsset = (image?: Asset | null) => {
  if (!image) return
  if (image.__typename === 'AssetUrl') {
    return image.url
  }
}
