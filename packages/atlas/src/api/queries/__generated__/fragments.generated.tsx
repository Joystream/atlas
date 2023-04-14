import { gql } from '@apollo/client'

import * as Types from './baseTypes.generated'

export type ExtendedVideoCategoryFieldsFragment = {
  __typename?: 'ExtendedVideoCategory'
  activeVideosCount: number
  category: { __typename?: 'VideoCategory'; id: string; name?: string | null }
}

export type BasicChannelFieldsFragment = {
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
  } | null
}

export type FullChannelFieldsFragment = {
  __typename?: 'Channel'
  videoViewsNum: number
  description?: string | null
  isPublic?: boolean | null
  cumulativeRewardClaimed?: string | null
  isCensored: boolean
  language?: string | null
  id: string
  title?: string | null
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
  coverPhoto?: {
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
  } | null
}

export type ExtendedFullChannelFieldsFragment = {
  __typename?: 'ExtendedChannel'
  activeVideosCount: number
  channel: {
    __typename?: 'Channel'
    videoViewsNum: number
    description?: string | null
    isPublic?: boolean | null
    cumulativeRewardClaimed?: string | null
    isCensored: boolean
    language?: string | null
    id: string
    title?: string | null
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
    coverPhoto?: {
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
    } | null
  }
}

export type ExtendedBasicChannelFieldsFragment = {
  __typename?: 'ExtendedChannel'
  activeVideosCount: number
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
    } | null
  }
}

