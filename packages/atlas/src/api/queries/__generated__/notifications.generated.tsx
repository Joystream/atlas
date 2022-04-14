import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicMembershipFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetNftNotificationsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']
  limit: Types.Scalars['Int']
}>

export type GetNftNotificationsQuery = {
  __typename?: 'Query'
  auctionBidMadeEvents: Array<{
    __typename?: 'AuctionBidMadeEvent'
    id: string
    createdAt: Date
    inBlock: number
    bidAmount: string
    video: { __typename?: 'Video'; id: string; title?: string | null }
    member: {
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
    }
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
    previousTopBidder?: {
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
  nftBoughtEvents: Array<{
    __typename?: 'NftBoughtEvent'
    id: string
    createdAt: Date
    inBlock: number
    price: string
    member: {
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
    }
    video: { __typename?: 'Video'; id: string; title?: string | null }
  }>
  bidMadeCompletingAuctionEvents: Array<{
    __typename?: 'BidMadeCompletingAuctionEvent'
    id: string
    createdAt: Date
    inBlock: number
    price: string
    member: {
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
    }
    video: { __typename?: 'Video'; id: string; title?: string | null }
  }>
  openAuctionBidAcceptedEvents: Array<{
    __typename?: 'OpenAuctionBidAcceptedEvent'
    id: string
    createdAt: Date
    inBlock: number
    video: { __typename?: 'Video'; id: string; title?: string | null }
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
    winningBid?: { __typename?: 'Bid'; amount: string } | null
  }>
}

export const GetNftNotificationsDocument = gql`
  query GetNftNotifications($memberId: ID!, $limit: Int!) {
    auctionBidMadeEvents(
      limit: $limit
      where: { OR: [{ ownerMember: { id_eq: $memberId } }, { previousTopBidder: { id_eq: $memberId } }] }
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      video {
        id
        title
      }
      member {
        ...BasicMembershipFields
      }
      ownerMember {
        ...BasicMembershipFields
      }
      previousTopBidder {
        ...BasicMembershipFields
      }
      bidAmount
    }
    nftBoughtEvents(where: { ownerMember: { id_eq: $memberId } }, limit: $limit, orderBy: [createdAt_DESC]) {
      id
      createdAt
      inBlock
      member {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
      price
    }
    bidMadeCompletingAuctionEvents(
      where: { ownerMember: { id_eq: $memberId } }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      member {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
      price
    }
    openAuctionBidAcceptedEvents(
      where: { winningBidder: { id_eq: $memberId } }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      video {
        id
        title
      }
      ownerMember {
        ...BasicMembershipFields
      }
      winningBid {
        amount
      }
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetNftNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNftNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftNotificationsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetNftNotificationsQuery(
  baseOptions: Apollo.QueryHookOptions<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>(
    GetNftNotificationsDocument,
    options
  )
}
export function useGetNftNotificationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>(
    GetNftNotificationsDocument,
    options
  )
}
export type GetNftNotificationsQueryHookResult = ReturnType<typeof useGetNftNotificationsQuery>
export type GetNftNotificationsLazyQueryHookResult = ReturnType<typeof useGetNftNotificationsLazyQuery>
export type GetNftNotificationsQueryResult = Apollo.QueryResult<
  GetNftNotificationsQuery,
  GetNftNotificationsQueryVariables
>
