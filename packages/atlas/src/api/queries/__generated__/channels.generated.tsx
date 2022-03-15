import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { AllChannelFieldsFragmentDoc, BasicChannelFieldsFragmentDoc } from './fragments.generated'

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
    views: number
    follows: number
    avatarPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
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
                size: number
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
  } | null
}

export type GetChannelQueryVariables = Types.Exact<{
  where: Types.ChannelWhereUniqueInput
}>

export type GetChannelQuery = {
  __typename?: 'Query'
  channelByUniqueInput?: {
    __typename?: 'Channel'
    description?: string | null
    isPublic?: boolean | null
    isCensored: boolean
    id: string
    title?: string | null
    createdAt: Date
    views: number
    follows: number
    language?: { __typename?: 'Language'; id: string; iso: string } | null
    coverPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
    avatarPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
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
                size: number
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
  } | null
}

export type GetVideoCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetVideoCountQuery = {
  __typename?: 'Query'
  videosConnection: { __typename?: 'VideoConnection'; totalCount: number }
}

export type GetChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ChannelWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  orderBy?: Types.InputMaybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetChannelsQuery = {
  __typename?: 'Query'
  channels: Array<{
    __typename?: 'Channel'
    description?: string | null
    isPublic?: boolean | null
    isCensored: boolean
    id: string
    title?: string | null
    createdAt: Date
    views: number
    follows: number
    language?: { __typename?: 'Language'; id: string; iso: string } | null
    coverPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
    avatarPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
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
                size: number
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

export type GetChannelsConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  where?: Types.InputMaybe<Types.ChannelWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
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
        description?: string | null
        isPublic?: boolean | null
        isCensored: boolean
        id: string
        title?: string | null
        createdAt: Date
        views: number
        follows: number
        language?: { __typename?: 'Language'; id: string; iso: string } | null
        coverPhoto?: {
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
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
        avatarPhoto?: {
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
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
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
                    size: number
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
        description?: string | null
        isPublic?: boolean | null
        isCensored: boolean
        id: string
        title?: string | null
        createdAt: Date
        views: number
        follows: number
        language?: { __typename?: 'Language'; id: string; iso: string } | null
        coverPhoto?: {
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
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
        avatarPhoto?: {
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
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
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
                    size: number
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
        description?: string | null
        isPublic?: boolean | null
        isCensored: boolean
        id: string
        title?: string | null
        createdAt: Date
        views: number
        follows: number
        language?: { __typename?: 'Language'; id: string; iso: string } | null
        coverPhoto?: {
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
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
        avatarPhoto?: {
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
            | { __typename: 'DataObjectTypeUnknown' }
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
        } | null
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
                    size: number
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
    views: number
    follows: number
    avatarPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
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
                size: number
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
    views: number
    follows: number
    avatarPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
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
                size: number
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
    views: number
    follows: number
    avatarPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
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
                size: number
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
    views: number
    follows: number
    avatarPhoto?: {
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
        | { __typename: 'DataObjectTypeUnknown' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
    } | null
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
                size: number
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
