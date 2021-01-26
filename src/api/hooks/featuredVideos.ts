import { useQuery } from '@apollo/client'
import { GET_FEATURED_VIDEOS } from '@/api/queries'
import { GetFeaturedVideos } from '@/api/queries/__generated__/GetFeaturedVideos'

const useFeaturedVideos = () => {
  const { loading, data, error, refetch } = useQuery<GetFeaturedVideos>(GET_FEATURED_VIDEOS, {
    notifyOnNetworkStatusChange: true,
  })

  return {
    loading,
    data: data?.featuredVideos,
    error,
    refetch,
  }
}

export default useFeaturedVideos
