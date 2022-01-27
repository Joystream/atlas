import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { AllChannelFieldsFragmentDoc } from './channels.generated'
import { VideoFieldsFragmentDoc } from './videos.generated'

const defaultOptions = {}
export type SearchQueryVariables = Types.Exact<{
  text: Types.Scalars['String']
  whereVideo?: Types.Maybe<Types.VideoWhereInput>
  whereChannel?: Types.Maybe<Types.ChannelWhereInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type SearchQuery = {
  __typename?: 'Query'
  search: Array<{
    __typename?: 'SearchFTSOutput'
    item:
      | {
          __typename?: 'Channel'
          description?: Types.Maybe<string>
          isPublic?: Types.Maybe<boolean>
          isCensored: boolean
          id: string
          title?: Types.Maybe<string>
          createdAt: Date
          views: number
          follows: number
          language?: Types.Maybe<{ __typename?: 'Language'; id: string; iso: string }>
          ownerMember?: Types.Maybe<{
            __typename?: 'Membership'
            id: string
            handle: string
            avatarUri?: Types.Maybe<string>
          }>
          coverPhoto?: Types.Maybe<{
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: number
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
          }>
          avatarPhoto?: Types.Maybe<{
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: number
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
          }>
        }
      | {
          __typename?: 'Video'
          id: string
          title?: Types.Maybe<string>
          description?: Types.Maybe<string>
          views: number
          duration?: Types.Maybe<number>
          createdAt: Date
          isPublic?: Types.Maybe<boolean>
          isExplicit?: Types.Maybe<boolean>
          isFeatured: boolean
          hasMarketing?: Types.Maybe<boolean>
          isCensored: boolean
          publishedBeforeJoystream?: Types.Maybe<Date>
          category?: Types.Maybe<{ __typename?: 'VideoCategory'; id: string }>
          language?: Types.Maybe<{ __typename?: 'Language'; iso: string }>
          mediaMetadata?: Types.Maybe<{
            __typename?: 'VideoMediaMetadata'
            id: string
            pixelHeight?: Types.Maybe<number>
            pixelWidth?: Types.Maybe<number>
          }>
          media?: Types.Maybe<{
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: number
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
          }>
          thumbnailPhoto?: Types.Maybe<{
            __typename?: 'StorageDataObject'
            id: string
            createdAt: Date
            size: number
            isAccepted: boolean
            ipfsHash: string
            storageBag: { __typename?: 'StorageBag'; id: string }
            type:
              | { __typename: 'DataObjectTypeChannelAvatar' }
              | { __typename: 'DataObjectTypeChannelCoverPhoto' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
          }>
          channel: {
            __typename?: 'Channel'
            id: string
            title?: Types.Maybe<string>
            createdAt: Date
            views: number
            follows: number
            avatarPhoto?: Types.Maybe<{
              __typename?: 'StorageDataObject'
              id: string
              createdAt: Date
              size: number
              isAccepted: boolean
              ipfsHash: string
              storageBag: { __typename?: 'StorageBag'; id: string }
              type:
                | { __typename: 'DataObjectTypeChannelAvatar' }
                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | { __typename: 'DataObjectTypeUnknown' }
            }>
          }
          license?: Types.Maybe<{
            __typename?: 'License'
            id: string
            code?: Types.Maybe<number>
            attribution?: Types.Maybe<string>
            customText?: Types.Maybe<string>
          }>
        }
  }>
}

export const SearchDocument = gql`
  query Search($text: String!, $whereVideo: VideoWhereInput, $whereChannel: ChannelWhereInput, $limit: Int) {
    search(text: $text, whereVideo: $whereVideo, whereChannel: $whereChannel, limit: $limit) {
      item {
        ... on Video {
          ...VideoFields
        }
        ... on Channel {
          ...AllChannelFields
        }
      }
    }
  }
  ${VideoFieldsFragmentDoc}
  ${AllChannelFieldsFragmentDoc}
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
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options)
}
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options)
}
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>
