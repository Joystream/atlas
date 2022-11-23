import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { CommentFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetCommentQueryVariables = Types.Exact<{
  commentId: Types.Scalars['ID']
}>

export type GetCommentQuery = {
  __typename?: 'Query'
  commentByUniqueInput?: {
    __typename?: 'Comment'
    id: string
    createdAt: Date
    isEdited: boolean
    parentCommentId?: string | null
    repliesCount: number
    text: string
    status: Types.CommentStatus
    author: {
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
                  | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoSubtitle' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    }
    reactionsCountByReactionId: Array<{
      __typename?: 'CommentReactionsCountByReactionId'
      id: string
      count: number
      reactionId: number
    }>
  } | null
}

export type GetCommentRepliesConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  parentCommentId: Types.Scalars['ID']
  orderBy?: Types.InputMaybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetCommentRepliesConnectionQuery = {
  __typename?: 'Query'
  commentsConnection: {
    __typename?: 'CommentConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'CommentEdge'
      cursor: string
      node: {
        __typename?: 'Comment'
        id: string
        createdAt: Date
        isEdited: boolean
        parentCommentId?: string | null
        repliesCount: number
        text: string
        status: Types.CommentStatus
        author: {
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
                      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoSubtitle' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        reactionsCountByReactionId: Array<{
          __typename?: 'CommentReactionsCountByReactionId'
          id: string
          count: number
          reactionId: number
        }>
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetUserCommentsAndVideoCommentsConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  memberId?: Types.InputMaybe<Types.Scalars['ID']>
  videoId?: Types.InputMaybe<Types.Scalars['ID']>
  orderBy?: Types.InputMaybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetUserCommentsAndVideoCommentsConnectionQuery = {
  __typename?: 'Query'
  userComments: Array<{
    __typename?: 'Comment'
    id: string
    createdAt: Date
    isEdited: boolean
    parentCommentId?: string | null
    repliesCount: number
    text: string
    status: Types.CommentStatus
    author: {
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
                  | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoSubtitle' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    }
    reactionsCountByReactionId: Array<{
      __typename?: 'CommentReactionsCountByReactionId'
      id: string
      count: number
      reactionId: number
    }>
  }>
  videoCommentsConnection: {
    __typename?: 'CommentConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'CommentEdge'
      cursor: string
      node: {
        __typename?: 'Comment'
        id: string
        createdAt: Date
        isEdited: boolean
        parentCommentId?: string | null
        repliesCount: number
        text: string
        status: Types.CommentStatus
        author: {
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
                      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoSubtitle' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        reactionsCountByReactionId: Array<{
          __typename?: 'CommentReactionsCountByReactionId'
          id: string
          count: number
          reactionId: number
        }>
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetUserCommentsReactionsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']
  videoId: Types.Scalars['ID']
}>

export type GetUserCommentsReactionsQuery = {
  __typename?: 'Query'
  commentReactions: Array<{ __typename?: 'CommentReaction'; reactionId: number; commentId: string }>
}

export type GetCommentEditsQueryVariables = Types.Exact<{
  commentId: Types.Scalars['ID']
}>

export type GetCommentEditsQuery = {
  __typename?: 'Query'
  commentTextUpdatedEvents: Array<{
    __typename?: 'CommentTextUpdatedEvent'
    id: string
    createdAt: Date
    newText: string
  }>
  commentCreatedEvents: Array<{ __typename?: 'CommentCreatedEvent'; id: string; createdAt: Date; text: string }>
}

export const GetCommentDocument = gql`
  query GetComment($commentId: ID!) {
    commentByUniqueInput(where: { id: $commentId }) {
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
    $parentCommentId: ID!
    $orderBy: [CommentOrderByInput!] = [createdAt_ASC]
  ) {
    commentsConnection(
      first: $first
      after: $after
      where: { parentComment: { id_eq: $parentCommentId }, status_eq: VISIBLE }
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
      totalCount
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
    $memberId: ID
    $videoId: ID
    $orderBy: [CommentOrderByInput!] = [createdAt_DESC]
  ) {
    userComments: comments(
      where: {
        parentComment: { id_eq: null }
        video: { id_eq: $videoId }
        author: { id_eq: $memberId }
        OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }]
      }
      orderBy: [createdAt_DESC]
    ) {
      ...CommentFields
    }
    videoCommentsConnection: commentsConnection(
      first: $first
      after: $after
      where: {
        video: { id_eq: $videoId }
        parentComment: { id_eq: null }
        OR: [{ status_eq: VISIBLE }, { repliesCount_gt: 0 }]
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
      totalCount
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
  query GetUserCommentsReactions($memberId: ID!, $videoId: ID!) {
    commentReactions(where: { member: { id_eq: $memberId }, video: { id_eq: $videoId } }, limit: 1000) {
      reactionId
      commentId
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
  query GetCommentEdits($commentId: ID!) {
    commentTextUpdatedEvents(where: { comment: { id_eq: $commentId } }) {
      id
      createdAt
      newText
    }
    commentCreatedEvents(where: { comment: { id_eq: $commentId } }) {
      id
      createdAt
      text
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
