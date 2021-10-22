import { useApolloClient } from '@apollo/client'
import { useMemo } from 'react'

import { useVideos } from '@/api/hooks'
import { VideoFieldsFragment } from '@/api/queries'
import {
  GetCategoriesFeaturedVideosDocument,
  GetCategoriesFeaturedVideosQuery,
} from '@/api/queries/__generated__/featured.generated'
import { createLookup } from '@/utils/data'

import { useGenericFeaturedData } from './helpers'

type CategoriesFeaturedVideos = Record<string, (VideoFieldsFragment & { videoCutUrl?: string | null })[]>

export const useCategoriesFeaturedVideos = (): CategoriesFeaturedVideos | null => {
  const client = useApolloClient()
  const fetchCategoriesFeaturedVideos = useMemo(
    () => async () =>
      (await client.query<GetCategoriesFeaturedVideosQuery>({ query: GetCategoriesFeaturedVideosDocument })).data
        .allCategoriesFeaturedVideos,
    [client]
  )
  const { data: rawData } = useGenericFeaturedData('categories-featured-videos', fetchCategoriesFeaturedVideos)

  const allVideosIds = rawData?.reduce((acc, cur) => [...acc, ...cur.videos.map((v) => v.videoId)], [] as string[])
  const { videos } = useVideos({ where: { id_in: allVideosIds } }, { skip: !allVideosIds || !allVideosIds.length })
  const videosLookup = createLookup(videos || [])

  const categoriesLookup = rawData?.reduce((acc, cur) => {
    acc[cur.categoryId] = cur.videos.map((v) => ({ ...videosLookup[v.videoId], videoCutUrl: v.videoCutUrl }))
    return acc
  }, {} as CategoriesFeaturedVideos)

  return (rawData && videos && categoriesLookup) ?? null
}
