import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

export type GetLanguagesQueryVariables = Types.Exact<{
  offset?: Types.Maybe<Types.Scalars['Int']>
  limit?: Types.Maybe<Types.Scalars['Int']>
  where?: Types.Maybe<Types.LanguageWhereInput>
  orderBy?: Types.Maybe<Array<Types.LanguageOrderByInput> | Types.LanguageOrderByInput>
}>

export type GetLanguagesQuery = {
  __typename?: 'Query'
  languages: Array<{ __typename?: 'Language'; id: string; iso: string }>
}

export const GetLanguagesDocument = gql`
  query GetLanguages($offset: Int, $limit: Int, $where: LanguageWhereInput, $orderBy: [LanguageOrderByInput!]) {
    languages(offset: $offset, limit: $limit, where: $where, orderBy: $orderBy) {
      id
      iso
    }
  }
`

/**
 * __useGetLanguagesQuery__
 *
 * To run a query within a React component, call `useGetLanguagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLanguagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLanguagesQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetLanguagesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>
) {
  return Apollo.useQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, baseOptions)
}
export function useGetLanguagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetLanguagesQuery, GetLanguagesQueryVariables>
) {
  return Apollo.useLazyQuery<GetLanguagesQuery, GetLanguagesQueryVariables>(GetLanguagesDocument, baseOptions)
}
export type GetLanguagesQueryHookResult = ReturnType<typeof useGetLanguagesQuery>
export type GetLanguagesLazyQueryHookResult = ReturnType<typeof useGetLanguagesLazyQuery>
export type GetLanguagesQueryResult = Apollo.QueryResult<GetLanguagesQuery, GetLanguagesQueryVariables>
