import { BasicVideoFieldsFragment, FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { absoluteRoutes } from '@/config/routes'

export const useVideoTileSharedLogic = (video?: BasicVideoFieldsFragment | FullVideoFieldsFragment | null) => {
  const thumbnailPhotoUrl = video?.thumbnailPhoto?.resolvedUrl
  const avatarPhotoUrl = video?.channel?.avatarPhoto?.resolvedUrl

  const videoHref = video ? absoluteRoutes.viewer.video(video.id) : undefined

  return {
    isLoadingThumbnail: !video,
    isLoadingAvatar: !video,
    thumbnailPhotoUrl,
    avatarPhotoUrl,
    videoHref,
  }
}
