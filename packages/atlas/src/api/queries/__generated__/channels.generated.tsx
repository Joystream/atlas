import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import {
  BasicChannelFieldsFragmentDoc,
  BasicMembershipFieldsFragmentDoc,
  ExtendedBasicChannelFieldsFragmentDoc,
  ExtendedFullChannelFieldsFragmentDoc,
  FullChannelFieldsFragmentDoc,
  StorageDataObjectFieldsFragmentDoc,
} from './fragments.generated'

const defaultOptions = {} as const
export type GetFullChannelQueryVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetFullChannelQuery = {
  __typename?: 'Query'
  channelById?: {
    __typename?: 'Channel'
    videoViewsNum: number
    description?: string | null
    isPublic?: boolean | null
    cumulativeRewardClaimed?: string | null
    isCensored: boolean
    language?: string | null
    id: string
    title?: string | null
    createdAt: Date
    followsNum: number
    rewardAccount: string
    channelStateBloatBond: string
    ownerMember?: {
      __typename?: 'Membership'
      id: string
      handle: string
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
                resolvedUrl?: string | null
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
    } | null
    coverPhoto?: {
      __typename?: 'StorageDataObject'
      id: string
      resolvedUrls: Array<string>
      resolvedUrl?: string | null
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
      resolvedUrl?: string | null
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
  } | null
}

export type GetExtendedBasicChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ExtendedChannelWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  orderBy?: Types.InputMaybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetExtendedBasicChannelsQuery = {
  __typename?: 'Query'
  extendedChannels: Array<{
    __typename?: 'ExtendedChannel'
    activeVideosCount: number
    channel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      description?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      avatarPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        resolvedUrl?: string | null
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
    }
  }>
}

export type GetExtendedFullChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ExtendedChannelWhereInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  orderBy?: Types.InputMaybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetExtendedFullChannelsQuery = {
  __typename?: 'Query'
  extendedChannels: Array<{
    __typename?: 'ExtendedChannel'
    activeVideosCount: number
    channel: {
      __typename?: 'Channel'
      videoViewsNum: number
      description?: string | null
      isPublic?: boolean | null
      cumulativeRewardClaimed?: string | null
      isCensored: boolean
      language?: string | null
      id: string
      title?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      ownerMember?: {
        __typename?: 'Membership'
        id: string
        handle: string
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
                  resolvedUrl?: string | null
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
      } | null
      coverPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        resolvedUrl?: string | null
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
        resolvedUrl?: string | null
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
    }
  }>
}

export type GetBasicChannelsConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  where?: Types.InputMaybe<Types.ChannelWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.ChannelOrderByInput> | Types.ChannelOrderByInput>
}>

export type GetBasicChannelsConnectionQuery = {
  __typename?: 'Query'
  channelsConnection: {
    __typename?: 'ChannelsConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'ChannelEdge'
      cursor: string
      node: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        description?: string | null
        createdAt: Date
        followsNum: number
        rewardAccount: string
        channelStateBloatBond: string
        avatarPhoto?: {
          __typename?: 'StorageDataObject'
          id: string
          resolvedUrls: Array<string>
          resolvedUrl?: string | null
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
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor: string }
  }
}

export type FollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']
}>

export type FollowChannelMutation = {
  __typename?: 'Mutation'
  followChannel: { __typename?: 'ChannelFollowResult'; channelId: string; follows: number; cancelToken: string }
}

export type UnfollowChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']
  token: Types.Scalars['String']
}>

export type UnfollowChannelMutation = {
  __typename?: 'Mutation'
  unfollowChannel: { __typename?: 'ChannelUnfollowResult'; channelId: string; follows: number }
}

export type GetTop10ChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ExtendedChannelWhereInput>
}>

export type GetTop10ChannelsQuery = {
  __typename?: 'Query'
  extendedChannels: Array<{
    __typename?: 'ExtendedChannel'
    channel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      description?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      avatarPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        resolvedUrl?: string | null
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
    }
  }>
}

export type GetPromisingChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ExtendedChannelWhereInput>
}>

export type GetPromisingChannelsQuery = {
  __typename?: 'Query'
  mostRecentChannels: Array<{
    __typename?: 'ExtendedChannel'
    channel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      description?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      avatarPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        resolvedUrl?: string | null
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
    }
  }>
}

export type GetDiscoverChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ExtendedChannelWhereInput>
}>

