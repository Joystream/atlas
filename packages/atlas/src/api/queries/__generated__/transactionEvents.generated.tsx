import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { MetaprotocolTransactionResultFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetMetaprotocolTransactionStatusEventsQueryVariables = Types.Exact<{
  transactionHash: Types.Scalars['String']
}>

export type GetMetaprotocolTransactionStatusEventsQuery = {
  __typename?: 'Query'
  events: Array<{
    __typename?: 'Event'
    inExtrinsic?: string | null
    inBlock: number
    data:
      | { __typename?: 'AuctionBidCanceledEventData' }
      | { __typename?: 'AuctionBidMadeEventData' }
      | { __typename?: 'AuctionCanceledEventData' }
      | { __typename?: 'BidMadeCompletingAuctionEventData' }
      | { __typename?: 'BuyNowCanceledEventData' }
      | { __typename?: 'BuyNowPriceUpdatedEventData' }
      | { __typename?: 'ChannelAssetsDeletedByModeratorEventData' }
      | { __typename?: 'ChannelCreatedEventData' }
      | { __typename?: 'ChannelFundsWithdrawnEventData' }
      | { __typename?: 'ChannelPaymentMadeEventData' }
      | { __typename?: 'ChannelPayoutsUpdatedEventData' }
      | { __typename?: 'ChannelRewardClaimedAndWithdrawnEventData' }
      | { __typename?: 'ChannelRewardClaimedEventData' }
      | { __typename?: 'CommentCreatedEventData' }
      | { __typename?: 'CommentReactionEventData' }
      | { __typename?: 'CommentTextUpdatedEventData' }
      | { __typename?: 'CreatorTokenIssuedEventData' }
      | { __typename?: 'CreatorTokenMarketBurnEventData' }
      | { __typename?: 'CreatorTokenMarketMintEventData' }
      | { __typename?: 'CreatorTokenMarketStartedEventData' }
      | { __typename?: 'CreatorTokenRevenueSplitIssuedEventData' }
      | { __typename?: 'CreatorTokenSaleMintEventData' }
      | { __typename?: 'CreatorTokenSaleStartedEventData' }
      | { __typename?: 'EnglishAuctionSettledEventData' }
      | { __typename?: 'EnglishAuctionStartedEventData' }
      | { __typename?: 'MemberBannedFromChannelEventData' }
      | {
          __typename?: 'MetaprotocolTransactionStatusEventData'
          result:
            | { __typename: 'MetaprotocolTransactionResultChannelPaid' }
            | {
                __typename: 'MetaprotocolTransactionResultCommentCreated'
                commentCreated?: {
                  __typename?: 'Comment'
                  id: string
                  isExcluded: boolean
                  createdAt: Date
                  isEdited: boolean
                  repliesCount: number
                  text: string
                  status: Types.CommentStatus
                  tipTier?: Types.CommentTipTier | null
                  tipAmount: string
                  author: {
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
                  reactionsCountByReactionId?: Array<{
                    __typename?: 'CommentReactionsCountByReactionId'
                    count: number
                    reactionId: number
                  }> | null
                  parentComment?: { __typename?: 'Comment'; id: string } | null
                } | null
              }
            | {
                __typename: 'MetaprotocolTransactionResultCommentDeleted'
                commentDeleted?: {
                  __typename?: 'Comment'
                  id: string
                  isExcluded: boolean
                  createdAt: Date
                  isEdited: boolean
                  repliesCount: number
                  text: string
                  status: Types.CommentStatus
                  tipTier?: Types.CommentTipTier | null
                  tipAmount: string
                  author: {
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
                  reactionsCountByReactionId?: Array<{
                    __typename?: 'CommentReactionsCountByReactionId'
                    count: number
                    reactionId: number
                  }> | null
                  parentComment?: { __typename?: 'Comment'; id: string } | null
                } | null
              }
            | {
                __typename: 'MetaprotocolTransactionResultCommentEdited'
                commentEdited?: {
                  __typename?: 'Comment'
                  id: string
                  isExcluded: boolean
                  createdAt: Date
                  isEdited: boolean
                  repliesCount: number
                  text: string
                  status: Types.CommentStatus
                  tipTier?: Types.CommentTipTier | null
                  tipAmount: string
                  author: {
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
                  reactionsCountByReactionId?: Array<{
                    __typename?: 'CommentReactionsCountByReactionId'
                    count: number
                    reactionId: number
                  }> | null
                  parentComment?: { __typename?: 'Comment'; id: string } | null
                } | null
              }
            | {
                __typename: 'MetaprotocolTransactionResultCommentModerated'
                commentModerated?: {
                  __typename?: 'Comment'
                  id: string
                  isExcluded: boolean
                  createdAt: Date
                  isEdited: boolean
                  repliesCount: number
                  text: string
                  status: Types.CommentStatus
                  tipTier?: Types.CommentTipTier | null
                  tipAmount: string
                  author: {
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
                  reactionsCountByReactionId?: Array<{
                    __typename?: 'CommentReactionsCountByReactionId'
                    count: number
                    reactionId: number
                  }> | null
                  parentComment?: { __typename?: 'Comment'; id: string } | null
                } | null
              }
            | { __typename: 'MetaprotocolTransactionResultFailed'; errorMessage: string }
            | { __typename: 'MetaprotocolTransactionResultOK' }
        }
      | { __typename?: 'NftBoughtEventData' }
      | { __typename?: 'NftIssuedEventData' }
      | { __typename?: 'NftOfferedEventData' }
      | { __typename?: 'NftSellOrderMadeEventData' }
      | { __typename?: 'OpenAuctionBidAcceptedEventData' }
      | { __typename?: 'OpenAuctionStartedEventData' }
      | { __typename?: 'VideoAssetsDeletedByModeratorEventData' }
      | { __typename?: 'VideoCreatedEventData' }
      | { __typename?: 'VideoReactionEventData' }
  }>
}

export const GetMetaprotocolTransactionStatusEventsDocument = gql`
  query GetMetaprotocolTransactionStatusEvents($transactionHash: String!) {
    events(
      where: { data: { isTypeOf_eq: "MetaprotocolTransactionStatusEventData" }, inExtrinsic_eq: $transactionHash }
    ) {
      inExtrinsic
      inBlock
      data {
        ... on MetaprotocolTransactionStatusEventData {
          result {
            ...MetaprotocolTransactionResultFields
          }
        }
      }
    }
  }
  ${MetaprotocolTransactionResultFieldsFragmentDoc}
`

/**
 * __useGetMetaprotocolTransactionStatusEventsQuery__
 *
 * To run a query within a React component, call `useGetMetaprotocolTransactionStatusEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMetaprotocolTransactionStatusEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMetaprotocolTransactionStatusEventsQuery({
 *   variables: {
 *      transactionHash: // value for 'transactionHash'
 *   },
 * });
 */
export function useGetMetaprotocolTransactionStatusEventsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >(GetMetaprotocolTransactionStatusEventsDocument, options)
}
export function useGetMetaprotocolTransactionStatusEventsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetMetaprotocolTransactionStatusEventsQuery,
    GetMetaprotocolTransactionStatusEventsQueryVariables
  >(GetMetaprotocolTransactionStatusEventsDocument, options)
}
export type GetMetaprotocolTransactionStatusEventsQueryHookResult = ReturnType<
  typeof useGetMetaprotocolTransactionStatusEventsQuery
>
export type GetMetaprotocolTransactionStatusEventsLazyQueryHookResult = ReturnType<
  typeof useGetMetaprotocolTransactionStatusEventsLazyQuery
>
export type GetMetaprotocolTransactionStatusEventsQueryResult = Apollo.QueryResult<
  GetMetaprotocolTransactionStatusEventsQuery,
  GetMetaprotocolTransactionStatusEventsQueryVariables
>
