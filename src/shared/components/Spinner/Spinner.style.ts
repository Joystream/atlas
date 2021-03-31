import { colors, sizes } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { SpinnerSize } from './Spinner'

type SpinnerWrapperProps = {
  size: SpinnerSize
}

const spinnerSizes = (size: SpinnerSize) => {
  switch (size) {
    case 'small':
      return css`
        font-size: 32px;
      `
    case 'medium':
      return css`
        font-size: 50px;
      `
    case 'large':
      return css`
        font-size: 72px;
      `
    default:
      return css`
        font-size: 50px;
      `
  }
}

// to adjust size of the spinner, change the font-size value
export const SpinnerWrapper = styled.div<SpinnerWrapperProps>`
  border-radius: 50%;
  width: 1em;
  height: 1em;
  border: 0.09em solid ${colors.gray[500]};
  border-left: 0.09em solid ${colors.blue[500]};
  margin-bottom: ${sizes(4)};
  animation: load 1s infinite linear;
  ${({ size }) => spinnerSizes(size)};
  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
