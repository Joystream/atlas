import styled from '@emotion/styled'
import React from 'react'

import { GridItem, LayoutGrid } from '@/shared/components/LayoutGrid'

export const GridTesting = () => {
  return (
    <div>
      <LayoutGrid>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem
          colStart={{ xlarge: 7 }}
          colSpan={{ small: 2, medium: 3, large: 4, xlarge: 5, xxlarge: 6 }}
        ></StyledGridItem>
      </LayoutGrid>
    </div>
  )
}

const StyledGridItem = styled(GridItem)`
  height: 600px;
  background-color: red;
`
