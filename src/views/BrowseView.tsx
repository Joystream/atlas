import React, { useState } from 'react'
import styled from '@emotion/styled'
import { RouteComponentProps } from '@reach/router'
import { ErrorBoundary } from '@sentry/react'
import { useQuery } from '@apollo/client'

import { ErrorFallback } from '@/components'
import { CategoryPicker, InfiniteVideoGrid, Typography } from '@/shared/components'
import { NAVBAR_HEIGHT } from '@/components/Navbar'
import { ReactComponent as BackgroundPattern } from '@/assets/browse-bg-pattern.svg'
import { colors, sizes } from '@/shared/theme'
import { GET_CATEGORIES } from '@/api/queries'
import { GetCategories } from '@/api/queries/__generated__/GetCategories'
import { CategoryFields } from '@/api/queries/__generated__/CategoryFields'

const BrowseView: React.FC<RouteComponentProps> = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { loading: categoriesLoading, data: categoriesData, error: categoriesError } = useQuery<GetCategories>(
    GET_CATEGORIES,
    {
      onCompleted: (data) => handleCategoryChange(data.categories[0]),
    }
  )

  const handleCategoryChange = (category: CategoryFields) => {
    setSelectedCategoryId(category.id)
  }

  if (categoriesError) {
    throw categoriesError
  }

  return (
    <Container>
      <StyledBackgroundPattern />
      <Header variant="hero">Browse</Header>
      <Typography variant="h5">Topics that may interest you</Typography>
      <StyledCategoryPicker
        categories={categoriesData?.categories}
        loading={categoriesLoading}
        selectedCategoryId={selectedCategoryId}
        onChange={handleCategoryChange}
      />
      <ErrorBoundary fallback={ErrorFallback}>
        <StyledInfiniteVideoGrid categoryId={selectedCategoryId || undefined} ready={!!selectedCategoryId} />
      </ErrorBoundary>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  padding-top: ${sizes(14)};
`

const StyledBackgroundPattern = styled(BackgroundPattern)`
  position: absolute;
  right: 0;
`

const Header = styled(Typography)`
  margin: 0 0 ${sizes(10)} 0;
`

const StyledCategoryPicker = styled(CategoryPicker)`
  z-index: 10;
  position: sticky;
  /*Offset Category Picker by Navbar Height */
  top: ${NAVBAR_HEIGHT}px;
  padding: ${sizes(5)} ${sizes(8)} ${sizes(2)};
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  background-color: ${colors.black};
`
const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  padding-top: ${sizes(2)};
`
export default BrowseView
