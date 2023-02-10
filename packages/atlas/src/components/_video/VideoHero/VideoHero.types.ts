import { ReactNode } from 'react'

import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

export type VideoHeroFeaturedVideo = {
  video: FullVideoFieldsFragment
  videoCutUrl: string
  thumbnailPhotoUrl?: string
  isLoadingThumbnail?: boolean
  progress?: number
}

export type VideoHeroCategory = {
  title?: string
  icon?: ReactNode
  color?: string
  coverImgUrl?: string
}
