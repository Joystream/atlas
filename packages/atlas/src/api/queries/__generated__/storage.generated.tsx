import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { DistributionBucketOperatorFieldFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetDistributionBucketsWithOperatorsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetDistributionBucketsWithOperatorsQuery = {
  __typename?: 'Query'
  distributionBuckets: Array<{
    __typename?: 'DistributionBucket'
    id: string
    bags: Array<{ __typename?: 'StorageBag'; id: string }>
    operators: Array<{
      __typename?: 'DistributionBucketOperator'
      id: string
      status: Types.DistributionBucketOperatorStatus
      metadata?: { __typename?: 'DistributionBucketOperatorMetadata'; nodeEndpoint?: string | null } | null
    }>
  }>
}

export type GetStorageBucketsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetStorageBucketsQuery = {
  __typename?: 'Query'
  storageBuckets: Array<{
    __typename?: 'StorageBucket'
    id: string
    operatorMetadata?: { __typename?: 'StorageBucketOperatorMetadata'; nodeEndpoint?: string | null } | null
    bags: Array<{ __typename?: 'StorageBag'; id: string }>
  }>
}

export const GetDistributionBucketsWithOperatorsDocument = gql`
  query GetDistributionBucketsWithOperators {
    distributionBuckets(limit: 50, where: { distributing_eq: true }) {
      id
      bags {
        id
      }
      operators {
        ...DistributionBucketOperatorField
      }
    }
  }
  ${DistributionBucketOperatorFieldFragmentDoc}
`

/**
 * __useGetDistributionBucketsWithOperatorsQuery__
 *
 * To run a query within a React component, call `useGetDistributionBucketsWithOperatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDistributionBucketsWithOperatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDistributionBucketsWithOperatorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDistributionBucketsWithOperatorsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDistributionBucketsWithOperatorsQuery,
    GetDistributionBucketsWithOperatorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDistributionBucketsWithOperatorsQuery, GetDistributionBucketsWithOperatorsQueryVariables>(
    GetDistributionBucketsWithOperatorsDocument,
    options
  )
}
export function useGetDistributionBucketsWithOperatorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDistributionBucketsWithOperatorsQuery,
    GetDistributionBucketsWithOperatorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetDistributionBucketsWithOperatorsQuery,
    GetDistributionBucketsWithOperatorsQueryVariables
  >(GetDistributionBucketsWithOperatorsDocument, options)
}
export type GetDistributionBucketsWithOperatorsQueryHookResult = ReturnType<
  typeof useGetDistributionBucketsWithOperatorsQuery
>
export type GetDistributionBucketsWithOperatorsLazyQueryHookResult = ReturnType<
  typeof useGetDistributionBucketsWithOperatorsLazyQuery
>
export type GetDistributionBucketsWithOperatorsQueryResult = Apollo.QueryResult<
  GetDistributionBucketsWithOperatorsQuery,
  GetDistributionBucketsWithOperatorsQueryVariables
>
export const GetStorageBucketsDocument = gql`
  query GetStorageBuckets {
    storageBuckets(
      limit: 50
      where: {
        operatorStatus_json: { isTypeOf_eq: "StorageBucketOperatorStatusActive" }
        operatorMetadata: { nodeEndpoint_contains: "http" }
      }
    ) {
      id
      operatorMetadata {
        nodeEndpoint
      }
      bags {
        id
      }
    }
  }
`

/**
 * __useGetStorageBucketsQuery__
 *
 * To run a query within a React component, call `useGetStorageBucketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStorageBucketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStorageBucketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStorageBucketsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetStorageBucketsQuery, GetStorageBucketsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetStorageBucketsQuery, GetStorageBucketsQueryVariables>(GetStorageBucketsDocument, options)
}
export function useGetStorageBucketsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStorageBucketsQuery, GetStorageBucketsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetStorageBucketsQuery, GetStorageBucketsQueryVariables>(
    GetStorageBucketsDocument,
    options
  )
}
export type GetStorageBucketsQueryHookResult = ReturnType<typeof useGetStorageBucketsQuery>
export type GetStorageBucketsLazyQueryHookResult = ReturnType<typeof useGetStorageBucketsLazyQuery>
export type GetStorageBucketsQueryResult = Apollo.QueryResult<GetStorageBucketsQuery, GetStorageBucketsQueryVariables>
