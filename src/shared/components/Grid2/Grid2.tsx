import { SerializedStyles, css } from '@emotion/react'
import styled from '@emotion/styled'

import { media } from '@/shared/theme'

type ReponsivenessArray = Array<number | null>

type GridProps = {
  gap?: number | ReponsivenessArray
  cols?: number | ReponsivenessArray
}

// Applies styles to the corresponding media queries given by the values passed to the ReponsivenessArray
const applyStyles = <T extends Record<string, unknown & { toString: () => string }>>(
  props: T,
  propToCSSRulesMap: Record<keyof T, { prependStyles: string; appendStyles: string }>
) => {
  const stylesArr: SerializedStyles[] = []
  Object.entries(propToCSSRulesMap).forEach((entry) => {
    const cssRule = entry[1]
    const propValue = props[entry[0] as keyof T]
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

const gridPropToCSSRulesMap = {
  gap: { prependStyles: 'grid-gap:', appendStyles: 'px' },
  cols: { prependStyles: 'grid-template-columns: repeat(', appendStyles: ', 1fr)' },
}
export const Grid2 = styled.div<GridProps>`
  display: grid;
  ${(props) => applyStyles<GridProps>(props, gridPropToCSSRulesMap)}
`

type GridItemProps = {
  colStart?: number | ReponsivenessArray
  colEnd?: number | ReponsivenessArray
  colSpan?: number | ReponsivenessArray
  rowStart?: number | ReponsivenessArray
  rowEnd?: number | ReponsivenessArray
  rowSpan?: number | ReponsivenessArray
}

const gridItemPropToCSSRulesMap = {
  colStart: { prependStyles: 'grid-column-start: ', appendStyles: '' },
  colEnd: { prependStyles: 'grid-column-end: ', appendStyles: '' },
  colSpan: { prependStyles: 'grid-column-end: span', appendStyles: '' },
  rowStart: { prependStyles: 'grid-row-start: ', appendStyles: '' },
  rowEnd: { prependStyles: 'grid-row-end: ', appendStyles: '' },
  rowSpan: { prependStyles: 'grid-row-end: span', appendStyles: '' },
}
export const GridItem = styled.div<GridItemProps>`
  ${(props) => applyStyles<GridItemProps>(props, gridItemPropToCSSRulesMap)}
`
