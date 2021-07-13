import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

export type BasicWorkerFieldsFragment = {
  __typename?: 'Worker'
  id: string
  workerId: string
  metadata?: Types.Maybe<string>
  isActive: boolean
  type: Types.WorkerType
}

export type GetWorkerQueryVariables = Types.Exact<{
  where: Types.WorkerWhereUniqueInput
}>

export type GetWorkerQuery = {
  __typename?: 'Query'
  workerByUniqueInput?: Types.Maybe<{ __typename?: 'Worker' } & BasicWorkerFieldsFragment>
}

export type GetWorkersQueryVariables = Types.Exact<{
  limit?: Types.Maybe<Types.Scalars['Int']>
  offset?: Types.Maybe<Types.Scalars['Int']>
  where?: Types.Maybe<Types.WorkerWhereInput>
}>

export type GetWorkersQuery = {
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
export const GetWorkerDocument = gql`
  query GetWorker($where: WorkerWhereUniqueInput!) {
    workerByUniqueInput(where: $where) {
      ...BasicWorkerFields
    }
  }
  ${BasicWorkerFieldsFragmentDoc}
`

/**
 * __useGetWorkerQuery__
 *
 * To run a query within a React component, call `useGetWorkerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkerQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetWorkerQuery(baseOptions: Apollo.QueryHookOptions<GetWorkerQuery, GetWorkerQueryVariables>) {
  return Apollo.useQuery<GetWorkerQuery, GetWorkerQueryVariables>(GetWorkerDocument, baseOptions)
}
export function useGetWorkerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetWorkerQuery, GetWorkerQueryVariables>
) {
  return Apollo.useLazyQuery<GetWorkerQuery, GetWorkerQueryVariables>(GetWorkerDocument, baseOptions)
}
export type GetWorkerQueryHookResult = ReturnType<typeof useGetWorkerQuery>
export type GetWorkerLazyQueryHookResult = ReturnType<typeof useGetWorkerLazyQuery>
export type GetWorkerQueryResult = Apollo.QueryResult<GetWorkerQuery, GetWorkerQueryVariables>
export const GetWorkersDocument = gql`
  query GetWorkers($limit: Int, $offset: Int, $where: WorkerWhereInput) {
    workers(limit: $limit, offset: $offset, where: $where) {
      ...BasicWorkerFields
    }
  }
  ${BasicWorkerFieldsFragmentDoc}
`

/**
 * __useGetWorkersQuery__
 *
 * To run a query within a React component, call `useGetWorkersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetWorkersQuery(baseOptions?: Apollo.QueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>) {
  return Apollo.useQuery<GetWorkersQuery, GetWorkersQueryVariables>(GetWorkersDocument, baseOptions)
}
export function useGetWorkersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>
) {
  return Apollo.useLazyQuery<GetWorkersQuery, GetWorkersQueryVariables>(GetWorkersDocument, baseOptions)
}
export type GetWorkersQueryHookResult = ReturnType<typeof useGetWorkersQuery>
export type GetWorkersLazyQueryHookResult = ReturnType<typeof useGetWorkersLazyQuery>
export type GetWorkersQueryResult = Apollo.QueryResult<GetWorkersQuery, GetWorkersQueryVariables>
