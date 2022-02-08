import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {} as const
export type BasicWorkerFieldsFragment = {
  __typename?: 'Worker'
  id: string
  workerId: string
  metadata?: string | null
  isActive: boolean
  type: Types.WorkerType
}

export type GetWorkerQueryVariables = Types.Exact<{
  where: Types.WorkerWhereUniqueInput
}>

export type GetWorkerQuery = {
  __typename?: 'Query'
  workerByUniqueInput?: {
    __typename?: 'Worker'
    id: string
    workerId: string
    metadata?: string | null
    isActive: boolean
    type: Types.WorkerType
  } | null
}

export type GetWorkersQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
  where?: Types.InputMaybe<Types.WorkerWhereInput>
}>

export type GetWorkersQuery = {
  __typename?: 'Query'
  workers: Array<{
    __typename?: 'Worker'
    id: string
    workerId: string
    metadata?: string | null
    isActive: boolean
    type: Types.WorkerType
  }>
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetWorkerQuery, GetWorkerQueryVariables>(GetWorkerDocument, options)
}
export function useGetWorkerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetWorkerQuery, GetWorkerQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetWorkerQuery, GetWorkerQueryVariables>(GetWorkerDocument, options)
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetWorkersQuery, GetWorkersQueryVariables>(GetWorkersDocument, options)
}
export function useGetWorkersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetWorkersQuery, GetWorkersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetWorkersQuery, GetWorkersQueryVariables>(GetWorkersDocument, options)
}
export type GetWorkersQueryHookResult = ReturnType<typeof useGetWorkersQuery>
export type GetWorkersLazyQueryHookResult = ReturnType<typeof useGetWorkersLazyQuery>
export type GetWorkersQueryResult = Apollo.QueryResult<GetWorkersQuery, GetWorkersQueryVariables>
