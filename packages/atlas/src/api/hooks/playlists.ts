import { QueryHookOptions } from '@apollo/client'

import {
  GetPlaylistQuery,
  GetPlaylistQueryVariables,
  GetPlaylistsQuery,
  GetPlaylistsQueryVariables,
  useGetPlaylistQuery,
  useGetPlaylistsQuery,
} from '@/api/queries'

export const usePlaylist = (id?: string, opts?: QueryHookOptions<GetPlaylistQuery, GetPlaylistQueryVariables>) => {
  const { data, ...queryRest } = useGetPlaylistQuery({
    variables: { where: { id: id || '' } },
    skip: !id,
    ...opts,
  })
  return {
    playlist: data?.playlistByUniqueInput,
    ...queryRest,
  }
}

export const useBasicPlaylists = (
  variables: GetPlaylistsQueryVariables,
  opts?: QueryHookOptions<GetPlaylistsQuery, GetPlaylistsQueryVariables>
) => {
  const { data, ...rest } = useGetPlaylistsQuery({ ...opts, variables })

  return {
    data: data?.playlists,
    ...rest,
  }
}