export type GetDiscoverChannelsQuery = {
  __typename?: 'Query'
  mostRecentChannels: Array<{
    __typename?: 'ExtendedChannel'
    channel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      description?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      avatarPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        resolvedUrl?: string | null
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
    }
  }>
}

export type GetPopularChannelsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.ExtendedChannelWhereInput>
}>

export type GetPopularChannelsQuery = {
  __typename?: 'Query'
  extendedChannels: Array<{
    __typename?: 'ExtendedChannel'
    channel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      description?: string | null
      createdAt: Date
      followsNum: number
      rewardAccount: string
      channelStateBloatBond: string
      avatarPhoto?: {
        __typename?: 'StorageDataObject'
        id: string
        resolvedUrls: Array<string>
        resolvedUrl?: string | null
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
    }
  }>
}

export type GetChannelNftCollectorsQueryVariables = Types.Exact<{
  channelId: Types.Scalars['String']
  orderBy?: Types.InputMaybe<Types.ChannelNftCollectorsOrderByInput>
}>

export type GetChannelNftCollectorsQuery = {
  __typename?: 'Query'
  channelNftCollectors: Array<{
    __typename?: 'ChannelNftCollector'
    amount: number
    member: {
      __typename?: 'Membership'
      id: string
      handle: string
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
                resolvedUrl?: string | null
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
    }
  }>
}

export type GetTotalChannelsAndTotalVideosQueryVariables = Types.Exact<{
  memberId: Types.Scalars['String']
  channelId: Types.Scalars['String']
}>

export type GetTotalChannelsAndTotalVideosQuery = {
  __typename?: 'Query'
  membershipById?: {
    __typename?: 'Membership'
    totalChannelsCreated: number
    channels: Array<{ __typename?: 'Channel'; totalVideosCreated: number }>
  } | null
}

export type ReportChannelMutationVariables = Types.Exact<{
  channelId: Types.Scalars['String']
  rationale: Types.Scalars['String']
}>

export type ReportChannelMutation = {
  __typename?: 'Mutation'
  reportChannel: { __typename?: 'ChannelReportInfo'; id: string; channelId: string }
}

export type GetPayloadDataByCommitmentQueryVariables = Types.Exact<{
  commitment: Types.Scalars['String']
}>

