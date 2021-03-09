import { GetFeaturedVideosQuery, VideoFieldsFragment } from '@/api/queries'

export const createFeaturedVideosAccessor = (
  videos: VideoFieldsFragment[],
  featuredIndexes: number[]
) => (): GetFeaturedVideosQuery['featuredVideos'] => {
  const featuredVideos = videos.filter((_, idx) => featuredIndexes.includes(idx))
  return featuredVideos.map((v) => ({
    video: v,
  }))
}
