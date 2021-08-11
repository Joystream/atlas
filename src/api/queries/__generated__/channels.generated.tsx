import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { DataObjectFieldsFragment } from './shared.generated'
import { DataObjectFieldsFragmentDoc } from './shared.generated'

export type BasicChannelFieldsFragment = {
  __typename?: 'Channel'
  id: string
  title?: Types.Maybe<string>
  createdAt: Date
  avatarPhotoUrls: Array<string>
  avatarPhotoAvailability: Types.AssetAvailability
  avatarPhotoDataObject?: Types.Maybe<{ __typename?: 'DataObject' } & DataObjectFieldsFragment>
}

export type AllChannelFieldsFragment = {
  __typename?: 'Channel'
  description?: Types.Maybe<string>
  follows?: Types.Maybe<number>
  views?: Types.Maybe<number>
  isPublic?: Types.Maybe<boolean>
  isCensored: boolean
  coverPhotoUrls: Array<string>
  coverPhotoAvailability: Types.AssetAvailability
  language?: Types.Maybe<{ __typename?: 'Language'; id: string; iso: string }>
  ownerMember?: Types.Maybe<{ __typename?: 'Membership'; id: string; handle: string; avatarUri?: Types.Maybe<string> }>
  coverPhotoDataObject?: Types.Maybe<{ __typename?: 'DataObject' } & DataObjectFieldsFragment>
} & BasicChannelFieldsFragment

export type GetBasicChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetBasicChannelQuery = {
  __typename?: 'Query'
  channelByUniqueInput?: Types.Maybe<{ __typename?: 'Channel' } & BasicChannelFieldsFragment>
}

export type GetChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetChannelQuery = {
  __typename?: 'Query'
  channelByUniqueInput?: Types.Maybe<{ __typename?: 'Channel' } & AllChannelFieldsFragment>
}

export type GetVideoCountQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetVideoCountQuery = {
  __typename?: 'Query'
  videosConnection: { __typename?: 'VideoConnection'; totalCount: number }
}

export type GetChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
  limit?: Types.Maybe<Types.Scalars['Int']>
  orderBy?: Types.Maybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetChannelsQuery = {
  __typename?: 'Query'
  channels: Array<{ __typename?: 'Channel' } & AllChannelFieldsFragment>
}

export type GetChannelsConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
  where?: Types.Maybe<Types.ChannelWhereInput>
  orderBy?: Types.Maybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetChannelsConnectionQuery = {
  __typename?: 'Query'
  channelsConnection: {
    __typename?: 'ChannelConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'ChannelEdge'
      cursor: string
      node: { __typename?: 'Channel' } & AllChannelFieldsFragment
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
}

export type GetChannelViewsQueryVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
}>

export type GetChannelViewsQuery = {
  __typename?: 'Query'
  channelViews?: Types.Maybe<{ __typename?: 'EntityViewsInfo'; id: string; views: number }>
}

export type GetChannelFollowsQueryVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
}>

export type GetChannelFollowsQuery = {
  __typename?: 'Query'
  channelFollows?: Types.Maybe<{ __typename?: 'ChannelFollowsInfo'; id: string; follows: number }>
}

export type GetBatchedChannelFollowsQueryVariables = Types.Exact<{
  channelIdList: Array<Types.Scalars['ID']> | Types.Scalars['ID']
}>

export type GetBatchedChannelFollowsQuery = {
  __typename?: 'Query'
  batchedChannelFollows: Array<Types.Maybe<{ __typename?: 'ChannelFollowsInfo'; id: string; follows: number }>>
}

export type GetBatchedChannelViewsQueryVariables = Types.Exact<{
  channelIdList: Array<Types.Scalars['ID']> | Types.Scalars['ID']
}>

export type GetBatchedChannelViewsQuery = {
  __typename?: 'Query'
  batchedChannelsViews: Array<Types.Maybe<{ __typename?: 'EntityViewsInfo'; id: string; views: number }>>
}

export type FollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
}>

export type FollowChannelMutation = {
  __typename?: 'Mutation'
  followChannel: { __typename?: 'ChannelFollowsInfo'; id: string; follows: number }
}

export type UnfollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
}>

export type UnfollowChannelMutation = {
  __typename?: 'Mutation'
  unfollowChannel: { __typename?: 'ChannelFollowsInfo'; id: string; follows: number }
}

