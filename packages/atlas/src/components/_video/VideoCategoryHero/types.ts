import { FullVideoFieldsFragment } from '@/api/queries'

export type VideoHeroFeaturedVideo = {
  video: FullVideoFieldsFragment
  videoCutUrl: string
  thumbnailPhotoUrl?: string
  isLoadingThumbnail?: boolean
  progress?: number
}
