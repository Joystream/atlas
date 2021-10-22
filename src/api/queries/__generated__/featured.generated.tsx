import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'

const defaultOptions = {}
export type GetVideoHeroQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetVideoHeroQuery = {
  __typename?: 'Query'
  videoHero: { __typename?: 'VideoHero'; videoId: string; heroTitle: string; heroVideoCutUrl: string }
}

export type GetCategoriesFeaturedVideosQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetCategoriesFeaturedVideosQuery = {
  __typename?: 'Query'
  allCategoriesFeaturedVideos: Array<{
    __typename?: 'CategoryFeaturedVideos'
    categoryId: string
    videos: Array<{ __typename?: 'FeaturedVideo'; videoId: string; videoCutUrl?: Types.Maybe<string> }>
  }>
}

export const GetVideoHeroDocument = gql`
  query GetVideoHero {
    videoHero {
      videoId
      heroTitle
      heroVideoCutUrl
    }
  }
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
export const GetCategoriesFeaturedVideosDocument = gql`
  query GetCategoriesFeaturedVideos {
    allCategoriesFeaturedVideos {
      categoryId
      videos {
        videoId
        videoCutUrl
      }
    }
  }
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
 *   },
 * });
 */
export function useGetCategoriesFeaturedVideosQuery(
  baseOptions?: Apollo.QueryHookOptions<GetCategoriesFeaturedVideosQuery, GetCategoriesFeaturedVideosQueryVariables>
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
