import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type BasicWorkerFieldsFragment = {
  __typename?: 'Worker'
  id: string
  workerId: string
  metadata?: Types.Maybe<string>
  isActive: boolean
  type: Types.WorkerType
}

export type GetStorageProviderQueryVariables = Types.Exact<{
  where: Types.WorkerWhereUniqueInput
}>

export type GetStorageProviderQuery = {
  __typename?: 'Query'
  workerByUniqueInput?: Types.Maybe<{ __typename?: 'Worker' } & BasicWorkerFieldsFragment>
}

export type GetStorageProvidersQueryVariables = Types.Exact<{
  limit?: Types.Maybe<Types.Scalars['Int']>
  offset?: Types.Maybe<Types.Scalars['Int']>
  where?: Types.Maybe<Types.WorkerWhereInput>
}>

export type GetStorageProvidersQuery = {
  __typename?: 'Query'
  workers?: Types.Maybe<Array<{ __typename?: 'Worker' } & BasicWorkerFieldsFragment>>
}

export const BasicWorkerFieldsFragmentDoc = gql`
  fragment BasicWorkerFields on Worker {
    id
    workerId
    metadata
    isActive
    type
  }
`
export const GetStorageProviderDocument = gql`
  query GetStorageProvider($where: WorkerWhereUniqueInput!) {
    workerByUniqueInput(where: $where) {
      ...BasicWorkerFields
    }
  }
  ${BasicWorkerFieldsFragmentDoc}
`

/**
 * __useGetStorageProviderQuery__
 *
 * To run a query within a React component, call `useGetStorageProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStorageProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStorageProviderQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetStorageProviderQuery(
  baseOptions: Apollo.QueryHookOptions<GetStorageProviderQuery, GetStorageProviderQueryVariables>
) {
  return Apollo.useQuery<GetStorageProviderQuery, GetStorageProviderQueryVariables>(
    GetStorageProviderDocument,
    baseOptions
  )
}
export function useGetStorageProviderLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStorageProviderQuery, GetStorageProviderQueryVariables>
) {
  return Apollo.useLazyQuery<GetStorageProviderQuery, GetStorageProviderQueryVariables>(
    GetStorageProviderDocument,
    baseOptions
  )
}
export type GetStorageProviderQueryHookResult = ReturnType<typeof useGetStorageProviderQuery>
export type GetStorageProviderLazyQueryHookResult = ReturnType<typeof useGetStorageProviderLazyQuery>
export type GetStorageProviderQueryResult = Apollo.QueryResult<
  GetStorageProviderQuery,
  GetStorageProviderQueryVariables
>
export const GetStorageProvidersDocument = gql`
  query GetStorageProviders($limit: Int, $offset: Int, $where: WorkerWhereInput) {
    workers(limit: $limit, offset: $offset, where: $where) {
      ...BasicWorkerFields
    }
  }
  ${BasicWorkerFieldsFragmentDoc}
`

/**
 * __useGetStorageProvidersQuery__
 *
 * To run a query within a React component, call `useGetStorageProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStorageProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStorageProvidersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetStorageProvidersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetStorageProvidersQuery, GetStorageProvidersQueryVariables>
) {
  return Apollo.useQuery<GetStorageProvidersQuery, GetStorageProvidersQueryVariables>(
    GetStorageProvidersDocument,
    baseOptions
  )
}
export function useGetStorageProvidersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStorageProvidersQuery, GetStorageProvidersQueryVariables>
) {
  return Apollo.useLazyQuery<GetStorageProvidersQuery, GetStorageProvidersQueryVariables>(
    GetStorageProvidersDocument,
    baseOptions
  )
}
export type GetStorageProvidersQueryHookResult = ReturnType<typeof useGetStorageProvidersQuery>
export type GetStorageProvidersLazyQueryHookResult = ReturnType<typeof useGetStorageProvidersLazyQuery>
export type GetStorageProvidersQueryResult = Apollo.QueryResult<
  GetStorageProvidersQuery,
  GetStorageProvidersQueryVariables
>
