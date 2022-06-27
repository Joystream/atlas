import { gql } from '@apollo/client'

import * as Types from './baseTypes.generated'

export type VideoCategoryFieldsFragment = {
  __typename?: 'VideoCategory'
  id: string
  name?: string | null
  activeVideosCounter: number
}

export type BasicChannelFieldsFragment = {
  __typename?: 'Channel'
  id: string
  title?: string | null
  createdAt: Date
  follows: number
  avatarPhoto?: {
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

export type FullChannelFieldsFragment = {
  __typename?: 'Channel'
  views: number
  activeVideosCounter: number
  description?: string | null
  isPublic?: boolean | null
  isCensored: boolean
  id: string
  title?: string | null
  createdAt: Date
  follows: number
  language?: { __typename?: 'Language'; id: string; iso: string } | null
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
  } | null
  coverPhoto?: {
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
  avatarPhoto?: {
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

export type BasicMembershipFieldsFragment = {
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

export type FullMembershipFieldsFragment = {
  __typename?: 'Membership'
  controllerAccount: string
  createdAt: Date
  id: string
  handle: string
  channels: Array<{
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    avatarPhoto?: {
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
  }>
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

export type StorageDataObjectFieldsFragment = {
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
}

export type DistributionBucketOperatorFieldFragment = {
  __typename?: 'DistributionBucketOperator'
  id: string
  status: Types.DistributionBucketOperatorStatus
  metadata?: {
    __typename?: 'DistributionBucketOperatorMetadata'
    nodeEndpoint?: string | null
    nodeLocation?: {
      __typename?: 'NodeLocationMetadata'
      coordinates?: { __typename?: 'GeoCoordinates'; latitude: number; longitude: number } | null
    } | null
  } | null
}

export type VideoMediaMetadataFieldsFragment = {
  __typename?: 'VideoMediaMetadata'
  id: string
  pixelHeight?: number | null
  pixelWidth?: number | null
}

export type LicenseFieldsFragment = {
  __typename?: 'License'
  id: string
  code?: number | null
  attribution?: string | null
  customText?: string | null
}

export type BasicVideoFieldsFragment = {
  __typename?: 'Video'
  id: string
  title?: string | null
  views: number
  createdAt: Date
  duration?: number | null
  reactionsCount: number
  commentsCount: number
  channel: {
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    avatarPhoto?: {
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
  thumbnailPhoto?: {
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
  nft?: { __typename?: 'OwnedNft'; id: string } | null
}

export type FullVideoFieldsFragment = {
  __typename?: 'Video'
  id: string
  title?: string | null
  description?: string | null
  reactionsCount: number
  views: number
  duration?: number | null
  createdAt: Date
  isPublic?: boolean | null
  isExplicit?: boolean | null
  hasMarketing?: boolean | null
  isCensored: boolean
  isCommentSectionEnabled: boolean
  commentsCount: number
  publishedBeforeJoystream?: Date | null
  reactions: Array<{
    __typename?: 'VideoReaction'
    id: string
    createdAt: Date
    reaction: Types.VideoReactionOptions
    memberId: string
  }>
  category?: { __typename?: 'VideoCategory'; id: string; name?: string | null } | null
  language?: { __typename?: 'Language'; iso: string } | null
  mediaMetadata?: {
    __typename?: 'VideoMediaMetadata'
    id: string
    pixelHeight?: number | null
    pixelWidth?: number | null
  } | null
  media?: {
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
  thumbnailPhoto?: {
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
  channel: {
    __typename?: 'Channel'
    views: number
    activeVideosCounter: number
    description?: string | null
    isPublic?: boolean | null
    isCensored: boolean
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    language?: { __typename?: 'Language'; id: string; iso: string } | null
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
    } | null
    coverPhoto?: {
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
    avatarPhoto?: {
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
  license?: {
    __typename?: 'License'
    id: string
    code?: number | null
    attribution?: string | null
    customText?: string | null
  } | null
  nft?: {
    __typename?: 'OwnedNft'
    id: string
    createdAt: Date
    creatorRoyalty?: number | null
    lastSaleDate?: Date | null
    lastSalePrice?: string | null
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
    } | null
    creatorChannel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      createdAt: Date
      follows: number
      avatarPhoto?: {
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
    transactionalStatusAuction?: {
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
            minimalBidStep: number
            plannedEndAtBlock: number
          }
        | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
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
      } | null
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
      }>
    } | null
    transactionalStatus?:
      | { __typename: 'TransactionalStatusBuyNow'; price: number }
      | { __typename: 'TransactionalStatusIdle'; dummy?: number | null }
      | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      | null
    video: {
      __typename?: 'Video'
      id: string
      title?: string | null
      views: number
      createdAt: Date
      duration?: number | null
      reactionsCount: number
      commentsCount: number
      channel: {
        __typename?: 'Channel'
        id: string
        title?: string | null
        createdAt: Date
        follows: number
        avatarPhoto?: {
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
      thumbnailPhoto?: {
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
      nft?: { __typename?: 'OwnedNft'; id: string } | null
    }
  } | null
}

export type FullNftFieldsFragment = {
  __typename?: 'OwnedNft'
  id: string
  createdAt: Date
  creatorRoyalty?: number | null
  lastSaleDate?: Date | null
  lastSalePrice?: string | null
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
  } | null
  creatorChannel: {
    __typename?: 'Channel'
    id: string
    title?: string | null
    createdAt: Date
    follows: number
    avatarPhoto?: {
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
  transactionalStatusAuction?: {
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
          minimalBidStep: number
          plannedEndAtBlock: number
        }
      | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
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
    } | null
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
    }>
  } | null
  transactionalStatus?:
    | { __typename: 'TransactionalStatusBuyNow'; price: number }
    | { __typename: 'TransactionalStatusIdle'; dummy?: number | null }
    | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
    | null
  video: {
    __typename?: 'Video'
    id: string
    title?: string | null
    views: number
    createdAt: Date
    duration?: number | null
    reactionsCount: number
    commentsCount: number
    channel: {
      __typename?: 'Channel'
      id: string
      title?: string | null
      createdAt: Date
      follows: number
      avatarPhoto?: {
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
    thumbnailPhoto?: {
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
    nft?: { __typename?: 'OwnedNft'; id: string } | null
  }
}

export type BasicBidFieldsFragment = {
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
}

export type FullBidFieldsFragment = {
  __typename?: 'Bid'
  amount: string
  createdAt: Date
  isCanceled: boolean
  createdInBlock: number
  id: string
  auction: {
    __typename?: 'Auction'
    isCompleted: boolean
    winningMemberId?: string | null
    id: string
    auctionType: { __typename: 'AuctionTypeEnglish' } | { __typename: 'AuctionTypeOpen' }
  }
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
}

export type CommentReactionsCountByReactionIdFieldsFragment = {
  __typename?: 'CommentReactionsCountByReactionId'
  id: string
  count: number
  reactionId: number
}

export type CommentFieldsFragment = {
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
  reactionsCountByReactionId: Array<{
    __typename?: 'CommentReactionsCountByReactionId'
    id: string
    count: number
    reactionId: number
  }>
}

export type MetaprotocolTransactionSuccessFieldsFragment = {
  __typename?: 'MetaprotocolTransactionSuccessful'
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

export const VideoCategoryFieldsFragmentDoc = gql`
  fragment VideoCategoryFields on VideoCategory {
    id
    name
    activeVideosCounter
  }
`
export const StorageDataObjectFieldsFragmentDoc = gql`
  fragment StorageDataObjectFields on StorageDataObject {
    id
    createdAt
    size
    isAccepted
    ipfsHash
    storageBag {
      id
    }
    type {
      __typename
    }
  }
`
export const BasicMembershipFieldsFragmentDoc = gql`
  fragment BasicMembershipFields on Membership {
    id
    handle
    metadata {
      avatar {
        ... on AvatarObject {
          avatarObject {
            ...StorageDataObjectFields
          }
        }
        ... on AvatarUri {
          avatarUri
        }
      }
      about
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
`
export const BasicChannelFieldsFragmentDoc = gql`
  fragment BasicChannelFields on Channel {
    id
    title
    createdAt
    follows
    avatarPhoto {
      ...StorageDataObjectFields
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
`
export const FullMembershipFieldsFragmentDoc = gql`
  fragment FullMembershipFields on Membership {
    ...BasicMembershipFields
    controllerAccount
    createdAt
    channels {
      ...BasicChannelFields
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
`
export const DistributionBucketOperatorFieldFragmentDoc = gql`
  fragment DistributionBucketOperatorField on DistributionBucketOperator {
    id
    metadata {
      nodeEndpoint
      nodeLocation {
        coordinates {
          latitude
          longitude
        }
      }
    }
    status
  }
`
export const VideoMediaMetadataFieldsFragmentDoc = gql`
  fragment VideoMediaMetadataFields on VideoMediaMetadata {
    id
    pixelHeight
    pixelWidth
  }
`
export const FullChannelFieldsFragmentDoc = gql`
  fragment FullChannelFields on Channel {
    ...BasicChannelFields
    views
    activeVideosCounter
    description
    isPublic
    isCensored
    language {
      id
      iso
    }
    ownerMember {
      ...BasicMembershipFields
    }
    coverPhoto {
      ...StorageDataObjectFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
  ${BasicMembershipFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
`
export const LicenseFieldsFragmentDoc = gql`
  fragment LicenseFields on License {
    id
    code
    attribution
    customText
  }
`
export const BasicBidFieldsFragmentDoc = gql`
  fragment BasicBidFields on Bid {
    bidder {
      ...BasicMembershipFields
    }
    amount
    createdAt
    isCanceled
    createdInBlock
    id
  }
  ${BasicMembershipFieldsFragmentDoc}
`
export const BasicVideoFieldsFragmentDoc = gql`
  fragment BasicVideoFields on Video {
    id
    title
    views
    createdAt
    duration
    reactionsCount
    commentsCount
    channel {
      ...BasicChannelFields
    }
    thumbnailPhoto {
      ...StorageDataObjectFields
    }
    nft {
      id
    }
  }
  ${BasicChannelFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
`
export const FullNftFieldsFragmentDoc = gql`
  fragment FullNftFields on OwnedNft {
    id
    createdAt
    creatorRoyalty
    lastSaleDate
    lastSalePrice
    ownerMember {
      ...BasicMembershipFields
    }
    creatorChannel {
      ...BasicChannelFields
    }
    transactionalStatusAuction {
      id
      auctionType {
        __typename
        ... on AuctionTypeEnglish {
          duration
          extensionPeriod
          minimalBidStep
          plannedEndAtBlock
        }
        ... on AuctionTypeOpen {
          bidLockDuration
        }
      }
      isCompleted
      initialOwner {
        ...BasicMembershipFields
      }
      buyNowPrice
      startingPrice
      startsAtBlock
      endedAtBlock
      topBid {
        ...BasicBidFields
      }
      bids {
        ...BasicBidFields
      }
      whitelistedMembers {
        ...BasicMembershipFields
      }
    }
    transactionalStatus {
      __typename
      ... on TransactionalStatusIdle {
        dummy
      }
      ... on TransactionalStatusBuyNow {
        price
      }
    }
    video {
      ...BasicVideoFields
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
  ${BasicBidFieldsFragmentDoc}
  ${BasicVideoFieldsFragmentDoc}
`
export const FullVideoFieldsFragmentDoc = gql`
  fragment FullVideoFields on Video {
    id
    title
    description
    reactionsCount
    reactions {
      id
      createdAt
      reaction
      memberId
    }
    category {
      id
      name
    }
    views
    duration
    createdAt
    isPublic
    isExplicit
    hasMarketing
    isCensored
    isCommentSectionEnabled
    commentsCount
    language {
      iso
    }
    publishedBeforeJoystream
    mediaMetadata {
      ...VideoMediaMetadataFields
    }
    media {
      ...StorageDataObjectFields
    }
    thumbnailPhoto {
      ...StorageDataObjectFields
    }
    channel {
      ...FullChannelFields
    }
    license {
      ...LicenseFields
    }
    nft {
      ...FullNftFields
    }
  }
  ${VideoMediaMetadataFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
  ${FullChannelFieldsFragmentDoc}
  ${LicenseFieldsFragmentDoc}
  ${FullNftFieldsFragmentDoc}
`
export const FullBidFieldsFragmentDoc = gql`
  fragment FullBidFields on Bid {
    ...BasicBidFields
    auction {
      auctionType {
        __typename
      }
      isCompleted
      winningMemberId
      id
    }
  }
  ${BasicBidFieldsFragmentDoc}
`
export const CommentReactionsCountByReactionIdFieldsFragmentDoc = gql`
  fragment CommentReactionsCountByReactionIdFields on CommentReactionsCountByReactionId {
    id
    count
    reactionId
  }
`
export const CommentFieldsFragmentDoc = gql`
  fragment CommentFields on Comment {
    id
    author {
      ...BasicMembershipFields
    }
    createdAt
    isEdited
    reactionsCountByReactionId {
      ...CommentReactionsCountByReactionIdFields
    }
    parentCommentId
    repliesCount
    text
    status
  }
  ${BasicMembershipFieldsFragmentDoc}
  ${CommentReactionsCountByReactionIdFieldsFragmentDoc}
`
export const MetaprotocolTransactionSuccessFieldsFragmentDoc = gql`
  fragment MetaprotocolTransactionSuccessFields on MetaprotocolTransactionSuccessful {
    commentCreated {
      ...CommentFields
    }
    commentEdited {
      ...CommentFields
    }
    commentDeleted {
      ...CommentFields
    }
    commentModerated {
      ...CommentFields
    }
  }
  ${CommentFieldsFragmentDoc}
`
