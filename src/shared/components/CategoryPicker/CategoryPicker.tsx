import React from 'react'

import { VideoCategoryFieldsFragment } from '@/api/queries'

import { Container, StyledToggleButton, StyledPlaceholder } from './CategoryPicker.style'

type CategoryPickerProps = {
  categories?: VideoCategoryFieldsFragment[]
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

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
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
              onClick={() => handleCategoryChange(category.id)}
              size="large"
            >
              {category.name || ''}
            </StyledToggleButton>
          ))}
    </Container>
  )
}
