import { gql } from '@apollo/client'

import * as Types from './baseTypes.generated'

export type VideoCategoryFieldsFragment = { __typename?: 'VideoCategory'; id: string; name?: string | null }

export type BasicChannelFieldsFragment = {
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
}

export type AllChannelFieldsFragment = {
  __typename?: 'Channel'
  description?: string | null
  isPublic?: boolean | null
  isCensored: boolean
  id: string
  title?: string | null
  createdAt: Date
  views: number
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
  coverPhoto?: {
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

export type AllMembershipFieldsFragment = {
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

export type StorageDataObjectFieldsFragment = {
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
}

export type DistributionBucketOperatorFieldFragment = {
  __typename?: 'DistributionBucketOperator'
  id: string
  status: Types.DistributionBucketOperatorStatus
  metadata?: { __typename?: 'DistributionBucketOperatorMetadata'; nodeEndpoint?: string | null } | null
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
  nft?: {
    __typename?: 'OwnedNft'
    id: string
    createdAt: Date
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

export type VideoFieldsFragment = {
  __typename?: 'Video'
  id: string
  title?: string | null
  description?: string | null
  views: number
  duration?: number | null
  createdAt: Date
  isPublic?: boolean | null
  isExplicit?: boolean | null
  isFeatured: boolean
  hasMarketing?: boolean | null
  isCensored: boolean
  publishedBeforeJoystream?: Date | null
  category?: { __typename?: 'VideoCategory'; id: string } | null
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

export type AllBidFieldsFragment = {
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
}

export type BasicNftFieldsFragment = {
  __typename?: 'OwnedNft'
  id: string
  createdAt: Date
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
}

export type AllNftFieldsFragment = {
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
    nft?: {
      __typename?: 'OwnedNft'
      id: string
      createdAt: Date
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
}

export const VideoCategoryFieldsFragmentDoc = gql`
  fragment VideoCategoryFields on VideoCategory {
    id
    name
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
export const BasicChannelFieldsFragmentDoc = gql`
  fragment BasicChannelFields on Channel {
    id
    title
    createdAt
    views
    follows
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
export const AllChannelFieldsFragmentDoc = gql`
  fragment AllChannelFields on Channel {
    ...BasicChannelFields
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
export const AllMembershipFieldsFragmentDoc = gql`
  fragment AllMembershipFields on Membership {
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
export const BasicNftFieldsFragmentDoc = gql`
  fragment BasicNftFields on OwnedNft {
    id
    createdAt
    ownerMember {
      ...BasicMembershipFields
    }
    transactionalStatus {
      __typename
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`
export const VideoFieldsFragmentDoc = gql`
  fragment VideoFields on Video {
    id
    title
    description
    category {
      id
    }
    views
    duration
    createdAt
    isPublic
    isExplicit
    isFeatured
    hasMarketing
    isCensored
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
      ...BasicChannelFields
    }
    license {
      ...LicenseFields
    }
    nft {
      ...BasicNftFields
    }
  }
  ${VideoMediaMetadataFieldsFragmentDoc}
  ${StorageDataObjectFieldsFragmentDoc}
  ${BasicChannelFieldsFragmentDoc}
  ${LicenseFieldsFragmentDoc}
  ${BasicNftFieldsFragmentDoc}
`
export const AllBidFieldsFragmentDoc = gql`
  fragment AllBidFields on Bid {
    bidder {
      ...BasicMembershipFields
    }
    amount
    createdAt
    isCanceled
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
    title
    isPublic
    media {
      ...StorageDataObjectFields
    }
    channel {
      id
      title
      avatarPhoto {
        ...StorageDataObjectFields
      }
    }
    thumbnailPhoto {
      ...StorageDataObjectFields
    }
    nft {
      ...BasicNftFields
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
  ${BasicNftFieldsFragmentDoc}
`
export const AllNftFieldsFragmentDoc = gql`
  fragment AllNftFields on OwnedNft {
    id
    createdAt
    creatorRoyalty
    ownerMember {
      ...BasicMembershipFields
    }
    transactionalStatus {
      __typename
      ... on TransactionalStatusIdle {
        dummy
      }
      ... on TransactionalStatusBuyNow {
        price
      }
      ... on TransactionalStatusAuction {
        auction {
          auctionType {
            __typename
            ... on AuctionTypeEnglish {
              duration
              extensionPeriod
            }
            ... on AuctionTypeOpen {
              bidLockingTime
            }
          }
          isCompleted
          buyNowPrice
          minimalBidStep
          startingPrice
          startsAtBlock
          plannedEndAtBlock
          endedAtBlock
          lastBid {
            ...AllBidFields
          }
          bids {
            ...AllBidFields
          }
          whitelistedMembers {
            ...BasicMembershipFields
          }
        }
      }
    }
    video {
      ...BasicVideoFields
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
  ${AllBidFieldsFragmentDoc}
  ${BasicVideoFieldsFragmentDoc}
`
