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
      description?: string | null
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
        cumulativeRevenue: string
        avatarPhoto?: {
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
        } | null
        creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
      }
      media?: {
        __typename?: 'StorageDataObject'
        id: string
        isAccepted: boolean
        resolvedUrls: Array<string>
        storageBag: { __typename?: 'StorageBag'; id: string }
      } | null
      nft?: { __typename?: 'OwnedNft'; id: string } | null
      thumbnailPhoto?: {
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
            cumulativeRevenue: string
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
            avatarPhoto?: {
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
            } | null
            creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
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
      description?: string | null
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
        cumulativeRevenue: string
        avatarPhoto?: {
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
        } | null
        creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
      }
      media?: {
        __typename?: 'StorageDataObject'
        id: string
        isAccepted: boolean
        resolvedUrls: Array<string>
        storageBag: { __typename?: 'StorageBag'; id: string }
      } | null
      nft?: { __typename?: 'OwnedNft'; id: string } | null
      thumbnailPhoto?: {
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
            cumulativeRevenue: string
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
            avatarPhoto?: {
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
            } | null
            creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
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
          description?: string | null
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
            cumulativeRevenue: string
            avatarPhoto?: {
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
            } | null
            creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
          }
          media?: {
            __typename?: 'StorageDataObject'
            id: string
            isAccepted: boolean
            resolvedUrls: Array<string>
            storageBag: { __typename?: 'StorageBag'; id: string }
          } | null
          nft?: { __typename?: 'OwnedNft'; id: string } | null
          thumbnailPhoto?: {
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
                cumulativeRevenue: string
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
                avatarPhoto?: {
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
                } | null
                creatorToken?: {
                  __typename?: 'TokenChannel'
                  token: { __typename?: 'CreatorToken'; id: string }
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

export type GetNftsCountQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.OwnedNftWhereInput>
}>

export type GetNftsCountQuery = {
  __typename?: 'Query'
  ownedNftsConnection: { __typename?: 'OwnedNftsConnection'; totalCount: number }
}

export type GetFeaturedNftsVideosQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  where?: Types.InputMaybe<Types.OwnedNftWhereInput>
  orderBy?: Types.InputMaybe<Array<Types.OwnedNftOrderByInput> | Types.OwnedNftOrderByInput>
}>

export type GetFeaturedNftsVideosQuery = {
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
      description?: string | null
      viewsNum: number
      createdAt: Date
      duration?: number | null
      reactionsCount: number
      commentsCount: number
      media?: {
        __typename?: 'StorageDataObject'
        id: string
        isAccepted: boolean
        resolvedUrls: Array<string>
        createdAt: Date
        size: string
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
      channel: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        description?: string | null
        createdAt: Date
        followsNum: number
        rewardAccount: string
        channelStateBloatBond: string
        cumulativeRevenue: string
        avatarPhoto?: {
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
        } | null
        creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
      }
      nft?: { __typename?: 'OwnedNft'; id: string } | null
      thumbnailPhoto?: {
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
            cumulativeRevenue: string
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
            avatarPhoto?: {
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
            } | null
            creatorToken?: { __typename?: 'TokenChannel'; token: { __typename?: 'CreatorToken'; id: string } } | null
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
        }
      | { __typename: 'TransactionalStatusBuyNow'; price: string }
      | { __typename: 'TransactionalStatusIdle' }
      | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      | null
  }>
}

export type RequestNftFeaturedMutationVariables = Types.Exact<{
  nftId: Types.Scalars['String']
  rationale: Types.Scalars['String']
}>

export type RequestNftFeaturedMutation = {
  __typename?: 'Mutation'
  requestNftFeatured: { __typename?: 'NftFeaturedRequstInfo'; rationale: string; nftId: string; createdAt: Date }
}

export type GetJoystreamTotalEarningsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetJoystreamTotalEarningsQuery = {
  __typename?: 'Query'
  totalJoystreamEarnings: {
    __typename?: 'EarningStatsOutput'
    crtSaleVolume: string
    totalRewardsPaid: string
    nftSaleVolume: string
  }
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
  query GetNfts($where: OwnedNftWhereInput, $orderBy: [OwnedNftOrderByInput!], $limit: Int, $offset: Int) {
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
    $orderBy: [OwnedNftOrderByInput!] = [id_DESC]
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
export const GetNftsCountDocument = gql`
  query GetNftsCount($where: OwnedNftWhereInput) {
    ownedNftsConnection(where: $where, orderBy: [id_ASC]) {
      totalCount
    }
  }
`

/**
 * __useGetNftsCountQuery__
 *
 * To run a query within a React component, call `useGetNftsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftsCountQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetNftsCountQuery(
  baseOptions?: Apollo.QueryHookOptions<GetNftsCountQuery, GetNftsCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftsCountQuery, GetNftsCountQueryVariables>(GetNftsCountDocument, options)
}
export function useGetNftsCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNftsCountQuery, GetNftsCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftsCountQuery, GetNftsCountQueryVariables>(GetNftsCountDocument, options)
}
export type GetNftsCountQueryHookResult = ReturnType<typeof useGetNftsCountQuery>
export type GetNftsCountLazyQueryHookResult = ReturnType<typeof useGetNftsCountLazyQuery>
export type GetNftsCountQueryResult = Apollo.QueryResult<GetNftsCountQuery, GetNftsCountQueryVariables>
export const GetFeaturedNftsVideosDocument = gql`
  query GetFeaturedNftsVideos($limit: Int, $where: OwnedNftWhereInput, $orderBy: [OwnedNftOrderByInput!]) {
    ownedNfts(limit: $limit, orderBy: $orderBy, where: $where) {
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
 * __useGetFeaturedNftsVideosQuery__
 *
 * To run a query within a React component, call `useGetFeaturedNftsVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeaturedNftsVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeaturedNftsVideosQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetFeaturedNftsVideosQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFeaturedNftsVideosQuery, GetFeaturedNftsVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFeaturedNftsVideosQuery, GetFeaturedNftsVideosQueryVariables>(
    GetFeaturedNftsVideosDocument,
    options
  )
}
export function useGetFeaturedNftsVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFeaturedNftsVideosQuery, GetFeaturedNftsVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFeaturedNftsVideosQuery, GetFeaturedNftsVideosQueryVariables>(
    GetFeaturedNftsVideosDocument,
    options
  )
}
export type GetFeaturedNftsVideosQueryHookResult = ReturnType<typeof useGetFeaturedNftsVideosQuery>
export type GetFeaturedNftsVideosLazyQueryHookResult = ReturnType<typeof useGetFeaturedNftsVideosLazyQuery>
export type GetFeaturedNftsVideosQueryResult = Apollo.QueryResult<
  GetFeaturedNftsVideosQuery,
  GetFeaturedNftsVideosQueryVariables
>
export const RequestNftFeaturedDocument = gql`
  mutation RequestNftFeatured($nftId: String!, $rationale: String!) {
    requestNftFeatured(nftId: $nftId, rationale: $rationale) {
      rationale
      nftId
      createdAt
    }
  }
`
export type RequestNftFeaturedMutationFn = Apollo.MutationFunction<
  RequestNftFeaturedMutation,
  RequestNftFeaturedMutationVariables
>

/**
 * __useRequestNftFeaturedMutation__
 *
 * To run a mutation, you first call `useRequestNftFeaturedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestNftFeaturedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestNftFeaturedMutation, { data, loading, error }] = useRequestNftFeaturedMutation({
 *   variables: {
 *      nftId: // value for 'nftId'
 *      rationale: // value for 'rationale'
 *   },
 * });
 */
export function useRequestNftFeaturedMutation(
  baseOptions?: Apollo.MutationHookOptions<RequestNftFeaturedMutation, RequestNftFeaturedMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RequestNftFeaturedMutation, RequestNftFeaturedMutationVariables>(
    RequestNftFeaturedDocument,
    options
  )
}
export type RequestNftFeaturedMutationHookResult = ReturnType<typeof useRequestNftFeaturedMutation>
export type RequestNftFeaturedMutationResult = Apollo.MutationResult<RequestNftFeaturedMutation>
export type RequestNftFeaturedMutationOptions = Apollo.BaseMutationOptions<
  RequestNftFeaturedMutation,
  RequestNftFeaturedMutationVariables
>
export const GetJoystreamTotalEarningsDocument = gql`
  query GetJoystreamTotalEarnings {
    totalJoystreamEarnings {
      crtSaleVolume
      totalRewardsPaid
      nftSaleVolume
    }
  }
`

/**
 * __useGetJoystreamTotalEarningsQuery__
 *
 * To run a query within a React component, call `useGetJoystreamTotalEarningsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetJoystreamTotalEarningsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetJoystreamTotalEarningsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetJoystreamTotalEarningsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetJoystreamTotalEarningsQuery, GetJoystreamTotalEarningsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetJoystreamTotalEarningsQuery, GetJoystreamTotalEarningsQueryVariables>(
    GetJoystreamTotalEarningsDocument,
    options
  )
}
export function useGetJoystreamTotalEarningsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetJoystreamTotalEarningsQuery, GetJoystreamTotalEarningsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetJoystreamTotalEarningsQuery, GetJoystreamTotalEarningsQueryVariables>(
    GetJoystreamTotalEarningsDocument,
    options
  )
}
export type GetJoystreamTotalEarningsQueryHookResult = ReturnType<typeof useGetJoystreamTotalEarningsQuery>
export type GetJoystreamTotalEarningsLazyQueryHookResult = ReturnType<typeof useGetJoystreamTotalEarningsLazyQuery>
export type GetJoystreamTotalEarningsQueryResult = Apollo.QueryResult<
  GetJoystreamTotalEarningsQuery,
  GetJoystreamTotalEarningsQueryVariables
>
