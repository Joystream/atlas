import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { colors, sizes, transitions, typography, zIndex } from '@/theme'

import { SnackbarVariant } from './Snackbar'

type SnackbarWrapperProps = {
  colorVariant?: SnackbarVariant
  snackbarHeight?: number
}

type InnerWrapperProps = {
  hasDescription?: boolean
  hasActionButton?: boolean
} & Omit<SnackbarWrapperProps, 'snackbarHeight'>

type TitleProps = Omit<InnerWrapperProps, 'hasActionButton'>

export const SnackbarWrapper = styled.div<SnackbarWrapperProps>`
  position: relative;
  width: 100%;
  height: 0;
  background-color: ${({ colorVariant }) => (colorVariant === 'secondary' ? colors.gray[700] : colors.blue[500])};
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
    transition: transform ${transitions.timings.regular} ${transitions.easing},
      height ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular},
      margin-bottom ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular};
  }

  &.snackbar-enter-active {
    transition: height ${transitions.timings.regular} ${transitions.easing},
      margin-bottom ${transitions.timings.regular} ${transitions.easing},
      transform ${transitions.timings.regular} ${transitions.easing} ${transitions.timings.regular};
  }
`

export const SnackbarHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const SnackbarTitle = styled(Text)<TitleProps>`
  color: ${({ colorVariant, hasDescription }) =>
    hasDescription ? colors.white : colorVariant === 'primary' ? colors.blue[200] : colors.gray[300]};
`

export const SnackbarDescription = styled(Text)`
  padding: ${sizes(1)} 0;
`

export const StyledInnerWrapper = styled.div<InnerWrapperProps>`
  width: 100%;
  padding: ${({ hasDescription }) => (hasDescription ? `${sizes(4)} ${sizes(5)}` : `${sizes(3)} ${sizes(5)}`)};
  ${SnackbarDescription} {
    ${({ hasActionButton }) => hasActionButton && `margin-bottom: ${sizes(3)}`};
    ${({ colorVariant }) => colorVariant === 'primary' && `color: ${colors.blue[200]}`};
  }
`

export const SnackbarButtonsContainer = styled.div`
  display: flex;
  margin-left: auto;
`

export const SnackbarActionButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 0;
  min-width: auto;
  margin-right: ${sizes(2)};
  font-size: ${typography.sizes.body1};
`

export const SnackbarIconContainer = styled.span`
  margin-right: ${sizes(2)};
`
