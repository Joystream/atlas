import styled from '@emotion/styled'
import React from 'react'

import { GridItem, GridLayout } from '@/shared/components'

export const GridTesting = () => {
  return (
    <div>
      <GridLayout>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem
          colStart={{ xlarge: 7 }}
          colSpan={{ small: 2, medium: 3, large: 4, xlarge: 5, xxlarge: 6 }}
        ></StyledGridItem>
      </GridLayout>
    </div>
  )
}

const StyledGridItem = styled(GridItem)`
  height: 600px;
  background-color: red;
`
