import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {}
export type GetDataObjectAvailabilityQueryVariables = Types.Exact<{
  id_eq?: Types.Maybe<Types.Scalars['ID']>
  id_in?: Types.Maybe<Array<Types.Scalars['ID']> | Types.Scalars['ID']>
}>

export type GetDataObjectAvailabilityQuery = {
  __typename?: 'Query'
  storageDataObjects: Array<{ __typename?: 'StorageDataObject'; id: string; isAccepted: boolean }>
}

export const GetDataObjectAvailabilityDocument = gql`
  query GetDataObjectAvailability($id_eq: ID, $id_in: [ID!]) {
    storageDataObjects(where: { id_eq: $id_eq, id_in: $id_in }) {
      id
      isAccepted
    }
  }
`

/**
 * __useGetDataObjectAvailabilityQuery__
 *
 * To run a query within a React component, call `useGetDataObjectAvailabilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataObjectAvailabilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataObjectAvailabilityQuery({
 *   variables: {
 *      id_eq: // value for 'id_eq'
 *      id_in: // value for 'id_in'
 *   },
 * });
 */
export function useGetDataObjectAvailabilityQuery(
  baseOptions?: Apollo.QueryHookOptions<GetDataObjectAvailabilityQuery, GetDataObjectAvailabilityQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDataObjectAvailabilityQuery, GetDataObjectAvailabilityQueryVariables>(
    GetDataObjectAvailabilityDocument,
    options
  )
}
export function useGetDataObjectAvailabilityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetDataObjectAvailabilityQuery, GetDataObjectAvailabilityQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDataObjectAvailabilityQuery, GetDataObjectAvailabilityQueryVariables>(
    GetDataObjectAvailabilityDocument,
    options
  )
}
export type GetDataObjectAvailabilityQueryHookResult = ReturnType<typeof useGetDataObjectAvailabilityQuery>
export type GetDataObjectAvailabilityLazyQueryHookResult = ReturnType<typeof useGetDataObjectAvailabilityLazyQuery>
export type GetDataObjectAvailabilityQueryResult = Apollo.QueryResult<
  GetDataObjectAvailabilityQuery,
  GetDataObjectAvailabilityQueryVariables
>
