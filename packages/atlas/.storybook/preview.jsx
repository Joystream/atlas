import styled from '@emotion/styled'
import { useRef } from 'react'
import useResizeObserver from 'use-resize-observer'

import { OperatorsContext } from '@/providers/assets/assets.provider'
import { JoystreamContext } from '@/providers/joystream/joystream.provider'
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

const OperatorsContextDecorator = (Story) => (
  <OperatorsContext.Provider value={{}}>
    <Story />
  </OperatorsContext.Provider>
)

const TokenPriceDecorator = (Story) => (
  <JoystreamContext.Provider value={{ tokenPrice: 0.5 }}>
    <Story />
  </JoystreamContext.Provider>
)

export const decorators = [OperatorsContextDecorator, TokenPriceDecorator, StylesWrapperDecorator]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: (a, b) => (a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true })),
  },
}

export const argTypes = {
  to: { table: { disable: true } },
  className: { table: { disable: true } },
  onClick: { table: { disable: true } },
  onChange: { table: { disable: true } },
  as: { table: { disable: true } },
  icon: { table: { disable: true } },
  children: { table: { disable: true } },
}
