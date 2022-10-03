import { useMemo } from 'react'

import { useQnCategories } from '@/api/hooks/categories'
import { displayCategories } from '@/config/categories'

export const useVideoCategoriesWithCounter = () => {
  const { categories } = useQnCategories()

  return useMemo(
    () =>
      displayCategories.map((category) => ({
        ...category,
        activeVideosCounter:
          categories?.reduce((previousValue, currentValue) => {
            if (category.videoCategories.includes(currentValue.id)) {
              return previousValue + currentValue.activeVideosCounter
            }
            return previousValue
          }, 0) || 0,
      })),
    [categories]
  )
}
