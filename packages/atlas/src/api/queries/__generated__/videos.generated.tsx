import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicVideoFieldsFragmentDoc, FullVideoFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetBasicVideoQueryVariables = Types.Exact<{
  where: Types.VideoWhereUniqueInput
}>

export type GetBasicVideoQuery = {
  __typename?: 'Query'
  videoByUniqueInput?: {
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
  } | null
}

export type GetFullVideoQueryVariables = Types.Exact<{
  where: Types.VideoWhereUniqueInput
}>

export type GetFullVideoQuery = {
  __typename?: 'Query'
  videoByUniqueInput?: {
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
  } | null
}

export type GetBasicVideosConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  orderBy?: Types.InputMaybe<Array<Types.VideoOrderByInput> | Types.VideoOrderByInput>
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetBasicVideosConnectionQuery = {
  __typename?: 'Query'
  videosConnection: {
    __typename?: 'VideoConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'VideoEdge'
      cursor: string
      node: {
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
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetFullVideosConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  orderBy?: Types.VideoOrderByInput
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetFullVideosConnectionQuery = {
  __typename?: 'Query'
  videosConnection: {
    __typename?: 'VideoConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'VideoEdge'
      cursor: string
      node: {
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
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetBasicVideosQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  where?: Types.InputMaybe<Types.VideoWhereInput>
  orderBy?: Types.VideoOrderByInput
}>

export type GetBasicVideosQuery = {
  __typename?: 'Query'
  videos: Array<{
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
  }>
}

export type GetFullVideosQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  where?: Types.InputMaybe<Types.VideoWhereInput>
  orderBy?: Types.VideoOrderByInput
}>

export type GetFullVideosQuery = {
  __typename?: 'Query'
  videos: Array<{
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
  }>
}

export type GetMostViewedVideosConnectionQueryVariables = Types.Exact<{
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  periodDays?: Types.InputMaybe<Types.Scalars['Int']>
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  orderBy?: Types.VideoOrderByInput
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetMostViewedVideosConnectionQuery = {
  __typename?: 'Query'
  mostViewedVideosConnection: {
    __typename?: 'VideoConnection'
    totalCount: number
    edges: Array<{
      __typename?: 'VideoEdge'
      cursor: string
      node: {
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
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetTop10VideosThisWeekQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetTop10VideosThisWeekQuery = {
  __typename?: 'Query'
  top10VideosThisWeek: Array<{
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
  }>
}

export type GetTop10VideosThisMonthQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetTop10VideosThisMonthQuery = {
  __typename?: 'Query'
  top10VideosThisMonth: Array<{
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
  }>
}

export type AddVideoViewMutationVariables = Types.Exact<{
  videoId: Types.Scalars['ID']
  channelId: Types.Scalars['ID']
  categoryId?: Types.InputMaybe<Types.Scalars['ID']>
}>

export type AddVideoViewMutation = {
  __typename?: 'Mutation'
  addVideoView: { __typename?: 'EntityViewsInfo'; id: string; views: number }
}

export const GetBasicVideoDocument = gql`
  query GetBasicVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetBasicVideoQuery__
 *
 * To run a query within a React component, call `useGetBasicVideoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicVideoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicVideoQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetBasicVideoQuery(
  baseOptions: Apollo.QueryHookOptions<GetBasicVideoQuery, GetBasicVideoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicVideoQuery, GetBasicVideoQueryVariables>(GetBasicVideoDocument, options)
}
export function useGetBasicVideoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicVideoQuery, GetBasicVideoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicVideoQuery, GetBasicVideoQueryVariables>(GetBasicVideoDocument, options)
}
export type GetBasicVideoQueryHookResult = ReturnType<typeof useGetBasicVideoQuery>
export type GetBasicVideoLazyQueryHookResult = ReturnType<typeof useGetBasicVideoLazyQuery>
export type GetBasicVideoQueryResult = Apollo.QueryResult<GetBasicVideoQuery, GetBasicVideoQueryVariables>
export const GetFullVideoDocument = gql`
  query GetFullVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
      ...FullVideoFields
    }
  }
  ${FullVideoFieldsFragmentDoc}
`

/**
 * __useGetFullVideoQuery__
 *
 * To run a query within a React component, call `useGetFullVideoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullVideoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullVideoQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetFullVideoQuery(
  baseOptions: Apollo.QueryHookOptions<GetFullVideoQuery, GetFullVideoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFullVideoQuery, GetFullVideoQueryVariables>(GetFullVideoDocument, options)
}
export function useGetFullVideoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFullVideoQuery, GetFullVideoQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFullVideoQuery, GetFullVideoQueryVariables>(GetFullVideoDocument, options)
}
export type GetFullVideoQueryHookResult = ReturnType<typeof useGetFullVideoQuery>
export type GetFullVideoLazyQueryHookResult = ReturnType<typeof useGetFullVideoLazyQuery>
export type GetFullVideoQueryResult = Apollo.QueryResult<GetFullVideoQuery, GetFullVideoQueryVariables>
export const GetBasicVideosConnectionDocument = gql`
  query GetBasicVideosConnection(
    $first: Int
    $after: String
    $orderBy: [VideoOrderByInput!] = [createdAt_DESC]
    $where: VideoWhereInput
  ) {
    videosConnection(first: $first, after: $after, where: $where, orderBy: $orderBy) {
      edges {
        cursor
        node {
          ...BasicVideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetBasicVideosConnectionQuery__
 *
 * To run a query within a React component, call `useGetBasicVideosConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicVideosConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicVideosConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetBasicVideosConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicVideosConnectionQuery, GetBasicVideosConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicVideosConnectionQuery, GetBasicVideosConnectionQueryVariables>(
    GetBasicVideosConnectionDocument,
    options
  )
}
export function useGetBasicVideosConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicVideosConnectionQuery, GetBasicVideosConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicVideosConnectionQuery, GetBasicVideosConnectionQueryVariables>(
    GetBasicVideosConnectionDocument,
    options
  )
}
export type GetBasicVideosConnectionQueryHookResult = ReturnType<typeof useGetBasicVideosConnectionQuery>
export type GetBasicVideosConnectionLazyQueryHookResult = ReturnType<typeof useGetBasicVideosConnectionLazyQuery>
export type GetBasicVideosConnectionQueryResult = Apollo.QueryResult<
  GetBasicVideosConnectionQuery,
  GetBasicVideosConnectionQueryVariables
>
export const GetFullVideosConnectionDocument = gql`
  query GetFullVideosConnection(
    $first: Int
    $after: String
    $orderBy: VideoOrderByInput! = createdAt_DESC
    $where: VideoWhereInput
  ) {
    videosConnection(first: $first, after: $after, where: $where, orderBy: [$orderBy]) {
      edges {
        cursor
        node {
          ...FullVideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${FullVideoFieldsFragmentDoc}
`

/**
 * __useGetFullVideosConnectionQuery__
 *
 * To run a query within a React component, call `useGetFullVideosConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullVideosConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullVideosConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetFullVideosConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFullVideosConnectionQuery, GetFullVideosConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFullVideosConnectionQuery, GetFullVideosConnectionQueryVariables>(
    GetFullVideosConnectionDocument,
    options
  )
}
export function useGetFullVideosConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFullVideosConnectionQuery, GetFullVideosConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFullVideosConnectionQuery, GetFullVideosConnectionQueryVariables>(
    GetFullVideosConnectionDocument,
    options
  )
}
export type GetFullVideosConnectionQueryHookResult = ReturnType<typeof useGetFullVideosConnectionQuery>
export type GetFullVideosConnectionLazyQueryHookResult = ReturnType<typeof useGetFullVideosConnectionLazyQuery>
export type GetFullVideosConnectionQueryResult = Apollo.QueryResult<
  GetFullVideosConnectionQuery,
  GetFullVideosConnectionQueryVariables
>
export const GetBasicVideosDocument = gql`
  query GetBasicVideos(
    $offset: Int
    $limit: Int
    $where: VideoWhereInput
    $orderBy: VideoOrderByInput! = createdAt_DESC
  ) {
    videos(offset: $offset, limit: $limit, where: $where, orderBy: [$orderBy]) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetBasicVideosQuery__
 *
 * To run a query within a React component, call `useGetBasicVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBasicVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBasicVideosQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetBasicVideosQuery(
  baseOptions?: Apollo.QueryHookOptions<GetBasicVideosQuery, GetBasicVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetBasicVideosQuery, GetBasicVideosQueryVariables>(GetBasicVideosDocument, options)
}
export function useGetBasicVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetBasicVideosQuery, GetBasicVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetBasicVideosQuery, GetBasicVideosQueryVariables>(GetBasicVideosDocument, options)
}
export type GetBasicVideosQueryHookResult = ReturnType<typeof useGetBasicVideosQuery>
export type GetBasicVideosLazyQueryHookResult = ReturnType<typeof useGetBasicVideosLazyQuery>
export type GetBasicVideosQueryResult = Apollo.QueryResult<GetBasicVideosQuery, GetBasicVideosQueryVariables>
export const GetFullVideosDocument = gql`
  query GetFullVideos(
    $offset: Int
    $limit: Int
    $where: VideoWhereInput
    $orderBy: VideoOrderByInput! = createdAt_DESC
  ) {
    videos(offset: $offset, limit: $limit, where: $where, orderBy: [$orderBy]) {
      ...FullVideoFields
    }
  }
  ${FullVideoFieldsFragmentDoc}
`

/**
 * __useGetFullVideosQuery__
 *
 * To run a query within a React component, call `useGetFullVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullVideosQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetFullVideosQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFullVideosQuery, GetFullVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetFullVideosQuery, GetFullVideosQueryVariables>(GetFullVideosDocument, options)
}
export function useGetFullVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFullVideosQuery, GetFullVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetFullVideosQuery, GetFullVideosQueryVariables>(GetFullVideosDocument, options)
}
export type GetFullVideosQueryHookResult = ReturnType<typeof useGetFullVideosQuery>
export type GetFullVideosLazyQueryHookResult = ReturnType<typeof useGetFullVideosLazyQuery>
export type GetFullVideosQueryResult = Apollo.QueryResult<GetFullVideosQuery, GetFullVideosQueryVariables>
export const GetMostViewedVideosConnectionDocument = gql`
  query GetMostViewedVideosConnection(
    $limit: Int = 50
    $periodDays: Int
    $first: Int
    $after: String
    $orderBy: VideoOrderByInput! = createdAt_DESC
    $where: VideoWhereInput
  ) {
    mostViewedVideosConnection(
      limit: $limit
      first: $first
      after: $after
      periodDays: $periodDays
      orderBy: [$orderBy]
      where: $where
    ) {
      edges {
        cursor
        node {
          ...BasicVideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetMostViewedVideosConnectionQuery__
 *
 * To run a query within a React component, call `useGetMostViewedVideosConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMostViewedVideosConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMostViewedVideosConnectionQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      periodDays: // value for 'periodDays'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetMostViewedVideosConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetMostViewedVideosConnectionQuery, GetMostViewedVideosConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMostViewedVideosConnectionQuery, GetMostViewedVideosConnectionQueryVariables>(
    GetMostViewedVideosConnectionDocument,
    options
  )
}
export function useGetMostViewedVideosConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMostViewedVideosConnectionQuery,
    GetMostViewedVideosConnectionQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMostViewedVideosConnectionQuery, GetMostViewedVideosConnectionQueryVariables>(
    GetMostViewedVideosConnectionDocument,
    options
  )
}
export type GetMostViewedVideosConnectionQueryHookResult = ReturnType<typeof useGetMostViewedVideosConnectionQuery>
export type GetMostViewedVideosConnectionLazyQueryHookResult = ReturnType<
  typeof useGetMostViewedVideosConnectionLazyQuery
>
export type GetMostViewedVideosConnectionQueryResult = Apollo.QueryResult<
  GetMostViewedVideosConnectionQuery,
  GetMostViewedVideosConnectionQueryVariables
>
export const GetTop10VideosThisWeekDocument = gql`
  query GetTop10VideosThisWeek($where: VideoWhereInput) {
    top10VideosThisWeek(where: $where) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetTop10VideosThisWeekQuery__
 *
 * To run a query within a React component, call `useGetTop10VideosThisWeekQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTop10VideosThisWeekQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTop10VideosThisWeekQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetTop10VideosThisWeekQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTop10VideosThisWeekQuery, GetTop10VideosThisWeekQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTop10VideosThisWeekQuery, GetTop10VideosThisWeekQueryVariables>(
    GetTop10VideosThisWeekDocument,
    options
  )
}
export function useGetTop10VideosThisWeekLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTop10VideosThisWeekQuery, GetTop10VideosThisWeekQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTop10VideosThisWeekQuery, GetTop10VideosThisWeekQueryVariables>(
    GetTop10VideosThisWeekDocument,
    options
  )
}
export type GetTop10VideosThisWeekQueryHookResult = ReturnType<typeof useGetTop10VideosThisWeekQuery>
export type GetTop10VideosThisWeekLazyQueryHookResult = ReturnType<typeof useGetTop10VideosThisWeekLazyQuery>
export type GetTop10VideosThisWeekQueryResult = Apollo.QueryResult<
  GetTop10VideosThisWeekQuery,
  GetTop10VideosThisWeekQueryVariables
>
export const GetTop10VideosThisMonthDocument = gql`
  query GetTop10VideosThisMonth($where: VideoWhereInput) {
    top10VideosThisMonth(where: $where) {
      ...BasicVideoFields
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetTop10VideosThisMonthQuery__
 *
 * To run a query within a React component, call `useGetTop10VideosThisMonthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTop10VideosThisMonthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTop10VideosThisMonthQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetTop10VideosThisMonthQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTop10VideosThisMonthQuery, GetTop10VideosThisMonthQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetTop10VideosThisMonthQuery, GetTop10VideosThisMonthQueryVariables>(
    GetTop10VideosThisMonthDocument,
    options
  )
}
export function useGetTop10VideosThisMonthLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTop10VideosThisMonthQuery, GetTop10VideosThisMonthQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetTop10VideosThisMonthQuery, GetTop10VideosThisMonthQueryVariables>(
    GetTop10VideosThisMonthDocument,
    options
  )
}
export type GetTop10VideosThisMonthQueryHookResult = ReturnType<typeof useGetTop10VideosThisMonthQuery>
export type GetTop10VideosThisMonthLazyQueryHookResult = ReturnType<typeof useGetTop10VideosThisMonthLazyQuery>
export type GetTop10VideosThisMonthQueryResult = Apollo.QueryResult<
  GetTop10VideosThisMonthQuery,
  GetTop10VideosThisMonthQueryVariables
>
export const AddVideoViewDocument = gql`
  mutation AddVideoView($videoId: ID!, $channelId: ID!, $categoryId: ID) {
    addVideoView(videoId: $videoId, channelId: $channelId, categoryId: $categoryId) {
      id
      views
    }
  }
`
export type AddVideoViewMutationFn = Apollo.MutationFunction<AddVideoViewMutation, AddVideoViewMutationVariables>

/**
 * __useAddVideoViewMutation__
 *
 * To run a mutation, you first call `useAddVideoViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddVideoViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addVideoViewMutation, { data, loading, error }] = useAddVideoViewMutation({
 *   variables: {
 *      videoId: // value for 'videoId'
 *      channelId: // value for 'channelId'
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useAddVideoViewMutation(
  baseOptions?: Apollo.MutationHookOptions<AddVideoViewMutation, AddVideoViewMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddVideoViewMutation, AddVideoViewMutationVariables>(AddVideoViewDocument, options)
}
export type AddVideoViewMutationHookResult = ReturnType<typeof useAddVideoViewMutation>
export type AddVideoViewMutationResult = Apollo.MutationResult<AddVideoViewMutation>
export type AddVideoViewMutationOptions = Apollo.BaseMutationOptions<
  AddVideoViewMutation,
  AddVideoViewMutationVariables
>
