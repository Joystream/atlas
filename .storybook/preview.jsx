import React from 'react'
import { css } from '@emotion/react'
import { GlobalStyle } from '../src/shared/components'

const wrapperStyle = css`
  padding: 10px;

  & > * + * {
    margin-left: 15px;
  }
`

const stylesWrapperDecorator = (styleFn) => (
  <div css={wrapperStyle}>
    <GlobalStyle />
    {styleFn()}
  </div>
)

export const decorators = [stylesWrapperDecorator]

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
}