export type GetMostViewedChannelsQueryVariables = Types.Exact<{
  viewedWithinDays: Types.Scalars['Int']
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetMostViewedChannelsQuery = {
  __typename?: 'Query'
  mostViewedChannels?: Types.Maybe<Array<{ __typename?: 'EntityViewsInfo'; id: string; views: number }>>
}

export type GetMostViewedChannelsAllTimeQueryVariables = Types.Exact<{
  limit: Types.Scalars['Int']
}>

export type GetMostViewedChannelsAllTimeQuery = {
  __typename?: 'Query'
  mostViewedChannelsAllTime?: Types.Maybe<Array<{ __typename?: 'EntityViewsInfo'; id: string; views: number }>>
}

export const BasicChannelFieldsFragmentDoc = gql`
  fragment BasicChannelFields on Channel {
    id
    title
    createdAt
    avatarPhotoUrls
    avatarPhotoAvailability
    avatarPhotoDataObject {
      ...DataObjectFields
    }
  }
  ${DataObjectFieldsFragmentDoc}
`
export const AllChannelFieldsFragmentDoc = gql`
  fragment AllChannelFields on Channel {
    ...BasicChannelFields
    description
    follows
    views
    isPublic
    isCensored
    language {
      id
      iso
    }
    ownerMember {
      id
      handle
      avatarUri
    }
    coverPhotoUrls
    coverPhotoAvailability
    coverPhotoDataObject {
      ...DataObjectFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
  ${DataObjectFieldsFragmentDoc}
`
export const GetBasicChannelDocument = gql`
  query GetBasicChannel($where: ChannelWhereUniqueInput!) {
    channelByUniqueInput(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetBasicChannelQuery__
 *
 * To run a query within a React component, call `useGetBasicChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicChannelQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetBasicChannelQuery(
  baseOptions: Apollo.QueryHookOptions<GetBasicChannelQuery, GetBasicChannelQueryVariables>
) {
  return Apollo.useQuery<GetBasicChannelQuery, GetBasicChannelQueryVariables>(GetBasicChannelDocument, baseOptions)
}
export function useGetBasicChannelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicChannelQuery, GetBasicChannelQueryVariables>
) {
  return Apollo.useLazyQuery<GetBasicChannelQuery, GetBasicChannelQueryVariables>(GetBasicChannelDocument, baseOptions)
}
export type GetBasicChannelQueryHookResult = ReturnType<typeof useGetBasicChannelQuery>
export type GetBasicChannelLazyQueryHookResult = ReturnType<typeof useGetBasicChannelLazyQuery>
export type GetBasicChannelQueryResult = Apollo.QueryResult<GetBasicChannelQuery, GetBasicChannelQueryVariables>
export const GetChannelDocument = gql`
  query GetChannel($where: ChannelWhereUniqueInput!) {
    channelByUniqueInput(where: $where) {
      ...AllChannelFields
    }
  }
  ${AllChannelFieldsFragmentDoc}
`

