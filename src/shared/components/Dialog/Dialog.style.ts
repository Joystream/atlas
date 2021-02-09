import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { colors, sizes, breakpoints, typography, zIndex } from '../../theme'
import { Text, Button } from '@/shared/components'
import { SIDENAVBAR_WIDTH } from '@/components/SideNavbar/SideNavbar.style'

type StyledExitButtonProps = {
  marginLeft?: boolean
}

export const StyledBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: ${zIndex.globalOverlay};
  @media (min-width: ${breakpoints.medium}) {
    padding-left: ${SIDENAVBAR_WIDTH}px;
  }
`

export const StyledContainer = styled.div`
  width: 90%;
  max-width: ${sizes(110)};
  margin: ${sizes(32)} auto;
  background-color: ${colors.gray[600]};
  padding: ${sizes(4)};
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.12), 0px 24px 40px rgba(0, 0, 0, 0.16);
  @media screen and (min-width: ${breakpoints.small}) {
    padding: ${sizes(6)};
  }
`

export const StyledTitleText = styled(Text)`
  margin-bottom: ${sizes(3)};
  line-height: ${sizes(8)};
`

export const StyledContentText = styled(Text)`
  color: ${colors.white};
  font-weight: ${typography.weights.thin};
  margin-bottom: ${sizes(6)};
  word-wrap: break-word;
  line-height: ${sizes(5)};
`

export const StyledHeadRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${sizes(4)};
`

export const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  @media screen and (min-width: ${breakpoints.small}) {
    flex-direction: row;
    justify-content: flex-end;
  }
`

export const StyledPrimaryButton = styled(Button)`
  margin-bottom: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-left: ${sizes(2)};
    margin-bottom: 0;
  }
`

export const StyledSecondaryButton = styled(Button)`
  background-color: ${colors.transparent};
  color: ${colors.white};
  border: 1px solid ${colors.gray[500]};
  &:hover {
    background-color: ${colors.gray[500]};
    border: 1px solid ${colors.gray[500]};
    color: ${colors.white};
  }
  &:active {
    background-color: ${colors.transparent};
    border: 1px solid ${colors.gray[500]};
  }
`

export const StyledExitButton = styled(Button)<StyledExitButtonProps>`
  padding: 0;
  background-color: ${colors.transparent};
  border: none;
  margin-left: ${({ marginLeft }) => marginLeft && 'auto'};
  &:hover {
    background-color: ${colors.transparent};
  }
`

export const dialogTransitions = css`
  &.modal-enter {
    opacity: 0;
    & .dialog {
      transform: scale(0.88);
    }
  }
  &.modal-enter-active {
    opacity: 1;
    & .dialog {
      transform: scale(1);
      transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
    }
    transition: 150ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
  &.modal-exit {
    opacity: 1;
    & .dialog {
      transform: scale(1);
    }
  }
  &.modal-exit-active {
    opacity: 0;
    & .dialog {
      transform: scale(0.88);
      transition: 100ms cubic-bezier(0.25, 0.01, 0.25, 1);
    }
    transition: 100ms cubic-bezier(0.25, 0.01, 0.25, 1);
  }
`
