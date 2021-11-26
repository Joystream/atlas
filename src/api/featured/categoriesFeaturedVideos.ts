import { QueryHookOptions } from '@apollo/client'

import { VideoFieldsFragment } from '@/api/queries'
import {
  GetAllCategoriesFeaturedVideosQuery,
  GetAllCategoriesFeaturedVideosQueryVariables,
  GetCategoriesFeaturedVideosQuery,
  GetCategoriesFeaturedVideosQueryVariables,
  useGetAllCategoriesFeaturedVideosQuery,
  useGetCategoriesFeaturedVideosQuery,
} from '@/api/queries/__generated__/featured.generated'

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

export const useCategoriesFeaturedVideos = (
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
