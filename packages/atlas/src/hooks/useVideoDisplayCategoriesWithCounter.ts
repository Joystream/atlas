import { useMemo } from 'react'

import { useQnCategories } from '@/api/hooks/categories'
import { allUniqueVideoCategories, displayCategories } from '@/config/categories'

export const useVideoDisplayCategoriesWithCounter = () => {
  const { categories, loading } = useQnCategories()

  const totalVideosCount = useMemo(() => {
    if (!categories) {
      return
    }
    const filteredCategories = categories?.filter((category) => allUniqueVideoCategories.includes(category.category.id))
    return filteredCategories.reduce((acc, cur) => acc + cur.activeVideosCount, 0)
  }, [categories])

  const displayCategoriesWithCounter = useMemo(
    () =>
      displayCategories.map((displayCategory) => ({
        ...displayCategory,
        activeVideosCounter:
          categories?.reduce((previousValue, currentValue) => {
            if (displayCategory.videoCategories.includes(currentValue.category.id)) {
              return previousValue + currentValue.activeVideosCount
            }
            return previousValue
          }, 0) || 0,
      })),
    [categories]
  )

  return {
    displayCategoriesWithCounter,
    totalVideosCount,
    loading,
  }
}
