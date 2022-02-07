import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {}
export type GetQueryNodeStateSubscriptionVariables = Types.Exact<{ [key: string]: never }>

export type GetQueryNodeStateSubscription = {
  __typename?: 'Subscription'
  stateSubscription: {
    __typename?: 'ProcessorState'
    chainHead: number
    indexerHead: number
    lastCompleteBlock: number
    lastProcessedEvent: string
  }
}

export const GetQueryNodeStateDocument = gql`
  subscription GetQueryNodeState {
    stateSubscription {
      chainHead
      indexerHead
      lastCompleteBlock
      lastProcessedEvent
    }
  }
`

/**
 * __useGetQueryNodeStateSubscription__
 *
 * To run a query within a React component, call `useGetQueryNodeStateSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetQueryNodeStateSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQueryNodeStateSubscription({
 *   variables: {
 *   },
 * });
 */
export function useGetQueryNodeStateSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<GetQueryNodeStateSubscription, GetQueryNodeStateSubscriptionVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<GetQueryNodeStateSubscription, GetQueryNodeStateSubscriptionVariables>(
    GetQueryNodeStateDocument,
    options
  )
}
export type GetQueryNodeStateSubscriptionHookResult = ReturnType<typeof useGetQueryNodeStateSubscription>
export type GetQueryNodeStateSubscriptionResult = Apollo.SubscriptionResult<GetQueryNodeStateSubscription>
