import styled from '@emotion/styled'
import React, { useRef } from 'react'
import useResizeObserver from 'use-resize-observer'

import { GlobalStyles } from '@/styles'

const Wrapper = styled.div`
  padding: 10px;
  height: calc(100vh - 20px);

  & > * + * {
    margin-left: 15px;
  }
`

const StylesWrapperDecorator = (styleFn) => {
  const ref = useRef(null)
  const { width, height } = useResizeObserver({ ref })
  return (
    <Wrapper ref={ref}>
      <div style={{ position: 'absolute', fontSize: '12px', right: '4px', top: '4px' }}>
        {width}px x {height}px
      </div>
      <GlobalStyles />
      {styleFn()}
    </Wrapper>
  )
}

export const decorators = [StylesWrapperDecorator]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: (a, b) => (a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })),
  },
}
