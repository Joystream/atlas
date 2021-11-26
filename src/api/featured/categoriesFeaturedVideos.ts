import { QueryHookOptions, useApolloClient } from '@apollo/client'
import { useMemo } from 'react'

import { useVideos } from '@/api/hooks'
import { VideoFieldsFragment } from '@/api/queries'
import {
  GetAllCategoriesFeaturedVideosDocument,
  GetAllCategoriesFeaturedVideosQuery,
  GetAllCategoriesFeaturedVideosQueryVariables,
  GetCategoriesFeaturedVideosQuery,
  GetCategoriesFeaturedVideosQueryVariables,
  useGetAllCategoriesFeaturedVideosQuery,
  useGetCategoriesFeaturedVideosQuery,
} from '@/api/queries/__generated__/featured.generated'
import { createLookup } from '@/utils/data'

import { useGenericFeaturedData } from './helpers'

export type CategoriesFeaturedVideos = Record<
  string,
  Array<VideoFieldsFragment & { videoCutUrl?: string | null }> | undefined
>

export const useAllCategoriesFeaturedVideos = (
  opts?: QueryHookOptions<GetAllCategoriesFeaturedVideosQuery, GetAllCategoriesFeaturedVideosQueryVariables>
) => {
  const { data, ...rest } = useGetAllCategoriesFeaturedVideosQuery({ ...opts })

  return {
    allCategoriesFeaturedVideos: data?.allCategoriesFeaturedVideos,
    ...rest,
  }
}

// TODO: hook to only fetch a single category featured videos
export const useCategoriesFeaturedVideos = (): CategoriesFeaturedVideos | null => {
  const client = useApolloClient()
  const fetchCategoriesFeaturedVideos = useMemo(
    () => async () =>
      (await client.query<GetAllCategoriesFeaturedVideosQuery>({ query: GetAllCategoriesFeaturedVideosDocument })).data
        .allCategoriesFeaturedVideos,
    [client]
  )
  const { data: rawData } = useGenericFeaturedData('categories-featured-videos', fetchCategoriesFeaturedVideos)

  const allVideosIds = rawData?.reduce((acc, cur) => [...acc, ...cur.videos.map((v) => v.videoId)], [] as string[])
  const { videos } = useVideos(
    { limit: allVideosIds?.length, where: { id_in: allVideosIds } },
    { skip: !allVideosIds || !allVideosIds.length }
  )
  const videosLookup = createLookup(videos || [])
  const categoriesLookup = rawData?.reduce((acc, cur) => {
    acc[cur.categoryId] = cur.videos.map((v) => ({ ...videosLookup[v.videoId], videoCutUrl: v.videoCutUrl }))
    return acc
  }, {} as CategoriesFeaturedVideos)

  return (rawData && videos && categoriesLookup) ?? null
}

export const useCategoriesFeaturedVideos1 = (
  id: string,
  opts?: QueryHookOptions<GetCategoriesFeaturedVideosQuery, GetCategoriesFeaturedVideosQueryVariables>
) => {
  const { data, ...rest } = useGetCategoriesFeaturedVideosQuery({
    ...opts,
    variables: {
      categoryId: id,
    },
  })
  return {
    categoriesFeaturedVideos: data?.categoryFeaturedVideos,
    ...rest,
  }
}
