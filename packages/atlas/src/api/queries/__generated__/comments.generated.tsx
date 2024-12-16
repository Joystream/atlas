import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { CommentFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetCommentQueryVariables = Types.Exact<{
  commentId: Types.Scalars['String']
}>

export type GetCommentQuery = {
  __typename?: 'Query'
  commentById?: {
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

export type GetCommentRepliesConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  parentCommentId: Types.Scalars['String']
  orderBy?: Types.InputMaybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetCommentRepliesConnectionQuery = {
  __typename?: 'Query'
  commentsConnection: {
    __typename?: 'CommentsConnection'
    edges: Array<{
      __typename?: 'CommentEdge'
      cursor: string
      node: {
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
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor: string }
  }
}

export type GetUserCommentsAndVideoCommentsConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  memberId?: Types.InputMaybe<Types.Scalars['String']>
  videoId?: Types.InputMaybe<Types.Scalars['String']>
  orderBy?: Types.InputMaybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetUserCommentsAndVideoCommentsConnectionQuery = {
  __typename?: 'Query'
  userComments: Array<{
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
  }>
  videoCommentsConnection: {
    __typename?: 'CommentsConnection'
    edges: Array<{
      __typename?: 'CommentEdge'
      cursor: string
      node: {
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
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor: string }
  }
}

export type GetUserCommentsReactionsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['String']
  videoId: Types.Scalars['String']
}>

export type GetUserCommentsReactionsQuery = {
  __typename?: 'Query'
  commentReactions: Array<{
    __typename?: 'CommentReaction'
    id: string
    reactionId: number
    comment: { __typename?: 'Comment'; id: string }
  }>
}

export type GetCommentEditsQueryVariables = Types.Exact<{
  commentId: Types.Scalars['String']
}>

export type GetCommentEditsQuery = {
  __typename?: 'Query'
  events: Array<{
    __typename?: 'Event'
    id: string
    timestamp: Date
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
      | { __typename?: 'CommentCreatedEventData'; text: string }
      | { __typename?: 'CommentReactionEventData' }
      | { __typename?: 'CommentTextUpdatedEventData'; newText: string }
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
      | { __typename?: 'MetaprotocolTransactionStatusEventData' }
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

export type GetTipTiersQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetTipTiersQuery = {
  __typename?: 'Query'
  tipTiers: { __typename?: 'CommentTipTiers'; SILVER: number; GOLD: number; DIAMOND: number }
}

export const GetCommentDocument = gql`
  query GetComment($commentId: String!) {
    commentById(id: $commentId) {
      ...CommentFields
    }
  }
  ${CommentFieldsFragmentDoc}
`

/**
 * __useGetCommentQuery__
 *
 * To run a query within a React component, call `useGetCommentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentQuery({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useGetCommentQuery(baseOptions: Apollo.QueryHookOptions<GetCommentQuery, GetCommentQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCommentQuery, GetCommentQueryVariables>(GetCommentDocument, options)
}
export function useGetCommentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCommentQuery, GetCommentQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCommentQuery, GetCommentQueryVariables>(GetCommentDocument, options)
}
export type GetCommentQueryHookResult = ReturnType<typeof useGetCommentQuery>
export type GetCommentLazyQueryHookResult = ReturnType<typeof useGetCommentLazyQuery>
export type GetCommentQueryResult = Apollo.QueryResult<GetCommentQuery, GetCommentQueryVariables>
export const GetCommentRepliesConnectionDocument = gql`
  query GetCommentRepliesConnection(
    $first: Int
    $after: String
    $parentCommentId: String!
    $orderBy: [CommentOrderByInput!] = [id_ASC]
  ) {
    commentsConnection(
      first: $first
      after: $after
      where: { parentComment: { id_eq: $parentCommentId }, status_eq: VISIBLE, isExcluded_eq: false }
      orderBy: $orderBy
    ) {
      edges {
        cursor
        node {
          ...CommentFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${CommentFieldsFragmentDoc}
`

/**
 * __useGetCommentRepliesConnectionQuery__
 *
 * To run a query within a React component, call `useGetCommentRepliesConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentRepliesConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentRepliesConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      parentCommentId: // value for 'parentCommentId'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetCommentRepliesConnectionQuery(
  baseOptions: Apollo.QueryHookOptions<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>(
    GetCommentRepliesConnectionDocument,
    options
  )
}
export function useGetCommentRepliesConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCommentRepliesConnectionQuery, GetCommentRepliesConnectionQueryVariables>(
    GetCommentRepliesConnectionDocument,
    options
  )
}
export type GetCommentRepliesConnectionQueryHookResult = ReturnType<typeof useGetCommentRepliesConnectionQuery>
export type GetCommentRepliesConnectionLazyQueryHookResult = ReturnType<typeof useGetCommentRepliesConnectionLazyQuery>
export type GetCommentRepliesConnectionQueryResult = Apollo.QueryResult<
  GetCommentRepliesConnectionQuery,
  GetCommentRepliesConnectionQueryVariables
>
export const GetUserCommentsAndVideoCommentsConnectionDocument = gql`
  query GetUserCommentsAndVideoCommentsConnection(
    $first: Int
    $after: String
    $memberId: String
    $videoId: String
    $orderBy: [CommentOrderByInput!] = [createdAt_DESC]
  ) {
    userComments: comments(
      where: {
        AND: [
          { parentComment: { id_isNull: true } }
          { video: { id_eq: $videoId } }
          { author: { id_eq: $memberId } }
          { OR: [{ isExcluded_eq: false }, { repliesCount_gt: 0 }] }
          { OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }] }
        ]
      }
      orderBy: [createdAt_DESC]
    ) {
      ...CommentFields
    }
    videoCommentsConnection: commentsConnection(
      first: $first
      after: $after
      where: {
        AND: [
          { video: { id_eq: $videoId } }
          { parentComment: { id_isNull: true } }
          { OR: [{ isExcluded_eq: false }, { repliesCount_gt: 0 }] }
          { OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }] }
        ]
      }
      orderBy: $orderBy
    ) {
      edges {
        cursor
        node {
          ...CommentFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${CommentFieldsFragmentDoc}
`

/**
 * __useGetUserCommentsAndVideoCommentsConnectionQuery__
 *
 * To run a query within a React component, call `useGetUserCommentsAndVideoCommentsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserCommentsAndVideoCommentsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserCommentsAndVideoCommentsConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      memberId: // value for 'memberId'
 *      videoId: // value for 'videoId'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetUserCommentsAndVideoCommentsConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUserCommentsAndVideoCommentsConnectionQuery,
    GetUserCommentsAndVideoCommentsConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    GetUserCommentsAndVideoCommentsConnectionQuery,
    GetUserCommentsAndVideoCommentsConnectionQueryVariables
  >(GetUserCommentsAndVideoCommentsConnectionDocument, options)
}
export function useGetUserCommentsAndVideoCommentsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserCommentsAndVideoCommentsConnectionQuery,
    GetUserCommentsAndVideoCommentsConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetUserCommentsAndVideoCommentsConnectionQuery,
    GetUserCommentsAndVideoCommentsConnectionQueryVariables
  >(GetUserCommentsAndVideoCommentsConnectionDocument, options)
}
export type GetUserCommentsAndVideoCommentsConnectionQueryHookResult = ReturnType<
  typeof useGetUserCommentsAndVideoCommentsConnectionQuery
>
export type GetUserCommentsAndVideoCommentsConnectionLazyQueryHookResult = ReturnType<
  typeof useGetUserCommentsAndVideoCommentsConnectionLazyQuery
>
export type GetUserCommentsAndVideoCommentsConnectionQueryResult = Apollo.QueryResult<
  GetUserCommentsAndVideoCommentsConnectionQuery,
  GetUserCommentsAndVideoCommentsConnectionQueryVariables
>
export const GetUserCommentsReactionsDocument = gql`
  query GetUserCommentsReactions($memberId: String!, $videoId: String!) {
    commentReactions(where: { member: { id_eq: $memberId }, video: { id_eq: $videoId } }, limit: 1000) {
      id
      reactionId
      comment {
        id
      }
    }
  }
`

/**
 * __useGetUserCommentsReactionsQuery__
 *
 * To run a query within a React component, call `useGetUserCommentsReactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserCommentsReactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserCommentsReactionsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      videoId: // value for 'videoId'
 *   },
 * });
 */
export function useGetUserCommentsReactionsQuery(
  baseOptions: Apollo.QueryHookOptions<GetUserCommentsReactionsQuery, GetUserCommentsReactionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetUserCommentsReactionsQuery, GetUserCommentsReactionsQueryVariables>(
    GetUserCommentsReactionsDocument,
    options
  )
}
export function useGetUserCommentsReactionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserCommentsReactionsQuery, GetUserCommentsReactionsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetUserCommentsReactionsQuery, GetUserCommentsReactionsQueryVariables>(
    GetUserCommentsReactionsDocument,
    options
  )
}
export type GetUserCommentsReactionsQueryHookResult = ReturnType<typeof useGetUserCommentsReactionsQuery>
export type GetUserCommentsReactionsLazyQueryHookResult = ReturnType<typeof useGetUserCommentsReactionsLazyQuery>
export type GetUserCommentsReactionsQueryResult = Apollo.QueryResult<
  GetUserCommentsReactionsQuery,
  GetUserCommentsReactionsQueryVariables
>
export const GetCommentEditsDocument = gql`
  query GetCommentEdits($commentId: String!) {
    events(
      where: {
        data: {
          isTypeOf_in: ["CommentCreatedEventData", "CommentTextUpdatedEventData"]
          comment: { id_eq: $commentId }
        }
      }
    ) {
      id
      timestamp
      data {
        ... on CommentCreatedEventData {
          text
        }
        ... on CommentTextUpdatedEventData {
          newText
        }
      }
    }
  }
`

/**
 * __useGetCommentEditsQuery__
 *
 * To run a query within a React component, call `useGetCommentEditsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentEditsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentEditsQuery({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useGetCommentEditsQuery(
  baseOptions: Apollo.QueryHookOptions<GetCommentEditsQuery, GetCommentEditsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCommentEditsQuery, GetCommentEditsQueryVariables>(GetCommentEditsDocument, options)
}
export function useGetCommentEditsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCommentEditsQuery, GetCommentEditsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCommentEditsQuery, GetCommentEditsQueryVariables>(GetCommentEditsDocument, options)
}
export type GetCommentEditsQueryHookResult = ReturnType<typeof useGetCommentEditsQuery>
export type GetCommentEditsLazyQueryHookResult = ReturnType<typeof useGetCommentEditsLazyQuery>
export type GetCommentEditsQueryResult = Apollo.QueryResult<GetCommentEditsQuery, GetCommentEditsQueryVariables>
export const GetTipTiersDocument = gql`
  query GetTipTiers {
    tipTiers {
      SILVER
      GOLD
      DIAMOND
    }
  }
`

/**
 * __useGetTipTiersQuery__
 *
 * To run a query within a React component, call `useGetTipTiersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTipTiersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTipTiersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTipTiersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTipTiersQuery, GetTipTiersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTipTiersQuery, GetTipTiersQueryVariables>(GetTipTiersDocument, options)
}
export function useGetTipTiersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTipTiersQuery, GetTipTiersQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTipTiersQuery, GetTipTiersQueryVariables>(GetTipTiersDocument, options)
}
export type GetTipTiersQueryHookResult = ReturnType<typeof useGetTipTiersQuery>
export type GetTipTiersLazyQueryHookResult = ReturnType<typeof useGetTipTiersLazyQuery>
export type GetTipTiersQueryResult = Apollo.QueryResult<GetTipTiersQuery, GetTipTiersQueryVariables>
