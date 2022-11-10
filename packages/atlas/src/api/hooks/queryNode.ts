import { SubscriptionHookOptions } from '@apollo/client'

import {
  GetQueryNodeStateSubscription,
  GetQueryNodeStateSubscriptionVariables,
  useGetQueryNodeStateSubscription,
} from '@/api/queries/__generated__/queryNode.generated'

export const useQueryNodeStateSubscription = (
  opts?: SubscriptionHookOptions<GetQueryNodeStateSubscription, GetQueryNodeStateSubscriptionVariables>
) => {
  const { data, ...rest } = useGetQueryNodeStateSubscription(opts)
  return {
    queryNodeState: data?.stateSubscription,
    ...rest,
  }
}
