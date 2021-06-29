import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicChannelFieldsFragment } from './channels.generated'
import { BasicChannelFieldsFragmentDoc } from './channels.generated'
import { DataObjectFieldsFragment } from './shared.generated'
import { DataObjectFieldsFragmentDoc } from './shared.generated'

export type VideoMediaMetadataFieldsFragment = {
  __typename?: 'VideoMediaMetadata'
  id: string
  pixelHeight?: Types.Maybe<number>
  pixelWidth?: Types.Maybe<number>
}

export type LicenseFieldsFragment = {
  __typename?: 'License'
  id: string
  code?: Types.Maybe<number>
  attribution?: Types.Maybe<string>
  customText?: Types.Maybe<string>
}

export type VideoFieldsFragment = {
  __typename?: 'Video'
  id: string
  title?: Types.Maybe<string>
  description?: Types.Maybe<string>
  views?: Types.Maybe<number>
  duration?: Types.Maybe<number>
  createdAt: Date
  isPublic?: Types.Maybe<boolean>
  isExplicit?: Types.Maybe<boolean>
  isFeatured: boolean
  hasMarketing?: Types.Maybe<boolean>
  isCensored: boolean
  publishedBeforeJoystream?: Types.Maybe<Date>
  mediaUrls: Array<string>
  mediaAvailability: Types.AssetAvailability
  thumbnailPhotoUrls: Array<string>
  thumbnailPhotoAvailability: Types.AssetAvailability
  category?: Types.Maybe<{ __typename?: 'VideoCategory'; id: string }>
  language?: Types.Maybe<{ __typename?: 'Language'; iso: string }>
  mediaMetadata: { __typename?: 'VideoMediaMetadata' } & VideoMediaMetadataFieldsFragment
  mediaDataObject?: Types.Maybe<{ __typename?: 'DataObject' } & DataObjectFieldsFragment>
  thumbnailPhotoDataObject?: Types.Maybe<{ __typename?: 'DataObject' } & DataObjectFieldsFragment>
  channel: { __typename?: 'Channel' } & BasicChannelFieldsFragment
  license?: Types.Maybe<{ __typename?: 'License' } & LicenseFieldsFragment>
}

export type GetVideoQueryVariables = Types.Exact<{
  where: Types.VideoWhereUniqueInput
}>

export type GetVideoQuery = {
  __typename?: 'Query'
  videoByUniqueInput?: Types.Maybe<{ __typename?: 'Video' } & VideoFieldsFragment>
}

