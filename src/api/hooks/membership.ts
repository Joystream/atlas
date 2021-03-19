import { QueryHookOptions } from '@apollo/client'
import { GetMembershipQuery, useGetMembershipQuery } from '@/api/queries'

type MembershipOpts = QueryHookOptions<GetMembershipQuery>

const useMembership = (id: string, opts?: MembershipOpts) => {
  const { data, ...rest } = useGetMembershipQuery({
    ...opts,
    variables: { where: { id } },
  })
  return {
    membership: data?.membership,
    ...rest,
  }
}

export default useMembership