/**
 * __useGetChannelQuery__
 *
 * To run a query within a React component, call `useGetChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetChannelQuery(baseOptions: Apollo.QueryHookOptions<GetChannelQuery, GetChannelQueryVariables>) {
  return Apollo.useQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, baseOptions)
}
export function useGetChannelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelQuery, GetChannelQueryVariables>
) {
  return Apollo.useLazyQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, baseOptions)
}
export type GetChannelQueryHookResult = ReturnType<typeof useGetChannelQuery>
export type GetChannelLazyQueryHookResult = ReturnType<typeof useGetChannelLazyQuery>
export type GetChannelQueryResult = Apollo.QueryResult<GetChannelQuery, GetChannelQueryVariables>
export const GetVideoCountDocument = gql`
  query GetVideoCount($where: VideoWhereInput) {
    videosConnection(first: 0, where: $where) {
      totalCount
    }
  }
`

/**
 * __useGetVideoCountQuery__
 *
 * To run a query within a React component, call `useGetVideoCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideoCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideoCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetVideoCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetVideoCountQuery, GetVideoCountQueryVariables>
) {
  return Apollo.useQuery<GetVideoCountQuery, GetVideoCountQueryVariables>(GetVideoCountDocument, baseOptions)
}
export function useGetVideoCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideoCountQuery, GetVideoCountQueryVariables>
) {
  return Apollo.useLazyQuery<GetVideoCountQuery, GetVideoCountQueryVariables>(GetVideoCountDocument, baseOptions)
}
export type GetVideoCountQueryHookResult = ReturnType<typeof useGetVideoCountQuery>
export type GetVideoCountLazyQueryHookResult = ReturnType<typeof useGetVideoCountLazyQuery>
export type GetVideoCountQueryResult = Apollo.QueryResult<GetVideoCountQuery, GetVideoCountQueryVariables>
export const GetChannelsDocument = gql`
  query GetChannels($where: ChannelWhereInput, $limit: Int = 50, $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]) {
    channels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...AllChannelFields
    }
  }
  ${AllChannelFieldsFragmentDoc}
`

/**
 * __useGetChannelsQuery__
 *
 * To run a query within a React component, call `useGetChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>
) {
  return Apollo.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, baseOptions)
}
export function useGetChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>
) {
  return Apollo.useLazyQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, baseOptions)
}
export type GetChannelsQueryHookResult = ReturnType<typeof useGetChannelsQuery>
export type GetChannelsLazyQueryHookResult = ReturnType<typeof useGetChannelsLazyQuery>
export type GetChannelsQueryResult = Apollo.QueryResult<GetChannelsQuery, GetChannelsQueryVariables>
export const GetChannelsConnectionDocument = gql`
  query GetChannelsConnection(
    $first: Int
    $after: String
    $where: ChannelWhereInput
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    channelsConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...AllChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${AllChannelFieldsFragmentDoc}
`

/**
 * __useGetChannelsConnectionQuery__
 *
 * To run a query within a React component, call `useGetChannelsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetChannelsConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>
) {
  return Apollo.useQuery<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>(
    GetChannelsConnectionDocument,
    baseOptions
  )
}
export function useGetChannelsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>
) {
  return Apollo.useLazyQuery<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>(
    GetChannelsConnectionDocument,
    baseOptions
  )
}
export type GetChannelsConnectionQueryHookResult = ReturnType<typeof useGetChannelsConnectionQuery>
export type GetChannelsConnectionLazyQueryHookResult = ReturnType<typeof useGetChannelsConnectionLazyQuery>
export type GetChannelsConnectionQueryResult = Apollo.QueryResult<
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables
>
export const GetChannelViewsDocument = gql`
  query GetChannelViews($channelId: ID!) {
    channelViews(channelId: $channelId) {
      id
      views
    }
  }
`

/**
 * __useGetChannelViewsQuery__
 *
 * To run a query within a React component, call `useGetChannelViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelViewsQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetChannelViewsQuery(
  baseOptions: Apollo.QueryHookOptions<GetChannelViewsQuery, GetChannelViewsQueryVariables>
) {
  return Apollo.useQuery<GetChannelViewsQuery, GetChannelViewsQueryVariables>(GetChannelViewsDocument, baseOptions)
}
export function useGetChannelViewsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelViewsQuery, GetChannelViewsQueryVariables>
) {
  return Apollo.useLazyQuery<GetChannelViewsQuery, GetChannelViewsQueryVariables>(GetChannelViewsDocument, baseOptions)
}
export type GetChannelViewsQueryHookResult = ReturnType<typeof useGetChannelViewsQuery>
export type GetChannelViewsLazyQueryHookResult = ReturnType<typeof useGetChannelViewsLazyQuery>
export type GetChannelViewsQueryResult = Apollo.QueryResult<GetChannelViewsQuery, GetChannelViewsQueryVariables>
export const GetChannelFollowsDocument = gql`
  query GetChannelFollows($channelId: ID!) {
    channelFollows(channelId: $channelId) {
      id
      follows
    }
  }
`

/**
 * __useGetChannelFollowsQuery__
 *
 * To run a query within a React component, call `useGetChannelFollowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelFollowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelFollowsQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetChannelFollowsQuery(
  baseOptions: Apollo.QueryHookOptions<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>
) {
  return Apollo.useQuery<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>(
    GetChannelFollowsDocument,
    baseOptions
  )
}
export function useGetChannelFollowsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>
) {
  return Apollo.useLazyQuery<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>(
    GetChannelFollowsDocument,
    baseOptions
  )
}
export type GetChannelFollowsQueryHookResult = ReturnType<typeof useGetChannelFollowsQuery>
export type GetChannelFollowsLazyQueryHookResult = ReturnType<typeof useGetChannelFollowsLazyQuery>
export type GetChannelFollowsQueryResult = Apollo.QueryResult<GetChannelFollowsQuery, GetChannelFollowsQueryVariables>
export const GetBatchedChannelFollowsDocument = gql`
  query GetBatchedChannelFollows($channelIdList: [ID!]!) {
    batchedChannelFollows(channelIdList: $channelIdList) {
      id
      follows
    }
  }
`

/**
 * __useGetBatchedChannelFollowsQuery__
 *
 * To run a query within a React component, call `useGetBatchedChannelFollowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBatchedChannelFollowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBatchedChannelFollowsQuery({
 *   variables: {
 *      channelIdList: // value for 'channelIdList'
 *   },
 * });
 */
