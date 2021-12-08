import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { DataObjectFieldsFragmentDoc } from './shared.generated'

const defaultOptions = {}
export type BasicChannelFieldsFragment = {
  __typename?: 'Channel'
  id: string
  title?: Types.Maybe<string>
  createdAt: Date
  avatarPhotoUrls: Array<string>
  avatarPhotoAvailability: Types.AssetAvailability
  avatarPhotoDataObject?: Types.Maybe<{
    __typename?: 'DataObject'
    id: string
    createdAt: Date
    size: number
    liaisonJudgement: Types.LiaisonJudgement
    ipfsContentId: string
    joystreamContentId: string
    liaison?: Types.Maybe<{
      __typename?: 'Worker'
      id: string
      workerId: string
      metadata?: Types.Maybe<string>
      isActive: boolean
      type: Types.WorkerType
    }>
  }>
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
  id: string
  title?: Types.Maybe<string>
  createdAt: Date
  avatarPhotoUrls: Array<string>
  avatarPhotoAvailability: Types.AssetAvailability
  language?: Types.Maybe<{ __typename?: 'Language'; id: string; iso: string }>
  ownerMember?: Types.Maybe<{ __typename?: 'Membership'; id: string; handle: string; avatarUri?: Types.Maybe<string> }>
  coverPhotoDataObject?: Types.Maybe<{
    __typename?: 'DataObject'
    id: string
    createdAt: Date
    size: number
    liaisonJudgement: Types.LiaisonJudgement
    ipfsContentId: string
    joystreamContentId: string
    liaison?: Types.Maybe<{
      __typename?: 'Worker'
      id: string
      workerId: string
      metadata?: Types.Maybe<string>
      isActive: boolean
      type: Types.WorkerType
    }>
  }>
  avatarPhotoDataObject?: Types.Maybe<{
    __typename?: 'DataObject'
    id: string
    createdAt: Date
    size: number
    liaisonJudgement: Types.LiaisonJudgement
    ipfsContentId: string
    joystreamContentId: string
    liaison?: Types.Maybe<{
      __typename?: 'Worker'
      id: string
      workerId: string
      metadata?: Types.Maybe<string>
      isActive: boolean
      type: Types.WorkerType
    }>
  }>
}

export type GetBasicChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetBasicChannelQuery = {
  __typename?: 'Query'
  channelByUniqueInput?: Types.Maybe<{
    __typename?: 'Channel'
    id: string
    title?: Types.Maybe<string>
    createdAt: Date
    avatarPhotoUrls: Array<string>
    avatarPhotoAvailability: Types.AssetAvailability
    avatarPhotoDataObject?: Types.Maybe<{
      __typename?: 'DataObject'
      id: string
      createdAt: Date
      size: number
      liaisonJudgement: Types.LiaisonJudgement
      ipfsContentId: string
      joystreamContentId: string
      liaison?: Types.Maybe<{
        __typename?: 'Worker'
        id: string
        workerId: string
        metadata?: Types.Maybe<string>
        isActive: boolean
        type: Types.WorkerType
      }>
    }>
  }>
}

