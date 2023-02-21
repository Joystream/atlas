import { ChannelWhereInput, OwnedNftWhereInput, VideoWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { atlasConfig } from '@/config/config'

import { allUniqueVideoCategories } from './categories'

type ContentFilter = string[]

const filteredAssetsFilter: ContentFilter = atlasConfig.content.blockedDataObjectIds
const filteredVideoIds: ContentFilter = atlasConfig.content.blockedVideoIds
const filteredChannelIds: ContentFilter = atlasConfig.content.blockedChannelIds

const NOTvideoFilter: Pick<VideoWhereInput, 'id_not_in' | 'channel' | 'thumbnailPhoto' | 'media'> = {
  ...(filteredVideoIds ? { id_not_in: filteredVideoIds } : {}),
  ...(filteredChannelIds ? { channel: { id_not_in: filteredChannelIds } } : {}),
  ...(filteredAssetsFilter
    ? {
        thumbnailPhoto: {
          id_not_in: filteredAssetsFilter,
        },
        media: {
          id_not_in: filteredAssetsFilter,
        },
      }
    : {}),
}
const NOTchannelFilters: Pick<ChannelWhereInput, 'id_not_in' | 'avatarPhoto' | 'coverPhoto'> = {
  ...(filteredChannelIds ? { id_not_in: filteredChannelIds } : {}),
  ...(filteredAssetsFilter
    ? {
        avatarPhoto: {
          id_not_in: filteredAssetsFilter,
        },
        coverPhoto: {
          id_not_in: filteredAssetsFilter,
        },
      }
    : {}),
}
const NOTnftFilters: Pick<OwnedNftWhereInput, 'video'> = {
  ...(Object.keys(NOTvideoFilter).length || Object.keys(NOTchannelFilters).length
    ? {
        video: {
          ...NOTvideoFilter,
          channel: {
            ...NOTvideoFilter.channel,
            ...NOTchannelFilters,
          },
        },
      }
    : {}),
}

export const channelFilter: ChannelWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  ...NOTchannelFilters,
}

export const nftFilter: OwnedNftWhereInput = {
  ...(!atlasConfig.content.showAllContent
    ? {
        video: {
          ...NOTnftFilters.video,
          category: {
            id_in: allUniqueVideoCategories,
          },
        },
      }
    : {
        ...(NOTnftFilters ? { ...NOTnftFilters } : {}),
      }),
}

export const videoFilter: VideoWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  ...(NOTvideoFilter.id_not_in ? { id_not_in: NOTvideoFilter.id_not_in } : {}),
  thumbnailPhoto: {
    isAccepted_eq: true,
    ...(NOTvideoFilter.thumbnailPhoto?.id_not_in ? { id_not_in: NOTvideoFilter.thumbnailPhoto?.id_not_in } : {}),
  },
  media: {
    isAccepted_eq: true,
    ...(NOTvideoFilter.media?.id_not_in ? { id_not_in: NOTvideoFilter.media?.id_not_in } : {}),
  },
  ...(NOTvideoFilter.channel ? { channel: NOTvideoFilter.channel } : {}),

  ...(!atlasConfig.content.showAllContent ? { category: { id_in: allUniqueVideoCategories } } : {}),
}

export const cancelledVideoFilter: VideoWhereInput = {
  isCensored_eq: undefined,
  isPublic_eq: undefined,
  media: undefined,
  thumbnailPhoto: undefined,
  category: undefined,
}
