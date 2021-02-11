import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Button } from '@/shared/components'
import { colors, sizes, breakpoints } from '@/shared/theme'

export const StyledContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: ${sizes(110)};
  min-height: 150px;
  margin: ${sizes(32)} auto;
  background-color: ${colors.gray[600]};
  padding: ${sizes(4)};
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.12), 0px 24px 40px rgba(0, 0, 0, 0.16);
  @media screen and (min-width: ${breakpoints.small}) {
    padding: ${sizes(6)};
  }
`

export const StyledExitButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${colors.transparent};
  border: none;
  &:hover {
    background-color: ${colors.transparent};
  }
`

export const dialogTransitions = css`
  &.dialog-enter {
    opacity: 0;
    transform: scale(0.88);
  }

  &.dialog-enter-active {
    opacity: 1;
    transform: scale(1);
    transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }

  &.dialog-exit {
    opacity: 1;
    transform: scale(1);
  }

  &.dialog-exit-active {
    opacity: 0;
    transform: scale(0.88);
    transition: 100ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`
