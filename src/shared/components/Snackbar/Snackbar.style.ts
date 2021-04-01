import { breakpoints, colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'
import { Button } from '@/shared/components'
import Icon from '../Icon'
import { SnackbarVariant } from './Snackbar'

type SnackbarWrapperProps = {
  variant?: SnackbarVariant
  snackbarHeight?: number
  exit?: boolean
} & ActionButtonProps

type ActionButtonProps = {
  hasSubMessage?: boolean
}

export const SnackbarWrapper = styled.div<SnackbarWrapperProps>`
  background-color: ${({ variant }) => (variant === 'secondary' ? colors.gray[700] : colors.blue[500])};
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 360px;
  width: 100%;
  position: relative;
  z-index: ${zIndex.overlay};
  overflow: hidden;
  &.snackbar-enter {
    height: ${({ snackbarHeight }) => snackbarHeight}px;
    transform: translateY(400px) translateX(0);
    margin-bottom: 0;
  }
  &.snackbar-enter-active {
    height: ${({ snackbarHeight }) => snackbarHeight}px;
    transform: translateY(0) translateX(0);
    margin-bottom: 12px;
  }
  &.snackbar-enter-done {
    height: ${({ snackbarHeight }) => snackbarHeight}px;
    margin-bottom: 12px;
  }
  &.snackbar-exit {
    transform: translateY(0) translateX(0);
    height: ${({ snackbarHeight }) => snackbarHeight}px;
    margin-bottom: 12px;
  }
  &.snackbar-exit-active {
    transform: translateY(0) translateX(-500px);
    height: 0;
    margin-bottom: 0;
  }
  &.snackbar-exit-active-done {
    transform: translateY(0) translateX(-500px);
    height: 0;
    margin-bottom: 0;
  }
  &.snackbar-enter-active {
    transition: transform ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular},
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
  top: 12px;
  right: 20px;
`

export const SnackbarAction = styled(Button)<ActionButtonProps>`
  padding: 0;
  min-width: auto;
  margin-top: ${({ hasSubMessage }) => hasSubMessage && sizes(3)};
  margin-bottom: ${({ hasSubMessage }) => hasSubMessage && sizes(2)};
  margin-left: ${({ hasSubMessage }) => (hasSubMessage ? '0px' : 'auto')};
  margin-right: 52px;
  font-size: 12px;
  &:hover {
    background-color: ${colors.transparent};
  }
`

export const SnackbarParagraph = styled.div<SnackbarWrapperProps>`
  display: flex;
  flex-direction: ${({ hasSubMessage }) => (hasSubMessage ? 'column' : 'row')};
  width: 100%;
  padding-top: ${({ hasSubMessage }) => (hasSubMessage ? sizes(1) : 0)};
  font-size: ${typography.sizes.body2};
  color: ${({ variant }) => (variant === 'secondary' ? colors.gray[300] : colors.blue[100])};
  align-items: ${({ hasSubMessage }) => (hasSubMessage ? 'flex-start' : 'center')};
  word-break: break-all;
`

export const SnackbarHeader = styled.div<ActionButtonProps>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ hasSubMessage }) => hasSubMessage && sizes(2)};
  color: ${({ hasSubMessage }) => hasSubMessage && colors.white};
  height: 24px;
  padding: 40px 0;
`

export const StyledIcon = styled(Icon)`
  margin-right: ${sizes(2)};
  width: ${sizes(6)};
  height: ${sizes(6)};
`