export type GetChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetChannelQuery = {
  __typename?: 'Query'
  channelByUniqueInput?: Types.Maybe<{
    __typename?: 'Channel'
    description?: Types.Maybe<string>
    follows?: Types.Maybe<number>
    views?: Types.Maybe<number>
    isPublic?: Types.Maybe<boolean>
    isCensored: boolean
    coverPhotoUrls: Array<string>
    coverPhotoAvailability: Types.AssetAvailability
    id: string
    title?: Types.Maybe<string>
    createdAt: Date
    avatarPhotoUrls: Array<string>
    avatarPhotoAvailability: Types.AssetAvailability
    language?: Types.Maybe<{ __typename?: 'Language'; id: string; iso: string }>
    ownerMember?: Types.Maybe<{
      __typename?: 'Membership'
      id: string
      handle: string
      avatarUri?: Types.Maybe<string>
    }>
    coverPhotoDataObject?: Types.Maybe<{
      __typename?: 'DataObject'
      id: string
      createdAt: Date
      size: number
      liaisonJudgement: Types.LiaisonJudgement
      ipfsContentId: string
      joystreamContentId: string
      liaison?: Types.Maybe<{
        __typename?: 'Worker'
        id: string
        workerId: string
        metadata?: Types.Maybe<string>
        isActive: boolean
        type: Types.WorkerType
      }>
    }>
    avatarPhotoDataObject?: Types.Maybe<{
      __typename?: 'DataObject'
      id: string
      createdAt: Date
      size: number
      liaisonJudgement: Types.LiaisonJudgement
      ipfsContentId: string
      joystreamContentId: string
      liaison?: Types.Maybe<{
        __typename?: 'Worker'
        id: string
        workerId: string
        metadata?: Types.Maybe<string>
        isActive: boolean
        type: Types.WorkerType
      }>
    }>
  }>
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
  channels: Array<{
    __typename?: 'Channel'
    description?: Types.Maybe<string>
    follows?: Types.Maybe<number>
    views?: Types.Maybe<number>
    isPublic?: Types.Maybe<boolean>
    isCensored: boolean
    coverPhotoUrls: Array<string>
    coverPhotoAvailability: Types.AssetAvailability
    id: string
    title?: Types.Maybe<string>
    createdAt: Date
    avatarPhotoUrls: Array<string>
    avatarPhotoAvailability: Types.AssetAvailability
    language?: Types.Maybe<{ __typename?: 'Language'; id: string; iso: string }>
    ownerMember?: Types.Maybe<{
      __typename?: 'Membership'
      id: string
      handle: string
      avatarUri?: Types.Maybe<string>
    }>
    coverPhotoDataObject?: Types.Maybe<{
      __typename?: 'DataObject'
      id: string
      createdAt: Date
      size: number
      liaisonJudgement: Types.LiaisonJudgement
      ipfsContentId: string
      joystreamContentId: string
      liaison?: Types.Maybe<{
        __typename?: 'Worker'
        id: string
        workerId: string
        metadata?: Types.Maybe<string>
        isActive: boolean
        type: Types.WorkerType
      }>
    }>
    avatarPhotoDataObject?: Types.Maybe<{
      __typename?: 'DataObject'
      id: string
      createdAt: Date
      size: number
      liaisonJudgement: Types.LiaisonJudgement
      ipfsContentId: string
      joystreamContentId: string
      liaison?: Types.Maybe<{
        __typename?: 'Worker'
        id: string
        workerId: string
        metadata?: Types.Maybe<string>
        isActive: boolean
        type: Types.WorkerType
      }>
    }>
  }>
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
      node: {
        __typename?: 'Channel'
        description?: Types.Maybe<string>
        follows?: Types.Maybe<number>
        views?: Types.Maybe<number>
        isPublic?: Types.Maybe<boolean>
        isCensored: boolean
        coverPhotoUrls: Array<string>
        coverPhotoAvailability: Types.AssetAvailability
        id: string
        title?: Types.Maybe<string>
        createdAt: Date
        avatarPhotoUrls: Array<string>
        avatarPhotoAvailability: Types.AssetAvailability
        language?: Types.Maybe<{ __typename?: 'Language'; id: string; iso: string }>
        ownerMember?: Types.Maybe<{
          __typename?: 'Membership'
          id: string
          handle: string
          avatarUri?: Types.Maybe<string>
        }>
        coverPhotoDataObject?: Types.Maybe<{
          __typename?: 'DataObject'
          id: string
          createdAt: Date
          size: number
          liaisonJudgement: Types.LiaisonJudgement
          ipfsContentId: string
          joystreamContentId: string
          liaison?: Types.Maybe<{
            __typename?: 'Worker'
            id: string
            workerId: string
            metadata?: Types.Maybe<string>
            isActive: boolean
            type: Types.WorkerType
          }>
        }>
        avatarPhotoDataObject?: Types.Maybe<{
          __typename?: 'DataObject'
          id: string
          createdAt: Date
          size: number
          liaisonJudgement: Types.LiaisonJudgement
          ipfsContentId: string
          joystreamContentId: string
          liaison?: Types.Maybe<{
            __typename?: 'Worker'
            id: string
            workerId: string
            metadata?: Types.Maybe<string>
            isActive: boolean
            type: Types.WorkerType
          }>
        }>
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: Types.Maybe<string> }
  }
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
  timePeriodDays: Types.Scalars['Int']
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetMostViewedChannelsQuery = {
  __typename?: 'Query'
  mostViewedChannels?: Types.Maybe<
    Array<{
      __typename?: 'Channel'
      id: string
      title?: Types.Maybe<string>
      createdAt: Date
      avatarPhotoUrls: Array<string>
      avatarPhotoAvailability: Types.AssetAvailability
      avatarPhotoDataObject?: Types.Maybe<{
        __typename?: 'DataObject'
        id: string
        createdAt: Date
        size: number
        liaisonJudgement: Types.LiaisonJudgement
        ipfsContentId: string
        joystreamContentId: string
        liaison?: Types.Maybe<{
          __typename?: 'Worker'
          id: string
          workerId: string
          metadata?: Types.Maybe<string>
          isActive: boolean
          type: Types.WorkerType
        }>
      }>
    }>
  >
}

