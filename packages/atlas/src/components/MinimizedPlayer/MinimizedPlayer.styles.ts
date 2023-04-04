import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

const FadeIn = keyframes`
  0% { opacity: 0}
  100% { opacity: 1}
`

export const Details = styled.div`
  width: 100%;
  max-height: 100px;
  margin-top: 180px;
  background-color: ${cVar('colorBackground')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${sizes(1)};
  padding: ${sizes(4)};
`

export const Wrapper = styled.div<{ isInView: boolean }>`
  display: flex;
  flex-direction: column;
  ${(props) =>
    !props.isInView &&
    css`
      width: 320px;
      position: fixed;
      z-index: 1000;
      right: 40px;
      bottom: 0;
      animation: ${FadeIn} 0.1s linear;

      > *:first-of-type {
        height: 180px;
      }
    `}
`
