import { ChannelWhereInput, VideoWhereInput } from '@/api/queries/__generated__/baseTypes.generated'

type ContentFilter = string[]

const filteredAssetsFilter: ContentFilter = []
const filteredVideoIds: ContentFilter = []
const filteredChannelIds: ContentFilter = []

const NOTvideoFilter = []
const NOTchannelFilters = []

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

export const channelFilter: ChannelWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  ...(NOTchannelFilters.length ? { NOT: NOTchannelFilters } : {}),
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
  ...(NOTvideoFilter.length ? { NOT: NOTvideoFilter } : {}),
}
export const cancelledVideoFilter: VideoWhereInput = {
  isCensored_eq: undefined,
  isPublic_eq: undefined,
  media: undefined,
  thumbnailPhoto: undefined,
  NOT: undefined,
}
