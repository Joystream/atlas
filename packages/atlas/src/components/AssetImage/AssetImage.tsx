import { ImgHTMLAttributes } from 'react'

import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'

export type AssetImage = {
  resolvedUrls: string[] | undefined | null
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>

export const AssetImage = ({ resolvedUrls, ...imgProps }: AssetImage) => {
  const { url, isLoading } = useGetAssetUrl(resolvedUrls, 'image')
  if (isLoading) {
    return <SkeletonLoader className={imgProps.className} />
  }

  return <img {...imgProps} src={url} />
}
