import { VideoWhereInput } from '@/api/queries'

import { channelFilter } from './channelFilter'

const channelIdFilter = channelFilter.NOT?.find((item) => item.id_in)

type VideoFilter = string[]

const filteredVideoIds: VideoFilter = []
const filteredThumbnailPhotoIds: VideoFilter = []
const filteredMediaIds: VideoFilter = []

const NOTfilter = []
if (filteredVideoIds.length) {
  NOTfilter.push({ id_in: filteredVideoIds })
}
if (filteredThumbnailPhotoIds.length) {
  NOTfilter.push({ thumbnailPhoto: { id_in: filteredThumbnailPhotoIds } })
}
if (filteredMediaIds.length) {
  NOTfilter.push({ media: { id_in: filteredMediaIds } })
}
if (channelIdFilter) {
  NOTfilter.push({ channel: { id_in: channelIdFilter.id_in } })
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
  ...(NOTfilter.length ? { NOT: NOTfilter } : {}),
}

export const cancelledVideoFilter: VideoWhereInput = {
  isCensored_eq: undefined,
  isPublic_eq: undefined,
  media: undefined,
  thumbnailPhoto: undefined,
  NOT: undefined,
}
