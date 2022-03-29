import { BasicVideoFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'

type UseVideoSharedLogicOpts = {
  video?: BasicVideoFieldsFragment | VideoFieldsFragment | null
  loading?: boolean
  isDraft?: boolean
  onNotFound?: () => void
}
export const useVideoTileSharedLogic = ({ video, loading }: UseVideoSharedLogicOpts) => {
  const { url: thumbnailPhotoUrl, isLoadingAsset: isLoadingThumbnail } = useAsset(video?.thumbnailPhoto)
  const { url: avatarPhotoUrl, isLoadingAsset: isLoadingAvatar } = useAsset(video?.channel?.avatarPhoto)

  const internalIsLoadingState = loading || !video
  const videoHref = video ? absoluteRoutes.viewer.video(video.id) : undefined

  return {
    video,
    loading: internalIsLoadingState,
    isLoadingThumbnail: isLoadingThumbnail || internalIsLoadingState,
    isLoadingAvatar: isLoadingAvatar || internalIsLoadingState,
    thumbnailPhotoUrl,
    avatarPhotoUrl,
    videoHref,
  }
}
