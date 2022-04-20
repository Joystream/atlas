import { QueryHookOptions } from '@apollo/client'

import { GetBidsQuery, GetBidsQueryVariables, useGetBidsQuery } from '../queries/__generated__/bids.generated'

export const useBids = (
  variables: GetBidsQueryVariables,
  opts?: QueryHookOptions<GetBidsQuery, GetBidsQueryVariables>
) => {
  const { data, ...rest } = useGetBidsQuery({
    ...opts,
    variables,
  })
  return {
    bids: data?.bids,
    ...rest,
  }
}
