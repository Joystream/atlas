import React, { useState, useRef } from 'react'
import { Container, StyledToggleButton, StyledPlaceholder } from './CategoryPicker.style'
import { CategoryFields } from '@/api/queries/__generated__/CategoryFields'

type CategoryPickerProps = {
  categories?: CategoryFields[]
  selectedCategoryId: string | null
  loading?: boolean
  onChange: (category: CategoryFields) => void
  className?: string
}

const CATEGORY_PLACEHOLDER_WIDTHS = [80, 170, 120, 110, 80, 170, 120]

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  loading,
  onChange,
  className,
}) => {
  const content =
    !categories || loading
      ? CATEGORY_PLACEHOLDER_WIDTHS.map((width, idx) => (
          <StyledPlaceholder key={`placeholder-${idx}`} width={width} height="48px" />
        ))
      : categories.map((category) => (
          <StyledToggleButton
            key={category.id}
            controlled
            toggled={category.id === selectedCategoryId}
            variant="secondary"
            onClick={() => onChange(category)}
          >
            {category.name}
          </StyledToggleButton>
        ))

  return <Container className={className}>{content}</Container>
}

export default CategoryPicker
