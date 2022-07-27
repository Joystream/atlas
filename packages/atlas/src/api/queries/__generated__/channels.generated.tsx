import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import {
  BasicChannelFieldsFragmentDoc,
  BasicMembershipFieldsFragmentDoc,
  FullChannelFieldsFragmentDoc,
} from './fragments.generated'

const defaultOptions = {} as const
export type GetBasicChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetBasicChannelQuery = {
  __typename?: 'Query'
  channelByUniqueInput?: {
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    rewardAccount: string
    avatarPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
  } | null
}

export type GetFullChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetFullChannelQuery = {
  __typename?: 'Query'
  channelByUniqueInput?: {
    __typename?: 'Channel'
    views: number
    activeVideosCounter: number
    description?: string | null
    isPublic?: boolean | null
    isCensored: boolean
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    rewardAccount: string
    language?: { __typename?: 'Language'; id: string; iso: string } | null
    ownerMember?: {
      __typename?: 'Membership'
      id: string
      handle: string
      metadata: {
        __typename?: 'MemberMetadata'
        about?: string | null
        avatar?:
          | {
              __typename?: 'AvatarObject'
              avatarObject?: {
                __typename?: 'StorageDataObject'
                id: string
                createdAt: Date
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    coverPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
    avatarPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
  } | null
}

export type GetVideoCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetVideoCountQuery = {
  __typename?: 'Query'
  videosConnection: { __typename?: 'VideoConnection'; totalCount: number }
}

export type GetBasicChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  orderBy?: Types.InputMaybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetBasicChannelsQuery = {
  __typename?: 'Query'
  channels: Array<{
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    rewardAccount: string
    avatarPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
  }>
}

export type GetBasicChannelsConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  where?: Types.InputMaybe<Types.ChannelWhereInput>
  orderBy?: Types.InputMaybe<Types.ChannelOrderByInput>
}>

export type GetBasicChannelsConnectionQuery = {
  __typename?: 'Query'
  channelsConnection: {
    __typename?: 'ChannelConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'ChannelEdge'
      cursor: string
      node: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        createdAt: Date
        follows: number
        rewardAccount: string
        avatarPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
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

export type GetMostViewedChannelsConnectionQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  periodDays?: Types.InputMaybe<Types.Scalars['Int']>
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  where?: Types.InputMaybe<Types.ChannelWhereInput>
}>

export type GetMostViewedChannelsConnectionQuery = {
  __typename?: 'Query'
  mostViewedChannelsConnection: {
    __typename?: 'ChannelConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'ChannelEdge'
      cursor: string
      node: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        createdAt: Date
        follows: number
        rewardAccount: string
        avatarPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetMostFollowedChannelsConnectionQueryVariables = Types.Exact<{
  limit: Types.Scalars['Int']
  periodDays?: Types.InputMaybe<Types.Scalars['Int']>
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  where?: Types.InputMaybe<Types.ChannelWhereInput>
}>

export type GetMostFollowedChannelsConnectionQuery = {
  __typename?: 'Query'
  mostFollowedChannelsConnection: {
    __typename?: 'ChannelConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'ChannelEdge'
      cursor: string
      node: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        createdAt: Date
        follows: number
        rewardAccount: string
        avatarPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          createdAt: Date
          size: string
          isAccepted: boolean
          ipfsHash: string
          storageBag: { __typename?: 'StorageBag'; id: string }
          type:
            | { __typename: 'DataObjectTypeChannelAvatar' }
            | { __typename: 'DataObjectTypeChannelCoverPhoto' }
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetTop10ChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelWhereInput>
}>

export type GetTop10ChannelsQuery = {
  __typename?: 'Query'
  top10Channels: Array<{
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    rewardAccount: string
    avatarPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
  }>
}

export type GetPromisingChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelWhereInput>
}>

export type GetPromisingChannelsQuery = {
  __typename?: 'Query'
  promisingChannels: Array<{
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    rewardAccount: string
    avatarPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
  }>
}

export type GetDiscoverChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelWhereInput>
}>

export type GetDiscoverChannelsQuery = {
  __typename?: 'Query'
  discoverChannels: Array<{
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    rewardAccount: string
    avatarPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
  }>
}

export type GetPopularChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelWhereInput>
}>

export type GetPopularChannelsQuery = {
  __typename?: 'Query'
  popularChannels: Array<{
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    rewardAccount: string
    avatarPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      createdAt: Date
      size: string
      isAccepted: boolean
      ipfsHash: string
      storageBag: { __typename?: 'StorageBag'; id: string }
      type:
        | { __typename: 'DataObjectTypeChannelAvatar' }
        | { __typename: 'DataObjectTypeChannelCoverPhoto' }
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
  }>
}

export type GetChannelNftCollectorsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelNftCollectorsWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.ChannelNftCollectorsOrderByInput> | Types.ChannelNftCollectorsOrderByInput>
}>

export type GetChannelNftCollectorsQuery = {
  __typename?: 'Query'
  channelNftCollectors: Array<{
    __typename?: 'ChannelNftCollectors'
    id: string
    amount: number
    member?: {
      __typename?: 'Membership'
      id: string
      handle: string
      metadata: {
        __typename?: 'MemberMetadata'
        about?: string | null
        avatar?:
          | {
              __typename?: 'AvatarObject'
              avatarObject?: {
                __typename?: 'StorageDataObject'
                id: string
                createdAt: Date
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
}

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
export const GetFullChannelDocument = gql`
  query GetFullChannel($where: ChannelWhereUniqueInput!) {
    channelByUniqueInput(where: $where) {
      ...FullChannelFields
    }
  }
  ${FullChannelFieldsFragmentDoc}
`

/**
 * __useGetFullChannelQuery__
 *
 * To run a query within a React component, call `useGetFullChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullChannelQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetFullChannelQuery(
  baseOptions: Apollo.QueryHookOptions<GetFullChannelQuery, GetFullChannelQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFullChannelQuery, GetFullChannelQueryVariables>(GetFullChannelDocument, options)
}
export function useGetFullChannelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFullChannelQuery, GetFullChannelQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFullChannelQuery, GetFullChannelQueryVariables>(GetFullChannelDocument, options)
}
export type GetFullChannelQueryHookResult = ReturnType<typeof useGetFullChannelQuery>
export type GetFullChannelLazyQueryHookResult = ReturnType<typeof useGetFullChannelLazyQuery>
export type GetFullChannelQueryResult = Apollo.QueryResult<GetFullChannelQuery, GetFullChannelQueryVariables>
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
export const GetBasicChannelsDocument = gql`
  query GetBasicChannels(
    $where: ChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    channels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetBasicChannelsQuery__
 *
 * To run a query within a React component, call `useGetBasicChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetBasicChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>(GetBasicChannelsDocument, options)
}
export function useGetBasicChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>(GetBasicChannelsDocument, options)
}
export type GetBasicChannelsQueryHookResult = ReturnType<typeof useGetBasicChannelsQuery>
export type GetBasicChannelsLazyQueryHookResult = ReturnType<typeof useGetBasicChannelsLazyQuery>
export type GetBasicChannelsQueryResult = Apollo.QueryResult<GetBasicChannelsQuery, GetBasicChannelsQueryVariables>
export const GetBasicChannelsConnectionDocument = gql`
  query GetBasicChannelsConnection(
    $first: Int
    $after: String
    $where: ChannelWhereInput
    $orderBy: ChannelOrderByInput = createdAt_DESC
  ) {
    channelsConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...BasicChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetBasicChannelsConnectionQuery__
 *
 * To run a query within a React component, call `useGetBasicChannelsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicChannelsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicChannelsConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetBasicChannelsConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicChannelsConnectionQuery, GetBasicChannelsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicChannelsConnectionQuery, GetBasicChannelsConnectionQueryVariables>(
    GetBasicChannelsConnectionDocument,
    options
  )
}
export function useGetBasicChannelsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicChannelsConnectionQuery, GetBasicChannelsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicChannelsConnectionQuery, GetBasicChannelsConnectionQueryVariables>(
    GetBasicChannelsConnectionDocument,
    options
  )
}
export type GetBasicChannelsConnectionQueryHookResult = ReturnType<typeof useGetBasicChannelsConnectionQuery>
export type GetBasicChannelsConnectionLazyQueryHookResult = ReturnType<typeof useGetBasicChannelsConnectionLazyQuery>
export type GetBasicChannelsConnectionQueryResult = Apollo.QueryResult<
  GetBasicChannelsConnectionQuery,
  GetBasicChannelsConnectionQueryVariables
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
export const GetMostViewedChannelsConnectionDocument = gql`
  query GetMostViewedChannelsConnection(
    $limit: Int = 50
    $periodDays: Int
    $first: Int
    $after: String
    $where: ChannelWhereInput
  ) {
    mostViewedChannelsConnection(limit: $limit, first: $first, after: $after, periodDays: $periodDays, where: $where) {
      edges {
        cursor
        node {
          ...BasicChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetMostViewedChannelsConnectionQuery__
 *
 * To run a query within a React component, call `useGetMostViewedChannelsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostViewedChannelsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostViewedChannelsConnectionQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      periodDays: // value for 'periodDays'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMostViewedChannelsConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMostViewedChannelsConnectionQuery,
    GetMostViewedChannelsConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostViewedChannelsConnectionQuery, GetMostViewedChannelsConnectionQueryVariables>(
    GetMostViewedChannelsConnectionDocument,
    options
  )
}
export function useGetMostViewedChannelsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostViewedChannelsConnectionQuery,
    GetMostViewedChannelsConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostViewedChannelsConnectionQuery, GetMostViewedChannelsConnectionQueryVariables>(
    GetMostViewedChannelsConnectionDocument,
    options
  )
}
export type GetMostViewedChannelsConnectionQueryHookResult = ReturnType<typeof useGetMostViewedChannelsConnectionQuery>
export type GetMostViewedChannelsConnectionLazyQueryHookResult = ReturnType<
  typeof useGetMostViewedChannelsConnectionLazyQuery
>
export type GetMostViewedChannelsConnectionQueryResult = Apollo.QueryResult<
  GetMostViewedChannelsConnectionQuery,
  GetMostViewedChannelsConnectionQueryVariables
>
export const GetMostFollowedChannelsConnectionDocument = gql`
  query GetMostFollowedChannelsConnection(
    $limit: Int!
    $periodDays: Int
    $first: Int
    $after: String
    $where: ChannelWhereInput
  ) {
    mostFollowedChannelsConnection(
      limit: $limit
      first: $first
      after: $after
      periodDays: $periodDays
      where: $where
    ) {
      edges {
        cursor
        node {
          ...BasicChannelFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetMostFollowedChannelsConnectionQuery__
 *
 * To run a query within a React component, call `useGetMostFollowedChannelsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostFollowedChannelsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostFollowedChannelsConnectionQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      periodDays: // value for 'periodDays'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMostFollowedChannelsConnectionQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMostFollowedChannelsConnectionQuery,
    GetMostFollowedChannelsConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostFollowedChannelsConnectionQuery, GetMostFollowedChannelsConnectionQueryVariables>(
    GetMostFollowedChannelsConnectionDocument,
    options
  )
}
export function useGetMostFollowedChannelsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostFollowedChannelsConnectionQuery,
    GetMostFollowedChannelsConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostFollowedChannelsConnectionQuery, GetMostFollowedChannelsConnectionQueryVariables>(
    GetMostFollowedChannelsConnectionDocument,
    options
  )
}
export type GetMostFollowedChannelsConnectionQueryHookResult = ReturnType<
  typeof useGetMostFollowedChannelsConnectionQuery
>
export type GetMostFollowedChannelsConnectionLazyQueryHookResult = ReturnType<
  typeof useGetMostFollowedChannelsConnectionLazyQuery
>
export type GetMostFollowedChannelsConnectionQueryResult = Apollo.QueryResult<
  GetMostFollowedChannelsConnectionQuery,
  GetMostFollowedChannelsConnectionQueryVariables
>
export const GetTop10ChannelsDocument = gql`
  query GetTop10Channels($where: ChannelWhereInput) {
    top10Channels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetTop10ChannelsQuery__
 *
 * To run a query within a React component, call `useGetTop10ChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTop10ChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTop10ChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetTop10ChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTop10ChannelsQuery, GetTop10ChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTop10ChannelsQuery, GetTop10ChannelsQueryVariables>(GetTop10ChannelsDocument, options)
}
export function useGetTop10ChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTop10ChannelsQuery, GetTop10ChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTop10ChannelsQuery, GetTop10ChannelsQueryVariables>(GetTop10ChannelsDocument, options)
}
export type GetTop10ChannelsQueryHookResult = ReturnType<typeof useGetTop10ChannelsQuery>
export type GetTop10ChannelsLazyQueryHookResult = ReturnType<typeof useGetTop10ChannelsLazyQuery>
export type GetTop10ChannelsQueryResult = Apollo.QueryResult<GetTop10ChannelsQuery, GetTop10ChannelsQueryVariables>
export const GetPromisingChannelsDocument = gql`
  query GetPromisingChannels($where: ChannelWhereInput) {
    promisingChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetPromisingChannelsQuery__
 *
 * To run a query within a React component, call `useGetPromisingChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPromisingChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPromisingChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPromisingChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetPromisingChannelsQuery, GetPromisingChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPromisingChannelsQuery, GetPromisingChannelsQueryVariables>(
    GetPromisingChannelsDocument,
    options
  )
}
export function useGetPromisingChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPromisingChannelsQuery, GetPromisingChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPromisingChannelsQuery, GetPromisingChannelsQueryVariables>(
    GetPromisingChannelsDocument,
    options
  )
}
export type GetPromisingChannelsQueryHookResult = ReturnType<typeof useGetPromisingChannelsQuery>
export type GetPromisingChannelsLazyQueryHookResult = ReturnType<typeof useGetPromisingChannelsLazyQuery>
export type GetPromisingChannelsQueryResult = Apollo.QueryResult<
  GetPromisingChannelsQuery,
  GetPromisingChannelsQueryVariables
>
export const GetDiscoverChannelsDocument = gql`
  query GetDiscoverChannels($where: ChannelWhereInput) {
    discoverChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetDiscoverChannelsQuery__
 *
 * To run a query within a React component, call `useGetDiscoverChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDiscoverChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDiscoverChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetDiscoverChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetDiscoverChannelsQuery, GetDiscoverChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDiscoverChannelsQuery, GetDiscoverChannelsQueryVariables>(
    GetDiscoverChannelsDocument,
    options
  )
}
export function useGetDiscoverChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetDiscoverChannelsQuery, GetDiscoverChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDiscoverChannelsQuery, GetDiscoverChannelsQueryVariables>(
    GetDiscoverChannelsDocument,
    options
  )
}
export type GetDiscoverChannelsQueryHookResult = ReturnType<typeof useGetDiscoverChannelsQuery>
export type GetDiscoverChannelsLazyQueryHookResult = ReturnType<typeof useGetDiscoverChannelsLazyQuery>
export type GetDiscoverChannelsQueryResult = Apollo.QueryResult<
  GetDiscoverChannelsQuery,
  GetDiscoverChannelsQueryVariables
>
export const GetPopularChannelsDocument = gql`
  query GetPopularChannels($where: ChannelWhereInput) {
    popularChannels(where: $where) {
      ...BasicChannelFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
`

/**
 * __useGetPopularChannelsQuery__
 *
 * To run a query within a React component, call `useGetPopularChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPopularChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPopularChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPopularChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetPopularChannelsQuery, GetPopularChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPopularChannelsQuery, GetPopularChannelsQueryVariables>(GetPopularChannelsDocument, options)
}
export function useGetPopularChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPopularChannelsQuery, GetPopularChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPopularChannelsQuery, GetPopularChannelsQueryVariables>(
    GetPopularChannelsDocument,
    options
  )
}
export type GetPopularChannelsQueryHookResult = ReturnType<typeof useGetPopularChannelsQuery>
export type GetPopularChannelsLazyQueryHookResult = ReturnType<typeof useGetPopularChannelsLazyQuery>
export type GetPopularChannelsQueryResult = Apollo.QueryResult<
  GetPopularChannelsQuery,
  GetPopularChannelsQueryVariables
>
export const GetChannelNftCollectorsDocument = gql`
  query GetChannelNftCollectors(
    $where: ChannelNftCollectorsWhereInput
    $orderBy: [ChannelNftCollectorsOrderByInput!] = [amount_DESC]
  ) {
    channelNftCollectors(where: $where, orderBy: $orderBy) {
      id
      member {
        ...BasicMembershipFields
      }
      amount
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetChannelNftCollectorsQuery__
 *
 * To run a query within a React component, call `useGetChannelNftCollectorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelNftCollectorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelNftCollectorsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetChannelNftCollectorsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelNftCollectorsQuery, GetChannelNftCollectorsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelNftCollectorsQuery, GetChannelNftCollectorsQueryVariables>(
    GetChannelNftCollectorsDocument,
    options
  )
}
export function useGetChannelNftCollectorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelNftCollectorsQuery, GetChannelNftCollectorsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelNftCollectorsQuery, GetChannelNftCollectorsQueryVariables>(
    GetChannelNftCollectorsDocument,
    options
  )
}
export type GetChannelNftCollectorsQueryHookResult = ReturnType<typeof useGetChannelNftCollectorsQuery>
export type GetChannelNftCollectorsLazyQueryHookResult = ReturnType<typeof useGetChannelNftCollectorsLazyQuery>
export type GetChannelNftCollectorsQueryResult = Apollo.QueryResult<
  GetChannelNftCollectorsQuery,
  GetChannelNftCollectorsQueryVariables
>
