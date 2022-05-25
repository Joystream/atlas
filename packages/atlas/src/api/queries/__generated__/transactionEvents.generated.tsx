import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { MetaprotocolTransactionStatusEventFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetMetaprotocolTransactionStatusEventsQueryVariables = Types.Exact<{
  transactionHash: Types.Scalars['String']
}>

export type GetMetaprotocolTransactionStatusEventsQuery = {
  __typename?: 'Query'
  metaprotocolTransactionStatusEvents: Array<{
    __typename?: 'MetaprotocolTransactionStatusEvent'
    inExtrinsic?: string | null
    inBlock: number
    status:
      | { __typename: 'MetaprotocolTransactionErrored'; message: string }
      | { __typename: 'MetaprotocolTransactionPending' }
      | { __typename: 'MetaprotocolTransactionSuccessful' }
  }>
}

export const GetMetaprotocolTransactionStatusEventsDocument = gql`
  query GetMetaprotocolTransactionStatusEvents($transactionHash: String!) {
    metaprotocolTransactionStatusEvents(where: { inExtrinsic_eq: $transactionHash }) {
      ...MetaprotocolTransactionStatusEventFields
    }
  }
  ${MetaprotocolTransactionStatusEventFieldsFragmentDoc}
`

/**
 * __useGetMetaprotocolTransactionStatusEventsQuery__
 *
 * To run a query within a React component, call `useGetMetaprotocolTransactionStatusEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMetaprotocolTransactionStatusEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMetaprotocolTransactionStatusEventsQuery({
 *   variables: {
 *      transactionHash: // value for 'transactionHash'
 *   },
 * });
 */
export function useGetMetaprotocolTransactionStatusEventsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >(GetMetaprotocolTransactionStatusEventsDocument, options)
}
export function useGetMetaprotocolTransactionStatusEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >(GetMetaprotocolTransactionStatusEventsDocument, options)
}
export type GetMetaprotocolTransactionStatusEventsQueryHookResult = ReturnType<
  typeof useGetMetaprotocolTransactionStatusEventsQuery
>
export type GetMetaprotocolTransactionStatusEventsLazyQueryHookResult = ReturnType<
  typeof useGetMetaprotocolTransactionStatusEventsLazyQuery
>
export type GetMetaprotocolTransactionStatusEventsQueryResult = Apollo.QueryResult<
  GetMetaprotocolTransactionStatusEventsQuery,
  GetMetaprotocolTransactionStatusEventsQueryVariables
>
