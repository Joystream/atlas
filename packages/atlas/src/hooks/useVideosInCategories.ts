import { useCategories } from '@/api/hooks/categories'
import { VideoCategoryData } from '@/config/categories'

export const useVideosInCategories = () => {
  const { categories } = useCategories()

  return (category: VideoCategoryData) =>
    categories?.reduce((previousValue, currentValue) => {
      if (category.videoCategories.includes(currentValue.id)) {
        return previousValue + currentValue.activeVideosCounter
      }
      return previousValue
    }, 0) || 0
}