export type GetVideosConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  orderBy?: Types.Maybe<Types.VideoOrderByInput>
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetVideosConnectionQuery = {
  __typename?: 'Query'
  videosConnection: {
    __typename?: 'VideoConnection'
    totalCount: number
    edges: Array<{ __typename?: 'VideoEdge'; cursor: string; node: { __typename?: 'Video' } & VideoFieldsFragment }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetVideosQueryVariables = Types.Exact<{
  offset?: Types.Maybe<Types.Scalars['Int']>
  limit?: Types.Maybe<Types.Scalars['Int']>
  where?: Types.Maybe<Types.VideoWhereInput>
  orderBy?: Types.Maybe<Types.VideoOrderByInput>
}>

export type GetVideosQuery = {
  __typename?: 'Query'
  videos?: Types.Maybe<Array<{ __typename?: 'Video' } & VideoFieldsFragment>>
}

export type GetVideoViewsQueryVariables = Types.Exact<{
  videoId: Types.Scalars['ID']
}>

export type GetVideoViewsQuery = {
  __typename?: 'Query'
  videoViews?: Types.Maybe<{ __typename?: 'EntityViewsInfo'; id: string; views: number }>
}

export type GetBatchedVideoViewsQueryVariables = Types.Exact<{
  videoIdList: Array<Types.Scalars['ID']> | Types.Scalars['ID']
}>

export type GetBatchedVideoViewsQuery = {
  __typename?: 'Query'
  batchedVideoViews: Array<Types.Maybe<{ __typename?: 'EntityViewsInfo'; id: string; views: number }>>
}

export type AddVideoViewMutationVariables = Types.Exact<{
  videoId: Types.Scalars['ID']
  channelId: Types.Scalars['ID']
}>

export type AddVideoViewMutation = {
  __typename?: 'Mutation'
  addVideoView: { __typename?: 'EntityViewsInfo'; id: string; views: number }
}

export const VideoMediaMetadataFieldsFragmentDoc = gql`
  fragment VideoMediaMetadataFields on VideoMediaMetadata {
    id
    pixelHeight
    pixelWidth
  }
`
export const LicenseFieldsFragmentDoc = gql`
  fragment LicenseFields on License {
    id
    code
    attribution
    customText
  }
`
export const VideoFieldsFragmentDoc = gql`
  fragment VideoFields on Video {
    id
    title
    description
    category {
      id
    }
    views
    duration
    createdAt
    isPublic
    isExplicit
    isFeatured
    hasMarketing
    isCensored
    language {
      iso
    }
    publishedBeforeJoystream
    mediaMetadata {
      ...VideoMediaMetadataFields
    }
    mediaUrls
    mediaAvailability
    mediaDataObject {
      ...DataObjectFields
    }
    thumbnailPhotoUrls
    thumbnailPhotoAvailability
    thumbnailPhotoDataObject {
      ...DataObjectFields
    }
    channel {
      ...BasicChannelFields
    }
    license {
      ...LicenseFields
    }
  }
  ${VideoMediaMetadataFieldsFragmentDoc}
  ${DataObjectFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
  ${LicenseFieldsFragmentDoc}
`
export const GetVideoDocument = gql`
  query GetVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
      ...VideoFields
    }
  }
  ${VideoFieldsFragmentDoc}
`

/**
 * __useGetVideoQuery__
 *
 * To run a query within a React component, call `useGetVideoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideoQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetVideoQuery(baseOptions: Apollo.QueryHookOptions<GetVideoQuery, GetVideoQueryVariables>) {
  return Apollo.useQuery<GetVideoQuery, GetVideoQueryVariables>(GetVideoDocument, baseOptions)
}
export function useGetVideoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVideoQuery, GetVideoQueryVariables>) {
  return Apollo.useLazyQuery<GetVideoQuery, GetVideoQueryVariables>(GetVideoDocument, baseOptions)
}
export type GetVideoQueryHookResult = ReturnType<typeof useGetVideoQuery>
export type GetVideoLazyQueryHookResult = ReturnType<typeof useGetVideoLazyQuery>
export type GetVideoQueryResult = Apollo.QueryResult<GetVideoQuery, GetVideoQueryVariables>
export const GetVideosConnectionDocument = gql`
  query GetVideosConnection(
    $first: Int
    $after: String
    $orderBy: VideoOrderByInput = createdAt_DESC
    $where: VideoWhereInput
  ) {
    videosConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...VideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${VideoFieldsFragmentDoc}
`

/**
 * __useGetVideosConnectionQuery__
 *
 * To run a query within a React component, call `useGetVideosConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideosConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideosConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetVideosConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>
) {
  return Apollo.useQuery<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>(
    GetVideosConnectionDocument,
    baseOptions
  )
}
export function useGetVideosConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>
) {
  return Apollo.useLazyQuery<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>(
    GetVideosConnectionDocument,
    baseOptions
  )
}
export type GetVideosConnectionQueryHookResult = ReturnType<typeof useGetVideosConnectionQuery>
export type GetVideosConnectionLazyQueryHookResult = ReturnType<typeof useGetVideosConnectionLazyQuery>
export type GetVideosConnectionQueryResult = Apollo.QueryResult<
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables
>
export const GetVideosDocument = gql`
  query GetVideos($offset: Int, $limit: Int, $where: VideoWhereInput, $orderBy: VideoOrderByInput = createdAt_DESC) {
    videos(offset: $offset, limit: $limit, where: $where, orderBy: $orderBy) {
      ...VideoFields
    }
  }
  ${VideoFieldsFragmentDoc}
`

/**
 * __useGetVideosQuery__
 *
 * To run a query within a React component, call `useGetVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideosQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetVideosQuery(baseOptions?: Apollo.QueryHookOptions<GetVideosQuery, GetVideosQueryVariables>) {
  return Apollo.useQuery<GetVideosQuery, GetVideosQueryVariables>(GetVideosDocument, baseOptions)
}
export function useGetVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideosQuery, GetVideosQueryVariables>
) {
  return Apollo.useLazyQuery<GetVideosQuery, GetVideosQueryVariables>(GetVideosDocument, baseOptions)
}
export type GetVideosQueryHookResult = ReturnType<typeof useGetVideosQuery>
export type GetVideosLazyQueryHookResult = ReturnType<typeof useGetVideosLazyQuery>
export type GetVideosQueryResult = Apollo.QueryResult<GetVideosQuery, GetVideosQueryVariables>
export const GetVideoViewsDocument = gql`
  query GetVideoViews($videoId: ID!) {
    videoViews(videoId: $videoId) {
      id
      views
    }
  }
`

/**
 * __useGetVideoViewsQuery__
 *
 * To run a query within a React component, call `useGetVideoViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideoViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideoViewsQuery({
 *   variables: {
 *      videoId: // value for 'videoId'
 *   },
 * });
 */
export function useGetVideoViewsQuery(
  baseOptions: Apollo.QueryHookOptions<GetVideoViewsQuery, GetVideoViewsQueryVariables>
) {
  return Apollo.useQuery<GetVideoViewsQuery, GetVideoViewsQueryVariables>(GetVideoViewsDocument, baseOptions)
}
export function useGetVideoViewsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideoViewsQuery, GetVideoViewsQueryVariables>
) {
  return Apollo.useLazyQuery<GetVideoViewsQuery, GetVideoViewsQueryVariables>(GetVideoViewsDocument, baseOptions)
}
export type GetVideoViewsQueryHookResult = ReturnType<typeof useGetVideoViewsQuery>
export type GetVideoViewsLazyQueryHookResult = ReturnType<typeof useGetVideoViewsLazyQuery>
export type GetVideoViewsQueryResult = Apollo.QueryResult<GetVideoViewsQuery, GetVideoViewsQueryVariables>
export const GetBatchedVideoViewsDocument = gql`
  query GetBatchedVideoViews($videoIdList: [ID!]!) {
    batchedVideoViews(videoIdList: $videoIdList) {
      id
      views
    }
  }
`

/**
 * __useGetBatchedVideoViewsQuery__
 *
 * To run a query within a React component, call `useGetBatchedVideoViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBatchedVideoViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBatchedVideoViewsQuery({
 *   variables: {
 *      videoIdList: // value for 'videoIdList'
 *   },
 * });
 */
export function useGetBatchedVideoViewsQuery(
  baseOptions: Apollo.QueryHookOptions<GetBatchedVideoViewsQuery, GetBatchedVideoViewsQueryVariables>
) {
  return Apollo.useQuery<GetBatchedVideoViewsQuery, GetBatchedVideoViewsQueryVariables>(
    GetBatchedVideoViewsDocument,
    baseOptions
  )
}
export function useGetBatchedVideoViewsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBatchedVideoViewsQuery, GetBatchedVideoViewsQueryVariables>
) {
  return Apollo.useLazyQuery<GetBatchedVideoViewsQuery, GetBatchedVideoViewsQueryVariables>(
    GetBatchedVideoViewsDocument,
    baseOptions
  )
}
export type GetBatchedVideoViewsQueryHookResult = ReturnType<typeof useGetBatchedVideoViewsQuery>
export type GetBatchedVideoViewsLazyQueryHookResult = ReturnType<typeof useGetBatchedVideoViewsLazyQuery>
export type GetBatchedVideoViewsQueryResult = Apollo.QueryResult<
  GetBatchedVideoViewsQuery,
  GetBatchedVideoViewsQueryVariables
