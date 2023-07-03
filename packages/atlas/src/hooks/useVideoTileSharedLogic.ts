import { BasicVideoFieldsFragment, FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { absoluteRoutes } from '@/config/routes'

export const useVideoTileSharedLogic = (video?: BasicVideoFieldsFragment | FullVideoFieldsFragment | null) => {
  const thumbnailPhotoUrls = video?.thumbnailPhoto?.resolvedUrls.length ? video.thumbnailPhoto.resolvedUrls : undefined
  const avatarPhotoUrls = video?.channel?.avatarPhoto?.resolvedUrls.length
    ? video.channel.avatarPhoto.resolvedUrls
    : undefined

  const videoHref = video ? absoluteRoutes.viewer.video(video.id) : undefined

  return {
    isLoadingThumbnail: !video,
    isLoadingAvatar: !video,
    thumbnailPhotoUrls,
    avatarPhotoUrls,
    videoHref,
  }
}
