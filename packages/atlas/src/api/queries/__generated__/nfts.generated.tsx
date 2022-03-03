import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { AllNftFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetNftQueryVariables = Types.Exact<{
  videoId: Types.Scalars['ID']
}>

export type GetNftQuery = {
  __typename?: 'Query'
  ownedNfts: Array<{
    __typename?: 'OwnedNft'
    id: string
    createdAt: Date
    creatorRoyalty?: number | null
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
    transactionalStatus:
      | {
          __typename: 'TransactionalStatusAuction'
          auction?: {
            __typename?: 'Auction'
            isCompleted: boolean
            buyNowPrice?: number | null
            minimalBidStep: number
            startingPrice: number
            startsAtBlock: number
            plannedEndAtBlock?: number | null
            endedAtBlock?: number | null
            auctionType:
              | { __typename: 'AuctionTypeEnglish'; duration: number; extensionPeriod?: number | null }
              | { __typename: 'AuctionTypeOpen'; bidLockingTime: number }
            lastBid?: {
              __typename?: 'Bid'
              amount: number
              createdAt: Date
              isCanceled: boolean
              bidder: {
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
              }
            } | null
            bids: Array<{
              __typename?: 'Bid'
              amount: number
              createdAt: Date
              isCanceled: boolean
              bidder: {
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
              }
            }>
            whitelistedMembers: Array<{
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
            }>
          } | null
        }
      | { __typename: 'TransactionalStatusBuyNow'; price: number }
      | { __typename: 'TransactionalStatusIdle'; dummy?: number | null }
      | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
    video: {
      __typename?: 'Video'
      id: string
      title?: string | null
      views: number
      createdAt: Date
      duration?: number | null
      isPublic?: boolean | null
      media?: {
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
      channel: {
        __typename?: 'Channel'
        id: string
        title?: string | null
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
      }
      thumbnailPhoto?: {
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
  }>
}

export type GetChannelNftsQueryVariables = Types.Exact<{
  channelId?: Types.InputMaybe<Types.Scalars['ID']>
}>

export type GetChannelNftsQuery = {
  __typename?: 'Query'
  videos: Array<{
    __typename?: 'Video'
    nft?: {
      __typename?: 'OwnedNft'
      id: string
      createdAt: Date
      creatorRoyalty?: number | null
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
      transactionalStatus:
        | {
            __typename: 'TransactionalStatusAuction'
            auction?: {
              __typename?: 'Auction'
              isCompleted: boolean
              buyNowPrice?: number | null
              minimalBidStep: number
              startingPrice: number
              startsAtBlock: number
              plannedEndAtBlock?: number | null
              endedAtBlock?: number | null
              auctionType:
                | { __typename: 'AuctionTypeEnglish'; duration: number; extensionPeriod?: number | null }
                | { __typename: 'AuctionTypeOpen'; bidLockingTime: number }
              lastBid?: {
                __typename?: 'Bid'
                amount: number
                createdAt: Date
                isCanceled: boolean
                bidder: {
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
                }
              } | null
              bids: Array<{
                __typename?: 'Bid'
                amount: number
                createdAt: Date
                isCanceled: boolean
                bidder: {
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
                }
              }>
              whitelistedMembers: Array<{
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
              }>
            } | null
          }
        | { __typename: 'TransactionalStatusBuyNow'; price: number }
        | { __typename: 'TransactionalStatusIdle'; dummy?: number | null }
        | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      video: {
        __typename?: 'Video'
        id: string
        title?: string | null
        views: number
        createdAt: Date
        duration?: number | null
        isPublic?: boolean | null
        media?: {
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
        channel: {
          __typename?: 'Channel'
          id: string
          title?: string | null
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
        }
        thumbnailPhoto?: {
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
    } | null
  }>
}

export const GetNftDocument = gql`
  query GetNft($videoId: ID!) {
    ownedNfts(where: { video: { id_eq: $videoId } }) {
      ...AllNftFields
    }
  }
  ${AllNftFieldsFragmentDoc}
`

/**
 * __useGetNftQuery__
 *
 * To run a query within a React component, call `useGetNftQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftQuery({
 *   variables: {
 *      videoId: // value for 'videoId'
 *   },
 * });
 */
export function useGetNftQuery(baseOptions: Apollo.QueryHookOptions<GetNftQuery, GetNftQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftQuery, GetNftQueryVariables>(GetNftDocument, options)
}
export function useGetNftLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNftQuery, GetNftQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftQuery, GetNftQueryVariables>(GetNftDocument, options)
}
export type GetNftQueryHookResult = ReturnType<typeof useGetNftQuery>
export type GetNftLazyQueryHookResult = ReturnType<typeof useGetNftLazyQuery>
export type GetNftQueryResult = Apollo.QueryResult<GetNftQuery, GetNftQueryVariables>
export const GetChannelNftsDocument = gql`
  query GetChannelNfts($channelId: ID) {
    videos(where: { nft: { metadata_contains: "" }, channel: { id_eq: $channelId } }) {
      nft {
        ...AllNftFields
      }
    }
  }
  ${AllNftFieldsFragmentDoc}
`

/**
 * __useGetChannelNftsQuery__
 *
 * To run a query within a React component, call `useGetChannelNftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelNftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelNftsQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetChannelNftsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetChannelNftsQuery, GetChannelNftsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelNftsQuery, GetChannelNftsQueryVariables>(GetChannelNftsDocument, options)
}
export function useGetChannelNftsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetChannelNftsQuery, GetChannelNftsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelNftsQuery, GetChannelNftsQueryVariables>(GetChannelNftsDocument, options)
}
export type GetChannelNftsQueryHookResult = ReturnType<typeof useGetChannelNftsQuery>
export type GetChannelNftsLazyQueryHookResult = ReturnType<typeof useGetChannelNftsLazyQuery>
export type GetChannelNftsQueryResult = Apollo.QueryResult<GetChannelNftsQuery, GetChannelNftsQueryVariables>
