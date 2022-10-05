import { useMemo } from 'react'

import { useQnCategories } from '@/api/hooks/categories'
import { allUniqueVideoCategories, displayCategories } from '@/config/categories'

export const useVideoDisplayCategoriesWithCounter = () => {
  const { categories, loading } = useQnCategories()

  const totalVideosCount = useMemo(() => {
    if (!categories) {
      return
    }
    const filteredCategories = categories?.filter((category) => allUniqueVideoCategories.includes(category.id))
    return filteredCategories.reduce((acc, cur) => acc + cur.activeVideosCounter, 0)
  }, [categories])

  const displayCategoriesWithCounter = useMemo(
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

  return {
    displayCategoriesWithCounter,
    totalVideosCount,
    loading,
  }
}