export type GetPayloadDataByCommitmentQuery = {
  __typename?: 'Query'
  events: Array<{
    __typename?: 'Event'
    data:
      | { __typename?: 'AuctionBidCanceledEventData' }
      | { __typename?: 'AuctionBidMadeEventData' }
      | { __typename?: 'AuctionCanceledEventData' }
      | { __typename?: 'BidMadeCompletingAuctionEventData' }
      | { __typename?: 'BuyNowCanceledEventData' }
      | { __typename?: 'BuyNowPriceUpdatedEventData' }
      | { __typename?: 'ChannelFundsWithdrawnEventData' }
      | { __typename?: 'ChannelPaymentMadeEventData' }
      | {
          __typename?: 'ChannelPayoutsUpdatedEventData'
          payloadDataObject?: {
            __typename?: 'StorageDataObject'
            id: string
            resolvedUrls: Array<string>
            resolvedUrl?: string | null
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
        }
      | { __typename?: 'ChannelRewardClaimedAndWithdrawnEventData' }
      | { __typename?: 'ChannelRewardClaimedEventData' }
      | { __typename?: 'CommentCreatedEventData' }
      | { __typename?: 'CommentTextUpdatedEventData' }
      | { __typename?: 'EnglishAuctionSettledEventData' }
      | { __typename?: 'EnglishAuctionStartedEventData' }
      | { __typename?: 'MemberBannedFromChannelEventData' }
      | { __typename?: 'MetaprotocolTransactionStatusEventData' }
      | { __typename?: 'NftBoughtEventData' }
      | { __typename?: 'NftIssuedEventData' }
      | { __typename?: 'NftSellOrderMadeEventData' }
      | { __typename?: 'OpenAuctionBidAcceptedEventData' }
      | { __typename?: 'OpenAuctionStartedEventData' }
  }>
}

export type GetChannelPaymentEventsQueryVariables = Types.Exact<{
  channelId?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetChannelPaymentEventsQuery = {
  __typename?: 'Query'
  events: Array<{
    __typename?: 'Event'
    inBlock: number
    timestamp: Date
    data:
      | { __typename: 'AuctionBidCanceledEventData' }
      | { __typename: 'AuctionBidMadeEventData' }
      | { __typename: 'AuctionCanceledEventData' }
      | {
          __typename: 'BidMadeCompletingAuctionEventData'
          previousNftOwner: { __typename: 'NftOwnerChannel' } | { __typename: 'NftOwnerMember' }
          winningBid: {
            __typename?: 'Bid'
            id: string
            amount: string
            bidder: { __typename?: 'Membership'; controllerAccount: string }
            nft: {
              __typename?: 'OwnedNft'
              creatorRoyalty?: number | null
              video: { __typename?: 'Video'; title?: string | null }
            }
          }
        }
      | { __typename: 'BuyNowCanceledEventData' }
      | { __typename: 'BuyNowPriceUpdatedEventData' }
      | {
          __typename: 'ChannelFundsWithdrawnEventData'
          amount: string
          actor:
            | { __typename: 'ContentActorCurator' }
            | { __typename: 'ContentActorLead' }
            | { __typename: 'ContentActorMember'; member: { __typename?: 'Membership'; controllerAccount: string } }
        }
      | {
          __typename: 'ChannelPaymentMadeEventData'
          amount: string
          rationale?: string | null
          payer: { __typename?: 'Membership'; controllerAccount: string }
        }
      | { __typename: 'ChannelPayoutsUpdatedEventData' }
      | { __typename: 'ChannelRewardClaimedAndWithdrawnEventData' }
      | { __typename: 'ChannelRewardClaimedEventData'; amount: string }
      | { __typename: 'CommentCreatedEventData' }
      | { __typename: 'CommentTextUpdatedEventData' }
      | {
          __typename: 'EnglishAuctionSettledEventData'
          previousNftOwner: { __typename: 'NftOwnerChannel' } | { __typename: 'NftOwnerMember' }
          winningBid: {
            __typename?: 'Bid'
            amount: string
            nft: {
              __typename?: 'OwnedNft'
              creatorRoyalty?: number | null
              video: { __typename?: 'Video'; title?: string | null }
            }
            bidder: { __typename?: 'Membership'; controllerAccount: string }
          }
        }
      | { __typename: 'EnglishAuctionStartedEventData' }
      | { __typename: 'MemberBannedFromChannelEventData' }
      | { __typename: 'MetaprotocolTransactionStatusEventData' }
      | {
          __typename: 'NftBoughtEventData'
          price: string
          buyer: { __typename?: 'Membership'; controllerAccount: string }
          nft: {
            __typename?: 'OwnedNft'
            creatorRoyalty?: number | null
            video: { __typename?: 'Video'; title?: string | null }
          }
          previousNftOwner: { __typename: 'NftOwnerChannel' } | { __typename: 'NftOwnerMember' }
        }
      | { __typename: 'NftIssuedEventData' }
      | { __typename: 'NftSellOrderMadeEventData' }
      | {
          __typename: 'OpenAuctionBidAcceptedEventData'
          winningBid: {
            __typename?: 'Bid'
            amount: string
            nft: {
              __typename?: 'OwnedNft'
              creatorRoyalty?: number | null
              video: { __typename?: 'Video'; title?: string | null }
            }
            bidder: { __typename?: 'Membership'; controllerAccount: string }
          }
          previousNftOwner: { __typename: 'NftOwnerChannel' } | { __typename: 'NftOwnerMember' }
        }
      | { __typename: 'OpenAuctionStartedEventData' }
  }>
}

export const GetFullChannelDocument = gql`
  query GetFullChannel($id: String!) {
    channelById(id: $id) {
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
 *      id: // value for 'id'
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
export const GetExtendedBasicChannelsDocument = gql`
  query GetExtendedBasicChannels(
    $where: ExtendedChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    extendedChannels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...ExtendedBasicChannelFields
    }
  }
  ${ExtendedBasicChannelFieldsFragmentDoc}
`

/**
 * __useGetExtendedBasicChannelsQuery__
 *
 * To run a query within a React component, call `useGetExtendedBasicChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExtendedBasicChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExtendedBasicChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetExtendedBasicChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>(
    GetExtendedBasicChannelsDocument,
    options
  )
}
export function useGetExtendedBasicChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetExtendedBasicChannelsQuery, GetExtendedBasicChannelsQueryVariables>(
    GetExtendedBasicChannelsDocument,
    options
  )
}
export type GetExtendedBasicChannelsQueryHookResult = ReturnType<typeof useGetExtendedBasicChannelsQuery>
export type GetExtendedBasicChannelsLazyQueryHookResult = ReturnType<typeof useGetExtendedBasicChannelsLazyQuery>
export type GetExtendedBasicChannelsQueryResult = Apollo.QueryResult<
  GetExtendedBasicChannelsQuery,
  GetExtendedBasicChannelsQueryVariables
