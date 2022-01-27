import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes, zIndex } from '@/styles'

type SnackbarWrapperProps = {
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
  background-color: ${cVar('colorBackgroundStrong')};
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
    transition: transform ${cVar('animationTransitionFast')},
      height ${cVar('animationTransitionFast')} ${cVar('animationTimingFast')},
      margin-bottom ${cVar('animationTransitionFast')} ${cVar('animationTimingFast')};
  }

  &.snackbar-enter-active {
    transition: height ${cVar('animationTransitionFast')}, margin-bottom ${cVar('animationTransitionFast')},
      transform ${cVar('animationTransitionFast')} ${cVar('animationTimingFast')};
  }
`

export const SnackbarContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding: ${sizes(1.5)} 0;
  width: 100%;
`

export const SnackbarTitle = styled(Text)<TitleProps>`
  display: flex;
  align-items: center;
`

export const SnackbarDescription = styled(Text)`
  margin-top: ${sizes(2)};
`

export const StyledInnerWrapper = styled.div<InnerWrapperProps>`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: ${({ hasDescription }) => (hasDescription ? `${sizes(4)} ${sizes(5)}` : `${sizes(3)} ${sizes(5)}`)};
  ${SnackbarDescription} {
    ${({ hasActionButton }) => hasActionButton && `margin-bottom: ${sizes(3)}`};
  }
`

export const SnackbarButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${sizes(4)};
`

export const SnackbarActionButton = styled(Button)`
  margin-right: ${sizes(2)};
`

export const SnackbarIconContainer = styled.div`
  margin-right: ${sizes(2)};
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`