export type GetMostViewedChannelsAllTimeQueryVariables = Types.Exact<{
  limit: Types.Scalars['Int']
}>

export type GetMostViewedChannelsAllTimeQuery = {
  __typename?: 'Query'
  mostViewedChannelsAllTime?: Types.Maybe<
    Array<{
      __typename?: 'Channel'
      id: string
      title?: Types.Maybe<string>
      createdAt: Date
      avatarPhotoUrls: Array<string>
      avatarPhotoAvailability: Types.AssetAvailability
      avatarPhotoDataObject?: Types.Maybe<{
        __typename?: 'DataObject'
        id: string
        createdAt: Date
        size: number
        liaisonJudgement: Types.LiaisonJudgement
        ipfsContentId: string
        joystreamContentId: string
        liaison?: Types.Maybe<{
          __typename?: 'Worker'
          id: string
          workerId: string
          metadata?: Types.Maybe<string>
          isActive: boolean
          type: Types.WorkerType
        }>
      }>
    }>
  >
}

export type GetMostFollowedChannelsQueryVariables = Types.Exact<{
  timePeriodDays: Types.Scalars['Int']
  limit?: Types.Maybe<Types.Scalars['Int']>
}>

export type GetMostFollowedChannelsQuery = {
  __typename?: 'Query'
  mostFollowedChannels: Array<{
    __typename?: 'Channel'
    id: string
    title?: Types.Maybe<string>
    createdAt: Date
    avatarPhotoUrls: Array<string>
    avatarPhotoAvailability: Types.AssetAvailability
    avatarPhotoDataObject?: Types.Maybe<{
      __typename?: 'DataObject'
      id: string
      createdAt: Date
      size: number
      liaisonJudgement: Types.LiaisonJudgement
      ipfsContentId: string
      joystreamContentId: string
      liaison?: Types.Maybe<{
        __typename?: 'Worker'
        id: string
        workerId: string
        metadata?: Types.Maybe<string>
        isActive: boolean
        type: Types.WorkerType
      }>
    }>
  }>
}

export type GetMostFollowedChannelsAllTimeQueryVariables = Types.Exact<{
  limit: Types.Scalars['Int']
}>

export type GetMostFollowedChannelsAllTimeQuery = {
  __typename?: 'Query'
  mostFollowedChannelsAllTime?: Types.Maybe<
    Array<{
      __typename?: 'Channel'
      id: string
      title?: Types.Maybe<string>
      createdAt: Date
      avatarPhotoUrls: Array<string>
      avatarPhotoAvailability: Types.AssetAvailability
      avatarPhotoDataObject?: Types.Maybe<{
        __typename?: 'DataObject'
        id: string
        createdAt: Date
        size: number
        liaisonJudgement: Types.LiaisonJudgement
        ipfsContentId: string
        joystreamContentId: string
        liaison?: Types.Maybe<{
          __typename?: 'Worker'
          id: string
          workerId: string
          metadata?: Types.Maybe<string>
          isActive: boolean
          type: Types.WorkerType
        }>
      }>
    }>
  >
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicChannelQuery, GetBasicChannelQueryVariables>(GetBasicChannelDocument, options)
}
export function useGetBasicChannelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicChannelQuery, GetBasicChannelQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicChannelQuery, GetBasicChannelQueryVariables>(GetBasicChannelDocument, options)
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options)
}
export function useGetChannelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelQuery, GetChannelQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelQuery, GetChannelQueryVariables>(GetChannelDocument, options)
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetVideoCountQuery, GetVideoCountQueryVariables>(GetVideoCountDocument, options)
}
export function useGetVideoCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideoCountQuery, GetVideoCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetVideoCountQuery, GetVideoCountQueryVariables>(GetVideoCountDocument, options)
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options)
}
export function useGetChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsQuery, GetChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelsQuery, GetChannelsQueryVariables>(GetChannelsDocument, options)
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>(
    GetChannelsConnectionDocument,
    options
  )
}
export function useGetChannelsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelsConnectionQuery, GetChannelsConnectionQueryVariables>(
    GetChannelsConnectionDocument,
    options
  )
}
export type GetChannelsConnectionQueryHookResult = ReturnType<typeof useGetChannelsConnectionQuery>
export type GetChannelsConnectionLazyQueryHookResult = ReturnType<typeof useGetChannelsConnectionLazyQuery>
export type GetChannelsConnectionQueryResult = Apollo.QueryResult<
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<FollowChannelMutation, FollowChannelMutationVariables>(FollowChannelDocument, options)
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UnfollowChannelMutation, UnfollowChannelMutationVariables>(UnfollowChannelDocument, options)
}
export type UnfollowChannelMutationHookResult = ReturnType<typeof useUnfollowChannelMutation>
export type UnfollowChannelMutationResult = Apollo.MutationResult<UnfollowChannelMutation>
export type UnfollowChannelMutationOptions = Apollo.BaseMutationOptions<
  UnfollowChannelMutation,
  UnfollowChannelMutationVariables
