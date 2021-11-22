import { VideoFieldsFragment } from '@/api/queries'

export type VideoHeroFeaturedVideo = {
  video: VideoFieldsFragment
  videoCutUrl: string
  thumbnailPhotoUrl?: string
  progress?: number
}
