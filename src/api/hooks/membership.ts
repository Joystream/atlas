import { QueryHookOptions } from '@apollo/client'
import {
  BasicMembershipFieldsFragment,
  GetMembershipQuery,
  useGetMembershipQuery,
  GetMembershipQueryVariables,
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