>
export const GetExtendedFullChannelsDocument = gql`
  query GetExtendedFullChannels(
    $where: ExtendedChannelWhereInput
    $limit: Int = 50
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
  ) {
    extendedChannels(where: $where, orderBy: $orderBy, limit: $limit) {
      ...ExtendedFullChannelFields
    }
  }
  ${ExtendedFullChannelFieldsFragmentDoc}
`

/**
 * __useGetExtendedFullChannelsQuery__
 *
 * To run a query within a React component, call `useGetExtendedFullChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExtendedFullChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExtendedFullChannelsQuery({
 *   variables: {
 *      where: // value for 'where'
 *      limit: // value for 'limit'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetExtendedFullChannelsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetExtendedFullChannelsQuery, GetExtendedFullChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetExtendedFullChannelsQuery, GetExtendedFullChannelsQueryVariables>(
    GetExtendedFullChannelsDocument,
    options
  )
}
export function useGetExtendedFullChannelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetExtendedFullChannelsQuery, GetExtendedFullChannelsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetExtendedFullChannelsQuery, GetExtendedFullChannelsQueryVariables>(
    GetExtendedFullChannelsDocument,
    options
  )
}
export type GetExtendedFullChannelsQueryHookResult = ReturnType<typeof useGetExtendedFullChannelsQuery>
export type GetExtendedFullChannelsLazyQueryHookResult = ReturnType<typeof useGetExtendedFullChannelsLazyQuery>
export type GetExtendedFullChannelsQueryResult = Apollo.QueryResult<
  GetExtendedFullChannelsQuery,
  GetExtendedFullChannelsQueryVariables
>
export const GetBasicChannelsConnectionDocument = gql`
  query GetBasicChannelsConnection(
    $first: Int
    $after: String
    $where: ChannelWhereInput
    $orderBy: [ChannelOrderByInput!] = [createdAt_DESC]
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
  mutation FollowChannel($channelId: String!) {
    followChannel(channelId: $channelId) {
      channelId
      follows
      cancelToken
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
  mutation UnfollowChannel($channelId: String!, $token: String!) {
    unfollowChannel(channelId: $channelId, token: $token) {
      channelId
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
 *      token: // value for 'token'
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
export const GetTop10ChannelsDocument = gql`
  query GetTop10Channels($where: ExtendedChannelWhereInput) {
    extendedChannels(where: $where, orderBy: followsNum_DESC, limit: 10) {
      channel {
        ...BasicChannelFields
      }
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
  query GetPromisingChannels($where: ExtendedChannelWhereInput) {
    mostRecentChannels(where: $where, orderBy: videoViewsNum_DESC, mostRecentLimit: 100, resultsLimit: 15) {
      channel {
        ...BasicChannelFields
      }
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
  query GetDiscoverChannels($where: ExtendedChannelWhereInput) {
    mostRecentChannels(where: $where, orderBy: followsNum_DESC, mostRecentLimit: 100, resultsLimit: 15) {
      channel {
        ...BasicChannelFields
      }
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
  query GetPopularChannels($where: ExtendedChannelWhereInput) {
    extendedChannels(where: $where, orderBy: videoViewsNum_DESC, limit: 15) {
      channel {
        ...BasicChannelFields
      }
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
  query GetChannelNftCollectors($channelId: String!, $orderBy: ChannelNftCollectorsOrderByInput = amount_DESC) {
    channelNftCollectors(channelId: $channelId, orderBy: $orderBy) {
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
 *      channelId: // value for 'channelId'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetChannelNftCollectorsQuery(
  baseOptions: Apollo.QueryHookOptions<GetChannelNftCollectorsQuery, GetChannelNftCollectorsQueryVariables>
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
export const GetTotalChannelsAndTotalVideosDocument = gql`
  query GetTotalChannelsAndTotalVideos($memberId: String!, $channelId: String!) {
    membershipById(id: $memberId) {
      totalChannelsCreated
      channels(where: { id_eq: $channelId }) {
        totalVideosCreated
      }
    }
  }
`

/**
 * __useGetTotalChannelsAndTotalVideosQuery__
 *
 * To run a query within a React component, call `useGetTotalChannelsAndTotalVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTotalChannelsAndTotalVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTotalChannelsAndTotalVideosQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetTotalChannelsAndTotalVideosQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTotalChannelsAndTotalVideosQuery,
    GetTotalChannelsAndTotalVideosQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTotalChannelsAndTotalVideosQuery, GetTotalChannelsAndTotalVideosQueryVariables>(
    GetTotalChannelsAndTotalVideosDocument,
    options
  )
}
export function useGetTotalChannelsAndTotalVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTotalChannelsAndTotalVideosQuery,
    GetTotalChannelsAndTotalVideosQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTotalChannelsAndTotalVideosQuery, GetTotalChannelsAndTotalVideosQueryVariables>(
    GetTotalChannelsAndTotalVideosDocument,
    options
  )
}
export type GetTotalChannelsAndTotalVideosQueryHookResult = ReturnType<typeof useGetTotalChannelsAndTotalVideosQuery>
export type GetTotalChannelsAndTotalVideosLazyQueryHookResult = ReturnType<
  typeof useGetTotalChannelsAndTotalVideosLazyQuery
>
export type GetTotalChannelsAndTotalVideosQueryResult = Apollo.QueryResult<
  GetTotalChannelsAndTotalVideosQuery,
  GetTotalChannelsAndTotalVideosQueryVariables
>
export const ReportChannelDocument = gql`
  mutation ReportChannel($channelId: String!, $rationale: String!) {
    reportChannel(channelId: $channelId, rationale: $rationale) {
      id
      channelId
    }
  }
`
export type ReportChannelMutationFn = Apollo.MutationFunction<ReportChannelMutation, ReportChannelMutationVariables>

/**
 * __useReportChannelMutation__
 *
 * To run a mutation, you first call `useReportChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportChannelMutation, { data, loading, error }] = useReportChannelMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      rationale: // value for 'rationale'
 *   },
 * });
 */
