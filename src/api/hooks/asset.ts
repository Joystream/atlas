import { useGetChannelAssetAvailabilityLazyQuery, useGetVideoAssetAvailabilityLazyQuery } from '../queries'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar'

export const useAssetsAvailability = (assetType?: AssetType) => {
  const isChannelAsset = assetType === 'cover' || assetType === 'avatar'
  const [getChannelAssetAvailability, channelRest] = useGetChannelAssetAvailabilityLazyQuery({
    fetchPolicy: 'network-only',
  })
  const [getVideoAssetAvailability, videoRest] = useGetVideoAssetAvailabilityLazyQuery({ fetchPolicy: 'network-only' })

  if (isChannelAsset) {
    return {
      getAssetAvailability: (id: string) =>
        getChannelAssetAvailability({
          variables: {
            where: {
              id,
            },
          },
        }),
      assetAvailability:
        assetType === 'cover'
          ? channelRest.data?.channelByUniqueInput?.coverPhotoAvailability
          : channelRest.data?.channelByUniqueInput?.avatarPhotoAvailability,
      ...channelRest,
    }
  } else {
    return {
      getAssetAvailability: (id: string) =>
        getVideoAssetAvailability({
          variables: {
            where: {
              id,
            },
          },
        }),
      assetAvailability:
        assetType === 'video'
          ? videoRest.data?.videoByUniqueInput?.mediaAvailability
          : videoRest.data?.videoByUniqueInput?.thumbnailPhotoAvailability,
      ...videoRest,
    }
  }
}
