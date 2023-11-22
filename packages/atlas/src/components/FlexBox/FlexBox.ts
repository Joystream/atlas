import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { sizes } from '@/styles'

type FlexBoxProps = {
  gap?: number
  flow?: 'row' | 'column'
  alignItems?: string
  justifyContent?: string
  equalChildren?: boolean
  width?: string | number
  padding?: number
  height?: string | number
}

export const FlexBox = styled.div<FlexBoxProps>`
  display: flex;
  ${(props) => css`
    gap: ${sizes(props.gap ?? 1)};
    padding: ${sizes(props.padding ?? 0)};
    flex-direction: ${props.flow ?? 'row'};
    align-items: ${props.alignItems ?? 'start'};
    justify-content: ${props.justifyContent ?? 'start'};
    width: ${props.width ?? '100%'};
    height: ${props.height ?? 'initial'};
  `}

  ${(props) =>
    props.equalChildren
      ? css`
          > * {
            flex: 1;
            min-width: 0;
          }
        `
      : ''}
`