export function useReportChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<ReportChannelMutation, ReportChannelMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ReportChannelMutation, ReportChannelMutationVariables>(ReportChannelDocument, options)
}
export type ReportChannelMutationHookResult = ReturnType<typeof useReportChannelMutation>
export type ReportChannelMutationResult = Apollo.MutationResult<ReportChannelMutation>
export type ReportChannelMutationOptions = Apollo.BaseMutationOptions<
  ReportChannelMutation,
  ReportChannelMutationVariables
>
export const GetPayloadDataByCommitmentDocument = gql`
  query GetPayloadDataByCommitment($commitment: String!) {
    events(where: { data: { isTypeOf_eq: "ChannelPayoutsUpdatedEventData", commitment_eq: $commitment } }) {
      data {
        ... on ChannelPayoutsUpdatedEventData {
          payloadDataObject {
            ...StorageDataObjectFields
          }
        }
      }
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
`

/**
 * __useGetPayloadDataByCommitmentQuery__
 *
 * To run a query within a React component, call `useGetPayloadDataByCommitmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPayloadDataByCommitmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPayloadDataByCommitmentQuery({
 *   variables: {
 *      commitment: // value for 'commitment'
 *   },
 * });
 */
export function useGetPayloadDataByCommitmentQuery(
  baseOptions: Apollo.QueryHookOptions<GetPayloadDataByCommitmentQuery, GetPayloadDataByCommitmentQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPayloadDataByCommitmentQuery, GetPayloadDataByCommitmentQueryVariables>(
    GetPayloadDataByCommitmentDocument,
    options
  )
}
export function useGetPayloadDataByCommitmentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPayloadDataByCommitmentQuery, GetPayloadDataByCommitmentQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPayloadDataByCommitmentQuery, GetPayloadDataByCommitmentQueryVariables>(
    GetPayloadDataByCommitmentDocument,
    options
  )
}
export type GetPayloadDataByCommitmentQueryHookResult = ReturnType<typeof useGetPayloadDataByCommitmentQuery>
export type GetPayloadDataByCommitmentLazyQueryHookResult = ReturnType<typeof useGetPayloadDataByCommitmentLazyQuery>
export type GetPayloadDataByCommitmentQueryResult = Apollo.QueryResult<
  GetPayloadDataByCommitmentQuery,
  GetPayloadDataByCommitmentQueryVariables
