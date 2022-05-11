import { QueryHookOptions } from '@apollo/client'

import { GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables, useGetVideoCategoriesQuery } from '@/api/queries'

export const useCategories = (
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
