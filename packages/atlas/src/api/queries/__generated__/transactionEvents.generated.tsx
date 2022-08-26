import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { MetaprotocolTransactionSuccessFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetMetaprotocolTransactionStatusEventsQueryVariables = Types.Exact<{
  transactionHash: Types.Scalars['String']
}>

export type GetMetaprotocolTransactionStatusEventsQuery = {
  __typename?: 'Query'
  metaprotocolTransactionStatusEvents: Array<{
    __typename?: 'MetaprotocolTransactionStatusEvent'
    inExtrinsic?: string | null
    inBlock: number
    status:
      | { __typename: 'MetaprotocolTransactionErrored'; message: string }
      | {
          __typename: 'MetaprotocolTransactionSuccessful'
          commentCreated?: {
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
          commentEdited?: {
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
          commentDeleted?: {
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
          commentModerated?: {
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
  }>
}

export const GetMetaprotocolTransactionStatusEventsDocument = gql`
  query GetMetaprotocolTransactionStatusEvents($transactionHash: String!) {
    metaprotocolTransactionStatusEvents(where: { inExtrinsic_eq: $transactionHash }) {
      inExtrinsic
      inBlock
      status {
        __typename
        ... on MetaprotocolTransactionErrored {
          message
        }
        ... on MetaprotocolTransactionSuccessful {
          ...MetaprotocolTransactionSuccessFields
        }
      }
    }
  }
  ${MetaprotocolTransactionSuccessFieldsFragmentDoc}
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
