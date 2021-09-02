import { QueryHookOptions } from '@apollo/client'

import { SearchQuery, SearchQueryVariables, useSearchQuery } from '@/api/queries'

export const useSearch = (
  variables: SearchQueryVariables,
  opts?: QueryHookOptions<SearchQuery, SearchQueryVariables>
) => {
  const { data, ...rest } = useSearchQuery({ ...opts, variables })

  return {
    data: data?.search,
    ...rest,
  }
}
