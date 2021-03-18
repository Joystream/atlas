import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
// based on https://github.com/lukehaas/css-loaders licensed under MIT

type SpinnerWrapperProps = {
  size?: number
}

// to adjust size of the spinner, change the font-size value
export const SpinnerWrapper = styled.div<SpinnerWrapperProps>`
  border-radius: 50%;
  font-size: ${({ size = 32 }) => size}px;
  width: 1em;
  height: 1em;
  border: 0.1em solid ${colors.transparentWhite[32]};
  border-left: 0.1em solid ${colors.white};
  margin-bottom: ${sizes(4)};
  animation: load 1s infinite linear;
  @keyframes load {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
