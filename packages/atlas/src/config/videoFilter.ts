import { VideoWhereInput } from '@/api/queries'

import { channelFilter } from './channelFilter'

const channelIdFilter = channelFilter.NOT?.find((item) => item.id_in)

export const videoFilter: VideoWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  thumbnailPhoto: {
    isAccepted_eq: true,
  },
  media: {
    isAccepted_eq: true,
  },
  NOT: [
    { id_in: [] },
    { thumbnailPhoto: { id_in: [] } },
    { media: { id_in: [] } },
    { channel: { id_in: channelIdFilter ? channelIdFilter.id_in : [] } },
  ],
}