export function useGetBatchedChannelFollowsQuery(
  baseOptions: Apollo.QueryHookOptions<GetBatchedChannelFollowsQuery, GetBatchedChannelFollowsQueryVariables>
) {
  return Apollo.useQuery<GetBatchedChannelFollowsQuery, GetBatchedChannelFollowsQueryVariables>(
    GetBatchedChannelFollowsDocument,
    baseOptions
  )
}
export function useGetBatchedChannelFollowsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBatchedChannelFollowsQuery, GetBatchedChannelFollowsQueryVariables>
) {
  return Apollo.useLazyQuery<GetBatchedChannelFollowsQuery, GetBatchedChannelFollowsQueryVariables>(
    GetBatchedChannelFollowsDocument,
    baseOptions
  )
}
export type GetBatchedChannelFollowsQueryHookResult = ReturnType<typeof useGetBatchedChannelFollowsQuery>
export type GetBatchedChannelFollowsLazyQueryHookResult = ReturnType<typeof useGetBatchedChannelFollowsLazyQuery>
export type GetBatchedChannelFollowsQueryResult = Apollo.QueryResult<
  GetBatchedChannelFollowsQuery,
  GetBatchedChannelFollowsQueryVariables
>
export const GetBatchedChannelViewsDocument = gql`
  query GetBatchedChannelViews($channelIdList: [ID!]!) {
    batchedChannelsViews(channelIdList: $channelIdList) {
      id
      views
    }
  }
`

/**
 * __useGetBatchedChannelViewsQuery__
 *
 * To run a query within a React component, call `useGetBatchedChannelViewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBatchedChannelViewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBatchedChannelViewsQuery({
 *   variables: {
 *      channelIdList: // value for 'channelIdList'
 *   },
 * });
 */
export function useGetBatchedChannelViewsQuery(
  baseOptions: Apollo.QueryHookOptions<GetBatchedChannelViewsQuery, GetBatchedChannelViewsQueryVariables>
) {
  return Apollo.useQuery<GetBatchedChannelViewsQuery, GetBatchedChannelViewsQueryVariables>(
    GetBatchedChannelViewsDocument,
    baseOptions
  )
}
export function useGetBatchedChannelViewsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBatchedChannelViewsQuery, GetBatchedChannelViewsQueryVariables>
) {
  return Apollo.useLazyQuery<GetBatchedChannelViewsQuery, GetBatchedChannelViewsQueryVariables>(
    GetBatchedChannelViewsDocument,
    baseOptions
  )
}
export type GetBatchedChannelViewsQueryHookResult = ReturnType<typeof useGetBatchedChannelViewsQuery>
export type GetBatchedChannelViewsLazyQueryHookResult = ReturnType<typeof useGetBatchedChannelViewsLazyQuery>
export type GetBatchedChannelViewsQueryResult = Apollo.QueryResult<
  GetBatchedChannelViewsQuery,
  GetBatchedChannelViewsQueryVariables
>
export const FollowChannelDocument = gql`
  mutation FollowChannel($channelId: ID!) {
    followChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
export type FollowChannelMutationFn = Apollo.MutationFunction<FollowChannelMutation, FollowChannelMutationVariables>

/**
 * __useFollowChannelMutation__
 *
 * To run a mutation, you first call `useFollowChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followChannelMutation, { data, loading, error }] = useFollowChannelMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useFollowChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<FollowChannelMutation, FollowChannelMutationVariables>
) {
  return Apollo.useMutation<FollowChannelMutation, FollowChannelMutationVariables>(FollowChannelDocument, baseOptions)
}
export type FollowChannelMutationHookResult = ReturnType<typeof useFollowChannelMutation>
export type FollowChannelMutationResult = Apollo.MutationResult<FollowChannelMutation>
export type FollowChannelMutationOptions = Apollo.BaseMutationOptions<
  FollowChannelMutation,
  FollowChannelMutationVariables
