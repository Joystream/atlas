import { QueryHookOptions } from '@apollo/client'

import {
  GetMembershipQuery,
  GetMembershipQueryVariables,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
  useGetMembershipQuery,
  useGetMembershipsQuery,
} from '@/api/queries'

export const useMembership = (
  variables: GetMembershipQueryVariables,
  opts?: QueryHookOptions<GetMembershipQuery, GetMembershipQueryVariables>
) => {
  const { data, ...rest } = useGetMembershipQuery({
    ...opts,
    variables,
  })
  return {
    membership: data?.membershipByUniqueInput,
    ...rest,
  }
}

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
