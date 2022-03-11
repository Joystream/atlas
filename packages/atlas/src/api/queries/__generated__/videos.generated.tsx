import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { AllChannelFieldsFragmentDoc, BasicVideoFieldsFragmentDoc, VideoFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetVideoQueryVariables = Types.Exact<{
  where: Types.VideoWhereUniqueInput
}>

export type GetVideoQuery = {
  __typename?: 'Query'
  videoByUniqueInput?: {
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
  } | null
}

export type GetVideosConnectionQueryVariables = Types.Exact<{
  first?: Types.InputMaybe<Types.Scalars['Int']>
  after?: Types.InputMaybe<Types.Scalars['String']>
  orderBy?: Types.VideoOrderByInput
  where?: Types.InputMaybe<Types.VideoWhereInput>
}>

export type GetVideosConnectionQuery = {
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
    }>
    pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
  }
}

export type GetVideosQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']>
  limit?: Types.InputMaybe<Types.Scalars['Int']>
  where?: Types.InputMaybe<Types.VideoWhereInput>
  orderBy?: Types.VideoOrderByInput
}>

export type GetVideosQuery = {
  __typename?: 'Query'
  videos: Array<{
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
  }>
}

export type GetBasicVideosQueryVariables = Types.Exact<{
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
  }>
}

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
  } | null
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

export const GetVideoDocument = gql`
  query GetVideo($where: VideoWhereUniqueInput!) {
    videoByUniqueInput(where: $where) {
      ...VideoFields
    }
  }
  ${VideoFieldsFragmentDoc}
`

/**
 * __useGetVideoQuery__
 *
 * To run a query within a React component, call `useGetVideoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideoQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetVideoQuery(baseOptions: Apollo.QueryHookOptions<GetVideoQuery, GetVideoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetVideoQuery, GetVideoQueryVariables>(GetVideoDocument, options)
}
export function useGetVideoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVideoQuery, GetVideoQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetVideoQuery, GetVideoQueryVariables>(GetVideoDocument, options)
}
export type GetVideoQueryHookResult = ReturnType<typeof useGetVideoQuery>
export type GetVideoLazyQueryHookResult = ReturnType<typeof useGetVideoLazyQuery>
export type GetVideoQueryResult = Apollo.QueryResult<GetVideoQuery, GetVideoQueryVariables>
export const GetVideosConnectionDocument = gql`
  query GetVideosConnection(
    $first: Int
    $after: String
    $orderBy: VideoOrderByInput! = createdAt_DESC
    $where: VideoWhereInput
  ) {
    videosConnection(first: $first, after: $after, where: $where, orderBy: [$orderBy]) {
      edges {
        cursor
        node {
          ...VideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${VideoFieldsFragmentDoc}
`

/**
 * __useGetVideosConnectionQuery__
 *
 * To run a query within a React component, call `useGetVideosConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideosConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideosConnectionQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetVideosConnectionQuery(
  baseOptions?: Apollo.QueryHookOptions<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>(
    GetVideosConnectionDocument,
    options
  )
}
export function useGetVideosConnectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>(
    GetVideosConnectionDocument,
    options
  )
}
export type GetVideosConnectionQueryHookResult = ReturnType<typeof useGetVideosConnectionQuery>
export type GetVideosConnectionLazyQueryHookResult = ReturnType<typeof useGetVideosConnectionLazyQuery>
export type GetVideosConnectionQueryResult = Apollo.QueryResult<
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables
>
export const GetVideosDocument = gql`
  query GetVideos($offset: Int, $limit: Int, $where: VideoWhereInput, $orderBy: VideoOrderByInput! = createdAt_DESC) {
    videos(offset: $offset, limit: $limit, where: $where, orderBy: [$orderBy]) {
      ...VideoFields
    }
  }
  ${VideoFieldsFragmentDoc}
`

/**
 * __useGetVideosQuery__
 *
 * To run a query within a React component, call `useGetVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideosQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetVideosQuery(baseOptions?: Apollo.QueryHookOptions<GetVideosQuery, GetVideosQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetVideosQuery, GetVideosQueryVariables>(GetVideosDocument, options)
}
export function useGetVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideosQuery, GetVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetVideosQuery, GetVideosQueryVariables>(GetVideosDocument, options)
}
export type GetVideosQueryHookResult = ReturnType<typeof useGetVideosQuery>
export type GetVideosLazyQueryHookResult = ReturnType<typeof useGetVideosLazyQuery>
export type GetVideosQueryResult = Apollo.QueryResult<GetVideosQuery, GetVideosQueryVariables>
export const GetBasicVideosDocument = gql`
  query GetBasicVideos($limit: Int, $where: VideoWhereInput, $orderBy: VideoOrderByInput! = createdAt_DESC) {
    videos(limit: $limit, where: $where, orderBy: [$orderBy]) {
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
          ...VideoFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${VideoFieldsFragmentDoc}
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
      ...VideoFields
    }
  }
  ${VideoFieldsFragmentDoc}
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
      ...VideoFields
    }
  }
  ${VideoFieldsFragmentDoc}
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
