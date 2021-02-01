import { QueryHookOptions } from '@apollo/client'
import {
  useGetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  GetVideosConnectionQuery,
} from '@/api/queries/__generated__/videos.generated'

type Opts = QueryHookOptions<GetVideosConnectionQuery>
const useVideosConnection = (variables?: GetVideosConnectionQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useGetVideosConnectionQuery({ ...opts, variables })

  return {
    videosConnection: data?.videosConnection,
    ...rest,
  }
}

export default useVideosConnection
