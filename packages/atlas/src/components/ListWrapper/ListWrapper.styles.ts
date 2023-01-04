import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div<{ columns?: string[] }>`
  display: grid;
  width: 100%;
  overflow-x: auto;
  padding-top: ${(props) => (props.columns ? sizes(8) : 0)};

  > :first-child {
    ${(props) =>
      props?.columns
        ?.map(
          (column, idx) => css`
            > :nth-child(${idx + 1}) {
              position: relative;

              ::after {
                pointer-events: none;
                width: 100%;
                position: absolute;
                bottom: calc(100% + ${sizes(8)});
                left: 0;
                text-transform: uppercase;
                color: ${cVar('colorTextMuted')};
                font: ${cVar('typographyDesktopH100')};
                content: '${column}';
              }
            }
          `
        )
        .map((style) => style.styles)
        .join('\n')}
  }
`
