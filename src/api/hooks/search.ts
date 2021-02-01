import { useSearchQuery, SearchQueryVariables, SearchQuery } from '@/api/queries/search'
import { QueryHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<SearchQuery>
const useSearch = (variables: SearchQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useSearchQuery({ ...opts, variables })

  return {
    data: data?.search,
    ...rest,
  }
}

export default useSearch
