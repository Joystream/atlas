import styled from '@emotion/styled'
import { colors, sizes, transitions, typography, zIndex } from '@/shared/theme'
import { Button, Text } from '@/shared/components'
import Icon from '../Icon'
import { SnackbarVariant } from './Snackbar'

type SnackbarWrapperProps = {
  variant?: SnackbarVariant
  snackbarHeight?: number
}

type InnerWrapperProps = {
  hasSubMessage?: boolean
} & Omit<SnackbarWrapperProps, 'snackbarHeight'>

export const SnackbarWrapper = styled.div<SnackbarWrapperProps>`
  position: relative;
  width: 100%;
  height: 0;
  background-color: ${({ variant }) => (variant === 'secondary' ? colors.gray[700] : colors.blue[500])};
  z-index: ${zIndex.overlay};
  overflow: hidden;
  transform: translateY(500px) translateX(0);
  &.snackbar-enter {
    transform: translateY(500px) translateX(0);
    height: 0;
    margin-bottom: 0;
  }
  &.snackbar-enter-active,
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
    transform: translateY(0) translateX(-150%);
    height: 0;
    margin-bottom: 0;
  }

  &.snackbar-enter-active {
    transition: height ${transitions.timings.regular} ${transitions.easing},
      margin-bottom ${transitions.timings.regular} ${transitions.easing},
      transform ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular};
  }
  &.snackbar-exit-active {
    transition: transform ${transitions.timings.regular} ${transitions.easing},
      height ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular},
      margin-bottom ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular};
  }
`

export const SnackbarHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const StyledInnerWrapper = styled.div<InnerWrapperProps>`
  width: 100%;
  color: ${({ variant }) => (variant === 'secondary' ? colors.gray[300] : colors.blue[100])};
  padding: ${({ hasSubMessage }) => (hasSubMessage ? `${sizes(4)} ${sizes(5)}` : `${sizes(3)} ${sizes(5)}`)};
  width: 100%;
  ${SnackbarHeader} {
    color: ${({ hasSubMessage }) => hasSubMessage && colors.white};
  }
`

export const SnackbarButtonsContainer = styled.div`
  display: flex;
  margin-left: auto;
`

export const SnackbarExitButton = styled(Button)`
  &:hover {
    background-color: ${colors.transparent};
  }
`

export const SnackbarActionButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 0;
  min-width: auto;
  font-size: ${sizes(3)};
  margin-right: ${sizes(2)};
  font-size: ${typography.sizes.body1};
  span {
    /* margin-top: calc(-1 * ${sizes(1)}); */
  }
  &:hover {
    background-color: ${colors.transparent};
  }
`

export const SnackbarDescription = styled(Text)`
  margin-top: ${sizes(1)};
  margin-bottom: ${sizes(4)};
`

export const SnackbarIcon = styled(Icon)`
  margin-left: 2px;
  margin-right: ${sizes(2)};
  width: ${sizes(5)};
  height: ${sizes(5)};
`
