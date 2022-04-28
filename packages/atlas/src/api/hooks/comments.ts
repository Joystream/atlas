import { QueryHookOptions } from '@apollo/client'

import { GetCommentsQuery, GetCommentsQueryVariables, useGetCommentsQuery } from '@/api/queries'

export const useComments = (
  variables?: GetCommentsQueryVariables,
  opts?: QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>
) => {
  const { data, ...rest } = useGetCommentsQuery({ ...opts, variables })

  return {
    comments: data?.comments,
    ...rest,
  }
}
