import { BasicVideoFieldsFragment, VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'

export const useVideoTileSharedLogic = (video?: BasicVideoFieldsFragment | VideoFieldsFragment | null) => {
  const { url: thumbnailPhotoUrl, isLoadingAsset: isLoadingThumbnail } = useAsset(video?.thumbnailPhoto)
  const { url: avatarPhotoUrl, isLoadingAsset: isLoadingAvatar } = useAsset(video?.channel?.avatarPhoto)

  const videoHref = video ? absoluteRoutes.viewer.video(video.id) : undefined

  return {
    isLoadingThumbnail: isLoadingThumbnail || !video,
    isLoadingAvatar: isLoadingAvatar || !video,
    thumbnailPhotoUrl,
    avatarPhotoUrl,
    videoHref,
  }
}
