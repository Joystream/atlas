import styled from '@emotion/styled'
import React from 'react'

import { Grid2, GridItem } from '@/shared/components'

export const GridTesting = () => {
  return (
    <div>
      <Grid2 gap={[8, 16, 24, 32, 48]} cols={[2, 4, 6, 8, 10]}>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem colSpan={2} rowSpan={2}></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
        <StyledGridItem></StyledGridItem>
      </Grid2>
    </div>
  )
}

const StyledGridItem = styled(GridItem)`
  height: 600px;
  background-color: red;
`
