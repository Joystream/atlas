import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {} as const
export type GetStorageBucketsWithBagsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetStorageBucketsWithBagsQuery = {
  __typename?: 'Query'
  storageBuckets: Array<{
    __typename?: 'StorageBucket'
    id: string
    operatorMetadata?: {
      __typename?: 'StorageBucketOperatorMetadata'
      nodeEndpoint?: string | null
      nodeLocation?: {
        __typename?: 'NodeLocationMetadata'
        coordinates?: { __typename?: 'GeoCoordinates'; latitude: number; longitude: number } | null
      } | null
    } | null
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

export type GetAvailableStorageBucketsForBagQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.StorageBucketWhereInput>
}>

export type GetAvailableStorageBucketsForBagQuery = {
  __typename?: 'Query'
  storageBuckets: Array<{ __typename?: 'StorageBucket'; id: string }>
}

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
        nodeLocation {
          coordinates {
            latitude
            longitude
          }
        }
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
export const GetAvailableStorageBucketsForBagDocument = gql`
  query GetAvailableStorageBucketsForBag($where: StorageBucketWhereInput) {
    storageBuckets(limit: 500, where: $where) {
      id
    }
  }
`

/**
 * __useGetAvailableStorageBucketsForBagQuery__
 *
 * To run a query within a React component, call `useGetAvailableStorageBucketsForBagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableStorageBucketsForBagQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableStorageBucketsForBagQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetAvailableStorageBucketsForBagQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAvailableStorageBucketsForBagQuery,
    GetAvailableStorageBucketsForBagQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetAvailableStorageBucketsForBagQuery, GetAvailableStorageBucketsForBagQueryVariables>(
    GetAvailableStorageBucketsForBagDocument,
    options
  )
}
export function useGetAvailableStorageBucketsForBagLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAvailableStorageBucketsForBagQuery,
    GetAvailableStorageBucketsForBagQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetAvailableStorageBucketsForBagQuery, GetAvailableStorageBucketsForBagQueryVariables>(
    GetAvailableStorageBucketsForBagDocument,
    options
  )
}
export type GetAvailableStorageBucketsForBagQueryHookResult = ReturnType<
  typeof useGetAvailableStorageBucketsForBagQuery
>
export type GetAvailableStorageBucketsForBagLazyQueryHookResult = ReturnType<
  typeof useGetAvailableStorageBucketsForBagLazyQuery
>
export type GetAvailableStorageBucketsForBagQueryResult = Apollo.QueryResult<
  GetAvailableStorageBucketsForBagQuery,
  GetAvailableStorageBucketsForBagQueryVariables
>
