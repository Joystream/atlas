import { QueryHookOptions } from '@apollo/client'
import {
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  useGetVideosConnectionQuery,
} from '@/api/queries/videos'

type Opts = QueryHookOptions<GetVideosConnectionQuery>
const useVideosConnection = (variables?: GetVideosConnectionQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useGetVideosConnectionQuery({ ...opts, variables })

  return {
    videosConnection: data?.videosConnection,
    ...rest,
  }
}

export default useVideosConnection
