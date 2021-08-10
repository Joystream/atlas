import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { media } from '@/shared/theme'

type ReponsivenessArray = Array<number | null>

type GridProps = {
  gap?: number | ReponsivenessArray
  cols?: number | ReponsivenessArray
}

const gridStyles = (props: GridProps) => {
  const stylesArr: SerializedStyles[] = []
  const propToCSSRulesArray: Record<keyof GridProps, { prependStyles: string; appendStyles: string }> = {
    gap: { prependStyles: 'grid-gap:', appendStyles: 'px' },
    cols: { prependStyles: 'grid-template-columns: repeat(', appendStyles: ', 1fr)' },
  }

  Object.entries(propToCSSRulesArray).forEach((entry, index) => {
    const cssRule = entry[1]
    const propValue = props[entry[0] as keyof GridProps]
    console.log({ propValue, entry, gap: props['gap'], props })
    const queries = Object.values(media)

    if (Array.isArray(propValue)) {
      for (let index = 0; index < propValue.length; index++) {
        const value = propValue[index]
        if (!value) continue
        stylesArr.push(css`
          ${queries[index]} {
            ${cssRule.prependStyles.concat(' ', value.toString()).concat(cssRule.appendStyles)};
          }
        `)
      }
    } else {
      propValue &&
        stylesArr.push(
          css`
            ${cssRule.prependStyles.concat(' ', propValue.toString()).concat(cssRule.appendStyles)};
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
