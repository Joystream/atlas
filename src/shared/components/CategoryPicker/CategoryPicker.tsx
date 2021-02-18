import React from 'react'
import { Container, StyledToggleButton, StyledPlaceholder } from './CategoryPicker.style'
import { CategoryFieldsFragment } from '@/api/queries'

type CategoryPickerProps = {
  categories?: CategoryFieldsFragment[]
  selectedCategoryId: string | null
  loading?: boolean
  onChange: (categoryId: string | null) => void
  className?: string
}

export const ALL_CATEGORY = {
  __typename: 'Category',
  id: null,
  name: 'All',
}

const CATEGORY_PLACEHOLDER_WIDTHS = [80, 170, 120, 110, 80, 170, 120]

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  loading,
  onChange,
  className,
}) => {
  const displayedCategories = [ALL_CATEGORY, ...(categories || [])]

  const handleCategoryChange = (categoryId: string | null) => {
    onChange(categoryId === ALL_CATEGORY.id ? null : categoryId)
  }
  const isLoading = !categories || !!loading
  return (
    <Container className={className}>
      {isLoading
        ? CATEGORY_PLACEHOLDER_WIDTHS.map((width, idx) => (
            <StyledPlaceholder key={`placeholder-${idx}`} width={width} height="48px" />
          ))
        : displayedCategories.map((category) => (
            <StyledToggleButton
              key={category.id}
              controlled
              toggled={category.id === selectedCategoryId}
              variant="secondary"
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </StyledToggleButton>
          ))}
    </Container>
  )
}

export default CategoryPicker
