import { useCategories } from '@/api/hooks/categories'
import { videoCategories } from '@/config/categories'

export const useCategoriesMatch = () => {
  const { categories } = useCategories()

  return (
    categories?.map((category) => ({
      ...videoCategories[category.id],
      ...category,
    })) || []
  )
}

export const useCategoryMatch = (categoryId?: string) => {
  const categories = useCategoriesMatch()

  return categories.find((category) => category.id === categoryId)
}
