import { QueryHookOptions } from '@apollo/client'

import {
  GetExtendedVideoCategoriesQuery,
  GetExtendedVideoCategoriesQueryVariables,
  useGetExtendedVideoCategoriesQuery,
} from '@/api/queries/__generated__/categories.generated'

export const useQnCategories = (
  variables?: GetExtendedVideoCategoriesQueryVariables,
  opts?: QueryHookOptions<GetExtendedVideoCategoriesQuery, GetExtendedVideoCategoriesQueryVariables>
) => {
  const { data, ...rest } = useGetExtendedVideoCategoriesQuery({ ...opts, variables })
  return {
    categories: data?.extendedVideoCategories,
    ...rest,
  }
}
