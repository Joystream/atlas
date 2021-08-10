import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'

import { media } from '@/shared/theme'

// lenght = amount of media queries
type ReponsivenessArray = Array<number | null> & { length: 7 }

type GridProps = {
  gap?: number | ReponsivenessArray
  cols?: number | ReponsivenessArray
}

// // what do we name this?
// export const Grid2: React.FC<GridProps> = ({ gap, cols }) => {
//   return <GridStyles />
// }

const gridStyles = (props: GridProps) => {
  const stylesArr: SerializedStyles[] = []
  const propToCSSRulesArray: Record<keyof GridProps, string> = {
    gap: 'grid-gap:',
    cols: '',
  }

  Object.entries(propToCSSRulesArray).forEach((entry, index) => {
    const propValue = props[entry[0] as keyof GridProps]
    const cssRule = entry[1]
    console.log({ propValue, entry, gap: props['gap'], props })
    const queries = Object.values(media)

    if (Array.isArray(propValue)) {
      propValue.forEach((gapValue, index) => {
        stylesArr.push(css`
          ${queries[index]} {
            /* @ts-styled-plugin-ignore */
            ${cssRule}${gapValue}px;
          }
        `)
      })
    } else {
      stylesArr.push(
        css`
          grid-gap: ${propValue}px;
        `
      )
    }
  })

  return stylesArr
}

export const Grid2 = styled.div<GridProps>`
  display: grid;
  ${({ cols }) => cols && `grid-template-columns: repeat(${cols}, 1fr)`};
  ${gridStyles}
`

type GridItemProps = {
  colStart?: number | ReponsivenessArray
  colEnd?: number | ReponsivenessArray
  colSpan?: number | ReponsivenessArray
  rowStart?: number | ReponsivenessArray
  rowEnd?: number | ReponsivenessArray
  rowSpan?: number | ReponsivenessArray
}

export const GridItem = styled.div<GridItemProps>`
  ${({ colStart }) => colStart && `grid-column-start: ${colStart}`};
  ${({ colEnd }) => colEnd && `grid-column-end: ${colEnd}`};
  ${({ colSpan }) => colSpan && `grid-column-end: span ${colSpan}`};
  ${({ rowStart }) => rowStart && `grid-row-start: ${rowStart}`};
  ${({ rowEnd }) => rowEnd && `grid-row-end: ${rowEnd}`};
  ${({ rowSpan }) => rowSpan && `grid-row-end: span ${rowSpan}`};
`