>
export const AddVideoViewDocument = gql`
  mutation AddVideoView($videoId: ID!, $channelId: ID!) {
    addVideoView(videoId: $videoId, channelId: $channelId) {
      id
      views
    }
  }
`
export type AddVideoViewMutationFn = Apollo.MutationFunction<AddVideoViewMutation, AddVideoViewMutationVariables>

/**
 * __useAddVideoViewMutation__
 *
 * To run a mutation, you first call `useAddVideoViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddVideoViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addVideoViewMutation, { data, loading, error }] = useAddVideoViewMutation({
 *   variables: {
 *      videoId: // value for 'videoId'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useAddVideoViewMutation(
  baseOptions?: Apollo.MutationHookOptions<AddVideoViewMutation, AddVideoViewMutationVariables>
) {
  return Apollo.useMutation<AddVideoViewMutation, AddVideoViewMutationVariables>(AddVideoViewDocument, baseOptions)
}
export type AddVideoViewMutationHookResult = ReturnType<typeof useAddVideoViewMutation>
export type AddVideoViewMutationResult = Apollo.MutationResult<AddVideoViewMutation>
export type AddVideoViewMutationOptions = Apollo.BaseMutationOptions<
  AddVideoViewMutation,
  AddVideoViewMutationVariables
>
