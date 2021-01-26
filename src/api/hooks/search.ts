import { useQuery } from '@apollo/client'
import { SEARCH } from '@/api/queries'
import { Search, SearchVariables } from '@/api/queries/__generated__/Search'

const useSearch = (search: string) => {
  const { data, loading, error } = useQuery<Search, SearchVariables>(SEARCH, { variables: { text: search } })

  return {
    loading,
    data: data?.search,
    error,
  }
}

export default useSearch
