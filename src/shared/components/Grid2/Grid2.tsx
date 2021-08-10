import styled from '@emotion/styled'

// lenght = amount of media queries
type ReponsivenessArray = Array<number> & { length: 7 }

type GridProps = {
  gap?: number | ReponsivenessArray
  cols?: number | ReponsivenessArray
}

export const Grid2 = styled.div<GridProps>`
  display: grid;
  ${({ cols }) => cols && `grid-template-columns: repeat(${cols}, 1fr)`};
  ${({ gap }) => gap && `grid-gap: ${gap}px`};
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
