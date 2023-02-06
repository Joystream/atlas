import { ChannelWhereInput, OwnedNftWhereInput, VideoWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { atlasConfig } from '@/config/config'

import { allUniqueVideoCategories } from './categories'

type ContentFilter = string[]

const filteredAssetsFilter: ContentFilter = atlasConfig.content.blockedDataObjectIds
const filteredVideoIds: ContentFilter = atlasConfig.content.blockedVideoIds
const filteredChannelIds: ContentFilter = atlasConfig.content.blockedChannelIds

const NOTvideoFilter = []
const NOTchannelFilters = []
const NOTnftFilters = []

if (filteredChannelIds.length) {
  NOTchannelFilters.push({ id_in: filteredChannelIds })
}
if (filteredAssetsFilter.length) {
  NOTchannelFilters.push(
    { avatarPhoto: { id_in: filteredAssetsFilter } },
    { coverPhoto: { id_in: filteredAssetsFilter } }
  )
}

if (filteredVideoIds.length) {
  NOTvideoFilter.push({ id_in: filteredVideoIds })
}
if (filteredChannelIds.length) {
  NOTvideoFilter.push({ channel: { id_in: filteredChannelIds } })
}
if (filteredAssetsFilter.length) {
  NOTvideoFilter.push({ thumbnailPhoto: { id_in: filteredAssetsFilter } }, { media: { id_in: filteredAssetsFilter } })
}
if (filteredChannelIds.length) {
  NOTnftFilters.push({
    creatorChannel: {
      id_in: filteredChannelIds,
    },
  })
}
if (filteredVideoIds.length) {
  NOTnftFilters.push({
    video: {
      id_in: filteredVideoIds,
    },
  })
}

export const channelFilter: ChannelWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  ...(NOTchannelFilters.length ? { NOT: NOTchannelFilters } : {}),
}

export const nftFilter: OwnedNftWhereInput = {
  ...(!atlasConfig.content.showAllContent
    ? {
        video: {
          category: {
            id_in: allUniqueVideoCategories,
          },
        },
      }
    : {}),
}

export const videoFilter: VideoWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  thumbnailPhoto: {
    isAccepted_eq: true,
  },
  media: {
    isAccepted_eq: true,
  },
  ...(!atlasConfig.content.showAllContent ? { category: { id_in: allUniqueVideoCategories } } : {}),
  ...(NOTvideoFilter.length ? { NOT: NOTvideoFilter } : {}),
}
export const cancelledVideoFilter: VideoWhereInput = {
  isCensored_eq: undefined,
  isPublic_eq: undefined,
  media: undefined,
  thumbnailPhoto: undefined,
  category: undefined,
}
