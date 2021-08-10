import styled from '@emotion/styled'
import React from 'react'

import { Grid2, GridItem } from '@/shared/components'

export const GridTesting = () => {
  return (
    <div>
      <Grid2 gap={[24, 48, 56, 100]} cols={10}>
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
