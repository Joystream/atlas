import { QueryHookOptions } from '@apollo/client'

import { GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables, useGetVideoCategoriesQuery } from '@/api/queries'

export const useCategories = (
  variables?: GetVideoCategoriesQueryVariables,
  opts?: QueryHookOptions<GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables>
) => {
  const { data, ...rest } = useGetVideoCategoriesQuery({ ...opts, variables })
  return {
    categories: data?.videoCategories,
    ...rest,
  }
}
