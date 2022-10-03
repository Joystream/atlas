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
  const totalVideosCount = data?.videoCategories.reduce((acc, cur) => acc + cur.activeVideosCounter, 0)
  return {
    categories: data?.videoCategories,
    totalVideosCount,
    ...rest,
  }
}
