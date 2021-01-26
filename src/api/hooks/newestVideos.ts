import { useQuery } from '@apollo/client'
import { GET_NEWEST_VIDEOS } from '@/api/queries'
import { GetNewestVideos, GetNewestVideosVariables } from '@/api/queries/__generated__/GetNewestVideos'

const NEWEST_VIDEOS_COUNT = 8

const useNewestVideos = () => {
  const { loading, data, error, refetch } = useQuery<GetNewestVideos, GetNewestVideosVariables>(GET_NEWEST_VIDEOS, {
    variables: { first: NEWEST_VIDEOS_COUNT },
    notifyOnNetworkStatusChange: true,
  })

  return {
    loading,
    data: data?.videosConnection.edges.slice(0, NEWEST_VIDEOS_COUNT).map((e) => e.node),
    error,
    newestVideosCount: NEWEST_VIDEOS_COUNT,
    refetch,
  }
}

export default useNewestVideos
