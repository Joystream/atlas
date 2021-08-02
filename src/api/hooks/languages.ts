import { QueryHookOptions } from '@apollo/client'

import { GetLanguagesQuery, GetLanguagesQueryVariables, useGetLanguagesQuery } from '@/api/queries'

type LanguagesOpts = QueryHookOptions<GetLanguagesQuery>
export const useLanguages = (variables?: GetLanguagesQueryVariables, opts?: LanguagesOpts) => {
  const { data, ...rest } = useGetLanguagesQuery({ ...opts, variables })

  return {
    languages: data?.languages,
    ...rest,
  }
}
