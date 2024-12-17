import { gql } from '@apollo/client'

import * as Types from './baseTypes.generated'

export type ExtendedVideoCategoryFieldsFragment = {
  __typename?: 'ExtendedVideoCategory'
  activeVideosCount: number
  category: { __typename?: 'VideoCategory'; id: string; name?: string | null }
}

export type ChannelAvatarFieldsFragment = {
  __typename?: 'Channel'
  avatarPhoto?: {
    __typename?: 'StorageDataObject'
    resolvedUrls: Array<string>
    isAccepted: boolean
    storageBag: { __typename?: 'StorageBag'; id: string }
  } | null
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

export type FullChannelFieldsFragment = {
  __typename?: 'Channel'
  videoViewsNum: number
  description?: string | null
  isPublic?: boolean | null
  cumulativeRewardClaimed: string
  cumulativeRevenue: string
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

export type ExtendedFullChannelFieldsFragment = {
  __typename?: 'ExtendedChannel'
  activeVideosCount: number
  channel: {
    __typename?: 'Channel'
    videoViewsNum: number
    description?: string | null
    isPublic?: boolean | null
    cumulativeRewardClaimed: string
    cumulativeRevenue: string
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
    cumulativeRevenue: string
    coverPhoto?: {
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
    storageBag: { __typename?: 'StorageBag'; id: string }
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
    cumulativeRewardClaimed: string
    cumulativeRevenue: string
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

export type BasicCreatorTokenHolderFragment = {
  __typename?: 'TokenAccount'
  id: string
  stakedAmount: string
  deleted: boolean
  totalAmount: string
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
  token: {
    __typename?: 'CreatorToken'
    id: string
    symbol?: string | null
    status: Types.TokenStatus
    lastPrice?: string | null
    channel?: { __typename?: 'TokenChannel'; id: string; channel: { __typename?: 'Channel'; id: string } } | null
  }
  vestingSchedules: Array<{
    __typename?: 'VestedAccount'
    id: string
    totalVestingAmount: string
    vestingSource:
      | { __typename: 'InitialIssuanceVestingSource' }
      | { __typename: 'IssuerTransferVestingSource' }
      | { __typename: 'SaleVestingSource' }
    vesting: {
      __typename?: 'VestingSchedule'
      id: string
      endsAt: number
      cliffBlock: number
      cliffDurationBlocks: number
      cliffRatioPermill: number
      vestingDurationBlocks: number
    }
  }>
}

export type BasicRevenueShareFragment = {
  __typename?: 'RevenueShare'
  id: string
  allocation: string
  claimed: string
  endsAt: number
  createdIn: number
  finalized: boolean
  participantsNum: number
  potentialParticipantsNum?: number | null
  startingAt: number
  token: { __typename?: 'CreatorToken'; id: string; symbol?: string | null }
  stakers: Array<{
    __typename?: 'RevenueShareParticipation'
    id: string
    stakedAmount: string
    recovered: boolean
    earnings: string
    createdIn: number
    account: { __typename?: 'TokenAccount'; member: { __typename?: 'Membership'; id: string } }
  }>
}

export type BasicCreatorTokenFragment = {
  __typename?: 'CreatorToken'
  id: string
  accountsNum: number
  symbol?: string | null
  isInviteOnly: boolean
  deissued: boolean
  status: Types.TokenStatus
  createdAt: Date
  lastPrice?: string | null
  totalSupply: string
  description?: string | null
  trailerVideo?: {
    __typename?: 'TrailerVideo'
    id: string
    video: {
      __typename?: 'Video'
      id: string
      media?: {
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
  } | null
  currentAmmSale?: { __typename?: 'AmmCurve'; id: string; burnedByAmm: string; mintedByAmm: string } | null
  currentSale?: { __typename?: 'Sale'; id: string; tokensSold: string; endsAt: number } | null
  channel?: {
    __typename?: 'TokenChannel'
    id: string
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
  } | null
  avatar?:
    | {
        __typename?: 'TokenAvatarObject'
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
    | { __typename?: 'TokenAvatarUri'; avatarUri: string }
    | null
}

export type FullCreatorTokenFragment = {
  __typename?: 'CreatorToken'
  annualCreatorRewardPermill: number
  revenueShareRatioPermill: number
  description?: string | null
  totalSupply: string
  id: string
  accountsNum: number
  symbol?: string | null
  isInviteOnly: boolean
  deissued: boolean
  status: Types.TokenStatus
  createdAt: Date
  lastPrice?: string | null
  ammCurves: Array<{
    __typename?: 'AmmCurve'
    id: string
    finalized: boolean
    ammInitPrice: string
    burnedByAmm: string
    mintedByAmm: string
    ammSlopeParameter: string
  }>
  sales: Array<{
    __typename?: 'Sale'
    id: string
    maxAmountPerMember?: string | null
    pricePerUnit: string
    tokensSold: string
    finalized: boolean
  }>
  benefits: Array<{
    __typename?: 'Benefit'
    id: string
    description: string
    title: string
    displayOrder: number
    emojiCode?: string | null
  }>
  trailerVideo?: {
    __typename?: 'TrailerVideo'
    id: string
    video: {
      __typename?: 'Video'
      id: string
      title?: string | null
      media?: {
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
  } | null
  revenueShares: Array<{
    __typename?: 'RevenueShare'
    id: string
    allocation: string
    claimed: string
    endsAt: number
    createdIn: number
    finalized: boolean
    participantsNum: number
    potentialParticipantsNum?: number | null
    startingAt: number
    token: { __typename?: 'CreatorToken'; id: string; symbol?: string | null }
    stakers: Array<{
      __typename?: 'RevenueShareParticipation'
      id: string
      stakedAmount: string
      recovered: boolean
      earnings: string
      createdIn: number
      account: { __typename?: 'TokenAccount'; member: { __typename?: 'Membership'; id: string } }
    }>
  }>
  currentAmmSale?: { __typename?: 'AmmCurve'; id: string; burnedByAmm: string; mintedByAmm: string } | null
  currentSale?: { __typename?: 'Sale'; id: string; tokensSold: string; endsAt: number } | null
  channel?: {
    __typename?: 'TokenChannel'
    id: string
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
  } | null
  avatar?:
    | {
        __typename?: 'TokenAvatarObject'
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
    | { __typename?: 'TokenAvatarUri'; avatarUri: string }
    | null
}

export type FullAmmCurveFragment = {
  __typename?: 'AmmCurve'
  id: string
  ammSlopeParameter: string
  mintedByAmm: string
  burnedByAmm: string
  ammInitPrice: string
  finalized: boolean
  transactions: Array<{
    __typename?: 'AmmTransaction'
    id: string
    createdIn: number
    pricePaid: string
    pricePerUnit: string
    transactionType: Types.AmmTransactionType
    quantity: string
    account: { __typename?: 'TokenAccount'; member: { __typename?: 'Membership'; id: string } }
  }>
}

export type BasicAmmTransactionFragment = {
  __typename?: 'AmmTransaction'
  id: string
  quantity: string
  pricePaid: string
  pricePerUnit: string
  transactionType: Types.AmmTransactionType
  createdIn: number
  amm: {
    __typename?: 'AmmCurve'
    id: string
    token: {
      __typename?: 'CreatorToken'
      id: string
      symbol?: string | null
      channel?: {
        __typename?: 'TokenChannel'
        channel: {
          __typename?: 'Channel'
          id: string
          avatarPhoto?: {
            __typename?: 'StorageDataObject'
            resolvedUrls: Array<string>
            storageBag: { __typename?: 'StorageBag'; id: string }
          } | null
        }
      } | null
    }
  }
  account: {
    __typename?: 'TokenAccount'
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
export const ChannelAvatarFieldsFragmentDoc = gql`
  fragment ChannelAvatarFields on Channel {
    avatarPhoto {
      resolvedUrls
      isAccepted
      storageBag {
        id
      }
    }
  }
`
export const StorageDataObjectFieldsFragmentDoc = gql`
  fragment StorageDataObjectFields on StorageDataObject {
    id
    resolvedUrls
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
    cumulativeRevenue
    avatarPhoto {
      ...StorageDataObjectFields
    }
    creatorToken {
      token {
        id
      }
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
    cumulativeRevenue
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
    description
    viewsNum
    createdAt
    duration
    reactionsCount
    commentsCount
    media {
      id
      isAccepted
      storageBag {
        id
      }
      resolvedUrls
    }
    channel {
      ...BasicChannelFields
    }
    nft {
      id
    }
    thumbnailPhoto {
      ...StorageDataObjectFields
    }
  }
  ${BasicChannelFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
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
    tipTier
    tipAmount
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
export const BasicCreatorTokenHolderFragmentDoc = gql`
  fragment BasicCreatorTokenHolder on TokenAccount {
    id
    stakedAmount
    deleted
    totalAmount
    member {
      ...BasicMembershipFields
    }
    token {
      id
      symbol
      status
      lastPrice
      channel {
        ... on TokenChannel {
          id
          channel {
            id
          }
        }
      }
    }
    vestingSchedules {
      id
      totalVestingAmount
      vestingSource {
        __typename
      }
      vesting {
        id
        endsAt
        cliffBlock
        cliffDurationBlocks
        cliffRatioPermill
        vestingDurationBlocks
      }
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`
export const BasicCreatorTokenFragmentDoc = gql`
  fragment BasicCreatorToken on CreatorToken {
    id
    accountsNum
    symbol
    isInviteOnly
    deissued
    status
    createdAt
    lastPrice
    totalSupply
    description
    trailerVideo {
      id
      video {
        id
        media {
          ...StorageDataObjectFields
        }
        thumbnailPhoto {
          ...StorageDataObjectFields
        }
      }
    }
    currentAmmSale {
      id
      burnedByAmm
      mintedByAmm
    }
    currentSale {
      id
      tokensSold
      endsAt
    }
    channel {
      ... on TokenChannel {
        id
        channel {
          ...BasicChannelFields
        }
      }
    }
    avatar {
      ... on TokenAvatarObject {
        avatarObject {
          ...StorageDataObjectFields
        }
      }
      ... on TokenAvatarUri {
        avatarUri
      }
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
`
export const BasicRevenueShareFragmentDoc = gql`
  fragment BasicRevenueShare on RevenueShare {
    id
    allocation
    claimed
    endsAt
    createdIn
    finalized
    participantsNum
    potentialParticipantsNum
    startingAt
    token {
      id
      symbol
    }
    stakers {
      id
      stakedAmount
      recovered
      earnings
      createdIn
      account {
        member {
          id
        }
      }
    }
  }
`
export const FullCreatorTokenFragmentDoc = gql`
  fragment FullCreatorToken on CreatorToken {
    ...BasicCreatorToken
    annualCreatorRewardPermill
    revenueShareRatioPermill
    description
    revenueShareRatioPermill
    ammCurves {
      id
      finalized
      ammInitPrice
      burnedByAmm
      mintedByAmm
      ammSlopeParameter
    }
    sales {
      id
      maxAmountPerMember
      pricePerUnit
      tokensSold
      finalized
    }
    benefits {
      id
      description
      title
      displayOrder
      emojiCode
    }
    totalSupply
    trailerVideo {
      id
      video {
        id
        title
      }
    }
    revenueShares {
      ...BasicRevenueShare
    }
  }
  ${BasicCreatorTokenFragmentDoc}
  ${BasicRevenueShareFragmentDoc}
`
export const FullAmmCurveFragmentDoc = gql`
  fragment FullAmmCurve on AmmCurve {
    id
    ammSlopeParameter
    mintedByAmm
    burnedByAmm
    ammInitPrice
    finalized
    transactions {
      id
      createdIn
      pricePaid
      pricePerUnit
      transactionType
      quantity
      account {
        member {
          id
        }
      }
    }
  }
`
export const BasicAmmTransactionFragmentDoc = gql`
  fragment BasicAmmTransaction on AmmTransaction {
    id
    quantity
    pricePaid
    pricePerUnit
    amm {
      id
      token {
        id
        symbol
        channel {
          channel {
            id
            avatarPhoto {
              resolvedUrls
              storageBag {
                id
              }
            }
          }
        }
      }
    }
    account {
      member {
        ...BasicMembershipFields
      }
    }
    transactionType
    createdIn
  }
  ${BasicMembershipFieldsFragmentDoc}
`
