import React from 'react'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'

import { CategoryVideos } from './CategoryVideos'

export const CategoryView = () => {
  return (
    <LimitedWidthContainer big>
      <CategoryVideos />
    </LimitedWidthContainer>
  )
}
