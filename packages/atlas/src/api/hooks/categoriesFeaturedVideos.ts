import { QueryHookOptions } from '@apollo/client'

import {
  GetAllCategoriesFeaturedVideosQuery,
  GetAllCategoriesFeaturedVideosQueryVariables,
  GetCategoryFeaturedVideosQuery,
  GetCategoryFeaturedVideosQueryVariables,
  useGetAllCategoriesFeaturedVideosQuery,
  useGetCategoryFeaturedVideosQuery,
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
  opts?: QueryHookOptions<GetCategoryFeaturedVideosQuery, GetCategoryFeaturedVideosQueryVariables>
) => {
  const { data, ...rest } = useGetCategoryFeaturedVideosQuery({
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
