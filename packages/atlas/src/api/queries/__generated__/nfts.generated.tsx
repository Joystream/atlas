import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import {
  BasicVideoFieldsFragmentDoc,
  FullNftFieldsFragmentDoc,
  StorageDataObjectFieldsFragmentDoc,
} from './fragments.generated'

const defaultOptions = {} as const
export type GetNftQueryVariables = Types.Exact<{
  id: Types.Scalars['String']
}>

export type GetNftQuery = {
  __typename?: 'Query'
  ownedNftById?: {
    __typename?: 'OwnedNft'
    id: string
    createdAt: Date
    creatorRoyalty?: number | null
    lastSaleDate?: Date | null
    lastSalePrice?: string | null
    video: {
      __typename?: 'Video'
      id: string
      title?: string | null
      viewsNum: number
      createdAt: Date
      duration?: number | null
      reactionsCount: number
      commentsCount: number
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
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
      }
      thumbnailPhoto?: {
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
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoSubtitle' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | null
      } | null
      nft?: {
        __typename?: 'OwnedNft'
        id: string
        createdAt: Date
        creatorRoyalty?: number | null
        lastSaleDate?: Date | null
        lastSalePrice?: string | null
        owner:
          | {
              __typename: 'NftOwnerChannel'
              channel: {
                __typename?: 'Channel'
                id: string
                title?: string | null
                description?: string | null
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
                    | { __typename: 'DataObjectTypeVideoMedia' }
                    | { __typename: 'DataObjectTypeVideoSubtitle' }
                    | { __typename: 'DataObjectTypeVideoThumbnail' }
                    | null
                } | null
              }
            }
          | {
              __typename: 'NftOwnerMember'
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
            }
        transactionalStatus?:
          | {
              __typename: 'TransactionalStatusAuction'
              auction: {
                __typename?: 'Auction'
                id: string
                isCompleted: boolean
                buyNowPrice?: string | null
                startingPrice: string
                startsAtBlock: number
                endedAtBlock?: number | null
                auctionType:
                  | {
                      __typename: 'AuctionTypeEnglish'
                      duration: number
                      extensionPeriod: number
                      minimalBidStep: string
                      plannedEndAtBlock: number
                    }
                  | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
                topBid?: {
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                } | null
                bids: Array<{
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                whitelistedMembers: Array<{
                  __typename?: 'AuctionWhitelistedMember'
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
            }
          | { __typename: 'TransactionalStatusBuyNow'; price: string }
          | { __typename: 'TransactionalStatusIdle' }
          | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
          | null
      } | null
    }
    owner:
      | {
          __typename: 'NftOwnerChannel'
          channel: {
            __typename?: 'Channel'
            id: string
            title?: string | null
            description?: string | null
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
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            } | null
          }
        }
      | {
          __typename: 'NftOwnerMember'
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
        }
    transactionalStatus?:
      | {
          __typename: 'TransactionalStatusAuction'
          auction: {
            __typename?: 'Auction'
            id: string
            isCompleted: boolean
            buyNowPrice?: string | null
            startingPrice: string
            startsAtBlock: number
            endedAtBlock?: number | null
            auctionType:
              | {
                  __typename: 'AuctionTypeEnglish'
                  duration: number
                  extensionPeriod: number
                  minimalBidStep: string
                  plannedEndAtBlock: number
                }
              | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
            topBid?: {
              __typename?: 'Bid'
              amount: string
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
              bidder: {
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
            } | null
            bids: Array<{
              __typename?: 'Bid'
              amount: string
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
              bidder: {
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
            whitelistedMembers: Array<{
              __typename?: 'AuctionWhitelistedMember'
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
        }
      | { __typename: 'TransactionalStatusBuyNow'; price: string }
      | { __typename: 'TransactionalStatusIdle' }
      | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      | null
  } | null
}

export type GetNftsQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.OwnedNftWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.OwnedNftOrderByInput> | Types.OwnedNftOrderByInput>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  offset?: Types.InputMaybe<Types.Scalars['Int']>
}>

export type GetNftsQuery = {
  __typename?: 'Query'
  ownedNfts: Array<{
    __typename?: 'OwnedNft'
    id: string
    createdAt: Date
    creatorRoyalty?: number | null
    lastSaleDate?: Date | null
    lastSalePrice?: string | null
    video: {
      __typename?: 'Video'
      id: string
      title?: string | null
      viewsNum: number
      createdAt: Date
      duration?: number | null
      reactionsCount: number
      commentsCount: number
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
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
      }
      thumbnailPhoto?: {
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
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoSubtitle' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | null
      } | null
      nft?: {
        __typename?: 'OwnedNft'
        id: string
        createdAt: Date
        creatorRoyalty?: number | null
        lastSaleDate?: Date | null
        lastSalePrice?: string | null
        owner:
          | {
              __typename: 'NftOwnerChannel'
              channel: {
                __typename?: 'Channel'
                id: string
                title?: string | null
                description?: string | null
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
                    | { __typename: 'DataObjectTypeVideoMedia' }
                    | { __typename: 'DataObjectTypeVideoSubtitle' }
                    | { __typename: 'DataObjectTypeVideoThumbnail' }
                    | null
                } | null
              }
            }
          | {
              __typename: 'NftOwnerMember'
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
            }
        transactionalStatus?:
          | {
              __typename: 'TransactionalStatusAuction'
              auction: {
                __typename?: 'Auction'
                id: string
                isCompleted: boolean
                buyNowPrice?: string | null
                startingPrice: string
                startsAtBlock: number
                endedAtBlock?: number | null
                auctionType:
                  | {
                      __typename: 'AuctionTypeEnglish'
                      duration: number
                      extensionPeriod: number
                      minimalBidStep: string
                      plannedEndAtBlock: number
                    }
                  | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
                topBid?: {
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                } | null
                bids: Array<{
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                whitelistedMembers: Array<{
                  __typename?: 'AuctionWhitelistedMember'
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
            }
          | { __typename: 'TransactionalStatusBuyNow'; price: string }
          | { __typename: 'TransactionalStatusIdle' }
          | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
          | null
      } | null
    }
    owner:
      | {
          __typename: 'NftOwnerChannel'
          channel: {
            __typename?: 'Channel'
            id: string
            title?: string | null
            description?: string | null
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
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            } | null
          }
        }
      | {
          __typename: 'NftOwnerMember'
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
        }
    transactionalStatus?:
      | {
          __typename: 'TransactionalStatusAuction'
          auction: {
            __typename?: 'Auction'
            id: string
            isCompleted: boolean
            buyNowPrice?: string | null
            startingPrice: string
            startsAtBlock: number
            endedAtBlock?: number | null
            auctionType:
              | {
                  __typename: 'AuctionTypeEnglish'
                  duration: number
                  extensionPeriod: number
                  minimalBidStep: string
                  plannedEndAtBlock: number
                }
              | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
            topBid?: {
              __typename?: 'Bid'
              amount: string
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
              bidder: {
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
            } | null
            bids: Array<{
              __typename?: 'Bid'
              amount: string
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
              bidder: {
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
            whitelistedMembers: Array<{
              __typename?: 'AuctionWhitelistedMember'
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
        }
      | { __typename: 'TransactionalStatusBuyNow'; price: string }
      | { __typename: 'TransactionalStatusIdle' }
      | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      | null
  }>
}

export type GetNftsConnectionQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.OwnedNftWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.OwnedNftOrderByInput> | Types.OwnedNftOrderByInput>
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetNftsConnectionQuery = {
  __typename?: 'Query'
  ownedNftsConnection: {
    __typename?: 'OwnedNftsConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'OwnedNftEdge'
      cursor: string
      node: {
        __typename?: 'OwnedNft'
        id: string
        createdAt: Date
        creatorRoyalty?: number | null
        lastSaleDate?: Date | null
        lastSalePrice?: string | null
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
          viewsNum: number
          createdAt: Date
          duration?: number | null
          reactionsCount: number
          commentsCount: number
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
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            } | null
          }
          thumbnailPhoto?: {
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
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoSubtitle' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
              | null
          } | null
          nft?: {
            __typename?: 'OwnedNft'
            id: string
            createdAt: Date
            creatorRoyalty?: number | null
            lastSaleDate?: Date | null
            lastSalePrice?: string | null
            owner:
              | {
                  __typename: 'NftOwnerChannel'
                  channel: {
                    __typename?: 'Channel'
                    id: string
                    title?: string | null
                    description?: string | null
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
                        | { __typename: 'DataObjectTypeVideoMedia' }
                        | { __typename: 'DataObjectTypeVideoSubtitle' }
                        | { __typename: 'DataObjectTypeVideoThumbnail' }
                        | null
                    } | null
                  }
                }
              | {
                  __typename: 'NftOwnerMember'
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
                }
            transactionalStatus?:
              | {
                  __typename: 'TransactionalStatusAuction'
                  auction: {
                    __typename?: 'Auction'
                    id: string
                    isCompleted: boolean
                    buyNowPrice?: string | null
                    startingPrice: string
                    startsAtBlock: number
                    endedAtBlock?: number | null
                    auctionType:
                      | {
                          __typename: 'AuctionTypeEnglish'
                          duration: number
                          extensionPeriod: number
                          minimalBidStep: string
                          plannedEndAtBlock: number
                        }
                      | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
                    topBid?: {
                      __typename?: 'Bid'
                      amount: string
                      createdAt: Date
                      isCanceled: boolean
                      createdInBlock: number
                      id: string
                      bidder: {
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
                    } | null
                    bids: Array<{
                      __typename?: 'Bid'
                      amount: string
                      createdAt: Date
                      isCanceled: boolean
                      createdInBlock: number
                      id: string
                      bidder: {
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
                    whitelistedMembers: Array<{
                      __typename?: 'AuctionWhitelistedMember'
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
                }
              | { __typename: 'TransactionalStatusBuyNow'; price: string }
              | { __typename: 'TransactionalStatusIdle' }
              | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
              | null
          } | null
        }
        owner:
          | {
              __typename: 'NftOwnerChannel'
              channel: {
                __typename?: 'Channel'
                id: string
                title?: string | null
                description?: string | null
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
                    | { __typename: 'DataObjectTypeVideoMedia' }
                    | { __typename: 'DataObjectTypeVideoSubtitle' }
                    | { __typename: 'DataObjectTypeVideoThumbnail' }
                    | null
                } | null
              }
            }
          | {
              __typename: 'NftOwnerMember'
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
            }
        transactionalStatus?:
          | {
              __typename: 'TransactionalStatusAuction'
              auction: {
                __typename?: 'Auction'
                id: string
                isCompleted: boolean
                buyNowPrice?: string | null
                startingPrice: string
                startsAtBlock: number
                endedAtBlock?: number | null
                auctionType:
                  | {
                      __typename: 'AuctionTypeEnglish'
                      duration: number
                      extensionPeriod: number
                      minimalBidStep: string
                      plannedEndAtBlock: number
                    }
                  | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
                topBid?: {
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                } | null
                bids: Array<{
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                whitelistedMembers: Array<{
                  __typename?: 'AuctionWhitelistedMember'
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
            }
          | { __typename: 'TransactionalStatusBuyNow'; price: string }
          | { __typename: 'TransactionalStatusIdle' }
          | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
          | null
      }
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor: string }
  }
}

export type GetFeaturedNftsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetFeaturedNftsQuery = {
  __typename?: 'Query'
  ownedNfts: Array<{
    __typename?: 'OwnedNft'
    id: string
    createdAt: Date
    creatorRoyalty?: number | null
    lastSaleDate?: Date | null
    lastSalePrice?: string | null
    video: {
      __typename?: 'Video'
      id: string
      title?: string | null
      viewsNum: number
      createdAt: Date
      duration?: number | null
      reactionsCount: number
      commentsCount: number
      media?: {
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
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoSubtitle' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | null
      } | null
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
            | { __typename: 'DataObjectTypeVideoMedia' }
            | { __typename: 'DataObjectTypeVideoSubtitle' }
            | { __typename: 'DataObjectTypeVideoThumbnail' }
            | null
        } | null
      }
      thumbnailPhoto?: {
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
          | { __typename: 'DataObjectTypeVideoMedia' }
          | { __typename: 'DataObjectTypeVideoSubtitle' }
          | { __typename: 'DataObjectTypeVideoThumbnail' }
          | null
      } | null
      nft?: {
        __typename?: 'OwnedNft'
        id: string
        createdAt: Date
        creatorRoyalty?: number | null
        lastSaleDate?: Date | null
        lastSalePrice?: string | null
        owner:
          | {
              __typename: 'NftOwnerChannel'
              channel: {
                __typename?: 'Channel'
                id: string
                title?: string | null
                description?: string | null
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
                    | { __typename: 'DataObjectTypeVideoMedia' }
                    | { __typename: 'DataObjectTypeVideoSubtitle' }
                    | { __typename: 'DataObjectTypeVideoThumbnail' }
                    | null
                } | null
              }
            }
          | {
              __typename: 'NftOwnerMember'
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
            }
        transactionalStatus?:
          | {
              __typename: 'TransactionalStatusAuction'
              auction: {
                __typename?: 'Auction'
                id: string
                isCompleted: boolean
                buyNowPrice?: string | null
                startingPrice: string
                startsAtBlock: number
                endedAtBlock?: number | null
                auctionType:
                  | {
                      __typename: 'AuctionTypeEnglish'
                      duration: number
                      extensionPeriod: number
                      minimalBidStep: string
                      plannedEndAtBlock: number
                    }
                  | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
                topBid?: {
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                } | null
                bids: Array<{
                  __typename?: 'Bid'
                  amount: string
                  createdAt: Date
                  isCanceled: boolean
                  createdInBlock: number
                  id: string
                  bidder: {
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
                whitelistedMembers: Array<{
                  __typename?: 'AuctionWhitelistedMember'
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
            }
          | { __typename: 'TransactionalStatusBuyNow'; price: string }
          | { __typename: 'TransactionalStatusIdle' }
          | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
          | null
      } | null
    }
    owner:
      | {
          __typename: 'NftOwnerChannel'
          channel: {
            __typename?: 'Channel'
            id: string
            title?: string | null
            description?: string | null
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
                | { __typename: 'DataObjectTypeVideoMedia' }
                | { __typename: 'DataObjectTypeVideoSubtitle' }
                | { __typename: 'DataObjectTypeVideoThumbnail' }
                | null
            } | null
          }
        }
      | {
          __typename: 'NftOwnerMember'
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
        }
    transactionalStatus?:
      | {
          __typename: 'TransactionalStatusAuction'
          auction: {
            __typename?: 'Auction'
            id: string
            isCompleted: boolean
            buyNowPrice?: string | null
            startingPrice: string
            startsAtBlock: number
            endedAtBlock?: number | null
            auctionType:
              | {
                  __typename: 'AuctionTypeEnglish'
                  duration: number
                  extensionPeriod: number
                  minimalBidStep: string
                  plannedEndAtBlock: number
                }
              | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
            topBid?: {
              __typename?: 'Bid'
              amount: string
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
              bidder: {
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
            } | null
            bids: Array<{
              __typename?: 'Bid'
              amount: string
              createdAt: Date
              isCanceled: boolean
              createdInBlock: number
              id: string
              bidder: {
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
            whitelistedMembers: Array<{
              __typename?: 'AuctionWhitelistedMember'
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
        }
      | { __typename: 'TransactionalStatusBuyNow'; price: string }
      | { __typename: 'TransactionalStatusIdle' }
      | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      | null
  }>
}

export const GetNftDocument = gql`
  query GetNft($id: String!) {
    ownedNftById(id: $id) {
      ...FullNftFields
    }
  }
  ${FullNftFieldsFragmentDoc}
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
  query GetNfts(
    $where: OwnedNftWhereInput
    $orderBy: [OwnedNftOrderByInput!] = [createdAt_DESC]
    $limit: Int
    $offset: Int
  ) {
    ownedNfts(where: $where, orderBy: $orderBy, limit: $limit, offset: $offset) {
      ...FullNftFields
    }
  }
  ${FullNftFieldsFragmentDoc}
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
 *      orderBy: // value for 'orderBy'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
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
export const GetNftsConnectionDocument = gql`
  query GetNftsConnection(
    $where: OwnedNftWhereInput
    $orderBy: [OwnedNftOrderByInput!] = [createdAt_DESC]
    $first: Int
    $after: String
  ) {
    ownedNftsConnection(where: $where, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        cursor
        node {
          ...FullNftFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${FullNftFieldsFragmentDoc}
`

/**
 * __useGetNftsConnectionQuery__
 *
 * To run a query within a React component, call `useGetNftsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftsConnectionQuery({
 *   variables: {
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetNftsConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>(GetNftsConnectionDocument, options)
}
export function useGetNftsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>(
    GetNftsConnectionDocument,
    options
  )
}
export type GetNftsConnectionQueryHookResult = ReturnType<typeof useGetNftsConnectionQuery>
export type GetNftsConnectionLazyQueryHookResult = ReturnType<typeof useGetNftsConnectionLazyQuery>
export type GetNftsConnectionQueryResult = Apollo.QueryResult<GetNftsConnectionQuery, GetNftsConnectionQueryVariables>
export const GetFeaturedNftsDocument = gql`
  query GetFeaturedNfts {
    ownedNfts(limit: 5, orderBy: [createdAt_DESC]) {
      ...FullNftFields
      video {
        ...BasicVideoFields
        media {
          ...StorageDataObjectFields
        }
      }
    }
  }
  ${FullNftFieldsFragmentDoc}
  ${BasicVideoFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
`

/**
 * __useGetFeaturedNftsQuery__
 *
 * To run a query within a React component, call `useGetFeaturedNftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeaturedNftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeaturedNftsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFeaturedNftsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFeaturedNftsQuery, GetFeaturedNftsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFeaturedNftsQuery, GetFeaturedNftsQueryVariables>(GetFeaturedNftsDocument, options)
}
export function useGetFeaturedNftsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFeaturedNftsQuery, GetFeaturedNftsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFeaturedNftsQuery, GetFeaturedNftsQueryVariables>(GetFeaturedNftsDocument, options)
}
export type GetFeaturedNftsQueryHookResult = ReturnType<typeof useGetFeaturedNftsQuery>
export type GetFeaturedNftsLazyQueryHookResult = ReturnType<typeof useGetFeaturedNftsLazyQuery>
export type GetFeaturedNftsQueryResult = Apollo.QueryResult<GetFeaturedNftsQuery, GetFeaturedNftsQueryVariables>
