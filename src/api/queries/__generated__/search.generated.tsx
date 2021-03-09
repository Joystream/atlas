import * as Types from './baseTypes.generated'

import { VideoFieldsFragment, VideoFieldsFragmentDoc } from './videos.generated'
import { BasicChannelFieldsFragment, BasicChannelFieldsFragmentDoc } from './channels.generated'
import { gql } from '@apollo/client'

import * as Apollo from '@apollo/client'
export type SearchQueryVariables = Types.Exact<{
  text: Types.Scalars['String']
}>

export type SearchQuery = {
  __typename?: 'Query'
  search: Array<{
    __typename?: 'SearchFTSOutput'
    item: ({ __typename?: 'Video' } & VideoFieldsFragment) | ({ __typename?: 'Channel' } & BasicChannelFieldsFragment)
  }>
}

export const SearchDocument = gql`
  query Search($text: String!) {
    search(text: $text) {
      item {
        ... on Video {
          ...VideoFields
        }
        ... on Channel {
          ...BasicChannelFields
        }
      }
    }
  }
  ${VideoFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      text: // value for 'text'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
  return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions)
}
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
  return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions)
}
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>
