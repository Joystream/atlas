import React from 'react'

import { CategoryVideos } from '@/components/CategoryVideos'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'

export const CategoryView = () => {
  return (
    <LimitedWidthContainer big>
      <CategoryVideos />
    </LimitedWidthContainer>
  )
}
