import { useGetVideoQuery, useAddVideoViewMutation, GetVideoQuery } from '@/api/queries/__generated__/videos.generated'
import { QueryHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<GetVideoQuery>
const useVideo = (id: string, opts?: Opts) => {
  const { data, ...queryRest } = useGetVideoQuery({
    ...opts,
    variables: { id },
  })
  const [addVideoView, addVideoViewFields] = useAddVideoViewMutation()

  return {
    video: data?.video,
    ...queryRest,
    addVideoView,
    addVideoViewFields,
  }
}

export default useVideo