>
export const UnfollowChannelDocument = gql`
  mutation UnfollowChannel($channelId: ID!) {
    unfollowChannel(channelId: $channelId) {
      id
      follows
    }
  }
`
export type UnfollowChannelMutationFn = Apollo.MutationFunction<
  UnfollowChannelMutation,
  UnfollowChannelMutationVariables
>

/**
 * __useUnfollowChannelMutation__
 *
 * To run a mutation, you first call `useUnfollowChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowChannelMutation, { data, loading, error }] = useUnfollowChannelMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useUnfollowChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<UnfollowChannelMutation, UnfollowChannelMutationVariables>
) {
  return Apollo.useMutation<UnfollowChannelMutation, UnfollowChannelMutationVariables>(
    UnfollowChannelDocument,
    baseOptions
  )
}
export type UnfollowChannelMutationHookResult = ReturnType<typeof useUnfollowChannelMutation>
export type UnfollowChannelMutationResult = Apollo.MutationResult<UnfollowChannelMutation>
export type UnfollowChannelMutationOptions = Apollo.BaseMutationOptions<
  UnfollowChannelMutation,
  UnfollowChannelMutationVariables
>
export const GetMostViewedChannelsDocument = gql`
  query GetMostViewedChannels($viewedWithinDays: Int!, $limit: Int) {
    mostViewedChannels(period: $viewedWithinDays, limit: $limit) {
      id
      views
    }
  }
`

/**
 * __useGetMostViewedChannelsQuery__
 *
 * To run a query within a React component, call `useGetMostViewedChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostViewedChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostViewedChannelsQuery({
 *   variables: {
 *      viewedWithinDays: // value for 'viewedWithinDays'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMostViewedChannelsQuery(
  baseOptions: Apollo.QueryHookOptions<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>
) {
  return Apollo.useQuery<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>(
    GetMostViewedChannelsDocument,
    baseOptions
  )
}
export function useGetMostViewedChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>
) {
  return Apollo.useLazyQuery<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>(
    GetMostViewedChannelsDocument,
    baseOptions
  )
}
export type GetMostViewedChannelsQueryHookResult = ReturnType<typeof useGetMostViewedChannelsQuery>
export type GetMostViewedChannelsLazyQueryHookResult = ReturnType<typeof useGetMostViewedChannelsLazyQuery>
export type GetMostViewedChannelsQueryResult = Apollo.QueryResult<
  GetMostViewedChannelsQuery,
  GetMostViewedChannelsQueryVariables
>
export const GetMostViewedChannelsAllTimeDocument = gql`
  query GetMostViewedChannelsAllTime($limit: Int!) {
    mostViewedChannelsAllTime(limit: $limit) {
      id
      views
    }
  }
`

/**
 * __useGetMostViewedChannelsAllTimeQuery__
 *
 * To run a query within a React component, call `useGetMostViewedChannelsAllTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostViewedChannelsAllTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostViewedChannelsAllTimeQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMostViewedChannelsAllTimeQuery(
  baseOptions: Apollo.QueryHookOptions<GetMostViewedChannelsAllTimeQuery, GetMostViewedChannelsAllTimeQueryVariables>
) {
  return Apollo.useQuery<GetMostViewedChannelsAllTimeQuery, GetMostViewedChannelsAllTimeQueryVariables>(
    GetMostViewedChannelsAllTimeDocument,
    baseOptions
  )
}
export function useGetMostViewedChannelsAllTimeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostViewedChannelsAllTimeQuery,
    GetMostViewedChannelsAllTimeQueryVariables
  >
) {
  return Apollo.useLazyQuery<GetMostViewedChannelsAllTimeQuery, GetMostViewedChannelsAllTimeQueryVariables>(
    GetMostViewedChannelsAllTimeDocument,
    baseOptions
  )
}
export type GetMostViewedChannelsAllTimeQueryHookResult = ReturnType<typeof useGetMostViewedChannelsAllTimeQuery>
export type GetMostViewedChannelsAllTimeLazyQueryHookResult = ReturnType<
  typeof useGetMostViewedChannelsAllTimeLazyQuery
>
export type GetMostViewedChannelsAllTimeQueryResult = Apollo.QueryResult<
  GetMostViewedChannelsAllTimeQuery,
  GetMostViewedChannelsAllTimeQueryVariables
>
