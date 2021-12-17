import styled from '@emotion/styled'
import React from 'react'

import { GridItem, LayoutGrid } from '@/components/LayoutGrid'

export const GridTesting = () => {
  return (
    <div>
      <LayoutGrid>
        <StyledGridItem />
        <StyledGridItem />
        <StyledGridItem />
        <StyledGridItem />
        <StyledGridItem />
        <StyledGridItem colStart={{ xl: 7 }} colSpan={{ sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }} />
      </LayoutGrid>
    </div>
  )
}

const StyledGridItem = styled(GridItem)`
  height: 600px;
  background-color: red;
`
