import { useChannelAssetAvailability } from './channel'
import { useVideoAssetAvailability } from './video'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar'

export const useAssetsAvailability = (id: string, assetType: AssetType) => {
  const isChannelAsset = assetType === 'cover' || assetType === 'avatar'
  const isVideoAsset = assetType === 'video' || assetType === 'thumbnail'
  const { avatarPhotoAvailability, coverPhotoAvailability, ...channelRest } = useChannelAssetAvailability(id, {
    skip: isVideoAsset,
  })
  const { mediaAvailability, thumbnailPhotoAvailability, ...videoRest } = useVideoAssetAvailability(id, {
    skip: isChannelAsset,
  })

  if (isChannelAsset) {
    return {
      assetAvailability: assetType === 'cover' ? coverPhotoAvailability : avatarPhotoAvailability,
      ...channelRest,
    }
  } else {
    return {
      assetAvailability: assetType === 'video' ? mediaAvailability : thumbnailPhotoAvailability,
      ...videoRest,
    }
  }
}
