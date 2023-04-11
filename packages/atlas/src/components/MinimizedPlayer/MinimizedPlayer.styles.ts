import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { zIndex } from '@/styles'

const FadeIn = keyframes`
  0% { opacity: 0}
  100% { opacity: 1}
`

export const Wrapper = styled.div<{ isInView: boolean }>`
  ${(props) =>
    !props.isInView &&
    css`
      width: 320px;
      position: fixed;
      z-index: ${zIndex.modals};
      right: 40px;
      bottom: 0;
      animation: ${FadeIn} 0.1s linear;
      height: 180px;
    `}
`
