import { SubscriptionHookOptions } from '@apollo/client'

import {
  GetQueryNodeStateSubscription,
  GetQueryNodeStateSubscriptionVariables,
  useGetQueryNodeStateSubscription,
} from '@/api/queries/__generated__/queryNode.generated'

type QueryNodeStateOpts = SubscriptionHookOptions<GetQueryNodeStateSubscription, GetQueryNodeStateSubscriptionVariables>
export const useQueryNodeStateSubscription = (opts?: QueryNodeStateOpts) => {
  const { data, ...rest } = useGetQueryNodeStateSubscription(opts)
  return {
    queryNodeState: data?.stateSubscription,
    ...rest,
  }
}
