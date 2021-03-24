import { QueryHookOptions } from '@apollo/client'
import {
  BasicMembershipFieldsFragment,
  GetMembershipQuery,
  useGetMembershipQuery,
  useGetMembershipsQuery,
  GetMembershipQueryVariables,
  GetMembershipsQueryVariables,
} from '@/api/queries'

type MembershipOpts = QueryHookOptions<GetMembershipQuery>

export const useMembership = (variables: GetMembershipQueryVariables, opts?: MembershipOpts) => {
  const { data, ...rest } = useGetMembershipQuery({
    ...opts,
    variables,
  })
  return {
    membership: data?.membership as BasicMembershipFieldsFragment | undefined,
    ...rest,
  }
}

export const useMemberships = (variables: GetMembershipsQueryVariables, opts?: MembershipOpts) => {
  const { data, ...rest } = useGetMembershipsQuery({
    ...opts,
    variables,
  })
  return {
    memberships: data?.memberships as BasicMembershipFieldsFragment[] | undefined,
    ...rest,
  }
}
