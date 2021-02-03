import * as Types from '../../__generated__/baseTypes.generated'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type CategoryFieldsFragment = { __typename: 'Category'; id: string; name: string }

export type GetCategoriesQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetCategoriesQuery = {
  __typename: 'Query'
  categories: Array<{ __typename: 'Category' } & CategoryFieldsFragment>
}

export const CategoryFieldsFragmentDoc = gql`
  fragment CategoryFields on Category {
    id
    name
  }
`
export const GetCategoriesDocument = gql`
  query GetCategories {
    categories {
      ...CategoryFields
    }
  }
  ${CategoryFieldsFragmentDoc}
`

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>
) {
  return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, baseOptions)
}
export function useGetCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>
) {
  return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, baseOptions)
}
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>
export type GetCategoriesQueryResult = Apollo.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>
