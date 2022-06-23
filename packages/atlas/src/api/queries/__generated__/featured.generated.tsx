import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicVideoFieldsFragmentDoc, FullVideoFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetVideoHeroQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetVideoHeroQuery = {
  __typename?: 'Query'
  videoHero: {
    __typename?: 'VideoHero'
    videoId: string
    heroTitle: string
    heroVideoCutUrl: string
    heroPosterUrl: string
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
}

export type GetAllCategoriesFeaturedVideosQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetAllCategoriesFeaturedVideosQuery = {
  __typename?: 'Query'
  allCategoriesFeaturedVideos: Array<{
    __typename?: 'CategoryFeaturedVideos'
    categoryId: string
    category: { __typename?: 'VideoCategory'; name?: string | null }
    categoryFeaturedVideos: Array<{
      __typename?: 'FeaturedVideo'
      videoId: string
      videoCutUrl?: string | null
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
    }>
  }>
}

export type GetCategoriesFeaturedVideosQueryVariables = Types.Exact<{
  categoryId: Types.Scalars['ID']
}>

export type GetCategoriesFeaturedVideosQuery = {
  __typename?: 'Query'
  categoryFeaturedVideos: Array<{
    __typename?: 'FeaturedVideo'
    videoId: string
    videoCutUrl?: string | null
    video: {
      __typename?: 'Video'
      id: string
      title?: string | null
      description?: string | null
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
}

export const GetVideoHeroDocument = gql`
  query GetVideoHero {
    videoHero {
      videoId
      heroTitle
      heroVideoCutUrl
      heroPosterUrl
      video {
        ...BasicVideoFields
      }
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetVideoHeroQuery__
 *
 * To run a query within a React component, call `useGetVideoHeroQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVideoHeroQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVideoHeroQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVideoHeroQuery(
  baseOptions?: Apollo.QueryHookOptions<GetVideoHeroQuery, GetVideoHeroQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetVideoHeroQuery, GetVideoHeroQueryVariables>(GetVideoHeroDocument, options)
}
export function useGetVideoHeroLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetVideoHeroQuery, GetVideoHeroQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetVideoHeroQuery, GetVideoHeroQueryVariables>(GetVideoHeroDocument, options)
}
export type GetVideoHeroQueryHookResult = ReturnType<typeof useGetVideoHeroQuery>
export type GetVideoHeroLazyQueryHookResult = ReturnType<typeof useGetVideoHeroLazyQuery>
export type GetVideoHeroQueryResult = Apollo.QueryResult<GetVideoHeroQuery, GetVideoHeroQueryVariables>
export const GetAllCategoriesFeaturedVideosDocument = gql`
  query GetAllCategoriesFeaturedVideos {
    allCategoriesFeaturedVideos(videosLimit: 3) {
      categoryId
      category {
        name
      }
      categoryFeaturedVideos {
        videoId
        videoCutUrl
        video {
          ...BasicVideoFields
        }
      }
    }
  }
  ${BasicVideoFieldsFragmentDoc}
`

/**
 * __useGetAllCategoriesFeaturedVideosQuery__
 *
 * To run a query within a React component, call `useGetAllCategoriesFeaturedVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCategoriesFeaturedVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCategoriesFeaturedVideosQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCategoriesFeaturedVideosQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAllCategoriesFeaturedVideosQuery,
    GetAllCategoriesFeaturedVideosQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetAllCategoriesFeaturedVideosQuery, GetAllCategoriesFeaturedVideosQueryVariables>(
    GetAllCategoriesFeaturedVideosDocument,
    options
  )
}
export function useGetAllCategoriesFeaturedVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAllCategoriesFeaturedVideosQuery,
    GetAllCategoriesFeaturedVideosQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetAllCategoriesFeaturedVideosQuery, GetAllCategoriesFeaturedVideosQueryVariables>(
    GetAllCategoriesFeaturedVideosDocument,
    options
  )
}
export type GetAllCategoriesFeaturedVideosQueryHookResult = ReturnType<typeof useGetAllCategoriesFeaturedVideosQuery>
export type GetAllCategoriesFeaturedVideosLazyQueryHookResult = ReturnType<
  typeof useGetAllCategoriesFeaturedVideosLazyQuery
>
export type GetAllCategoriesFeaturedVideosQueryResult = Apollo.QueryResult<
  GetAllCategoriesFeaturedVideosQuery,
  GetAllCategoriesFeaturedVideosQueryVariables
>
export const GetCategoriesFeaturedVideosDocument = gql`
  query GetCategoriesFeaturedVideos($categoryId: ID!) {
    categoryFeaturedVideos(categoryId: $categoryId) {
      videoId
      videoCutUrl
      video {
        ...FullVideoFields
      }
    }
  }
  ${FullVideoFieldsFragmentDoc}
`

/**
 * __useGetCategoriesFeaturedVideosQuery__
 *
 * To run a query within a React component, call `useGetCategoriesFeaturedVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesFeaturedVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesFeaturedVideosQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useGetCategoriesFeaturedVideosQuery(
  baseOptions: Apollo.QueryHookOptions<GetCategoriesFeaturedVideosQuery, GetCategoriesFeaturedVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCategoriesFeaturedVideosQuery, GetCategoriesFeaturedVideosQueryVariables>(
    GetCategoriesFeaturedVideosDocument,
    options
  )
}
export function useGetCategoriesFeaturedVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesFeaturedVideosQuery, GetCategoriesFeaturedVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCategoriesFeaturedVideosQuery, GetCategoriesFeaturedVideosQueryVariables>(
    GetCategoriesFeaturedVideosDocument,
    options
  )
}
export type GetCategoriesFeaturedVideosQueryHookResult = ReturnType<typeof useGetCategoriesFeaturedVideosQuery>
export type GetCategoriesFeaturedVideosLazyQueryHookResult = ReturnType<typeof useGetCategoriesFeaturedVideosLazyQuery>
export type GetCategoriesFeaturedVideosQueryResult = Apollo.QueryResult<
  GetCategoriesFeaturedVideosQuery,
  GetCategoriesFeaturedVideosQueryVariables
>
