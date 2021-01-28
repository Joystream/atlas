import * as Types from './baseTypes.generated';

import { BasicChannelFieldsFragment , BasicChannelFieldsFragmentDoc } from './channels.generated';
import { gql } from '@apollo/client';

import * as Apollo from '@apollo/client';
export type VideoMediaFieldsFragment = { __typename?: 'VideoMedia', id: string, pixelHeight: number, pixelWidth: number, location: { __typename?: 'JoystreamMediaLocation', dataObjectId: string } | { __typename?: 'HttpMediaLocation', url: string } };

export type LicenseFieldsFragment = { __typename?: 'LicenseEntity', id: string, attribution?: Types.Maybe<string>, type: { __typename?: 'UserDefinedLicense', content: string } | { __typename?: 'KnownLicense', code: string, url?: Types.Maybe<string> } };

export type VideoFieldsFragment = { __typename?: 'Video', id: string, title: string, description: string, views?: Types.Maybe<number>, duration: number, thumbnailUrl: string, createdAt: Date, category: { __typename?: 'Category', id: string }, media: (
    { __typename?: 'VideoMedia' }
    & VideoMediaFieldsFragment
  ), channel: { __typename?: 'Channel', id: string, avatarPhotoUrl?: Types.Maybe<string>, handle: string }, license: (
    { __typename?: 'LicenseEntity' }
    & LicenseFieldsFragment
  ) };

export type GetNewestVideosQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>;
  after?: Types.Maybe<Types.Scalars['String']>;
  categoryId?: Types.Maybe<Types.Scalars['ID']>;
  channelId?: Types.Maybe<Types.Scalars['ID']>;
}>;


export type GetNewestVideosQuery = { __typename?: 'Query', videosConnection: { __typename?: 'VideoConnection', totalCount: number, edges: Array<{ __typename?: 'VideoEdge', cursor: string, node: (
        { __typename?: 'Video' }
        & VideoFieldsFragment
      ) }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: Types.Maybe<string> } } };

export type GetFeaturedVideosQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetFeaturedVideosQuery = { __typename?: 'Query', featuredVideos: Array<{ __typename?: 'FeaturedVideo', video: (
      { __typename?: 'Video' }
      & VideoFieldsFragment
    ) }> };

export type GetCoverVideoQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetCoverVideoQuery = { __typename?: 'Query', coverVideo: { __typename?: 'CoverVideo', coverDescription: string, video: (
      { __typename?: 'Video' }
      & VideoFieldsFragment
    ), coverCutMedia: (
      { __typename?: 'VideoMedia' }
      & VideoMediaFieldsFragment
    ) } };

export type GetVideoQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetVideoQuery = { __typename?: 'Query', video?: Types.Maybe<(
    { __typename?: 'Video', channel: (
      { __typename?: 'Channel' }
      & BasicChannelFieldsFragment
    ) }
    & VideoFieldsFragment
  )> };

export type AddVideoViewMutationVariables = Types.Exact<{
  videoId: Types.Scalars['ID'];
  channelId: Types.Scalars['ID'];
}>;


export type AddVideoViewMutation = { __typename?: 'Mutation', addVideoView: { __typename?: 'EntityViewsInfo', id: string, views: number } };

export const VideoMediaFieldsFragmentDoc = gql`
    fragment VideoMediaFields on VideoMedia {
  id
  pixelHeight
  pixelWidth
  location {
    ... on HttpMediaLocation {
      url
    }
    ... on JoystreamMediaLocation {
      dataObjectId
    }
  }
}
    `;
export const LicenseFieldsFragmentDoc = gql`
    fragment LicenseFields on LicenseEntity {
  id
  attribution
  type {
    ... on KnownLicense {
      code
      url
    }
    ... on UserDefinedLicense {
      content
    }
  }
}
    `;
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
  thumbnailUrl
  createdAt
  media {
    ...VideoMediaFields
  }
  channel {
    id
    avatarPhotoUrl
    handle
  }
  license {
    ...LicenseFields
  }
}
    ${VideoMediaFieldsFragmentDoc}
${LicenseFieldsFragmentDoc}`;
export const GetNewestVideosDocument = gql`
    query GetNewestVideos($first: Int, $after: String, $categoryId: ID, $channelId: ID) {
  videosConnection(first: $first, after: $after, where: {categoryId_eq: $categoryId, channelId_eq: $channelId, isCurated_eq: false}, orderBy: createdAt_DESC) {
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
    ${VideoFieldsFragmentDoc}`;

/**
 * __useGetNewestVideosQuery__
 *
 * To run a query within a React component, call `useGetNewestVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNewestVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNewestVideosQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      categoryId: // value for 'categoryId'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetNewestVideosQuery(baseOptions?: Apollo.QueryHookOptions<GetNewestVideosQuery, GetNewestVideosQueryVariables>) {
        return Apollo.useQuery<GetNewestVideosQuery, GetNewestVideosQueryVariables>(GetNewestVideosDocument, baseOptions);
      }
export function useGetNewestVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNewestVideosQuery, GetNewestVideosQueryVariables>) {
          return Apollo.useLazyQuery<GetNewestVideosQuery, GetNewestVideosQueryVariables>(GetNewestVideosDocument, baseOptions);
        }