>
export const GetChannelPaymentEventsDocument = gql`
  query GetChannelPaymentEvents($channelId: String) {
    events(
      orderBy: timestamp_DESC
      where: {
        OR: [
          {
            data: {
              isTypeOf_in: [
                "NftBoughtEventData"
                "BidMadeCompletingAuctionEventData"
                "EnglishAuctionSettledEventData"
                "OpenAuctionBidAcceptedEventData"
              ]
              previousNftOwner: { channel: { id_eq: $channelId } }
            }
          }
          {
            data: {
              isTypeOf_in: [
                "NftBoughtEventData"
                "BidMadeCompletingAuctionEventData"
                "EnglishAuctionSettledEventData"
                "OpenAuctionBidAcceptedEventData"
              ]
              nft: { video: { channel: { id_eq: $channelId } } }
            }
          }
          {
            data: {
              isTypeOf_in: ["ChannelRewardClaimedEventData", "ChannelFundsWithdrawnEventData"]
              channel: { id_eq: $channelId }
            }
          }
          { data: { isTypeOf_in: ["ChannelPaymentMadeEventData"], payeeChannel: { id_eq: $channelId } } }
        ]
      }
    ) {
      inBlock
      timestamp
      data {
        __typename
        ... on NftBoughtEventData {
          price
          buyer {
            controllerAccount
          }
          nft {
            creatorRoyalty
            video {
              title
            }
          }
          previousNftOwner {
            __typename
          }
        }
        ... on BidMadeCompletingAuctionEventData {
          previousNftOwner {
            __typename
          }
          winningBid {
            id
            amount
            bidder {
              controllerAccount
            }
            nft {
              creatorRoyalty
              video {
                title
              }
            }
            bidder {
              controllerAccount
            }
            amount
          }
        }
        ... on EnglishAuctionSettledEventData {
          previousNftOwner {
            __typename
          }
          winningBid {
            nft {
              creatorRoyalty
              video {
                title
              }
            }
            bidder {
              controllerAccount
            }
            amount
          }
        }
        ... on OpenAuctionBidAcceptedEventData {
          winningBid {
            nft {
              creatorRoyalty
              video {
                title
              }
            }
            bidder {
              controllerAccount
            }
            amount
          }
        }
        ... on OpenAuctionBidAcceptedEventData {
          previousNftOwner {
            __typename
          }
          winningBid {
            amount
            bidder {
              controllerAccount
            }
            nft {
              creatorRoyalty
              video {
                title
              }
            }
          }
        }
        ... on ChannelRewardClaimedEventData {
          amount
        }
        ... on ChannelFundsWithdrawnEventData {
          amount
          actor {
            __typename
            ... on ContentActorCurator {
              __typename
            }
            ... on ContentActorLead {
              __typename
            }
            ... on ContentActorMember {
              member {
                controllerAccount
              }
            }
          }
        }
        ... on ChannelPaymentMadeEventData {
          amount
          rationale
          payer {
            controllerAccount
          }
        }
        ... on ChannelPaymentMadeEventData {
          amount
          rationale
          payer {
            controllerAccount
          }
        }
      }
    }
  }
`

/**
 * __useGetChannelPaymentEventsQuery__
 *
 * To run a query within a React component, call `useGetChannelPaymentEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelPaymentEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelPaymentEventsQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetChannelPaymentEventsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelPaymentEventsQuery, GetChannelPaymentEventsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelPaymentEventsQuery, GetChannelPaymentEventsQueryVariables>(
    GetChannelPaymentEventsDocument,
    options
  )
}
export function useGetChannelPaymentEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelPaymentEventsQuery, GetChannelPaymentEventsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelPaymentEventsQuery, GetChannelPaymentEventsQueryVariables>(
    GetChannelPaymentEventsDocument,
    options
  )
}
export type GetChannelPaymentEventsQueryHookResult = ReturnType<typeof useGetChannelPaymentEventsQuery>
export type GetChannelPaymentEventsLazyQueryHookResult = ReturnType<typeof useGetChannelPaymentEventsLazyQuery>
export type GetChannelPaymentEventsQueryResult = Apollo.QueryResult<
  GetChannelPaymentEventsQuery,
  GetChannelPaymentEventsQueryVariables
>
