import { VideoHTMLAttributes, forwardRef } from 'react'

import { useGetAssetUrl } from '@/hooks/useGetAssetUrl'

export type AssetVideoProps = {
  src: string[]
  poster: string[]
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster'>

export const AssetVideo = forwardRef<HTMLVideoElement, AssetVideoProps>(
  ({ src, poster, ...props }: AssetVideoProps, ref) => {
    const { url: videoSrc } = useGetAssetUrl(src, 'video')
    const { url: posterSrc } = useGetAssetUrl(poster, 'image')

    return <video {...props} ref={ref} src={videoSrc} poster={posterSrc} />
  }
)

AssetVideo.displayName = 'AssetVideo'
