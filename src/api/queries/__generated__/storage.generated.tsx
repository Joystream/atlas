import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {}
export type StorageDataObjectFieldsFragment = {
  __typename?: 'StorageDataObject'
  id: string
  createdAt: Date
  size: number
  isAccepted: boolean
  ipfsHash: string
  storageBag: { __typename?: 'StorageBag'; id: string }
  type:
    | { __typename: 'DataObjectTypeChannelAvatar' }
    | { __typename: 'DataObjectTypeChannelCoverPhoto' }
    | { __typename: 'DataObjectTypeVideoMedia' }
    | { __typename: 'DataObjectTypeVideoThumbnail' }
    | { __typename: 'DataObjectTypeUnknown' }
}

export type DistributionBucketOperatorFieldFragment = {
  __typename?: 'DistributionBucketOperator'
  id: string
  metadata?: Types.Maybe<{ __typename?: 'DistributionBucketOperatorMetadata'; nodeEndpoint?: Types.Maybe<string> }>
}

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
      metadata?: Types.Maybe<{ __typename?: 'DistributionBucketOperatorMetadata'; nodeEndpoint?: Types.Maybe<string> }>
    }>
  }>
}

export const StorageDataObjectFieldsFragmentDoc = gql`
  fragment StorageDataObjectFields on StorageDataObject {
    id
    createdAt
    size
    isAccepted
    ipfsHash
    storageBag {
      id
    }
    type {
      __typename
    }
  }
`
export const DistributionBucketOperatorFieldFragmentDoc = gql`
  fragment DistributionBucketOperatorField on DistributionBucketOperator {
    id
    metadata {
      nodeEndpoint
    }
  }
`
export const GetDistributionBucketsWithOperatorsDocument = gql`
  query GetDistributionBucketsWithOperators {
    distributionBuckets(limit: 50) {
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
