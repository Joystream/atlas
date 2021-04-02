import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'
import { Button, Text } from '@/shared/components'
import Icon from '../Icon'
import { SnackbarVariant } from './Snackbar'

type SnackbarWrapperProps = {
  variant?: SnackbarVariant
  snackbarHeight?: number
}

type InnerWrapperProps = {
  hasSubMessage?: boolean
}

export const SnackbarWrapper = styled.div<SnackbarWrapperProps>`
  position: relative;
  max-width: 360px;
  width: 100%;
  height: 0;
  background-color: ${({ variant }) => (variant === 'secondary' ? colors.gray[700] : colors.blue[500])};
  z-index: ${zIndex.overlay};
  overflow: hidden;
  &.snackbar-enter {
    transform: translateY(200%) translateX(0);
    height: 0;
    margin-bottom: 0;
  }
  &.snackbar-enter-active {
    transform: translateY(0) translateX(0);
    height: ${({ snackbarHeight }) => snackbarHeight && snackbarHeight}px;
    margin-bottom: ${sizes(3)};
  }
  &.snackbar-enter-done {
    transform: translateY(0) translateX(0);
    height: ${({ snackbarHeight }) => snackbarHeight && snackbarHeight}px;
    margin-bottom: ${sizes(3)};
  }
  &.snackbar-exit {
    transform: translateY(0) translateX(0);
    height: ${({ snackbarHeight }) => snackbarHeight && snackbarHeight}px;
    margin-bottom: ${sizes(3)};
  }
  &.snackbar-exit-active {
    transform: translateY(0) translateX(-115%);
    height: 0;
    margin-bottom: 0;
  }
  &.snackbar-exit-active-done {
    transform: translateY(0) translateX(-115%);
    height: 0;
    margin-bottom: 0;
  }
  &.snackbar-enter-active {
    transition: transform ${transitions.timings.regular} ${transitions.easing},
      height ${transitions.timings.regular} ${transitions.easing},
      margin-bottom ${transitions.timings.regular} ${transitions.easing};
  }
  &.snackbar-exit-active {
    transition: transform ${transitions.timings.regular} ${transitions.easing},
      height ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular},
      margin-bottom ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular};
  }
`

export const SnackbarButton = styled(Button)`
  position: absolute;
  top: ${sizes(3)};
  right: ${sizes(5)};
  &:hover {
    background-color: ${colors.transparent};
  }
`

export const SnackbarAction = styled(Button)`
  display: flex;
  align-items: center;
  padding: 0;
  min-width: auto;
  height: ${sizes(8)};
  font-size: ${sizes(3)};
  margin-right: ${sizes(10)};
  font-size: 16px;
  span {
    margin-top: -4px;
  }
  &:hover {
    background-color: ${colors.transparent};
  }
`

export const SnackbarParagraph = styled.div<SnackbarWrapperProps>`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: ${typography.sizes.body2};
  color: ${({ variant }) => (variant === 'secondary' ? colors.gray[300] : colors.blue[100])};
  word-break: break-all;
`

export const SnackbarHeader = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
`

export const Submessage = styled(Text)`
  margin-top: 10px;
  margin-bottom: 16px;
`

export const StyledIcon = styled(Icon)`
  margin-left: 2px;
  margin-right: ${sizes(2)};
  width: ${sizes(6)};
  height: ${sizes(6)};
`

export const StyledInnerWrapper = styled.div<InnerWrapperProps>`
  padding: ${sizes(3)} ${sizes(5)};
  width: 100%;
  ${SnackbarHeader} {
    color: ${({ hasSubMessage }) => hasSubMessage && colors.white};
  }
  ${SnackbarParagraph} {
    flex-direction: ${({ hasSubMessage }) => (hasSubMessage ? 'column' : 'row')};
    align-items: ${({ hasSubMessage }) => (hasSubMessage ? 'flex-start' : 'center')};
  }
  ${SnackbarAction} {
    margin-left: ${({ hasSubMessage }) => (hasSubMessage ? '0' : 'auto')};
  }
`
