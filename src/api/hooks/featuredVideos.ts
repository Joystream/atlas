import { GetFeaturedVideosQuery, GetFeaturedVideosQueryVariables, useGetFeaturedVideosQuery } from '@/api/queries'
import { QueryHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<GetFeaturedVideosQuery>
const useFeaturedVideos = (variables?: GetFeaturedVideosQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useGetFeaturedVideosQuery({ ...opts, variables })
  return {
    featuredVideos: data?.featuredVideos,
    ...rest,
  }
}

export default useFeaturedVideos