>
export const GetMostViewedChannelsDocument = gql`
  query GetMostViewedChannels($timePeriodDays: Int!, $limit: Int) {
    mostViewedChannels(timePeriodDays: $timePeriodDays, limit: $limit) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
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
 *      timePeriodDays: // value for 'timePeriodDays'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMostViewedChannelsQuery(
  baseOptions: Apollo.QueryHookOptions<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>(
    GetMostViewedChannelsDocument,
    options
  )
}
export function useGetMostViewedChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostViewedChannelsQuery, GetMostViewedChannelsQueryVariables>(
    GetMostViewedChannelsDocument,
    options
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
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
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
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostViewedChannelsAllTimeQuery, GetMostViewedChannelsAllTimeQueryVariables>(
    GetMostViewedChannelsAllTimeDocument,
    options
  )
}
export function useGetMostViewedChannelsAllTimeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostViewedChannelsAllTimeQuery,
    GetMostViewedChannelsAllTimeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostViewedChannelsAllTimeQuery, GetMostViewedChannelsAllTimeQueryVariables>(
    GetMostViewedChannelsAllTimeDocument,
    options
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
export const GetMostFollowedChannelsDocument = gql`
  query GetMostFollowedChannels($timePeriodDays: Int!, $limit: Int) {
    mostFollowedChannels(timePeriodDays: $timePeriodDays, limit: $limit) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetMostFollowedChannelsQuery__
 *
 * To run a query within a React component, call `useGetMostFollowedChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostFollowedChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostFollowedChannelsQuery({
 *   variables: {
 *      timePeriodDays: // value for 'timePeriodDays'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMostFollowedChannelsQuery(
  baseOptions: Apollo.QueryHookOptions<GetMostFollowedChannelsQuery, GetMostFollowedChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostFollowedChannelsQuery, GetMostFollowedChannelsQueryVariables>(
    GetMostFollowedChannelsDocument,
    options
  )
}
export function useGetMostFollowedChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMostFollowedChannelsQuery, GetMostFollowedChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostFollowedChannelsQuery, GetMostFollowedChannelsQueryVariables>(
    GetMostFollowedChannelsDocument,
    options
  )
}
export type GetMostFollowedChannelsQueryHookResult = ReturnType<typeof useGetMostFollowedChannelsQuery>
export type GetMostFollowedChannelsLazyQueryHookResult = ReturnType<typeof useGetMostFollowedChannelsLazyQuery>
export type GetMostFollowedChannelsQueryResult = Apollo.QueryResult<
  GetMostFollowedChannelsQuery,
  GetMostFollowedChannelsQueryVariables
>
export const GetMostFollowedChannelsAllTimeDocument = gql`
  query GetMostFollowedChannelsAllTime($limit: Int!) {
    mostFollowedChannelsAllTime(limit: $limit) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetMostFollowedChannelsAllTimeQuery__
 *
 * To run a query within a React component, call `useGetMostFollowedChannelsAllTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostFollowedChannelsAllTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostFollowedChannelsAllTimeQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMostFollowedChannelsAllTimeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMostFollowedChannelsAllTimeQuery,
    GetMostFollowedChannelsAllTimeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostFollowedChannelsAllTimeQuery, GetMostFollowedChannelsAllTimeQueryVariables>(
    GetMostFollowedChannelsAllTimeDocument,
    options
  )
}
export function useGetMostFollowedChannelsAllTimeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostFollowedChannelsAllTimeQuery,
    GetMostFollowedChannelsAllTimeQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostFollowedChannelsAllTimeQuery, GetMostFollowedChannelsAllTimeQueryVariables>(
    GetMostFollowedChannelsAllTimeDocument,
    options
  )
}
export type GetMostFollowedChannelsAllTimeQueryHookResult = ReturnType<typeof useGetMostFollowedChannelsAllTimeQuery>
export type GetMostFollowedChannelsAllTimeLazyQueryHookResult = ReturnType<
  typeof useGetMostFollowedChannelsAllTimeLazyQuery
>
export type GetMostFollowedChannelsAllTimeQueryResult = Apollo.QueryResult<
  GetMostFollowedChannelsAllTimeQuery,
  GetMostFollowedChannelsAllTimeQueryVariables
>
