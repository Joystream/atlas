import { useQuery, useMutation } from '@apollo/client'
import { GET_VIDEO, ADD_VIDEO_VIEW } from '@/api/queries'
import { GetVideo, GetVideoVariables } from '@/api/queries/__generated__/GetVideo'
import { AddVideoView, AddVideoViewVariables } from '@/api/queries/__generated__/AddVideoView'

const useVideo = (id: string) => {
  const { loading, data, error } = useQuery<GetVideo, GetVideoVariables>(GET_VIDEO, {
    variables: { id },
  })
  const [addVideoView] = useMutation<AddVideoView, AddVideoViewVariables>(ADD_VIDEO_VIEW)

  return {
    loading,
    data: data?.video,
    error,
    addVideoView,
  }
}

export default useVideo
