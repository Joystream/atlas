import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicMembershipFieldsFragmentDoc, StorageDataObjectFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetNotificationsQueryVariables = Types.Exact<{
  channelId: Types.Scalars['ID']
  memberId: Types.Scalars['ID']
  limit: Types.Scalars['Int']
}>

export type GetNotificationsQuery = {
  __typename?: 'Query'
  auctionBidMadeEvents: Array<{
    __typename?: 'AuctionBidMadeEvent'
    id: string
    createdAt: Date
    inBlock: number
    bidAmount: string
    video: { __typename?: 'Video'; id: string; title?: string | null }
    member: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    }
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    previousTopBidder?: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  nftBoughtEvents: Array<{
    __typename?: 'NftBoughtEvent'
    id: string
    createdAt: Date
    inBlock: number
    price: string
    member: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    }
    video: { __typename?: 'Video'; id: string; title?: string | null }
  }>
  bidMadeCompletingAuctionEvents: Array<{
    __typename?: 'BidMadeCompletingAuctionEvent'
    id: string
    createdAt: Date
    inBlock: number
    price: string
    member: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    }
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    video: { __typename?: 'Video'; id: string; title?: string | null }
  }>
  openAuctionBidAcceptedEvents: Array<{
    __typename?: 'OpenAuctionBidAcceptedEvent'
    id: string
    createdAt: Date
    inBlock: number
    video: { __typename?: 'Video'; id: string; title?: string | null }
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    winningBid?: { __typename?: 'Bid'; amount: string } | null
    winningBidder?: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  englishAuctionSettledEvents: Array<{
    __typename?: 'EnglishAuctionSettledEvent'
    id: string
    createdAt: Date
    inBlock: number
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    winner: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    }
    video: { __typename?: 'Video'; id: string; title?: string | null }
  }>
  commentCreatedEvents: Array<{
    __typename?: 'CommentCreatedEvent'
    id: string
    inBlock: number
    createdAt: Date
    video: { __typename?: 'Video'; id: string; title?: string | null }
    comment: {
      __typename?: 'Comment'
      id: string
      parentComment?: { __typename?: 'Comment'; id: string } | null
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
    }
  }>
}

export type GetNftHistoryQueryVariables = Types.Exact<{
  nftId: Types.Scalars['ID']
}>

