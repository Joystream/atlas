import { VideoHTMLAttributes, forwardRef } from 'react'

import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'

export type AssetVideoProps = {
  resolvedVideoUrls: string[]
  resolvedPosterUrls: string[]
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster'>

export const AssetVideo = forwardRef<HTMLVideoElement, AssetVideoProps>(
  ({ resolvedVideoUrls, resolvedPosterUrls, ...props }: AssetVideoProps, ref) => {
    const { url: videoSrc } = useGetAssetUrl(resolvedVideoUrls, 'video')
    const { url: posterSrc } = useGetAssetUrl(resolvedPosterUrls, 'image')

    return <video {...props} ref={ref} src={videoSrc} poster={posterSrc} />
  }
)

AssetVideo.displayName = 'AssetVideo'
