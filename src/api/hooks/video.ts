import {
  useGetVideoQuery,
  useAddVideoViewMutation,
  GetVideoQuery,
  AddVideoViewMutation,
} from '@/api/queries/__generated__/videos.generated'
import { QueryHookOptions, MutationHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<GetVideoQuery>
const useVideo = (id: string, opts?: Opts) => {
  const { data, ...queryRest } = useGetVideoQuery({
    ...opts,
    variables: { id },
  })

  return {
    video: data?.video,
    ...queryRest,
  }
}

type AddVideoViewOpts = Omit<MutationHookOptions<AddVideoViewMutation>, 'variables'>
export const useAddVideoView = (opts?: AddVideoViewOpts) => {
  const [addVideoView, rest] = useAddVideoViewMutation(opts)
  return {
    addVideoView,
    ...rest,
  }
}

export default useVideo
