import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

import { SpinnerSize } from './Spinner'

type SpinnerWrapperProps = {
  size: SpinnerSize
}

const spinnerSizes = (size: SpinnerSize) => {
  switch (size) {
    case 'small':
      return css`
        font-size: 24px;
      `
    case 'medium':
      return css`
        font-size: 32px;
      `
    case 'large':
      return css`
        font-size: 72px;
      `
    default:
      return css`
        font-size: 32px;
      `
  }
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

// to adjust size of the spinner, change the font-size value
export const SpinnerWrapper = styled.div<SpinnerWrapperProps>`
  border-radius: 50%;
  width: 1em;
  height: 1em;
  border: 0.09em solid ${colors.blue[500]};
  border-left: 0.09em solid ${colors.gray[100]};
  margin-bottom: ${sizes(4)};
  animation: ${spin} 1s infinite linear;
  ${({ size }) => spinnerSizes(size)}
`
