import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes, zIndex } from '@/styles'

import { IconButton } from '../_buttons/IconButton'

type SnackbarWrapperProps = {
  snackbarHeight?: number
}

export const SnackbarWrapper = styled.div<SnackbarWrapperProps>`
  position: relative;
  width: 100%;
  height: 0;
  background-color: ${cVar('colorBackgroundStrong')};
  z-index: ${zIndex.overlay};
  overflow: hidden;
  transform: translateY(500px) translateX(0);
  border-radius: ${cVar('radiusSmall')};

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
    transition: transform ${cVar('animationTransitionCallout')},
      height ${cVar('animationTransitionCallout')} ${cVar('animationTimingMedium')},
      margin-bottom ${cVar('animationTransitionCallout')} ${cVar('animationTimingMedium')};
  }

  &.snackbar-enter-active {
    transition: height ${cVar('animationTransitionCallout')}, margin-bottom ${cVar('animationTransitionCallout')},
      transform ${cVar('animationTransitionCallout')};
  }
`

export const SnackbarContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: ${sizes(1.5)} 0 ${sizes(1.5)} ${sizes(1.5)};
  width: 100%;
  align-items: flex-start;
`

export const SnackbarDescription = styled(Text)`
  margin-top: ${sizes(2)};
`

export const StyledInnerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: ${sizes(3)};
`

export const SnackbarCloseButton = styled(IconButton)`
  margin-left: ${sizes(4)};
`

export const SnackbarActionButton = styled(Button)`
  margin-top: ${sizes(2)};
  margin-right: ${sizes(2)};
`

export const SnackbarIconContainer = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
