import * as Types from './baseTypes.generated'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type BasicChannelFieldsFragment = {
  __typename?: 'Channel'
  id: string
  handle: string
  avatarPhotoUrl?: Types.Maybe<string>
  createdAt: Date
  description: string
  isPublic: boolean
  language?: Types.Maybe<{ __typename?: 'Language'; name: string }>
}

export type AllChannelFieldsFragment = {
  __typename?: 'Channel'
  coverPhotoUrl?: Types.Maybe<string>
  follows?: Types.Maybe<number>
} & BasicChannelFieldsFragment

export type GetBasicChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetBasicChannelQuery = {
  __typename?: 'Query'
  channel?: Types.Maybe<{ __typename?: 'Channel' } & BasicChannelFieldsFragment>
}

export type GetChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetChannelQuery = {
  __typename?: 'Query'
  channel?: Types.Maybe<{ __typename?: 'Channel' } & AllChannelFieldsFragment>
}

export type GetChannelVideoCountQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.VideoWhereInput>
}>

export type GetChannelVideoCountQuery = {
  __typename?: 'Query'
  videosConnection: { __typename?: 'VideoConnection'; totalCount: number }
}

export type GetChannelsQueryVariables = Types.Exact<{
  where?: Types.Maybe<Types.ChannelWhereInput>
}>

export type GetChannelsQuery = {
  __typename?: 'Query'
  channels: Array<{ __typename?: 'Channel' } & AllChannelFieldsFragment>
}

export type GetChannelsConnectionQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>
  after?: Types.Maybe<Types.Scalars['String']>
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

export type GetChannelFollowsQueryVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
}>

export type GetChannelFollowsQuery = {
  __typename?: 'Query'
  channelFollows?: Types.Maybe<{ __typename?: 'ChannelFollowsInfo'; id: string; follows: number }>
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

export const BasicChannelFieldsFragmentDoc = gql`
  fragment BasicChannelFields on Channel {
    id
    handle
    avatarPhotoUrl
    createdAt
    description
    isPublic
    language {
      name
    }
  }
`
export const AllChannelFieldsFragmentDoc = gql`
  fragment AllChannelFields on Channel {
    ...BasicChannelFields
    coverPhotoUrl
    follows
  }
  ${BasicChannelFieldsFragmentDoc}
`
export const GetBasicChannelDocument = gql`
  query GetBasicChannel($where: ChannelWhereUniqueInput!) {
    channel(where: $where) {
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
    channel(where: $where) {
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
export const GetChannelVideoCountDocument = gql`
  query GetChannelVideoCount($where: VideoWhereInput) {
    videosConnection(first: 0, where: $where) {
      totalCount
    }
  }
`

/**
 * __useGetChannelVideoCountQuery__
 *
 * To run a query within a React component, call `useGetChannelVideoCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelVideoCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelVideoCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetChannelVideoCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelVideoCountQuery, GetChannelVideoCountQueryVariables>
) {
  return Apollo.useQuery<GetChannelVideoCountQuery, GetChannelVideoCountQueryVariables>(
    GetChannelVideoCountDocument,
    baseOptions
  )
}
export function useGetChannelVideoCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelVideoCountQuery, GetChannelVideoCountQueryVariables>
) {
  return Apollo.useLazyQuery<GetChannelVideoCountQuery, GetChannelVideoCountQueryVariables>(
    GetChannelVideoCountDocument,
    baseOptions
  )
}
export type GetChannelVideoCountQueryHookResult = ReturnType<typeof useGetChannelVideoCountQuery>
export type GetChannelVideoCountLazyQueryHookResult = ReturnType<typeof useGetChannelVideoCountLazyQuery>
export type GetChannelVideoCountQueryResult = Apollo.QueryResult<
  GetChannelVideoCountQuery,
  GetChannelVideoCountQueryVariables
>
export const GetChannelsDocument = gql`
  query GetChannels($where: ChannelWhereInput) {
    channels(where: $where) {
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
  query GetChannelsConnection($first: Int, $after: String) {
    channelsConnection(first: $first, after: $after, orderBy: createdAt_DESC) {
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
