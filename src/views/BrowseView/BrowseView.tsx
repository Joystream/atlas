import React, { useState, useRef } from 'react'

import { RouteComponentProps } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'
import { useQuery } from '@apollo/client'
import { useInView } from 'react-intersection-observer'

import { ErrorFallback } from '@/components'
import { Text } from '@/shared/components'
import { NAVBAR_HEIGHT } from '@/components/Navbar'
import {
  StyledCategoryPicker,
  Container,
  StyledInfiniteVideoGrid,
  IntersectionTarget,
  Header,
  StyledBackgroundPattern,
  GRID_TOP_PADDING,
} from './BrowseView.style'
import { GET_CATEGORIES } from '@/api/queries'
import { GetCategories } from '@/api/queries/__generated__/GetCategories'
import { CategoryFields } from '@/api/queries/__generated__/CategoryFields'

const BrowseView: React.FC<RouteComponentProps> = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { loading: categoriesLoading, data: categoriesData, error: categoriesError } = useQuery<GetCategories>(
    GET_CATEGORIES,
    {
      onCompleted: (data) => {
        handleCategoryChange(data.categories[0], false)
      },
    }
  )

  const headerRef = useRef<HTMLHeadingElement>(null)
  const { ref: targetRef, inView } = useInView({
    rootMargin: `-${NAVBAR_HEIGHT - GRID_TOP_PADDING}px 0px 0px`,
  })
  const handleCategoryChange = (category: CategoryFields, scrollTop = true) => {
    setSelectedCategoryId(category.id)
    if (headerRef.current && scrollTop) {
      headerRef.current.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' })
    }
  }

  if (categoriesError) {
    throw categoriesError
  }

  return (
    <Container>
      <StyledBackgroundPattern />
      <Header variant="hero" ref={headerRef}>
        Browse
      </Header>
      <Text variant="h5">Topics that may interest you</Text>
      <IntersectionTarget ref={targetRef} />
      <StyledCategoryPicker
        categories={categoriesData?.categories}
        loading={categoriesLoading}
        selectedCategoryId={selectedCategoryId}
        onChange={handleCategoryChange}
        isAtTop={inView}
      />
      <ErrorBoundary fallback={ErrorFallback}>
        <StyledInfiniteVideoGrid categoryId={selectedCategoryId || undefined} ready={!!selectedCategoryId} />
      </ErrorBoundary>
    </Container>
  )
}

export default BrowseView