export type BasicMembershipFieldsFragment = {
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

export type FullMembershipFieldsFragment = {
  __typename?: 'Membership'
  controllerAccount: string
  createdAt: Date
  totalChannelsCreated: number
  id: string
  handle: string
  channels: Array<{
    __typename?: 'Channel'
    totalVideosCreated: number
    description?: string | null
    id: string
    title?: string | null
    createdAt: Date
    followsNum: number
    rewardAccount: string
    channelStateBloatBond: string
    coverPhoto?: {
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
    } | null
  }>
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

export type StorageDataObjectFieldsFragment = {
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
    | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
    | { __typename: 'DataObjectTypeVideoMedia' }
    | { __typename: 'DataObjectTypeVideoSubtitle' }
    | { __typename: 'DataObjectTypeVideoThumbnail' }
    | null
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

export type SubtitlesFieldsFragment = {
  __typename?: 'VideoSubtitle'
  id: string
  language?: string | null
  mimeType: string
  type: string
  asset?: {
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
  } | null
}

export type BasicVideoFieldsFragment = {
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
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
              resolvedUrl?: string | null
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
                          resolvedUrl?: string | null
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
                          resolvedUrl?: string | null
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
                          resolvedUrl?: string | null
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

export type FullVideoFieldsFragment = {
  __typename?: 'Video'
  id: string
  title?: string | null
  ytVideoId?: string | null
  description?: string | null
  reactionsCount: number
  viewsNum: number
  duration?: number | null
  createdAt: Date
  isPublic?: boolean | null
  isExplicit?: boolean | null
  hasMarketing?: boolean | null
  isCensored: boolean
  isCommentSectionEnabled: boolean
  commentsCount: number
  language?: string | null
  publishedBeforeJoystream?: Date | null
  reactions: Array<{
    __typename?: 'VideoReaction'
    id: string
    createdAt: Date
    reaction: Types.VideoReactionOptions
    member: { __typename?: 'Membership'; id: string }
  }>
  category?: { __typename?: 'VideoCategory'; id: string; name?: string | null } | null
  mediaMetadata?: {
    __typename?: 'VideoMediaMetadata'
    id: string
    pixelHeight?: number | null
    pixelWidth?: number | null
  } | null
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
  } | null
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
  } | null
  channel: {
    __typename?: 'Channel'
    videoViewsNum: number
    description?: string | null
    isPublic?: boolean | null
    cumulativeRewardClaimed?: string | null
    isCensored: boolean
    language?: string | null
    id: string
    title?: string | null
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
    coverPhoto?: {
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
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
              resolvedUrl?: string | null
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
                          resolvedUrl?: string | null
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
                          resolvedUrl?: string | null
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
                          resolvedUrl?: string | null
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
  subtitles: Array<{
    __typename?: 'VideoSubtitle'
    id: string
    language?: string | null
    mimeType: string
    type: string
    asset?: {
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
    } | null
  }>
}

export type BasicNftFieldsFragment = {
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
            resolvedUrl?: string | null
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
                        resolvedUrl?: string | null
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
                        resolvedUrl?: string | null
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
                        resolvedUrl?: string | null
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

export type FullNftFieldsFragment = {
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
          | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
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
                resolvedUrl?: string | null
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
                            resolvedUrl?: string | null
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
                            resolvedUrl?: string | null
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
                            resolvedUrl?: string | null
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
            resolvedUrl?: string | null
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
                        resolvedUrl?: string | null
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
                        resolvedUrl?: string | null
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
                        resolvedUrl?: string | null
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
    id: string
    auctionType: { __typename: 'AuctionTypeEnglish' } | { __typename: 'AuctionTypeOpen' }
    winningMember?: { __typename?: 'Membership'; id: string } | null
  }
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

export type CommentReactionsCountByReactionIdFieldsFragment = {
  __typename?: 'CommentReactionsCountByReactionId'
  count: number
  reactionId: number
}

export type CommentFieldsFragment = {
  __typename?: 'Comment'
  id: string
  isExcluded: boolean
  createdAt: Date
  isEdited: boolean
  repliesCount: number
  text: string
  status: Types.CommentStatus
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
              resolvedUrl?: string | null
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

export type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment = {
  __typename: 'MetaprotocolTransactionResultChannelPaid'
}

export type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment = {
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
                resolvedUrl?: string | null
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

export type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment = {
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
                resolvedUrl?: string | null
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

export type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment = {
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
                resolvedUrl?: string | null
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

export type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment = {
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
                resolvedUrl?: string | null
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

export type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment = {
  __typename: 'MetaprotocolTransactionResultFailed'
  errorMessage: string
}

export type MetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment = {
  __typename: 'MetaprotocolTransactionResultOK'
}

export type MetaprotocolTransactionResultFieldsFragment =
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultChannelPaid_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentCreated_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentDeleted_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentEdited_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultCommentModerated_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultFailed_Fragment
  | MetaprotocolTransactionResultFields_MetaprotocolTransactionResultOk_Fragment

export type BasicNftOwnerFields_NftOwnerChannel_Fragment = {
  __typename: 'NftOwnerChannel'
  channel: {
    __typename?: 'Channel'
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
  }
}

export type BasicNftOwnerFields_NftOwnerMember_Fragment = {
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

export type BasicNftOwnerFieldsFragment =
  | BasicNftOwnerFields_NftOwnerChannel_Fragment
  | BasicNftOwnerFields_NftOwnerMember_Fragment

export type BasicFeaturedVideoFragment = {
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
  } | null
  nft?: {
    __typename?: 'OwnedNft'
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
                  plannedEndAtBlock: number
                }
              | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
          }
        }
      | { __typename: 'TransactionalStatusBuyNow'; price: string }
      | { __typename: 'TransactionalStatusIdle' }
      | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
      | null
  } | null
}

export type BasicVideoFeaturedInCategoryFragment = {
  __typename?: 'VideoFeaturedInCategory'
  videoCutUrl?: string | null
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
          | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
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
        | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
        | { __typename: 'DataObjectTypeVideoMedia' }
        | { __typename: 'DataObjectTypeVideoSubtitle' }
        | { __typename: 'DataObjectTypeVideoThumbnail' }
        | null
    } | null
    nft?: {
      __typename?: 'OwnedNft'
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
                    plannedEndAtBlock: number
                  }
                | { __typename: 'AuctionTypeOpen'; bidLockDuration: number }
            }
          }
        | { __typename: 'TransactionalStatusBuyNow'; price: string }
        | { __typename: 'TransactionalStatusIdle' }
        | { __typename: 'TransactionalStatusInitiatedOfferToMember' }
        | null
    } | null
  }
}

export type BasicVideoActivityFieldsFragment = {
  __typename?: 'Video'
  id: string
  title?: string | null
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
      | { __typename: 'DataObjectTypeChannelPayoutsPayload' }
      | { __typename: 'DataObjectTypeVideoMedia' }
      | { __typename: 'DataObjectTypeVideoSubtitle' }
      | { __typename: 'DataObjectTypeVideoThumbnail' }
      | null
  } | null
}

export const ExtendedVideoCategoryFieldsFragmentDoc = gql`
  fragment ExtendedVideoCategoryFields on ExtendedVideoCategory {
    category {
      id
      name
    }
    activeVideosCount
  }
`
export const StorageDataObjectFieldsFragmentDoc = gql`
  fragment StorageDataObjectFields on StorageDataObject {
    id
    resolvedUrls
    resolvedUrl @client
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
export const BasicChannelFieldsFragmentDoc = gql`
  fragment BasicChannelFields on Channel {
    id
    title
    description
    createdAt
    followsNum
    rewardAccount
    channelStateBloatBond
    avatarPhoto {
      ...StorageDataObjectFields
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
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
export const FullChannelFieldsFragmentDoc = gql`
  fragment FullChannelFields on Channel {
    ...BasicChannelFields
    videoViewsNum
    description
    isPublic
    cumulativeRewardClaimed
    isCensored
    language
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
export const ExtendedFullChannelFieldsFragmentDoc = gql`
  fragment ExtendedFullChannelFields on ExtendedChannel {
    channel {
      ...FullChannelFields
    }
    activeVideosCount
  }
  ${FullChannelFieldsFragmentDoc}
`
export const ExtendedBasicChannelFieldsFragmentDoc = gql`
  fragment ExtendedBasicChannelFields on ExtendedChannel {
    channel {
      ...BasicChannelFields
    }
    activeVideosCount
  }
  ${BasicChannelFieldsFragmentDoc}
`
export const FullMembershipFieldsFragmentDoc = gql`
  fragment FullMembershipFields on Membership {
    ...BasicMembershipFields
    controllerAccount
    createdAt
    totalChannelsCreated
    channels {
      ...BasicChannelFields
      totalVideosCreated
      description
      coverPhoto {
        ...StorageDataObjectFields
      }
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
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
export const BasicNftFieldsFragmentDoc = gql`
  fragment BasicNftFields on OwnedNft {
    id
    createdAt
    creatorRoyalty
    lastSaleDate
    lastSalePrice
    owner {
      __typename
      ... on NftOwnerChannel {
        channel {
          ...BasicChannelFields
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      ... on NftOwnerMember {
        member {
          ...BasicMembershipFields
        }
      }
    }
    transactionalStatus {
      __typename
      ... on TransactionalStatusBuyNow {
        price
      }
      ... on TransactionalStatusAuction {
        auction {
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
            member {
              ...BasicMembershipFields
            }
          }
        }
      }
    }
  }
  ${BasicChannelFieldsFragmentDoc}
  ${BasicMembershipFieldsFragmentDoc}
  ${BasicBidFieldsFragmentDoc}
`
export const SubtitlesFieldsFragmentDoc = gql`
  fragment SubtitlesFields on VideoSubtitle {
    id
    language
    asset {
      ...StorageDataObjectFields
    }
    mimeType
    type
  }
  ${StorageDataObjectFieldsFragmentDoc}
`
export const FullVideoFieldsFragmentDoc = gql`
  fragment FullVideoFields on Video {
    id
    title
    ytVideoId
    description
    reactionsCount
    reactions {
      id
      createdAt
      reaction
      member {
        id
      }
    }
    category {
      id
      name
    }
    viewsNum
    duration
    createdAt
    isPublic
    isExplicit
    hasMarketing
    isCensored
    isCommentSectionEnabled
    commentsCount
    language
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
      ...BasicNftFields
    }
    subtitles {
      ...SubtitlesFields
    }
  }
  ${VideoMediaMetadataFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
  ${FullChannelFieldsFragmentDoc}
  ${LicenseFieldsFragmentDoc}
  ${BasicNftFieldsFragmentDoc}
  ${SubtitlesFieldsFragmentDoc}
`
export const BasicVideoFieldsFragmentDoc = gql`
  fragment BasicVideoFields on Video {
    id
    title
    viewsNum
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
      ...BasicNftFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
  ${BasicNftFieldsFragmentDoc}
`
export const FullNftFieldsFragmentDoc = gql`
  fragment FullNftFields on OwnedNft {
    ...BasicNftFields
    video {
      ...BasicVideoFields
      channel {
        ...BasicChannelFields
      }
    }
  }
  ${BasicNftFieldsFragmentDoc}
  ${BasicVideoFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
`
export const FullBidFieldsFragmentDoc = gql`
  fragment FullBidFields on Bid {
    ...BasicBidFields
    auction {
      auctionType {
        __typename
      }
      isCompleted
      winningMember {
        id
      }
      id
    }
  }
  ${BasicBidFieldsFragmentDoc}
`
export const CommentReactionsCountByReactionIdFieldsFragmentDoc = gql`
  fragment CommentReactionsCountByReactionIdFields on CommentReactionsCountByReactionId {
    count
    reactionId
  }
`
export const CommentFieldsFragmentDoc = gql`
  fragment CommentFields on Comment {
    id
    isExcluded
    author {
      ...BasicMembershipFields
    }
    createdAt
    isEdited
    reactionsCountByReactionId {
      ...CommentReactionsCountByReactionIdFields
    }
    parentComment {
      id
    }
    repliesCount
    text
    status
  }
  ${BasicMembershipFieldsFragmentDoc}
  ${CommentReactionsCountByReactionIdFieldsFragmentDoc}
`
export const MetaprotocolTransactionResultFieldsFragmentDoc = gql`
  fragment MetaprotocolTransactionResultFields on MetaprotocolTransactionResult {
    __typename
    ... on MetaprotocolTransactionResultCommentCreated {
      commentCreated {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultCommentEdited {
      commentEdited {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultCommentDeleted {
      commentDeleted {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultCommentModerated {
      commentModerated {
        ...CommentFields
      }
    }
    ... on MetaprotocolTransactionResultFailed {
      errorMessage
    }
  }
  ${CommentFieldsFragmentDoc}
`
export const BasicNftOwnerFieldsFragmentDoc = gql`
  fragment BasicNftOwnerFields on NftOwner {
    __typename
    ... on NftOwnerMember {
      member {
        ...BasicMembershipFields
      }
    }
    ... on NftOwnerChannel {
      channel {
        ownerMember {
          ...BasicMembershipFields
        }
      }
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`
export const BasicFeaturedVideoFragmentDoc = gql`
  fragment BasicFeaturedVideo on Video {
    id
    title
    viewsNum
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
      transactionalStatus {
        __typename
        ... on TransactionalStatusBuyNow {
          price
        }
        ... on TransactionalStatusAuction {
          auction {
            id
            auctionType {
              __typename
              ... on AuctionTypeEnglish {
                duration
                extensionPeriod
                plannedEndAtBlock
              }
              ... on AuctionTypeOpen {
                bidLockDuration
              }
            }
            isCompleted
            buyNowPrice
            startingPrice
            startsAtBlock
            endedAtBlock
          }
        }
      }
    }
  }
  ${BasicChannelFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
`
export const BasicVideoFeaturedInCategoryFragmentDoc = gql`
  fragment BasicVideoFeaturedInCategory on VideoFeaturedInCategory {
    videoCutUrl
    video {
      ...BasicFeaturedVideo
    }
  }
  ${BasicFeaturedVideoFragmentDoc}
`
export const BasicVideoActivityFieldsFragmentDoc = gql`
  fragment BasicVideoActivityFields on Video {
    id
    title
    thumbnailPhoto {
      ...StorageDataObjectFields
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
`
