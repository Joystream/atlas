import {
  GetFeaturedVideosQueryVariables,
  useGetFeaturedVideosQuery,
} from '@/api/queries/__generated__/videos.generated'
import { QueryHookOptions } from '@apollo/client'
import { GetFeaturedVideosQuery } from '../queries/__generated__/videos.generated'

type Opts = QueryHookOptions<GetFeaturedVideosQuery>
const useFeaturedVideos = (variables?: GetFeaturedVideosQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useGetFeaturedVideosQuery({ ...opts, variables })
  return {
    featuredVideos: data?.featuredVideos,
    ...rest,
  }
}

export default useFeaturedVideos
