import { QueryHookOptions } from '@apollo/client'

import {
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
  useGetMembershipsQuery,
} from '@/api/queries/__generated__/memberships.generated'

export const useMemberships = (
  variables: GetMembershipsQueryVariables,
  opts?: QueryHookOptions<GetMembershipsQuery, GetMembershipsQueryVariables>
) => {
  const { data, ...rest } = useGetMembershipsQuery({
    ...opts,
    variables,
  })
  return {
    memberships: data?.memberships,
    ...rest,
  }
}
