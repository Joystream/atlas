import {
  useGetCategoriesQuery,
  GetCategoriesQueryVariables,
  GetCategoriesQuery,
} from '@/api/queries/__generated__/categories.generated'
import { QueryHookOptions } from '@apollo/client'

type Opts = QueryHookOptions<GetCategoriesQuery>
const useCategories = (variables?: GetCategoriesQueryVariables, opts?: Opts) => {
  const { data, ...rest } = useGetCategoriesQuery({ ...opts, variables })
  return {
    categories: data?.categories,
    ...rest,
  }
}

export default useCategories
