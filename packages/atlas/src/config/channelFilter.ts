import { ChannelWhereInput } from '@/api/queries'

type ChannelFilter = string[]

const channelFilterIds: ChannelFilter = []
const avatarPhotoFilterIds: ChannelFilter = []
const coverPhotoFilterIds: ChannelFilter = []

const NOTfilter = []
if (channelFilterIds.length) {
  NOTfilter.push({ id_in: channelFilterIds })
}
if (avatarPhotoFilterIds) {
  NOTfilter.push({ avatarPhoto: { id_in: avatarPhotoFilterIds } })
}
if (coverPhotoFilterIds) {
  NOTfilter.push({ coverPhoto: { id_in: coverPhotoFilterIds } })
}

export const channelFilter: ChannelWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  ...(NOTfilter.length ? { NOT: NOTfilter } : {}),
}
