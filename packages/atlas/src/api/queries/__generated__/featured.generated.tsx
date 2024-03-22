import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicVideoFeaturedInCategoryFragmentDoc, BasicVideoFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetVideoHeroQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetVideoHeroQuery = {
  __typename?: 'Query'
  videoHero?: {
    __typename?: 'VideoHero'
    heroTitle: string
    heroVideoCutUrl: string
    heroPosterUrl: string
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
  } | null
}

export type GetAllCategoriesFeaturedVideosQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetAllCategoriesFeaturedVideosQuery = {
  __typename?: 'Query'
  videoCategories: Array<{
    __typename?: 'VideoCategory'
    id: string
    name?: string | null
    featuredVideos: Array<{
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
    }>
  }>
}

export type GetCategoryFeaturedVideosQueryVariables = Types.Exact<{
  categoryId: Types.Scalars['String']
}>

export type GetCategoryFeaturedVideosQuery = {
  __typename?: 'Query'
  videoCategoryById?: {
    __typename?: 'VideoCategory'
    featuredVideos: Array<{
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
    }>
  } | null
}

export const GetVideoHeroDocument = gql`
  query GetVideoHero {
    videoHero {
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
    videoCategories {
      id
      name
      featuredVideos(limit: 3) {
        ...BasicVideoFeaturedInCategory
      }
    }
  }
  ${BasicVideoFeaturedInCategoryFragmentDoc}
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
export const GetCategoryFeaturedVideosDocument = gql`
  query GetCategoryFeaturedVideos($categoryId: String!) {
    videoCategoryById(id: $categoryId) {
      featuredVideos {
        ...BasicVideoFeaturedInCategory
      }
    }
  }
  ${BasicVideoFeaturedInCategoryFragmentDoc}
`

/**
 * __useGetCategoryFeaturedVideosQuery__
 *
 * To run a query within a React component, call `useGetCategoryFeaturedVideosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryFeaturedVideosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryFeaturedVideosQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useGetCategoryFeaturedVideosQuery(
  baseOptions: Apollo.QueryHookOptions<GetCategoryFeaturedVideosQuery, GetCategoryFeaturedVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetCategoryFeaturedVideosQuery, GetCategoryFeaturedVideosQueryVariables>(
    GetCategoryFeaturedVideosDocument,
    options
  )
}
export function useGetCategoryFeaturedVideosLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetCategoryFeaturedVideosQuery, GetCategoryFeaturedVideosQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCategoryFeaturedVideosQuery, GetCategoryFeaturedVideosQueryVariables>(
    GetCategoryFeaturedVideosDocument,
    options
  )
}
export type GetCategoryFeaturedVideosQueryHookResult = ReturnType<typeof useGetCategoryFeaturedVideosQuery>
export type GetCategoryFeaturedVideosLazyQueryHookResult = ReturnType<typeof useGetCategoryFeaturedVideosLazyQuery>
export type GetCategoryFeaturedVideosQueryResult = Apollo.QueryResult<
  GetCategoryFeaturedVideosQuery,
  GetCategoryFeaturedVideosQueryVariables
>
