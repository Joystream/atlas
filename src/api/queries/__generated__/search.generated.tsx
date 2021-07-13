import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicChannelFieldsFragment } from './channels.generated'
import { BasicChannelFieldsFragmentDoc } from './channels.generated'
import { VideoFieldsFragment } from './videos.generated'
import { VideoFieldsFragmentDoc } from './videos.generated'

export type SearchQueryVariables = Types.Exact<{
  text: Types.Scalars['String']
  whereVideo?: Types.Maybe<Types.VideoWhereInput>
  whereChannel?: Types.Maybe<Types.ChannelWhereInput>
}>

export type SearchQuery = {
  __typename?: 'Query'
  search: Array<{
    __typename?: 'SearchFTSOutput'
    item: ({ __typename?: 'Video' } & VideoFieldsFragment) | ({ __typename?: 'Channel' } & BasicChannelFieldsFragment)
  }>
}

export const SearchDocument = gql`
  query Search($text: String!, $whereVideo: VideoWhereInput, $whereChannel: ChannelWhereInput) {
    search(text: $text, whereVideo: $whereVideo, whereChannel: $whereChannel) {
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
 *      whereVideo: // value for 'whereVideo'
 *      whereChannel: // value for 'whereChannel'
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
