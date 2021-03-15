import { colors } from '@/shared/theme'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
// based on https://github.com/lukehaas/css-loaders licensed under MIT

const load8 = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const SpinnerWrapper = styled.div`
  border-radius: 50%;
  width: 1em;
  height: 1em;
  font-size: 50px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.1em solid rgba(255, 255, 255, 0.4);
  border-right: 0.1em solid rgba(255, 255, 255, 0.4);
  border-bottom: 0.1em solid rgba(255, 255, 255, 0.4);
  border-left: 0.1em solid ${colors.white};
  transform: translateZ(0);
  animation: ${load8} 1.1s infinite linear;
  ::after {
    border-radius: 50%;
    width: 0.1em;
    height: 0.1em;
  }
`
