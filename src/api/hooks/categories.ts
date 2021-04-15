import { useGetVideoCategoriesQuery, GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables } from '@/api/queries'
import { QueryHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<GetVideoCategoriesQuery>
const useCategories = (variables?: GetVideoCategoriesQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useGetVideoCategoriesQuery({ ...opts, variables })
  return {
    categories: data?.videoCategories,
    ...rest,
  }
}

export default useCategories
