import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { DistributionBucketOperatorFieldFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetDistributionBucketsWithBagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetDistributionBucketsWithBagsQuery = {
  __typename?: 'Query'
  distributionBuckets: Array<{
    __typename?: 'DistributionBucket'
    id: string
    bags: Array<{ __typename?: 'DistributionBucketBag'; bag: { __typename?: 'StorageBag'; id: string } }>
    operators: Array<{
      __typename?: 'DistributionBucketOperator'
      id: string
      status: Types.DistributionBucketOperatorStatus
      metadata?: {
        __typename?: 'DistributionBucketOperatorMetadata'
        nodeEndpoint?: string | null
        nodeLocation?: {
          __typename?: 'NodeLocationMetadata'
          coordinates?: { __typename?: 'GeoCoordinates'; latitude: number; longitude: number } | null
        } | null
      } | null
    }>
  }>
}

export type GetStorageBucketsWithBagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetStorageBucketsWithBagsQuery = {
  __typename?: 'Query'
  storageBuckets: Array<{
    __typename?: 'StorageBucket'
    id: string
    operatorMetadata?: { __typename?: 'StorageBucketOperatorMetadata'; nodeEndpoint?: string | null } | null
    bags: Array<{ __typename?: 'StorageBucketBag'; bag: { __typename?: 'StorageBag'; id: string } }>
  }>
}

export type GetBasicDistributionBucketsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetBasicDistributionBucketsQuery = {
  __typename?: 'Query'
  distributionBuckets: Array<{
    __typename?: 'DistributionBucket'
    id: string
    bucketIndex: number
    family: { __typename?: 'DistributionBucketFamily'; id: string }
  }>
}

export type GetBasicStorageBucketsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetBasicStorageBucketsQuery = {
  __typename?: 'Query'
  storageBuckets: Array<{ __typename?: 'StorageBucket'; id: string }>
}

export const GetDistributionBucketsWithBagsDocument = gql`
  query GetDistributionBucketsWithBags {
    distributionBuckets(limit: 500, where: { distributing_eq: true }) {
      id
      bags {
        bag {
          id
        }
      }
      operators {
        ...DistributionBucketOperatorField
      }
    }
  }
  ${DistributionBucketOperatorFieldFragmentDoc}
`

/**
 * __useGetDistributionBucketsWithBagsQuery__
 *
 * To run a query within a React component, call `useGetDistributionBucketsWithBagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDistributionBucketsWithBagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDistributionBucketsWithBagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDistributionBucketsWithBagsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDistributionBucketsWithBagsQuery,
    GetDistributionBucketsWithBagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDistributionBucketsWithBagsQuery, GetDistributionBucketsWithBagsQueryVariables>(
    GetDistributionBucketsWithBagsDocument,
    options
  )
}
export function useGetDistributionBucketsWithBagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDistributionBucketsWithBagsQuery,
    GetDistributionBucketsWithBagsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDistributionBucketsWithBagsQuery, GetDistributionBucketsWithBagsQueryVariables>(
    GetDistributionBucketsWithBagsDocument,
    options
  )
}
export type GetDistributionBucketsWithBagsQueryHookResult = ReturnType<typeof useGetDistributionBucketsWithBagsQuery>
export type GetDistributionBucketsWithBagsLazyQueryHookResult = ReturnType<
  typeof useGetDistributionBucketsWithBagsLazyQuery
>
export type GetDistributionBucketsWithBagsQueryResult = Apollo.QueryResult<
  GetDistributionBucketsWithBagsQuery,
  GetDistributionBucketsWithBagsQueryVariables
>
export const GetStorageBucketsWithBagsDocument = gql`
  query GetStorageBucketsWithBags {
    storageBuckets(
      limit: 500
      where: {
        operatorStatus: { isTypeOf_eq: "StorageBucketOperatorStatusActive" }
        operatorMetadata: { nodeEndpoint_contains: "http" }
      }
    ) {
      id
      operatorMetadata {
        nodeEndpoint
      }
      bags {
        bag {
          id
        }
      }
    }
  }
`

/**
 * __useGetStorageBucketsWithBagsQuery__
 *
 * To run a query within a React component, call `useGetStorageBucketsWithBagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStorageBucketsWithBagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStorageBucketsWithBagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStorageBucketsWithBagsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetStorageBucketsWithBagsQuery, GetStorageBucketsWithBagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetStorageBucketsWithBagsQuery, GetStorageBucketsWithBagsQueryVariables>(
    GetStorageBucketsWithBagsDocument,
    options
  )
}
export function useGetStorageBucketsWithBagsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStorageBucketsWithBagsQuery, GetStorageBucketsWithBagsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetStorageBucketsWithBagsQuery, GetStorageBucketsWithBagsQueryVariables>(
    GetStorageBucketsWithBagsDocument,
    options
  )
}
export type GetStorageBucketsWithBagsQueryHookResult = ReturnType<typeof useGetStorageBucketsWithBagsQuery>
export type GetStorageBucketsWithBagsLazyQueryHookResult = ReturnType<typeof useGetStorageBucketsWithBagsLazyQuery>
export type GetStorageBucketsWithBagsQueryResult = Apollo.QueryResult<
  GetStorageBucketsWithBagsQuery,
  GetStorageBucketsWithBagsQueryVariables
>
export const GetBasicDistributionBucketsDocument = gql`
  query GetBasicDistributionBuckets {
    distributionBuckets(limit: 500, where: { acceptingNewBags_eq: true }) {
      id
      bucketIndex
      family {
        id
      }
    }
  }
`

/**
 * __useGetBasicDistributionBucketsQuery__
 *
 * To run a query within a React component, call `useGetBasicDistributionBucketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicDistributionBucketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicDistributionBucketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBasicDistributionBucketsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicDistributionBucketsQuery, GetBasicDistributionBucketsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicDistributionBucketsQuery, GetBasicDistributionBucketsQueryVariables>(
    GetBasicDistributionBucketsDocument,
    options
  )
}
export function useGetBasicDistributionBucketsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicDistributionBucketsQuery, GetBasicDistributionBucketsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicDistributionBucketsQuery, GetBasicDistributionBucketsQueryVariables>(
    GetBasicDistributionBucketsDocument,
    options
  )
}
export type GetBasicDistributionBucketsQueryHookResult = ReturnType<typeof useGetBasicDistributionBucketsQuery>
export type GetBasicDistributionBucketsLazyQueryHookResult = ReturnType<typeof useGetBasicDistributionBucketsLazyQuery>
export type GetBasicDistributionBucketsQueryResult = Apollo.QueryResult<
  GetBasicDistributionBucketsQuery,
  GetBasicDistributionBucketsQueryVariables
>
export const GetBasicStorageBucketsDocument = gql`
  query GetBasicStorageBuckets {
    storageBuckets(limit: 500, where: { acceptingNewBags_eq: true }) {
      id
    }
  }
`

/**
 * __useGetBasicStorageBucketsQuery__
 *
 * To run a query within a React component, call `useGetBasicStorageBucketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicStorageBucketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicStorageBucketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBasicStorageBucketsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicStorageBucketsQuery, GetBasicStorageBucketsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicStorageBucketsQuery, GetBasicStorageBucketsQueryVariables>(
    GetBasicStorageBucketsDocument,
    options
  )
}
export function useGetBasicStorageBucketsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicStorageBucketsQuery, GetBasicStorageBucketsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicStorageBucketsQuery, GetBasicStorageBucketsQueryVariables>(
    GetBasicStorageBucketsDocument,
    options
  )
}
export type GetBasicStorageBucketsQueryHookResult = ReturnType<typeof useGetBasicStorageBucketsQuery>
export type GetBasicStorageBucketsLazyQueryHookResult = ReturnType<typeof useGetBasicStorageBucketsLazyQuery>
export type GetBasicStorageBucketsQueryResult = Apollo.QueryResult<
  GetBasicStorageBucketsQuery,
  GetBasicStorageBucketsQueryVariables
>
