import { ChannelWhereInput, InputMaybe, VideoWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { atlasConfig } from '@/config/config'

import { allUniqueVideoCategories } from './categories'

type ContentFilter = string[]

export const filteredVideoIds: ContentFilter = atlasConfig.content.blockedVideoIds
export const filteredChannelIds: ContentFilter = atlasConfig.content.blockedChannelIds

export const createChannelWhereObjectWithFilters = (
  channelWhereInput?: ChannelWhereInput | null
): ChannelWhereInput => {
  return {
    ...channelWhereInput,

    // filter by channel ids
    ...(filteredChannelIds.length ? { id_not_in: filteredChannelIds } : {}),
  }
}

export const createVideoWhereObjectWithFilters = (
  videoWhereInput?: VideoWhereInput | InputMaybe<VideoWhereInput>
): VideoWhereInput => {
  return {
    ...videoWhereInput,

    // filter by video ids
    ...(filteredVideoIds.length ? { id_not_in: filteredVideoIds } : {}),

    // filter by channel ids
    channel: createChannelWhereObjectWithFilters(videoWhereInput?.channel),

    // filter by category
    ...(!atlasConfig.content.showAllContent
      ? { category: { ...videoWhereInput?.category, id_in: allUniqueVideoCategories } }
      : { category: videoWhereInput?.category }),
  }
}

export const publicChannelFilter: ChannelWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
}

export const cancelledVideoFilter: VideoWhereInput = {
  isCensored_eq: undefined,
  isPublic_eq: undefined,
  media: undefined,
  thumbnailPhoto: undefined,
  category: undefined,
  id_not_in: undefined,
  channel: {
    id_not_in: undefined,
  },
}

export const publicVideoFilter: VideoWhereInput = {
  isPublic_eq: true,
  isCensored_eq: false,
  media: {
    isAccepted_eq: true,
  },
  thumbnailPhoto: {
    isAccepted_eq: true,
  },
  channel: {
    isPublic_eq: true,
  },
}
