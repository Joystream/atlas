import { QueryHookOptions } from '@apollo/client'

import {
  GetAllCategoriesFeaturedVideosQuery,
  GetAllCategoriesFeaturedVideosQueryVariables,
  GetCategoriesFeaturedVideosQuery,
  GetCategoriesFeaturedVideosQueryVariables,
  useGetAllCategoriesFeaturedVideosQuery,
  useGetCategoriesFeaturedVideosQuery,
} from '@/api/queries/__generated__/featured.generated'

export const useAllCategoriesFeaturedVideos = (
  opts?: QueryHookOptions<GetAllCategoriesFeaturedVideosQuery, GetAllCategoriesFeaturedVideosQueryVariables>
) => {
  const { data, ...rest } = useGetAllCategoriesFeaturedVideosQuery({ ...opts })

  return {
    allCategoriesFeaturedVideos: data?.videoCategories,
    ...rest,
  }
}

export const useCategoriesFeaturedVideos = (
  categoryId: string,
  opts?: QueryHookOptions<GetCategoriesFeaturedVideosQuery, GetCategoriesFeaturedVideosQueryVariables>
) => {
  const { data, ...rest } = useGetCategoriesFeaturedVideosQuery({
    ...opts,
    variables: {
      categoryId,
    },
  })
  return {
    categoriesFeaturedVideos: data?.videoCategoryById?.featuredVideos,
    ...rest,
  }
}
