import { useQuery } from '@apollo/client'
import { GET_CATEGORIES } from '@/api/queries'
import { GetCategories } from '@/api/queries/__generated__/GetCategories'

const useCategories = () => {
  const { loading, data, error } = useQuery<GetCategories>(GET_CATEGORIES)
  return {
    loading,
    data: data?.categories,
    error,
  }
}

export default useCategories
