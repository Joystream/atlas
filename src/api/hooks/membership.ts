import { QueryHookOptions } from '@apollo/client'
import {
  GetMembershipQuery,
  useGetMembershipQuery,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
  useGetMembershipsQuery,
} from '@/api/queries'

type MembershipOpts = QueryHookOptions<GetMembershipQuery>

export const useMembership = (id: string, opts?: MembershipOpts) => {
  const { data, ...rest } = useGetMembershipQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    membership: data?.membership,
    ...rest,
  }
}

type MembershipsOpts = QueryHookOptions<GetMembershipsQuery>
export const useMemberships = (variables?: GetMembershipsQueryVariables, opts?: MembershipsOpts) => {
  const { data, ...rest } = useGetMembershipsQuery({ ...opts, variables })
  return {
    memberships: data?.memberships,
    ...rest,
  }
}
