import { QueryHookOptions } from '@apollo/client'

import { GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables, useGetVideoCategoriesQuery } from '@/api/queries'

type Opts = QueryHookOptions<GetVideoCategoriesQuery>
const useCategories = (variables?: GetVideoCategoriesQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useGetVideoCategoriesQuery({ ...opts, variables })
  return {
    categories: data?.videoCategories,
    ...rest,
  }
}

export default useCategories
