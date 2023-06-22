import { ImgHTMLAttributes } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'

export type AssetImage = {
  src: string[] | undefined | null
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>

export const AssetImage = ({ src, ...imgProps }: AssetImage) => {
  const { url, isLoading } = useGetAssetUrl(src, 'image')
  if (isLoading) {
    return <SkeletonLoader className={imgProps.className} />
  }

  return <img {...imgProps} src={url} />
}
