import React, { useRef } from 'react'
import { css } from '@emotion/react'
import { GlobalStyle } from '../src/shared/components'
import useResizeObserver from 'use-resize-observer'

const wrapperStyle = css`
  padding: 10px;
  height: calc(100vh - 20px);

  & > * + * {
    margin-left: 15px;
  }
`

const sizeIndicatorStyle = css`
  position: absolute;
  font-size: 12px;
  right: 4px;
  top: 4px;
`

const StylesWrapperDecorator = (styleFn) => {
  const ref = useRef(null)
  const { width, height } = useResizeObserver({ ref })
  return (
    <div ref={ref} css={wrapperStyle}>
      <div css={sizeIndicatorStyle}>
        {width}px x {height}px
      </div>
      <GlobalStyle />
      {styleFn()}
    </div>
  )
}

export const decorators = [StylesWrapperDecorator]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'black',
    values: [
      {
        name: 'black',
        value: '#000000',
      },
      {
        name: 'gray',
        value: '#272D33',
      },
    ],
  },
  options: {
    storySort: (a, b) => (a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })),
  },
}
