import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import {
  BasicMembershipFieldsFragmentDoc,
  BasicNftOwnerFieldsFragmentDoc,
  BasicVideoActivityFieldsFragmentDoc,
} from './fragments.generated'

const defaultOptions = {} as const
export type GetNotificationsConnectionQueryVariables = Types.Exact<{
  accountId: Types.Scalars['String']
  first: Types.Scalars['Int']
  after?: Types.InputMaybe<Types.Scalars['String']>
}>

export type GetNotificationsConnectionQuery = {
  __typename?: 'Query'
  notificationsConnection: {
    __typename?: 'NotificationsConnection'
    totalCount: number
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor: string }
    edges: Array<{
      __typename?: 'NotificationEdge'
      cursor: string
      node: {
        __typename?: 'Notification'
        event?: {
          __typename?: 'Event'
          id: string
          timestamp: Date
          inBlock: number
          data:
            | { __typename?: 'AuctionBidCanceledEventData' }
            | {
                __typename?: 'AuctionBidMadeEventData'
                bid: {
                  __typename?: 'Bid'
                  amount: string
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
                  previousTopBid?: {
                    __typename?: 'Bid'
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                nftOwner:
                  | {
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
              }
            | { __typename?: 'AuctionCanceledEventData' }
            | {
                __typename?: 'BidMadeCompletingAuctionEventData'
                winningBid: {
                  __typename?: 'Bid'
                  amount: string
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                previousNftOwner:
                  | {
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
              }
            | { __typename?: 'BuyNowCanceledEventData' }
            | { __typename?: 'BuyNowPriceUpdatedEventData' }
            | { __typename?: 'ChannelCreatedEventData' }
            | { __typename?: 'ChannelFundsWithdrawnEventData' }
            | { __typename?: 'ChannelPaymentMadeEventData' }
            | { __typename?: 'ChannelPayoutsUpdatedEventData' }
            | { __typename?: 'ChannelRewardClaimedAndWithdrawnEventData' }
            | { __typename?: 'ChannelRewardClaimedEventData' }
            | {
                __typename?: 'CommentCreatedEventData'
                comment: {
                  __typename?: 'Comment'
                  id: string
                  video: { __typename?: 'Video'; id: string; title?: string | null }
                  parentComment?: { __typename?: 'Comment'; id: string } | null
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
                }
              }
            | { __typename?: 'CommentReactionEventData' }
            | { __typename?: 'CommentTextUpdatedEventData' }
            | {
                __typename?: 'EnglishAuctionSettledEventData'
                winningBid: {
                  __typename?: 'Bid'
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                previousNftOwner:
                  | {
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
              }
            | { __typename?: 'EnglishAuctionStartedEventData' }
            | { __typename?: 'MemberBannedFromChannelEventData' }
            | { __typename?: 'MetaprotocolTransactionStatusEventData' }
            | {
                __typename?: 'NftBoughtEventData'
                price: string
                buyer: {
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
                nft: {
                  __typename?: 'OwnedNft'
                  video: {
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
                }
              }
            | { __typename?: 'NftIssuedEventData' }
            | { __typename?: 'NftOfferedEventData' }
            | { __typename?: 'NftSellOrderMadeEventData' }
            | {
                __typename?: 'OpenAuctionBidAcceptedEventData'
                winningBid: {
                  __typename?: 'Bid'
                  amount: string
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                previousNftOwner:
                  | {
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
              }
            | { __typename?: 'OpenAuctionStartedEventData' }
            | { __typename?: 'VideoCreatedEventData' }
            | { __typename?: 'VideoReactionEventData' }
        } | null
      }
    }>
  }
}

export type GetMembershipNotificationPreferencesQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetMembershipNotificationPreferencesQuery = {
  __typename?: 'Query'
  accountData: {
    __typename?: 'AccountData'
    notificationPreferences?: {
      __typename?: 'AccountNotificationPreferencesOutput'
      channelCreated: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      replyToComment: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      reactionToComment: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      videoPosted: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      newNftOnAuction: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      newNftOnSale: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      higherBidThanYoursMade: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      timedAuctionExpired: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      auctionWon: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      auctionLost: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      openAuctionBidCanBeWithdrawn: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      fundsFromCouncilReceived: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      fundsToExternalWalletSent: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      fundsFromWgReceived: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    } | null
  }
}

export type GetChannelNotificationPreferencesQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetChannelNotificationPreferencesQuery = {
  __typename?: 'Query'
  accountData: {
    __typename?: 'AccountData'
    notificationPreferences?: {
      __typename?: 'AccountNotificationPreferencesOutput'
      bidMadeOnNft: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      channelExcludedFromApp: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      channelFundsWithdrawn: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      channelPaymentReceived: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      channelReceivedFundsFromWg: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      newChannelFollower: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      newPayoutUpdatedByCouncil: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      nftBought: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      nftFeaturedOnMarketPlace: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      royaltyReceived: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      videoCommentCreated: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      videoDisliked: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      videoExcludedFromApp: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      videoFeaturedAsHero: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      videoFeaturedOnCategoryPage: {
        __typename?: 'NotificationPreferenceOutput'
        emailEnabled: boolean
        inAppEnabled: boolean
      }
      videoLiked: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
      yppChannelVerified: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    } | null
  }
}

export type SetMembershipNotificationPreferencesMutationVariables = Types.Exact<{
  notificationPreferences: Types.AccountNotificationPreferencesInput
}>

export type SetMembershipNotificationPreferencesMutation = {
  __typename?: 'Mutation'
  setAccountNotificationPreferences: {
    __typename?: 'AccountNotificationPreferencesOutput'
    channelCreated: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    replyToComment: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    reactionToComment: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    videoPosted: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    newNftOnAuction: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    newNftOnSale: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    higherBidThanYoursMade: {
      __typename?: 'NotificationPreferenceOutput'
      emailEnabled: boolean
      inAppEnabled: boolean
    }
    timedAuctionExpired: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    auctionWon: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    auctionLost: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
    openAuctionBidCanBeWithdrawn: {
      __typename?: 'NotificationPreferenceOutput'
      emailEnabled: boolean
      inAppEnabled: boolean
    }
    fundsFromCouncilReceived: {
      __typename?: 'NotificationPreferenceOutput'
      emailEnabled: boolean
      inAppEnabled: boolean
    }
    fundsToExternalWalletSent: {
      __typename?: 'NotificationPreferenceOutput'
      emailEnabled: boolean
      inAppEnabled: boolean
    }
    fundsFromWgReceived: { __typename?: 'NotificationPreferenceOutput'; emailEnabled: boolean; inAppEnabled: boolean }
  }
}

export type GetNftHistoryQueryVariables = Types.Exact<{
  nftId: Types.Scalars['String']
}>

export type GetNftHistoryQuery = {
  __typename?: 'Query'
  nftHistoryEntries: Array<{
    __typename?: 'NftHistoryEntry'
    event: {
      __typename?: 'Event'
      id: string
      timestamp: Date
      data:
        | {
            __typename?: 'AuctionBidCanceledEventData'
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
        | {
            __typename?: 'AuctionBidMadeEventData'
            bid: {
              __typename?: 'Bid'
              amount: string
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
          }
        | {
            __typename?: 'AuctionCanceledEventData'
            nftOwner:
              | {
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
          }
        | {
            __typename?: 'BidMadeCompletingAuctionEventData'
            previousNftOwner:
              | {
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
            winningBid: {
              __typename?: 'Bid'
              amount: string
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
          }
        | {
            __typename?: 'BuyNowCanceledEventData'
            nftOwner:
              | {
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
          }
        | {
            __typename?: 'BuyNowPriceUpdatedEventData'
            newPrice: string
            nftOwner:
              | {
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
          }
        | { __typename?: 'ChannelCreatedEventData' }
        | { __typename?: 'ChannelFundsWithdrawnEventData' }
        | { __typename?: 'ChannelPaymentMadeEventData' }
        | { __typename?: 'ChannelPayoutsUpdatedEventData' }
        | { __typename?: 'ChannelRewardClaimedAndWithdrawnEventData' }
        | { __typename?: 'ChannelRewardClaimedEventData' }
        | { __typename?: 'CommentCreatedEventData' }
        | { __typename?: 'CommentReactionEventData' }
        | { __typename?: 'CommentTextUpdatedEventData' }
        | {
            __typename?: 'EnglishAuctionSettledEventData'
            previousNftOwner:
              | {
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
            winningBid: {
              __typename?: 'Bid'
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
          }
        | {
            __typename?: 'EnglishAuctionStartedEventData'
            nftOwner:
              | {
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
          }
        | { __typename?: 'MemberBannedFromChannelEventData' }
        | { __typename?: 'MetaprotocolTransactionStatusEventData' }
        | {
            __typename?: 'NftBoughtEventData'
            price: string
            buyer: {
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
        | {
            __typename?: 'NftIssuedEventData'
            nftOwner:
              | {
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
          }
        | { __typename?: 'NftOfferedEventData' }
        | {
            __typename?: 'NftSellOrderMadeEventData'
            price: string
            nftOwner:
              | {
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
          }
        | {
            __typename?: 'OpenAuctionBidAcceptedEventData'
            previousNftOwner:
              | {
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
            winningBid: {
              __typename?: 'Bid'
              amount: string
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
          }
        | {
            __typename?: 'OpenAuctionStartedEventData'
            nftOwner:
              | {
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
          }
        | { __typename?: 'VideoCreatedEventData' }
        | { __typename?: 'VideoReactionEventData' }
    }
  }>
}

export type GetNftActivitiesCountQueryVariables = Types.Exact<{
  memberId: Types.Scalars['String']
}>

export type GetNftActivitiesCountQuery = {
  __typename?: 'Query'
  nftsBought: { __typename?: 'NftActivitiesConnection'; totalCount: number }
  nftsSold: { __typename?: 'NftActivitiesConnection'; totalCount: number }
  nftsIssued: { __typename?: 'NftActivitiesConnection'; totalCount: number }
  nftsBidded: { __typename?: 'NftActivitiesConnection'; totalCount: number }
}

export type GetNftActivitiesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['String']
  first: Types.Scalars['Int']
  after?: Types.InputMaybe<Types.Scalars['String']>
  orderBy?: Types.InputMaybe<Array<Types.NftActivityOrderByInput> | Types.NftActivityOrderByInput>
}>

export type GetNftActivitiesQuery = {
  __typename?: 'Query'
  nftActivitiesConnection: {
    __typename?: 'NftActivitiesConnection'
    totalCount: number
    pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean }
    edges: Array<{
      __typename?: 'NftActivityEdge'
      cursor: string
      node: {
        __typename?: 'NftActivity'
        event: {
          __typename?: 'Event'
          id: string
          timestamp: Date
          inBlock: number
          data:
            | {
                __typename?: 'AuctionBidCanceledEventData'
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
                bid: {
                  __typename?: 'Bid'
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
              }
            | {
                __typename?: 'AuctionBidMadeEventData'
                nftOwner:
                  | {
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
                bid: {
                  __typename?: 'Bid'
                  amount: string
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
                  previousTopBid?: {
                    __typename?: 'Bid'
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
              }
            | {
                __typename?: 'AuctionCanceledEventData'
                auction: {
                  __typename?: 'Auction'
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                nftOwner:
                  | {
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
              }
            | {
                __typename?: 'BidMadeCompletingAuctionEventData'
                previousNftOwner:
                  | {
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
                winningBid: {
                  __typename?: 'Bid'
                  amount: string
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
              }
            | {
                __typename?: 'BuyNowCanceledEventData'
                nft: {
                  __typename?: 'OwnedNft'
                  video: {
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
                }
                nftOwner:
                  | {
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
              }
            | {
                __typename?: 'BuyNowPriceUpdatedEventData'
                newPrice: string
                nft: {
                  __typename?: 'OwnedNft'
                  video: {
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
                }
                nftOwner:
                  | {
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
              }
            | { __typename?: 'ChannelCreatedEventData' }
            | { __typename?: 'ChannelFundsWithdrawnEventData' }
            | { __typename?: 'ChannelPaymentMadeEventData' }
            | { __typename?: 'ChannelPayoutsUpdatedEventData' }
            | { __typename?: 'ChannelRewardClaimedAndWithdrawnEventData' }
            | { __typename?: 'ChannelRewardClaimedEventData' }
            | { __typename?: 'CommentCreatedEventData' }
            | { __typename?: 'CommentReactionEventData' }
            | { __typename?: 'CommentTextUpdatedEventData' }
            | {
                __typename?: 'EnglishAuctionSettledEventData'
                previousNftOwner:
                  | {
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
                winningBid: {
                  __typename?: 'Bid'
                  amount: string
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
              }
            | {
                __typename?: 'EnglishAuctionStartedEventData'
                auction: {
                  __typename?: 'Auction'
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                nftOwner:
                  | {
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
              }
            | { __typename?: 'MemberBannedFromChannelEventData' }
            | { __typename?: 'MetaprotocolTransactionStatusEventData' }
            | {
                __typename?: 'NftBoughtEventData'
                price: string
                buyer: {
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
                previousNftOwner:
                  | {
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
                nft: {
                  __typename?: 'OwnedNft'
                  video: {
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
                }
              }
            | {
                __typename?: 'NftIssuedEventData'
                nft: {
                  __typename?: 'OwnedNft'
                  video: {
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
                }
                nftOwner:
                  | {
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
              }
            | { __typename?: 'NftOfferedEventData' }
            | {
                __typename?: 'NftSellOrderMadeEventData'
                price: string
                nft: {
                  __typename?: 'OwnedNft'
                  video: {
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
                }
                nftOwner:
                  | {
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
              }
            | {
                __typename?: 'OpenAuctionBidAcceptedEventData'
                winningBid: {
                  __typename?: 'Bid'
                  amount: string
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
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                previousNftOwner:
                  | {
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
              }
            | {
                __typename?: 'OpenAuctionStartedEventData'
                auction: {
                  __typename?: 'Auction'
                  nft: {
                    __typename?: 'OwnedNft'
                    video: {
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
                  }
                }
                nftOwner:
                  | {
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
              }
            | { __typename?: 'VideoCreatedEventData' }
            | { __typename?: 'VideoReactionEventData' }
        }
      }
    }>
  }
}

export const GetNotificationsConnectionDocument = gql`
  query GetNotificationsConnection($accountId: String!, $first: Int!, $after: String) {
    notificationsConnection(
      first: $first
      after: $after
      orderBy: event_timestamp_DESC
      where: { account: { id_eq: $accountId } }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          event {
            id
            timestamp
            inBlock
            data {
              ... on AuctionBidMadeEventData {
                bid {
                  amount
                  bidder {
                    ...BasicMembershipFields
                  }
                  previousTopBid {
                    bidder {
                      ...BasicMembershipFields
                    }
                  }
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on NftBoughtEventData {
                buyer {
                  ...BasicMembershipFields
                }
                price
                nft {
                  video {
                    ...BasicVideoActivityFields
                  }
                }
              }
              ... on BidMadeCompletingAuctionEventData {
                winningBid {
                  bidder {
                    ...BasicMembershipFields
                  }
                  amount
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                previousNftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on OpenAuctionBidAcceptedEventData {
                winningBid {
                  amount
                  bidder {
                    ...BasicMembershipFields
                  }
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                previousNftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on EnglishAuctionSettledEventData {
                winningBid {
                  bidder {
                    ...BasicMembershipFields
                  }
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                previousNftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on CommentCreatedEventData {
                comment {
                  id
                  video {
                    id
                    title
                  }
                  parentComment {
                    id
                  }
                  author {
                    ...BasicMembershipFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${BasicMembershipFieldsFragmentDoc}
  ${BasicVideoActivityFieldsFragmentDoc}
  ${BasicNftOwnerFieldsFragmentDoc}
`

/**
 * __useGetNotificationsConnectionQuery__
 *
 * To run a query within a React component, call `useGetNotificationsConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotificationsConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotificationsConnectionQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetNotificationsConnectionQuery(
  baseOptions: Apollo.QueryHookOptions<GetNotificationsConnectionQuery, GetNotificationsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNotificationsConnectionQuery, GetNotificationsConnectionQueryVariables>(
    GetNotificationsConnectionDocument,
    options
  )
}
export function useGetNotificationsConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNotificationsConnectionQuery, GetNotificationsConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNotificationsConnectionQuery, GetNotificationsConnectionQueryVariables>(
    GetNotificationsConnectionDocument,
    options
  )
}
export type GetNotificationsConnectionQueryHookResult = ReturnType<typeof useGetNotificationsConnectionQuery>
export type GetNotificationsConnectionLazyQueryHookResult = ReturnType<typeof useGetNotificationsConnectionLazyQuery>
export type GetNotificationsConnectionQueryResult = Apollo.QueryResult<
  GetNotificationsConnectionQuery,
  GetNotificationsConnectionQueryVariables
>
export const GetMembershipNotificationPreferencesDocument = gql`
  query GetMembershipNotificationPreferences {
    accountData {
      notificationPreferences {
        channelCreated {
          emailEnabled
          inAppEnabled
        }
        replyToComment {
          emailEnabled
          inAppEnabled
        }
        reactionToComment {
          emailEnabled
          inAppEnabled
        }
        videoPosted {
          emailEnabled
          inAppEnabled
        }
        newNftOnAuction {
          emailEnabled
          inAppEnabled
        }
        newNftOnSale {
          emailEnabled
          inAppEnabled
        }
        higherBidThanYoursMade {
          emailEnabled
          inAppEnabled
        }
        timedAuctionExpired {
          emailEnabled
          inAppEnabled
        }
        auctionWon {
          emailEnabled
          inAppEnabled
        }
        auctionLost {
          emailEnabled
          inAppEnabled
        }
        openAuctionBidCanBeWithdrawn {
          emailEnabled
          inAppEnabled
        }
        fundsFromCouncilReceived {
          emailEnabled
          inAppEnabled
        }
        fundsToExternalWalletSent {
          emailEnabled
          inAppEnabled
        }
        fundsFromWgReceived {
          emailEnabled
          inAppEnabled
        }
      }
    }
  }
`

/**
 * __useGetMembershipNotificationPreferencesQuery__
 *
 * To run a query within a React component, call `useGetMembershipNotificationPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembershipNotificationPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembershipNotificationPreferencesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMembershipNotificationPreferencesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMembershipNotificationPreferencesQuery,
    GetMembershipNotificationPreferencesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMembershipNotificationPreferencesQuery, GetMembershipNotificationPreferencesQueryVariables>(
    GetMembershipNotificationPreferencesDocument,
    options
  )
}
export function useGetMembershipNotificationPreferencesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMembershipNotificationPreferencesQuery,
    GetMembershipNotificationPreferencesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetMembershipNotificationPreferencesQuery,
    GetMembershipNotificationPreferencesQueryVariables
  >(GetMembershipNotificationPreferencesDocument, options)
}
export type GetMembershipNotificationPreferencesQueryHookResult = ReturnType<
  typeof useGetMembershipNotificationPreferencesQuery
>
export type GetMembershipNotificationPreferencesLazyQueryHookResult = ReturnType<
  typeof useGetMembershipNotificationPreferencesLazyQuery
>
export type GetMembershipNotificationPreferencesQueryResult = Apollo.QueryResult<
  GetMembershipNotificationPreferencesQuery,
  GetMembershipNotificationPreferencesQueryVariables
>
export const GetChannelNotificationPreferencesDocument = gql`
  query GetChannelNotificationPreferences {
    accountData {
      notificationPreferences {
        bidMadeOnNft {
          emailEnabled
          inAppEnabled
        }
        channelExcludedFromApp {
          emailEnabled
          inAppEnabled
        }
        channelFundsWithdrawn {
          emailEnabled
          inAppEnabled
        }
        channelPaymentReceived {
          emailEnabled
          inAppEnabled
        }
        channelReceivedFundsFromWg {
          emailEnabled
          inAppEnabled
        }
        newChannelFollower {
          emailEnabled
          inAppEnabled
        }
        newPayoutUpdatedByCouncil {
          emailEnabled
          inAppEnabled
        }
        nftBought {
          emailEnabled
          inAppEnabled
        }
        nftFeaturedOnMarketPlace {
          emailEnabled
          inAppEnabled
        }
        royaltyReceived {
          emailEnabled
          inAppEnabled
        }
        videoCommentCreated {
          emailEnabled
          inAppEnabled
        }
        videoDisliked {
          emailEnabled
          inAppEnabled
        }
        videoExcludedFromApp {
          emailEnabled
          inAppEnabled
        }
        videoFeaturedAsHero {
          emailEnabled
          inAppEnabled
        }
        videoFeaturedOnCategoryPage {
          emailEnabled
          inAppEnabled
        }
        videoLiked {
          emailEnabled
          inAppEnabled
        }
        yppChannelVerified {
          emailEnabled
          inAppEnabled
        }
      }
    }
  }
`

/**
 * __useGetChannelNotificationPreferencesQuery__
 *
 * To run a query within a React component, call `useGetChannelNotificationPreferencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelNotificationPreferencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelNotificationPreferencesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetChannelNotificationPreferencesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetChannelNotificationPreferencesQuery,
    GetChannelNotificationPreferencesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetChannelNotificationPreferencesQuery, GetChannelNotificationPreferencesQueryVariables>(
    GetChannelNotificationPreferencesDocument,
    options
  )
}
export function useGetChannelNotificationPreferencesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetChannelNotificationPreferencesQuery,
    GetChannelNotificationPreferencesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetChannelNotificationPreferencesQuery, GetChannelNotificationPreferencesQueryVariables>(
    GetChannelNotificationPreferencesDocument,
    options
  )
}
export type GetChannelNotificationPreferencesQueryHookResult = ReturnType<
  typeof useGetChannelNotificationPreferencesQuery
>
export type GetChannelNotificationPreferencesLazyQueryHookResult = ReturnType<
  typeof useGetChannelNotificationPreferencesLazyQuery
>
export type GetChannelNotificationPreferencesQueryResult = Apollo.QueryResult<
  GetChannelNotificationPreferencesQuery,
  GetChannelNotificationPreferencesQueryVariables
>
export const SetMembershipNotificationPreferencesDocument = gql`
  mutation SetMembershipNotificationPreferences($notificationPreferences: AccountNotificationPreferencesInput!) {
    setAccountNotificationPreferences(notificationPreferences: $notificationPreferences) {
      channelCreated {
        emailEnabled
        inAppEnabled
      }
      replyToComment {
        emailEnabled
        inAppEnabled
      }
      reactionToComment {
        emailEnabled
        inAppEnabled
      }
      videoPosted {
        emailEnabled
        inAppEnabled
      }
      newNftOnAuction {
        emailEnabled
        inAppEnabled
      }
      newNftOnSale {
        emailEnabled
        inAppEnabled
      }
      higherBidThanYoursMade {
        emailEnabled
        inAppEnabled
      }
      timedAuctionExpired {
        emailEnabled
        inAppEnabled
      }
      auctionWon {
        emailEnabled
        inAppEnabled
      }
      auctionLost {
        emailEnabled
        inAppEnabled
      }
      openAuctionBidCanBeWithdrawn {
        emailEnabled
        inAppEnabled
      }
      fundsFromCouncilReceived {
        emailEnabled
        inAppEnabled
      }
      fundsToExternalWalletSent {
        emailEnabled
        inAppEnabled
      }
      fundsFromWgReceived {
        emailEnabled
        inAppEnabled
      }
    }
  }
`
export type SetMembershipNotificationPreferencesMutationFn = Apollo.MutationFunction<
  SetMembershipNotificationPreferencesMutation,
  SetMembershipNotificationPreferencesMutationVariables
>

/**
 * __useSetMembershipNotificationPreferencesMutation__
 *
 * To run a mutation, you first call `useSetMembershipNotificationPreferencesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetMembershipNotificationPreferencesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setMembershipNotificationPreferencesMutation, { data, loading, error }] = useSetMembershipNotificationPreferencesMutation({
 *   variables: {
 *      notificationPreferences: // value for 'notificationPreferences'
 *   },
 * });
 */
export function useSetMembershipNotificationPreferencesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetMembershipNotificationPreferencesMutation,
    SetMembershipNotificationPreferencesMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    SetMembershipNotificationPreferencesMutation,
    SetMembershipNotificationPreferencesMutationVariables
  >(SetMembershipNotificationPreferencesDocument, options)
}
export type SetMembershipNotificationPreferencesMutationHookResult = ReturnType<
  typeof useSetMembershipNotificationPreferencesMutation
>
export type SetMembershipNotificationPreferencesMutationResult =
  Apollo.MutationResult<SetMembershipNotificationPreferencesMutation>
export type SetMembershipNotificationPreferencesMutationOptions = Apollo.BaseMutationOptions<
  SetMembershipNotificationPreferencesMutation,
  SetMembershipNotificationPreferencesMutationVariables
>
export const GetNftHistoryDocument = gql`
  query GetNftHistory($nftId: String!) {
    nftHistoryEntries(orderBy: event_timestamp_DESC, where: { nft: { id_eq: $nftId } }) {
      event {
        id
        timestamp
        data {
          ... on NftIssuedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on OpenAuctionStartedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on EnglishAuctionStartedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on NftSellOrderMadeEventData {
            price
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on AuctionBidMadeEventData {
            bid {
              bidder {
                ...BasicMembershipFields
              }
              amount
            }
          }
          ... on BidMadeCompletingAuctionEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
              amount
            }
          }
          ... on NftBoughtEventData {
            buyer {
              ...BasicMembershipFields
            }
            price
          }
          ... on EnglishAuctionSettledEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              bidder {
                ...BasicMembershipFields
              }
            }
          }
          ... on OpenAuctionBidAcceptedEventData {
            previousNftOwner {
              ...BasicNftOwnerFields
            }
            winningBid {
              amount
              bidder {
                ...BasicMembershipFields
              }
            }
          }
          ... on AuctionBidCanceledEventData {
            member {
              ...BasicMembershipFields
            }
          }
          ... on AuctionCanceledEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on BuyNowCanceledEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
          }
          ... on BuyNowPriceUpdatedEventData {
            nftOwner {
              ...BasicNftOwnerFields
            }
            newPrice
          }
        }
      }
    }
  }
  ${BasicNftOwnerFieldsFragmentDoc}
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
export const GetNftActivitiesCountDocument = gql`
  query GetNftActivitiesCount($memberId: String!) {
    nftsBought: nftActivitiesConnection(
      where: {
        OR: [
          {
            member: { id_eq: $memberId }
            event: {
              data: {
                isTypeOf_in: [
                  "EnglishAuctionSettledEventData"
                  "BidMadeCompletingAuctionEventData"
                  "OpenAuctionBidAcceptedEventData"
                ]
                winningBid: { bidder: { id_eq: $memberId } }
              }
            }
          }
          {
            member: { id_eq: $memberId }
            event: { data: { isTypeOf_eq: "NftBoughtEventData", buyer: { id_eq: $memberId } } }
          }
        ]
      }
      orderBy: event_timestamp_DESC
    ) {
      totalCount
    }
    nftsSold: nftActivitiesConnection(
      where: {
        OR: [
          {
            member: { id_eq: $memberId }
            event: {
              data: {
                isTypeOf_in: [
                  "EnglishAuctionSettledEventData"
                  "BidMadeCompletingAuctionEventData"
                  "OpenAuctionBidAcceptedEventData"
                  "NftBoughtEventData"
                ]
                previousNftOwner: { member: { id_eq: $memberId } }
              }
            }
          }
          {
            member: { id_eq: $memberId }
            event: {
              data: {
                isTypeOf_in: [
                  "EnglishAuctionSettledEventData"
                  "BidMadeCompletingAuctionEventData"
                  "OpenAuctionBidAcceptedEventData"
                  "NftBoughtEventData"
                ]
                previousNftOwner: { channel: { ownerMember: { id_eq: $memberId } } }
              }
            }
          }
        ]
      }
      orderBy: event_timestamp_DESC
    ) {
      totalCount
    }
    nftsIssued: nftActivitiesConnection(
      where: {
        event: {
          OR: [
            {
              data: { isTypeOf_eq: "NftIssuedEventData", nftOwner: { channel: { ownerMember: { id_eq: $memberId } } } }
            }
            { data: { isTypeOf_eq: "NftIssuedEventData", nftOwner: { member: { id_eq: $memberId } } } }
          ]
        }
      }
      orderBy: event_timestamp_DESC
    ) {
      totalCount
    }
    nftsBidded: nftActivitiesConnection(
      where: { event: { data: { isTypeOf_eq: "AuctionBidMadeEventData", bid: { bidder: { id_eq: $memberId } } } } }
      orderBy: event_timestamp_DESC
    ) {
      totalCount
    }
  }
`

/**
 * __useGetNftActivitiesCountQuery__
 *
 * To run a query within a React component, call `useGetNftActivitiesCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftActivitiesCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftActivitiesCountQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetNftActivitiesCountQuery(
  baseOptions: Apollo.QueryHookOptions<GetNftActivitiesCountQuery, GetNftActivitiesCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetNftActivitiesCountQuery, GetNftActivitiesCountQueryVariables>(
    GetNftActivitiesCountDocument,
    options
  )
}
export function useGetNftActivitiesCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetNftActivitiesCountQuery, GetNftActivitiesCountQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetNftActivitiesCountQuery, GetNftActivitiesCountQueryVariables>(
    GetNftActivitiesCountDocument,
    options
  )
}
export type GetNftActivitiesCountQueryHookResult = ReturnType<typeof useGetNftActivitiesCountQuery>
export type GetNftActivitiesCountLazyQueryHookResult = ReturnType<typeof useGetNftActivitiesCountLazyQuery>
export type GetNftActivitiesCountQueryResult = Apollo.QueryResult<
  GetNftActivitiesCountQuery,
  GetNftActivitiesCountQueryVariables
>
export const GetNftActivitiesDocument = gql`
  query GetNftActivities(
    $memberId: String!
    $first: Int!
    $after: String
    $orderBy: [NftActivityOrderByInput!] = event_timestamp_DESC
  ) {
    nftActivitiesConnection(first: $first, after: $after, orderBy: $orderBy, where: { member: { id_eq: $memberId } }) {
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          event {
            id
            timestamp
            inBlock
            data {
              ... on AuctionBidMadeEventData {
                nftOwner {
                  ...BasicNftOwnerFields
                }
                bid {
                  amount
                  bidder {
                    ...BasicMembershipFields
                  }
                  previousTopBid {
                    bidder {
                      ...BasicMembershipFields
                    }
                  }
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
              }
              ... on EnglishAuctionSettledEventData {
                previousNftOwner {
                  ...BasicNftOwnerFields
                }
                winningBid {
                  bidder {
                    ...BasicMembershipFields
                  }
                  amount
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
              }
              ... on NftBoughtEventData {
                buyer {
                  ...BasicMembershipFields
                }
                previousNftOwner {
                  ...BasicNftOwnerFields
                }
                nft {
                  video {
                    ...BasicVideoActivityFields
                  }
                }
                price
              }
              ... on BidMadeCompletingAuctionEventData {
                previousNftOwner {
                  ...BasicNftOwnerFields
                }
                winningBid {
                  bidder {
                    ...BasicMembershipFields
                  }
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                  amount
                }
              }
              ... on OpenAuctionBidAcceptedEventData {
                winningBid {
                  amount
                  bidder {
                    ...BasicMembershipFields
                  }
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                previousNftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on EnglishAuctionStartedEventData {
                auction {
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on OpenAuctionStartedEventData {
                auction {
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on NftSellOrderMadeEventData {
                price
                nft {
                  video {
                    ...BasicVideoActivityFields
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on AuctionBidCanceledEventData {
                member {
                  ...BasicMembershipFields
                }
                bid {
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
              }
              ... on BuyNowCanceledEventData {
                nft {
                  video {
                    ...BasicVideoActivityFields
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on AuctionCanceledEventData {
                auction {
                  nft {
                    video {
                      ...BasicVideoActivityFields
                    }
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on BuyNowPriceUpdatedEventData {
                newPrice
                nft {
                  video {
                    ...BasicVideoActivityFields
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
              ... on NftIssuedEventData {
                nft {
                  video {
                    ...BasicVideoActivityFields
                  }
                }
                nftOwner {
                  ...BasicNftOwnerFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${BasicNftOwnerFieldsFragmentDoc}
  ${BasicMembershipFieldsFragmentDoc}
  ${BasicVideoActivityFieldsFragmentDoc}
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
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
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