export type GetNewestVideosQueryHookResult = ReturnType<typeof useGetNewestVideosQuery>;
export type GetNewestVideosLazyQueryHookResult = ReturnType<typeof useGetNewestVideosLazyQuery>;
export type GetNewestVideosQueryResult = Apollo.QueryResult<GetNewestVideosQuery, GetNewestVideosQueryVariables>;
export const GetFeaturedVideosDocument = gql`
    query GetFeaturedVideos {
  featuredVideos(orderBy: createdAt_DESC) {
    video {
      ...VideoFields
    }
  }
}
    ${VideoFieldsFragmentDoc}`;

/**
 * __useGetFeaturedVideosQuery__
 *
 * To run a query within a React component, call `useGetFeaturedVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeaturedVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeaturedVideosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFeaturedVideosQuery(baseOptions?: Apollo.QueryHookOptions<GetFeaturedVideosQuery, GetFeaturedVideosQueryVariables>) {
        return Apollo.useQuery<GetFeaturedVideosQuery, GetFeaturedVideosQueryVariables>(GetFeaturedVideosDocument, baseOptions);
      }
export function useGetFeaturedVideosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeaturedVideosQuery, GetFeaturedVideosQueryVariables>) {
          return Apollo.useLazyQuery<GetFeaturedVideosQuery, GetFeaturedVideosQueryVariables>(GetFeaturedVideosDocument, baseOptions);
        }
export type GetFeaturedVideosQueryHookResult = ReturnType<typeof useGetFeaturedVideosQuery>;
export type GetFeaturedVideosLazyQueryHookResult = ReturnType<typeof useGetFeaturedVideosLazyQuery>;
export type GetFeaturedVideosQueryResult = Apollo.QueryResult<GetFeaturedVideosQuery, GetFeaturedVideosQueryVariables>;
export const GetCoverVideoDocument = gql`
    query GetCoverVideo {
  coverVideo {
    video {
      ...VideoFields
    }
    coverDescription
    coverCutMedia {
      ...VideoMediaFields
    }
  }
}
    ${VideoFieldsFragmentDoc}
${VideoMediaFieldsFragmentDoc}`;

/**
 * __useGetCoverVideoQuery__
 *
 * To run a query within a React component, call `useGetCoverVideoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCoverVideoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCoverVideoQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCoverVideoQuery(baseOptions?: Apollo.QueryHookOptions<GetCoverVideoQuery, GetCoverVideoQueryVariables>) {
        return Apollo.useQuery<GetCoverVideoQuery, GetCoverVideoQueryVariables>(GetCoverVideoDocument, baseOptions);
      }
export function useGetCoverVideoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCoverVideoQuery, GetCoverVideoQueryVariables>) {
          return Apollo.useLazyQuery<GetCoverVideoQuery, GetCoverVideoQueryVariables>(GetCoverVideoDocument, baseOptions);
        }
export type GetCoverVideoQueryHookResult = ReturnType<typeof useGetCoverVideoQuery>;
export type GetCoverVideoLazyQueryHookResult = ReturnType<typeof useGetCoverVideoLazyQuery>;
export type GetCoverVideoQueryResult = Apollo.QueryResult<GetCoverVideoQuery, GetCoverVideoQueryVariables>;
export const GetVideoDocument = gql`
    query GetVideo($id: ID!) {
  video(where: {id: $id}) {
    ...VideoFields
    channel {
      ...BasicChannelFields
    }
  }
}
    ${VideoFieldsFragmentDoc}
${BasicChannelFieldsFragmentDoc}`;

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
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetVideoQuery(baseOptions: Apollo.QueryHookOptions<GetVideoQuery, GetVideoQueryVariables>) {
        return Apollo.useQuery<GetVideoQuery, GetVideoQueryVariables>(GetVideoDocument, baseOptions);
      }
export function useGetVideoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVideoQuery, GetVideoQueryVariables>) {
          return Apollo.useLazyQuery<GetVideoQuery, GetVideoQueryVariables>(GetVideoDocument, baseOptions);
        }
export type GetVideoQueryHookResult = ReturnType<typeof useGetVideoQuery>;
export type GetVideoLazyQueryHookResult = ReturnType<typeof useGetVideoLazyQuery>;
export type GetVideoQueryResult = Apollo.QueryResult<GetVideoQuery, GetVideoQueryVariables>;
export const AddVideoViewDocument = gql`
    mutation AddVideoView($videoId: ID!, $channelId: ID!) {
  addVideoView(videoId: $videoId, channelId: $channelId) {
    id
    views
  }
}
    `;
export type AddVideoViewMutationFn = Apollo.MutationFunction<AddVideoViewMutation, AddVideoViewMutationVariables>;

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
export function useAddVideoViewMutation(baseOptions?: Apollo.MutationHookOptions<AddVideoViewMutation, AddVideoViewMutationVariables>) {
        return Apollo.useMutation<AddVideoViewMutation, AddVideoViewMutationVariables>(AddVideoViewDocument, baseOptions);
      }
export type AddVideoViewMutationHookResult = ReturnType<typeof useAddVideoViewMutation>;
export type AddVideoViewMutationResult = Apollo.MutationResult<AddVideoViewMutation>;
export type AddVideoViewMutationOptions = Apollo.BaseMutationOptions<AddVideoViewMutation, AddVideoViewMutationVariables>;