export type GetNftHistoryQuery = {
  __typename?: 'Query'
  nftIssuedEvents: Array<{
    __typename?: 'NftIssuedEvent'
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
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  openAuctionStartedEvents: Array<{
    __typename?: 'OpenAuctionStartedEvent'
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
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  englishAuctionStartedEvents: Array<{
    __typename?: 'EnglishAuctionStartedEvent'
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
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  nftSellOrderMadeEvents: Array<{
    __typename?: 'NftSellOrderMadeEvent'
    id: string
    createdAt: Date
    price: string
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  auctionBidMadeEvents: Array<{
    __typename?: 'AuctionBidMadeEvent'
    id: string
    createdAt: Date
    bidAmount: string
    member: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
  bidMadeCompletingAuctionEvents: Array<{
    __typename?: 'BidMadeCompletingAuctionEvent'
    id: string
    createdAt: Date
    price: string
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    member: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
  nftBoughtEvents: Array<{
    __typename?: 'NftBoughtEvent'
    id: string
    createdAt: Date
    price: string
    member: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
  englishAuctionSettledEvents: Array<{
    __typename?: 'EnglishAuctionSettledEvent'
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
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    winner: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
  openAuctionBidAcceptedEvents: Array<{
    __typename?: 'OpenAuctionBidAcceptedEvent'
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
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
    winningBid?: {
      __typename?: 'Bid'
      amount: string
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
                    | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
  }>
  auctionBidCanceledEvents: Array<{
    __typename?: 'AuctionBidCanceledEvent'
    id: string
    createdAt: Date
    member: {
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
  auctionCanceledEvents: Array<{
    __typename?: 'AuctionCanceledEvent'
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
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  buyNowCanceledEvents: Array<{
    __typename?: 'BuyNowCanceledEvent'
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
                size: string
                isAccepted: boolean
                ipfsHash: string
                storageBag: { __typename?: 'StorageBag'; id: string }
                type:
                  | { __typename: 'DataObjectTypeChannelAvatar' }
                  | { __typename: 'DataObjectTypeChannelCoverPhoto' }
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
  buyNowPriceUpdatedEvents: Array<{
    __typename?: 'BuyNowPriceUpdatedEvent'
    id: string
    createdAt: Date
    newPrice: string
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
                  | { __typename: 'DataObjectTypePlaylistThumbnail' }
                  | { __typename: 'DataObjectTypeUnknown' }
                  | { __typename: 'DataObjectTypeVideoMedia' }
                  | { __typename: 'DataObjectTypeVideoThumbnail' }
              } | null
            }
          | { __typename?: 'AvatarUri'; avatarUri: string }
          | null
      }
    } | null
  }>
}

export type GetNftActivitiesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID']
  limit: Types.Scalars['Int']
}>

export type GetNftActivitiesQuery = {
  __typename?: 'Query'
  auctionBidMadeEventsConnection: {
    __typename?: 'AuctionBidMadeEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'AuctionBidMadeEventEdge'
      node: {
        __typename?: 'AuctionBidMadeEvent'
        id: string
        createdAt: Date
        inBlock: number
        bidAmount: string
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
        member: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        previousTopBidder?: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  purchaseEnglishAuctionSettledEventsConnection: {
    __typename?: 'EnglishAuctionSettledEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'EnglishAuctionSettledEventEdge'
      node: {
        __typename?: 'EnglishAuctionSettledEvent'
        id: string
        createdAt: Date
        inBlock: number
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        winner: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        winningBid: { __typename?: 'Bid'; amount: string }
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
      }
    }>
  }
  purchaseNftBoughtEventsConnection: {
    __typename?: 'NftBoughtEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'NftBoughtEventEdge'
      node: {
        __typename?: 'NftBoughtEvent'
        id: string
        createdAt: Date
        inBlock: number
        price: string
        member: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
      }
    }>
  }
  purchaseBidMadeCompletingAuctionEventsConnection: {
    __typename?: 'BidMadeCompletingAuctionEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'BidMadeCompletingAuctionEventEdge'
      node: {
        __typename?: 'BidMadeCompletingAuctionEvent'
        id: string
        createdAt: Date
        inBlock: number
        price: string
        member: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
      }
    }>
  }
  purchaseOpenAuctionBidAcceptedEventsConnection: {
    __typename?: 'OpenAuctionBidAcceptedEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'OpenAuctionBidAcceptedEventEdge'
      node: {
        __typename?: 'OpenAuctionBidAcceptedEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        winningBid?: {
          __typename?: 'Bid'
          amount: string
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
                        | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
      }
    }>
  }
  saleEnglishAuctionSettledEventsConnection: {
    __typename?: 'EnglishAuctionSettledEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'EnglishAuctionSettledEventEdge'
      node: {
        __typename?: 'EnglishAuctionSettledEvent'
        id: string
        createdAt: Date
        inBlock: number
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        winner: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
        winningBid: { __typename?: 'Bid'; amount: string }
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
      }
    }>
  }
  saleNftBoughtEventsConnection: {
    __typename?: 'NftBoughtEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'NftBoughtEventEdge'
      node: {
        __typename?: 'NftBoughtEvent'
        id: string
        createdAt: Date
        inBlock: number
        price: string
        member: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
      }
    }>
  }
  saleBidMadeCompletingAuctionEventsConnection: {
    __typename?: 'BidMadeCompletingAuctionEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'BidMadeCompletingAuctionEventEdge'
      node: {
        __typename?: 'BidMadeCompletingAuctionEvent'
        id: string
        createdAt: Date
        inBlock: number
        price: string
        member: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
      }
    }>
  }
  saleOpenAuctionBidAcceptedEventsConnection: {
    __typename?: 'OpenAuctionBidAcceptedEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'OpenAuctionBidAcceptedEventEdge'
      node: {
        __typename?: 'OpenAuctionBidAcceptedEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
                      | { __typename: 'DataObjectTypeUnknown' }
                      | { __typename: 'DataObjectTypeVideoMedia' }
                      | { __typename: 'DataObjectTypeVideoThumbnail' }
                  } | null
                }
              | { __typename?: 'AvatarUri'; avatarUri: string }
              | null
          }
        } | null
        winningBid?: {
          __typename?: 'Bid'
          amount: string
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
                        | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
      }
    }>
  }
  englishAuctionStartedEventsConnection: {
    __typename?: 'EnglishAuctionStartedEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'EnglishAuctionStartedEventEdge'
      node: {
        __typename?: 'EnglishAuctionStartedEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  openAuctionStartedEventsConnection: {
    __typename?: 'OpenAuctionStartedEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'OpenAuctionStartedEventEdge'
      node: {
        __typename?: 'OpenAuctionStartedEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  nftSellOrderMadeEventsConnection: {
    __typename?: 'NftSellOrderMadeEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'NftSellOrderMadeEventEdge'
      node: {
        __typename?: 'NftSellOrderMadeEvent'
        id: string
        createdAt: Date
        inBlock: number
        price: string
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  auctionBidCanceledEventsConnection: {
    __typename?: 'AuctionBidCanceledEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'AuctionBidCanceledEventEdge'
      node: {
        __typename?: 'AuctionBidCanceledEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
        member: {
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  buyNowCanceledEventsConnection: {
    __typename?: 'BuyNowCanceledEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'BuyNowCanceledEventEdge'
      node: {
        __typename?: 'BuyNowCanceledEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  auctionCanceledEventsConnection: {
    __typename?: 'AuctionCanceledEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'AuctionCanceledEventEdge'
      node: {
        __typename?: 'AuctionCanceledEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  buyNowPriceUpdatedEventsConnection: {
    __typename?: 'BuyNowPriceUpdatedEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'BuyNowPriceUpdatedEventEdge'
      node: {
        __typename?: 'BuyNowPriceUpdatedEvent'
        id: string
        createdAt: Date
        inBlock: number
        newPrice: string
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
  nftIssuedEventsConnection: {
    __typename?: 'NftIssuedEventConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'NftIssuedEventEdge'
      node: {
        __typename?: 'NftIssuedEvent'
        id: string
        createdAt: Date
        inBlock: number
        video: {
          __typename?: 'Video'
          id: string
          title?: string | null
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
              | { __typename: 'DataObjectTypePlaylistThumbnail' }
              | { __typename: 'DataObjectTypeUnknown' }
              | { __typename: 'DataObjectTypeVideoMedia' }
              | { __typename: 'DataObjectTypeVideoThumbnail' }
          } | null
        }
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
                      | { __typename: 'DataObjectTypePlaylistThumbnail' }
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
    }>
  }
}

export const GetNotificationsDocument = gql`
  query GetNotifications($channelId: ID!, $memberId: ID!, $limit: Int!) {
    auctionBidMadeEvents(
      limit: $limit
      where: { OR: [{ ownerMember: { id_eq: $memberId } }, { previousTopBidder: { id_eq: $memberId } }] }
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      video {
        id
        title
      }
      member {
        ...BasicMembershipFields
      }
      ownerMember {
        ...BasicMembershipFields
      }
      previousTopBidder {
        ...BasicMembershipFields
      }
      bidAmount
    }
    nftBoughtEvents(where: { ownerMember: { id_eq: $memberId } }, limit: $limit, orderBy: [createdAt_DESC]) {
      id
      createdAt
      inBlock
      member {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
      price
    }
    bidMadeCompletingAuctionEvents(
      where: { OR: [{ ownerMember: { id_eq: $memberId } }, { bidders_some: { id_eq: $memberId } }] }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      member {
        ...BasicMembershipFields
      }
      ownerMember {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
      price
    }
    openAuctionBidAcceptedEvents(
      where: { OR: [{ winningBidder: { id_eq: $memberId } }, { bidders_some: { id_eq: $memberId } }] }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      video {
        id
        title
      }
      ownerMember {
        ...BasicMembershipFields
      }
      winningBid {
        amount
      }
      winningBidder {
        ...BasicMembershipFields
      }
    }
    englishAuctionSettledEvents(
      where: {
        OR: [
          { ownerMember: { id_eq: $memberId } }
          { winner: { id_eq: $memberId } }
          { bidders_some: { id_eq: $memberId } }
        ]
      }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      createdAt
      inBlock
      ownerMember {
        ...BasicMembershipFields
      }
      winner {
        ...BasicMembershipFields
      }
      video {
        id
        title
      }
    }
    commentCreatedEvents(
      where: {
        OR: [
          { videoChannel: { id_eq: $channelId }, parentCommentAuthor: { id_eq: null } }
          { parentCommentAuthor: { id_eq: $memberId } }
        ]
      }
      limit: $limit
      orderBy: [createdAt_DESC]
    ) {
      id
      inBlock
      createdAt
      video {
        id
        title
      }
      comment {
        id
        parentComment {
          id
        }
        author {
          ...BasicMembershipFields
        }
      }
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetNotificationsQuery__
 *
 * To run a query within a React component, call `useGetNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      memberId: // value for 'memberId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetNotificationsQuery(
  baseOptions: Apollo.QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options)
}
export function useGetNotificationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNotificationsQuery, GetNotificationsQueryVariables>(GetNotificationsDocument, options)
}
export type GetNotificationsQueryHookResult = ReturnType<typeof useGetNotificationsQuery>
export type GetNotificationsLazyQueryHookResult = ReturnType<typeof useGetNotificationsLazyQuery>
export type GetNotificationsQueryResult = Apollo.QueryResult<GetNotificationsQuery, GetNotificationsQueryVariables>
export const GetNftHistoryDocument = gql`
  query GetNftHistory($nftId: ID!) {
    nftIssuedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    openAuctionStartedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    englishAuctionStartedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    nftSellOrderMadeEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      price
    }
    auctionBidMadeEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      member {
        ...BasicMembershipFields
      }
      bidAmount
    }
    bidMadeCompletingAuctionEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      member {
        ...BasicMembershipFields
      }
      price
    }
    nftBoughtEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      member {
        ...BasicMembershipFields
      }
      price
    }
    englishAuctionSettledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      winner {
        ...BasicMembershipFields
      }
    }
    openAuctionBidAcceptedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      winningBid {
        amount
        bidder {
          ...BasicMembershipFields
        }
      }
    }
    auctionBidCanceledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      member {
        ...BasicMembershipFields
      }
    }
    auctionCanceledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    buyNowCanceledEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
    }
    buyNowPriceUpdatedEvents(where: { video: { id_eq: $nftId } }, orderBy: [createdAt_DESC]) {
      id
      createdAt
      ownerMember {
        ...BasicMembershipFields
      }
      newPrice
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetNftHistoryQuery__
 *
 * To run a query within a React component, call `useGetNftHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftHistoryQuery({
 *   variables: {
 *      nftId: // value for 'nftId'
 *   },
 * });
 */
export function useGetNftHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<GetNftHistoryQuery, GetNftHistoryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftHistoryQuery, GetNftHistoryQueryVariables>(GetNftHistoryDocument, options)
}
export function useGetNftHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNftHistoryQuery, GetNftHistoryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftHistoryQuery, GetNftHistoryQueryVariables>(GetNftHistoryDocument, options)
}
export type GetNftHistoryQueryHookResult = ReturnType<typeof useGetNftHistoryQuery>
export type GetNftHistoryLazyQueryHookResult = ReturnType<typeof useGetNftHistoryLazyQuery>
export type GetNftHistoryQueryResult = Apollo.QueryResult<GetNftHistoryQuery, GetNftHistoryQueryVariables>
export const GetNftActivitiesDocument = gql`
  query GetNftActivities($memberId: ID!, $limit: Int!) {
    auctionBidMadeEventsConnection(
      first: $limit
      where: { OR: [{ member: { id_eq: $memberId } }, { previousTopBidder: { id_eq: $memberId } }] }
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          previousTopBidder {
            ...BasicMembershipFields
          }
          bidAmount
        }
      }
      totalCount
    }
    purchaseEnglishAuctionSettledEventsConnection: englishAuctionSettledEventsConnection(
      where: { winner: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          ownerMember {
            ...BasicMembershipFields
          }
          winner {
            ...BasicMembershipFields
          }
          winningBid {
            amount
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
        }
      }
      totalCount
    }
    purchaseNftBoughtEventsConnection: nftBoughtEventsConnection(
      where: { member: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    purchaseBidMadeCompletingAuctionEventsConnection: bidMadeCompletingAuctionEventsConnection(
      where: { member: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    purchaseOpenAuctionBidAcceptedEventsConnection: openAuctionBidAcceptedEventsConnection(
      where: { winningBidder: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
          winningBid {
            amount
            bidder {
              ...BasicMembershipFields
            }
          }
        }
      }
      totalCount
    }
    saleEnglishAuctionSettledEventsConnection: englishAuctionSettledEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          ownerMember {
            ...BasicMembershipFields
          }
          winner {
            ...BasicMembershipFields
          }
          winningBid {
            amount
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
        }
      }
      totalCount
    }
    saleNftBoughtEventsConnection: nftBoughtEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    saleBidMadeCompletingAuctionEventsConnection: bidMadeCompletingAuctionEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          member {
            ...BasicMembershipFields
          }
          ownerMember {
            ...BasicMembershipFields
          }
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          price
        }
      }
      totalCount
    }
    saleOpenAuctionBidAcceptedEventsConnection: openAuctionBidAcceptedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
          winningBid {
            amount
            bidder {
              ...BasicMembershipFields
            }
          }
        }
      }
      totalCount
    }
    englishAuctionStartedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    openAuctionStartedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    nftSellOrderMadeEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          price
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    auctionBidCanceledEventsConnection(
      where: { member: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          member {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    buyNowCanceledEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    auctionCanceledEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    buyNowPriceUpdatedEventsConnection(
      where: { ownerMember: { id_eq: $memberId } }
      first: $limit
      orderBy: [createdAt_DESC]
    ) {
      edges {
        node {
          id
          createdAt
          inBlock
          newPrice
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
    nftIssuedEventsConnection(where: { ownerMember: { id_eq: $memberId } }, first: $limit, orderBy: [createdAt_DESC]) {
      edges {
        node {
          id
          createdAt
          inBlock
          video {
            id
            title
            thumbnailPhoto {
              ...StorageDataObjectFields
            }
          }
          ownerMember {
            ...BasicMembershipFields
          }
        }
      }
      totalCount
    }
  }
  ${StorageDataObjectFieldsFragmentDoc}
  ${BasicMembershipFieldsFragmentDoc}
`

/**
 * __useGetNftActivitiesQuery__
 *
 * To run a query within a React component, call `useGetNftActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftActivitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftActivitiesQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetNftActivitiesQuery(
  baseOptions: Apollo.QueryHookOptions<GetNftActivitiesQuery, GetNftActivitiesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftActivitiesQuery, GetNftActivitiesQueryVariables>(GetNftActivitiesDocument, options)
}
export function useGetNftActivitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNftActivitiesQuery, GetNftActivitiesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftActivitiesQuery, GetNftActivitiesQueryVariables>(GetNftActivitiesDocument, options)
}
export type GetNftActivitiesQueryHookResult = ReturnType<typeof useGetNftActivitiesQuery>
export type GetNftActivitiesLazyQueryHookResult = ReturnType<typeof useGetNftActivitiesLazyQuery>
export type GetNftActivitiesQueryResult = Apollo.QueryResult<GetNftActivitiesQuery, GetNftActivitiesQueryVariables>
