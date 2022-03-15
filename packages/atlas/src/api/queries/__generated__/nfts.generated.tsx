import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { AllNftFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetNftQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']
}>

export type GetNftQuery = {
  __typename?: 'Query'
  ownedNftByUniqueInput?: {
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
            initialOwner?: {
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
            lastBid?: {
              __typename?: 'Bid'
              amount: number
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
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
              createdInBlock: number
              id: string
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
          | { __typename: 'TransactionalStatusAuction' }
          | { __typename: 'TransactionalStatusBuyNow' }
          | { __typename: 'TransactionalStatusIdle' }
          | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      } | null
    }
  } | null
}

export type GetNftsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.OwnedNftWhereInput>
}>

export type GetNftsQuery = {
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
            initialOwner?: {
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
            lastBid?: {
              __typename?: 'Bid'
              amount: number
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
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
              createdInBlock: number
              id: string
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
          | { __typename: 'TransactionalStatusAuction' }
          | { __typename: 'TransactionalStatusBuyNow' }
          | { __typename: 'TransactionalStatusIdle' }
          | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      } | null
    }
  }>
}

export const GetNftDocument = gql`
  query GetNft($id: ID!) {
    ownedNftByUniqueInput(where: { id: $id }) {
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
 *      id: // value for 'id'
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
export const GetNftsDocument = gql`
  query GetNfts($where: OwnedNftWhereInput) {
    ownedNfts(where: $where) {
      ...AllNftFields
    }
  }
  ${AllNftFieldsFragmentDoc}
`

/**
 * __useGetNftsQuery__
 *
 * To run a query within a React component, call `useGetNftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftsQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetNftsQuery(baseOptions?: Apollo.QueryHookOptions<GetNftsQuery, GetNftsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftsQuery, GetNftsQueryVariables>(GetNftsDocument, options)
}
export function useGetNftsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNftsQuery, GetNftsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftsQuery, GetNftsQueryVariables>(GetNftsDocument, options)
}
export type GetNftsQueryHookResult = ReturnType<typeof useGetNftsQuery>
export type GetNftsLazyQueryHookResult = ReturnType<typeof useGetNftsLazyQuery>
export type GetNftsQueryResult = Apollo.QueryResult<GetNftsQuery, GetNftsQueryVariables>
