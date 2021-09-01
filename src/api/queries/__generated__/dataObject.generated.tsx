import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {}
export type GetDataObjectAvailabilityQueryVariables = Types.Exact<{
  joystreamContentIdEq?: Types.Maybe<Types.Scalars['String']>
  joystreamContentIdIn?: Types.Maybe<Array<Types.Scalars['String']> | Types.Scalars['String']>
}>

export type GetDataObjectAvailabilityQuery = {
  __typename?: 'Query'
  dataObjects: Array<{
    __typename?: 'DataObject'
    liaisonJudgement: Types.LiaisonJudgement
    joystreamContentId: string
  }>
}

export const GetDataObjectAvailabilityDocument = gql`
  query GetDataObjectAvailability($joystreamContentIdEq: String, $joystreamContentIdIn: [String!]) {
    dataObjects(where: { joystreamContentId_eq: $joystreamContentIdEq, joystreamContentId_in: $joystreamContentIdIn }) {
      liaisonJudgement
      joystreamContentId
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
 *      joystreamContentIdEq: // value for 'joystreamContentIdEq'
 *      joystreamContentIdIn: // value for 'joystreamContentIdIn'
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
