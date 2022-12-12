import styled from '@emotion/styled'
import { useRef } from 'react'
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
  const { width, height } = useResizeObserver({ ref, box: 'border-box' })
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
    storySort: (a, b) => (a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true })),
  },
}
