import { VideoWhereInput } from '@/api/queries'

export const videoFilter: VideoWhereInput = {
  isCensored_eq: false,
  isPublic_eq: true,
  thumbnailPhoto: {
    isAccepted_eq: true,
  },
  media: {
    isAccepted_eq: true,
  },
  NOT: [{ id_in: [] }, { thumbnailPhoto: { id_in: [] } }, { media: { id_in: [] } }],
}
