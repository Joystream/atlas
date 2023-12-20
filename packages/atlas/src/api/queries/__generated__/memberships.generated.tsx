import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { FullMembershipFieldsFragmentDoc, StorageDataObjectFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetMembershipsQueryVariables = Types.Exact<{
  where: Types.MembershipWhereInput
}>

export type GetMembershipsQuery = {
  __typename?: 'Query'
  memberships: Array<{
    __typename?: 'Membership'
    controllerAccount: string
    createdAt: Date
    totalChannelsCreated: number
    id: string
    handle: string
    channels: Array<{
      __typename?: 'Channel'
      totalVideosCreated: number
      description?: string | null
      id: string
      title?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      cumulativeRevenue: string
      coverPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        createdAt: Date
        size: string
        isAccepted: boolean
        ipfsHash: string
        storageBag: { __typename?: 'StorageBag'; id: string }
        type?:
          | { __typename: 'DataObjectTypeChannelAvatar' }
          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
          | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoSubtitle' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | null
      } | null
      avatarPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        createdAt: Date
        size: string
        isAccepted: boolean
        ipfsHash: string
        storageBag: { __typename?: 'StorageBag'; id: string }
        type?:
          | { __typename: 'DataObjectTypeChannelAvatar' }
          | { __typename: 'DataObjectTypeChannelCoverPhoto' }
          | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoSubtitle' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | null
      } | null
      creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
    }>
    metadata?: {
      __typename?: 'MemberMetadata'
      about?: string | null
      avatar?:
        | {
            __typename?: 'AvatarObject'
            avatarObject: {
              __typename?: 'StorageDataObject'
              id: string
              resolvedUrls: Array<string>
              createdAt: Date
              size: string
              isAccepted: boolean
              ipfsHash: string
              storageBag: { __typename?: 'StorageBag'; id: string }
              type?:
                | { __typename: 'DataObjectTypeChannelAvatar' }
                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            }
          }
        | { __typename?: 'AvatarUri'; avatarUri: string }
        | null
    } | null
  }>
}

export type GetMembershipsAvatarQueryVariables = Types.Exact<{
  where: Types.MembershipWhereInput
  limit?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetMembershipsAvatarQuery = {
  __typename?: 'Query'
  memberships: Array<{
    __typename?: 'Membership'
    metadata?: {
      __typename?: 'MemberMetadata'
      avatar?:
        | {
            __typename: 'AvatarObject'
            avatarObject: {
              __typename?: 'StorageDataObject'
              id: string
              resolvedUrls: Array<string>
              createdAt: Date
              size: string
              isAccepted: boolean
              ipfsHash: string
              storageBag: { __typename?: 'StorageBag'; id: string }
              type?:
                | { __typename: 'DataObjectTypeChannelAvatar' }
                | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            }
          }
        | { __typename: 'AvatarUri'; avatarUri: string }
        | null
    } | null
  }>
}

export type GetChannelCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelWhereInput>
}>

export type GetChannelCountQuery = {
  __typename?: 'Query'
  channelsConnection: { __typename?: 'ChannelsConnection'; totalCount: number }
}

export const GetMembershipsDocument = gql`
  query GetMemberships($where: MembershipWhereInput!) {
    memberships(where: $where) {
      ...FullMembershipFields
    }
  }
  ${FullMembershipFieldsFragmentDoc}
`

/**
 * __useGetMembershipsQuery__
 *
 * To run a query within a React component, call `useGetMembershipsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembershipsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembershipsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMembershipsQuery(
  baseOptions: Apollo.QueryHookOptions<GetMembershipsQuery, GetMembershipsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMembershipsQuery, GetMembershipsQueryVariables>(GetMembershipsDocument, options)
}
export function useGetMembershipsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMembershipsQuery, GetMembershipsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMembershipsQuery, GetMembershipsQueryVariables>(GetMembershipsDocument, options)
}
export type GetMembershipsQueryHookResult = ReturnType<typeof useGetMembershipsQuery>
export type GetMembershipsLazyQueryHookResult = ReturnType<typeof useGetMembershipsLazyQuery>
export type GetMembershipsQueryResult = Apollo.QueryResult<GetMembershipsQuery, GetMembershipsQueryVariables>
export const GetMembershipsAvatarDocument = gql`
  query GetMembershipsAvatar($where: MembershipWhereInput!, $limit: Int) {
    memberships(where: $where, limit: $limit) {
      metadata {
        avatar {
          __typename
          ... on AvatarObject {
            avatarObject {
              ...StorageDataObjectFields
            }
          }
          ... on AvatarUri {
            avatarUri
          }
        }
      }
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
`

/**
 * __useGetMembershipsAvatarQuery__
 *
 * To run a query within a React component, call `useGetMembershipsAvatarQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembershipsAvatarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembershipsAvatarQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetMembershipsAvatarQuery(
  baseOptions: Apollo.QueryHookOptions<GetMembershipsAvatarQuery, GetMembershipsAvatarQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMembershipsAvatarQuery, GetMembershipsAvatarQueryVariables>(
    GetMembershipsAvatarDocument,
    options
  )
}
export function useGetMembershipsAvatarLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetMembershipsAvatarQuery, GetMembershipsAvatarQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMembershipsAvatarQuery, GetMembershipsAvatarQueryVariables>(
    GetMembershipsAvatarDocument,
    options
  )
}
export type GetMembershipsAvatarQueryHookResult = ReturnType<typeof useGetMembershipsAvatarQuery>
export type GetMembershipsAvatarLazyQueryHookResult = ReturnType<typeof useGetMembershipsAvatarLazyQuery>
export type GetMembershipsAvatarQueryResult = Apollo.QueryResult<
  GetMembershipsAvatarQuery,
  GetMembershipsAvatarQueryVariables
>
export const GetChannelCountDocument = gql`
  query GetChannelCount($where: ChannelWhereInput) {
    channelsConnection(where: $where, orderBy: [id_ASC]) {
      totalCount
    }
  }
`

/**
 * __useGetChannelCountQuery__
 *
 * To run a query within a React component, call `useGetChannelCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetChannelCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelCountQuery, GetChannelCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelCountQuery, GetChannelCountQueryVariables>(GetChannelCountDocument, options)
}
export function useGetChannelCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelCountQuery, GetChannelCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelCountQuery, GetChannelCountQueryVariables>(GetChannelCountDocument, options)
}
export type GetChannelCountQueryHookResult = ReturnType<typeof useGetChannelCountQuery>
export type GetChannelCountLazyQueryHookResult = ReturnType<typeof useGetChannelCountLazyQuery>
export type GetChannelCountQueryResult = Apollo.QueryResult<GetChannelCountQuery, GetChannelCountQueryVariables>
