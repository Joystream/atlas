import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'

import * as Types from './baseTypes.generated'
import { BasicPlaylistFieldsFragmentDoc } from './fragments.generated'

const defaultOptions = {} as const
export type GetPlaylistsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetPlaylistsQuery = {
  __typename?: 'Query'
  playlists: Array<{
    __typename?: 'Playlist'
    id: string
    title: string
    description: string
    isPublic?: boolean | null
    publicUncensoredVideosCount?: number | null
    publicUncensoredVideosDuration?: number | null
    thumbnailPhoto?: { __typename?: 'StorageDataObject'; id: string } | null
    videos: Array<{ __typename?: 'PlaylistVideo'; video: { __typename?: 'Video'; id: string; title?: string | null } }>
  }>
}

export type GetPlaylistQueryVariables = Types.Exact<{
  where: Types.PlaylistWhereUniqueInput
}>

export type GetPlaylistQuery = {
  __typename?: 'Query'
  playlistByUniqueInput?: {
    __typename?: 'Playlist'
    id: string
    title: string
    description: string
    isPublic?: boolean | null
    publicUncensoredVideosCount?: number | null
    publicUncensoredVideosDuration?: number | null
    thumbnailPhoto?: { __typename?: 'StorageDataObject'; id: string } | null
    videos: Array<{ __typename?: 'PlaylistVideo'; video: { __typename?: 'Video'; id: string; title?: string | null } }>
  } | null
}

export const GetPlaylistsDocument = gql`
  query GetPlaylists {
    playlists {
      ...BasicPlaylistFields
    }
  }
  ${BasicPlaylistFieldsFragmentDoc}
`

/**
 * __useGetPlaylistsQuery__
 *
 * To run a query within a React component, call `useGetPlaylistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaylistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaylistsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPlaylistsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetPlaylistsQuery, GetPlaylistsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPlaylistsQuery, GetPlaylistsQueryVariables>(GetPlaylistsDocument, options)
}
export function useGetPlaylistsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPlaylistsQuery, GetPlaylistsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPlaylistsQuery, GetPlaylistsQueryVariables>(GetPlaylistsDocument, options)
}
export type GetPlaylistsQueryHookResult = ReturnType<typeof useGetPlaylistsQuery>
export type GetPlaylistsLazyQueryHookResult = ReturnType<typeof useGetPlaylistsLazyQuery>
export type GetPlaylistsQueryResult = Apollo.QueryResult<GetPlaylistsQuery, GetPlaylistsQueryVariables>
export const GetPlaylistDocument = gql`
  query GetPlaylist($where: PlaylistWhereUniqueInput!) {
    playlistByUniqueInput(where: $where) {
      ...BasicPlaylistFields
    }
  }
  ${BasicPlaylistFieldsFragmentDoc}
`

/**
 * __useGetPlaylistQuery__
 *
 * To run a query within a React component, call `useGetPlaylistQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaylistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaylistQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useGetPlaylistQuery(baseOptions: Apollo.QueryHookOptions<GetPlaylistQuery, GetPlaylistQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPlaylistQuery, GetPlaylistQueryVariables>(GetPlaylistDocument, options)
}
export function useGetPlaylistLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPlaylistQuery, GetPlaylistQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPlaylistQuery, GetPlaylistQueryVariables>(GetPlaylistDocument, options)
}
export type GetPlaylistQueryHookResult = ReturnType<typeof useGetPlaylistQuery>
export type GetPlaylistLazyQueryHookResult = ReturnType<typeof useGetPlaylistLazyQuery>
export type GetPlaylistQueryResult = Apollo.QueryResult<GetPlaylistQuery, GetPlaylistQueryVariables>
