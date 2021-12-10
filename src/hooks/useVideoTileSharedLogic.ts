import { useVideo } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/providers/assets'
import { SentryLogger } from '@/utils/logs'

type UseVideoSharedLogicOpts = {
  id?: string
  isDraft?: boolean
  onNotFound?: () => void
}
export const useVideoTileSharedLogic = ({ id, isDraft, onNotFound }: UseVideoSharedLogicOpts) => {
  const { video, loading } = useVideo(id ?? '', {
    skip: !id || isDraft,
    onCompleted: (data) => !data && onNotFound?.(),
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const { url: thumbnailPhotoUrl, isLoadingAsset: isLoadingThumbnail } = useAsset(video?.thumbnailPhoto)
  const { url: avatarPhotoUrl, isLoadingAsset: isLoadingAvatar } = useAsset(video?.channel?.avatarPhoto)

  const internalIsLoadingState = loading || !id
  const videoHref = id ? absoluteRoutes.viewer.video(id) : undefined
  return {
    video,
    loading: internalIsLoadingState,
    isLoadingThumbnail,
    isLoadingAvatar,
    thumbnailPhotoUrl,
    avatarPhotoUrl,
    videoHref,
  }
}
