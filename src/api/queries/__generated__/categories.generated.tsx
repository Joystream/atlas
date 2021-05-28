import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type VideoCategoryFieldsFragment = { __typename?: 'VideoCategory'; id: string; name?: Types.Maybe<string> }

export type GetVideoCategoriesQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetVideoCategoriesQuery = {
  __typename?: 'Query'
  videoCategories: Array<{ __typename?: 'VideoCategory' } & VideoCategoryFieldsFragment>
}

export const VideoCategoryFieldsFragmentDoc = gql`
  fragment VideoCategoryFields on VideoCategory {
    id
    name
  }
`
export const GetVideoCategoriesDocument = gql`
  query GetVideoCategories {
    videoCategories {
      ...VideoCategoryFields
    }
  }
  ${VideoCategoryFieldsFragmentDoc}
`

/**
 * __useGetVideoCategoriesQuery__
 *
 * To run a query within a React component, call `useGetVideoCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideoCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideoCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVideoCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables>
) {
  return Apollo.useQuery<GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables>(
    GetVideoCategoriesDocument,
    baseOptions
  )
}
export function useGetVideoCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables>
) {
  return Apollo.useLazyQuery<GetVideoCategoriesQuery, GetVideoCategoriesQueryVariables>(
    GetVideoCategoriesDocument,
    baseOptions
  )
}
export type GetVideoCategoriesQueryHookResult = ReturnType<typeof useGetVideoCategoriesQuery>
export type GetVideoCategoriesLazyQueryHookResult = ReturnType<typeof useGetVideoCategoriesLazyQuery>
export type GetVideoCategoriesQueryResult = Apollo.QueryResult<
  GetVideoCategoriesQuery,
  GetVideoCategoriesQueryVariables
>
