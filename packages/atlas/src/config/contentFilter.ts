import { ChannelWhereInput, VideoWhereInput } from '@/api/queries/__generated__/baseTypes.generated'

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

export const publicCryptoVideoFilter: VideoWhereInput = {
  isPublic_eq: true,
  isCensored_eq: false,
  // category: {
  //   id_in: atlasConfig.content.categories.find((category) => category.name === 'Crypto')?.videoCategories,
  // },
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
