import { ReactNode } from 'react'

import { BasicFeaturedVideoFragment } from '@/api/queries/__generated__/fragments.generated'

export type VideoHeroFeaturedVideo = {
  video: BasicFeaturedVideoFragment
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
