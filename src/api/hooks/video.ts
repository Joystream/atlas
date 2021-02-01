import {
  useGetVideoQuery,
  useAddVideoViewMutation,
  GetVideoQuery,
  AddVideoViewMutation,
  GetVideosQuery,
  GetVideosQueryVariables,
  useGetVideosQuery,
} from '@/api/queries'
import { QueryHookOptions, MutationHookOptions } from '@apollo/client'

type VideoOpts = QueryHookOptions<GetVideoQuery>
const useVideo = (id: string, opts?: VideoOpts) => {
  const { data, ...queryRest } = useGetVideoQuery({
    ...opts,
    variables: { id },
  })

  return {
    video: data?.video,
    ...queryRest,
  }
}

type VideosOpts = QueryHookOptions<GetVideosQuery>
export const useVideos = (variables?: GetVideosQueryVariables, opts?: VideosOpts) => {
  const { data, ...rest } = useGetVideosQuery({ ...opts, variables })
  return {
    videos: data?.videos,
    ...rest,
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
