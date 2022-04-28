import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { CommentFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetCommentsQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
  where?: Types.InputMaybe<Types.CommentWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetCommentsQuery = {
  __typename?: 'Query'
  comments: Array<{
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
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    }
    reactions: Array<{ __typename?: 'CommentReaction'; id: string; createdAt: Date; reactionId: number }>
  }>
}

export type GetCommentsConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  where?: Types.InputMaybe<Types.CommentWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.CommentOrderByInput> | Types.CommentOrderByInput>
}>

export type GetCommentsConnectionQuery = {
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
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        reactions: Array<{ __typename?: 'CommentReaction'; id: string; createdAt: Date; reactionId: number }>
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
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
}

export const GetCommentsDocument = gql`
  query GetComments(
    $limit: Int
    $offset: Int
    $where: CommentWhereInput
    $orderBy: [CommentOrderByInput!] = [createdAt_DESC]
  ) {
    comments(limit: $limit, offset: $offset, where: $where, orderBy: $orderBy) {
      ...CommentFields
    }
  }
  ${CommentFieldsFragmentDoc}
`

/**
 * __useGetCommentsQuery__
 *
 * To run a query within a React component, call `useGetCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetCommentsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options)
}
export function useGetCommentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCommentsQuery, GetCommentsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCommentsQuery, GetCommentsQueryVariables>(GetCommentsDocument, options)
}
export type GetCommentsQueryHookResult = ReturnType<typeof useGetCommentsQuery>
export type GetCommentsLazyQueryHookResult = ReturnType<typeof useGetCommentsLazyQuery>
export type GetCommentsQueryResult = Apollo.QueryResult<GetCommentsQuery, GetCommentsQueryVariables>
export const GetCommentsConnectionDocument = gql`
  query GetCommentsConnection(
    $first: Int
    $after: String
    $where: CommentWhereInput
    $orderBy: [CommentOrderByInput!] = [createdAt_DESC]
  ) {
    commentsConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
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
 * __useGetCommentsConnectionQuery__
 *
 * To run a query within a React component, call `useGetCommentsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommentsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommentsConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetCommentsConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCommentsConnectionQuery, GetCommentsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCommentsConnectionQuery, GetCommentsConnectionQueryVariables>(
    GetCommentsConnectionDocument,
    options
  )
}
export function useGetCommentsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCommentsConnectionQuery, GetCommentsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCommentsConnectionQuery, GetCommentsConnectionQueryVariables>(
    GetCommentsConnectionDocument,
    options
  )
}
export type GetCommentsConnectionQueryHookResult = ReturnType<typeof useGetCommentsConnectionQuery>
export type GetCommentsConnectionLazyQueryHookResult = ReturnType<typeof useGetCommentsConnectionLazyQuery>
export type GetCommentsConnectionQueryResult = Apollo.QueryResult<
  GetCommentsConnectionQuery,
  GetCommentsConnectionQueryVariables
>
export const GetCommentEditsDocument = gql`
  query GetCommentEdits($commentId: ID!) {
    commentTextUpdatedEvents(where: { comment: { id_eq: $commentId } }) {
      id
      createdAt
      newText
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
