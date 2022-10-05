import { QueryHookOptions } from '@apollo/client'

import {
  GetVideoCategoriesQuery,
  GetVideoCategoriesQueryVariables,
  useGetVideoCategoriesQuery,
} from '@/api/queries/__generated__/categories.generated'

export const useQnCategories = (
  variables?: GetVideoCategoriesQueryVariables,
  opts?: QueryHookOptions<GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables>
) => {
  const { data, ...rest } = useGetVideoCategoriesQuery({ ...opts, variables })
  return {
    categories: data?.videoCategories,
    ...rest,
  }
}
