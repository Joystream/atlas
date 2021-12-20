import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { VideoFieldsFragmentDoc } from './videos.generated'

const defaultOptions = {}
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
      title?: Types.Maybe<string>
      description?: Types.Maybe<string>
      views: number
      duration?: Types.Maybe<number>
      createdAt: Date
      isPublic?: Types.Maybe<boolean>
      isExplicit?: Types.Maybe<boolean>
      isFeatured: boolean
      hasMarketing?: Types.Maybe<boolean>
      isCensored: boolean
      publishedBeforeJoystream?: Types.Maybe<Date>
      mediaUrls: Array<string>
      mediaAvailability: Types.AssetAvailability
      thumbnailPhotoUrls: Array<string>
      thumbnailPhotoAvailability: Types.AssetAvailability
      category?: Types.Maybe<{ __typename?: 'VideoCategory'; id: string }>
      language?: Types.Maybe<{ __typename?: 'Language'; iso: string }>
      mediaMetadata?: Types.Maybe<{
        __typename?: 'VideoMediaMetadata'
        id: string
        pixelHeight?: Types.Maybe<number>
        pixelWidth?: Types.Maybe<number>
      }>
      mediaDataObject?: Types.Maybe<{
        __typename?: 'DataObject'
        id: string
        createdAt: Date
        size: number
        liaisonJudgement: Types.LiaisonJudgement
        ipfsContentId: string
        joystreamContentId: string
        liaison?: Types.Maybe<{
          __typename?: 'Worker'
          id: string
          workerId: string
          metadata?: Types.Maybe<string>
          isActive: boolean
          type: Types.WorkerType
        }>
      }>
      thumbnailPhotoDataObject?: Types.Maybe<{
        __typename?: 'DataObject'
        id: string
        createdAt: Date
        size: number
        liaisonJudgement: Types.LiaisonJudgement
        ipfsContentId: string
        joystreamContentId: string
        liaison?: Types.Maybe<{
          __typename?: 'Worker'
          id: string
          workerId: string
          metadata?: Types.Maybe<string>
          isActive: boolean
          type: Types.WorkerType
        }>
      }>
      channel?: Types.Maybe<{
        __typename?: 'Channel'
        id: string
        title?: Types.Maybe<string>
        createdAt: Date
        views: number
        follows: number
        avatarPhotoUrls: Array<string>
        avatarPhotoAvailability: Types.AssetAvailability
        avatarPhotoDataObject?: Types.Maybe<{
          __typename?: 'DataObject'
          id: string
          createdAt: Date
          size: number
          liaisonJudgement: Types.LiaisonJudgement
          ipfsContentId: string
          joystreamContentId: string
          liaison?: Types.Maybe<{
            __typename?: 'Worker'
            id: string
            workerId: string
            metadata?: Types.Maybe<string>
            isActive: boolean
            type: Types.WorkerType
          }>
        }>
      }>
      license?: Types.Maybe<{
        __typename?: 'License'
        id: string
        code?: Types.Maybe<number>
        attribution?: Types.Maybe<string>
        customText?: Types.Maybe<string>
      }>
    }
  }
}

export type GetAllCategoriesFeaturedVideosQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetAllCategoriesFeaturedVideosQuery = {
  __typename?: 'Query'
  allCategoriesFeaturedVideos: Array<{
    __typename?: 'CategoryFeaturedVideos'
    categoryId: string
    category: { __typename?: 'VideoCategory'; name?: Types.Maybe<string> }
    videos: Array<{
      __typename?: 'FeaturedVideo'
      videoId: string
      videoCutUrl?: Types.Maybe<string>
      video: {
        __typename?: 'Video'
        id: string
        title?: Types.Maybe<string>
        description?: Types.Maybe<string>
        views: number
        duration?: Types.Maybe<number>
        createdAt: Date
        isPublic?: Types.Maybe<boolean>
        isExplicit?: Types.Maybe<boolean>
        isFeatured: boolean
        hasMarketing?: Types.Maybe<boolean>
        isCensored: boolean
        publishedBeforeJoystream?: Types.Maybe<Date>
        mediaUrls: Array<string>
        mediaAvailability: Types.AssetAvailability
        thumbnailPhotoUrls: Array<string>
        thumbnailPhotoAvailability: Types.AssetAvailability
        category?: Types.Maybe<{ __typename?: 'VideoCategory'; id: string }>
        language?: Types.Maybe<{ __typename?: 'Language'; iso: string }>
        mediaMetadata?: Types.Maybe<{
          __typename?: 'VideoMediaMetadata'
          id: string
          pixelHeight?: Types.Maybe<number>
          pixelWidth?: Types.Maybe<number>
        }>
        mediaDataObject?: Types.Maybe<{
          __typename?: 'DataObject'
          id: string
          createdAt: Date
          size: number
          liaisonJudgement: Types.LiaisonJudgement
          ipfsContentId: string
          joystreamContentId: string
          liaison?: Types.Maybe<{
            __typename?: 'Worker'
            id: string
            workerId: string
            metadata?: Types.Maybe<string>
            isActive: boolean
            type: Types.WorkerType
          }>
        }>
        thumbnailPhotoDataObject?: Types.Maybe<{
          __typename?: 'DataObject'
          id: string
          createdAt: Date
          size: number
          liaisonJudgement: Types.LiaisonJudgement
          ipfsContentId: string
          joystreamContentId: string
          liaison?: Types.Maybe<{
            __typename?: 'Worker'
            id: string
            workerId: string
            metadata?: Types.Maybe<string>
            isActive: boolean
            type: Types.WorkerType
          }>
        }>
        channel?: Types.Maybe<{
          __typename?: 'Channel'
          id: string
          title?: Types.Maybe<string>
          createdAt: Date
          views: number
          follows: number
          avatarPhotoUrls: Array<string>
          avatarPhotoAvailability: Types.AssetAvailability
          avatarPhotoDataObject?: Types.Maybe<{
            __typename?: 'DataObject'
            id: string
            createdAt: Date
            size: number
            liaisonJudgement: Types.LiaisonJudgement
            ipfsContentId: string
            joystreamContentId: string
            liaison?: Types.Maybe<{
              __typename?: 'Worker'
              id: string
              workerId: string
              metadata?: Types.Maybe<string>
              isActive: boolean
              type: Types.WorkerType
            }>
          }>
        }>
        license?: Types.Maybe<{
          __typename?: 'License'
          id: string
          code?: Types.Maybe<number>
          attribution?: Types.Maybe<string>
          customText?: Types.Maybe<string>
        }>
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
    videoCutUrl?: Types.Maybe<string>
    video: {
      __typename?: 'Video'
      id: string
      title?: Types.Maybe<string>
      description?: Types.Maybe<string>
      views: number
      duration?: Types.Maybe<number>
      createdAt: Date
      isPublic?: Types.Maybe<boolean>
      isExplicit?: Types.Maybe<boolean>
      isFeatured: boolean
      hasMarketing?: Types.Maybe<boolean>
      isCensored: boolean
      publishedBeforeJoystream?: Types.Maybe<Date>
      mediaUrls: Array<string>
      mediaAvailability: Types.AssetAvailability
      thumbnailPhotoUrls: Array<string>
      thumbnailPhotoAvailability: Types.AssetAvailability
      category?: Types.Maybe<{ __typename?: 'VideoCategory'; id: string }>
      language?: Types.Maybe<{ __typename?: 'Language'; iso: string }>
      mediaMetadata?: Types.Maybe<{
        __typename?: 'VideoMediaMetadata'
        id: string
        pixelHeight?: Types.Maybe<number>
        pixelWidth?: Types.Maybe<number>
      }>
      mediaDataObject?: Types.Maybe<{
        __typename?: 'DataObject'
        id: string
        createdAt: Date
        size: number
        liaisonJudgement: Types.LiaisonJudgement
        ipfsContentId: string
        joystreamContentId: string
        liaison?: Types.Maybe<{
          __typename?: 'Worker'
          id: string
          workerId: string
          metadata?: Types.Maybe<string>
          isActive: boolean
          type: Types.WorkerType
        }>
      }>
      thumbnailPhotoDataObject?: Types.Maybe<{
        __typename?: 'DataObject'
        id: string
        createdAt: Date
        size: number
        liaisonJudgement: Types.LiaisonJudgement
        ipfsContentId: string
        joystreamContentId: string
        liaison?: Types.Maybe<{
          __typename?: 'Worker'
          id: string
          workerId: string
          metadata?: Types.Maybe<string>
          isActive: boolean
          type: Types.WorkerType
        }>
      }>
      channel?: Types.Maybe<{
        __typename?: 'Channel'
        id: string
        title?: Types.Maybe<string>
        createdAt: Date
        views: number
        follows: number
        avatarPhotoUrls: Array<string>
        avatarPhotoAvailability: Types.AssetAvailability
        avatarPhotoDataObject?: Types.Maybe<{
          __typename?: 'DataObject'
          id: string
          createdAt: Date
          size: number
          liaisonJudgement: Types.LiaisonJudgement
          ipfsContentId: string
          joystreamContentId: string
          liaison?: Types.Maybe<{
            __typename?: 'Worker'
            id: string
            workerId: string
            metadata?: Types.Maybe<string>
            isActive: boolean
            type: Types.WorkerType
          }>
        }>
      }>
      license?: Types.Maybe<{
        __typename?: 'License'
        id: string
        code?: Types.Maybe<number>
        attribution?: Types.Maybe<string>
        customText?: Types.Maybe<string>
      }>
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
        ...VideoFields
      }
    }
  }
  ${VideoFieldsFragmentDoc}
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
    allCategoriesFeaturedVideos {
      categoryId
      category {
        name
      }
      videos {
        videoId
        videoCutUrl
        video {
          ...VideoFields
        }
      }
    }
  }
  ${VideoFieldsFragmentDoc}
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
        ...VideoFields
      }
    }
  }
  ${VideoFieldsFragmentDoc}
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
