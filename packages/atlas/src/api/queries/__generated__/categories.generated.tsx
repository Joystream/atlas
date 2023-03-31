import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { ExtendedVideoCategoryFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetExtendedVideoCategoriesQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetExtendedVideoCategoriesQuery = {
  __typename?: 'Query'
  extendedVideoCategories: Array<{
    __typename?: 'ExtendedVideoCategory'
    activeVideosCount: number
    category: { __typename?: 'VideoCategory'; id: string; name?: string | null }
  }>
}

export const GetExtendedVideoCategoriesDocument = gql`
  query GetExtendedVideoCategories {
    extendedVideoCategories {
      ...ExtendedVideoCategoryFields
    }
  }
  ${ExtendedVideoCategoryFieldsFragmentDoc}
`

/**
 * __useGetExtendedVideoCategoriesQuery__
 *
 * To run a query within a React component, call `useGetExtendedVideoCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExtendedVideoCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExtendedVideoCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExtendedVideoCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetExtendedVideoCategoriesQuery, GetExtendedVideoCategoriesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetExtendedVideoCategoriesQuery, GetExtendedVideoCategoriesQueryVariables>(
    GetExtendedVideoCategoriesDocument,
    options
  )
}
export function useGetExtendedVideoCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExtendedVideoCategoriesQuery, GetExtendedVideoCategoriesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetExtendedVideoCategoriesQuery, GetExtendedVideoCategoriesQueryVariables>(
    GetExtendedVideoCategoriesDocument,
    options
  )
}
export type GetExtendedVideoCategoriesQueryHookResult = ReturnType<typeof useGetExtendedVideoCategoriesQuery>
export type GetExtendedVideoCategoriesLazyQueryHookResult = ReturnType<typeof useGetExtendedVideoCategoriesLazyQuery>
export type GetExtendedVideoCategoriesQueryResult = Apollo.QueryResult<
  GetExtendedVideoCategoriesQuery,
  GetExtendedVideoCategoriesQueryVariables
>
