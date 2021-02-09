import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

const SNACKBAR_POSITION = 34
const SNACKBAR_POSITION_MOBILE = 15

export const snackbarTransitions = css`
  .snackbar-enter {
    transform: translateX(-200%);
  }
  .snackbar-enter-active {
    transform: translateX(0);
  }
  .snackbar-exit {
    transform: translateX(0);
  }
  .snackbar-exit-active {
    transform: translateX(-200%);
  }
  .snackbar-enter-active {
    transition: transform ${transitions.timings.loading} ${transitions.easing};
  }
  .snackbar-exit-active {
    transition: transform 800ms ${transitions.easing};
  }
`

export const SnackbarWrapper = styled.div`
  background-color: ${colors.gray[800]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(2)};
  padding-left: ${sizes(4)};
  max-width: 300px;
  width: 100%;
  position: fixed;
  bottom: ${SNACKBAR_POSITION_MOBILE}px;
  left: ${SNACKBAR_POSITION_MOBILE}px;
  z-index: ${zIndex.overlay};
  margin: 0;
  @media screen and (min-width: ${breakpoints.small}) {
    padding: ${sizes(3)};
    padding-left: ${sizes(6)};
    max-width: 400px;
    bottom: ${SNACKBAR_POSITION}px;
    left: ${SNACKBAR_POSITION}px;
  }
`

export const SnackbarButton = styled.button`
  border: none;
  background: none;
  color: ${colors.gray[300]};
  padding: ${sizes(3)};
  cursor: pointer;
`

export const SnackbarParagraph = styled.p`
  margin: 0;
  font-size: ${typography.sizes.body2};
  color: ${colors.white};
  display: flex;
  align-items: center;
  word-break: break-all;
  svg {
    margin-right: ${sizes(4)};
    width: ${sizes(6)};
    height: ${sizes(6)};
  }
`
