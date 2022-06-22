import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

type DragAndDropAreaProps = {
  isDragAccept?: boolean
  isFileDialogActive?: boolean
  fileAccepted?: boolean
}

type LoadingProp = {
  isLoading?: boolean
}

export const FileHoverOverlay = styled.div`
  pointer-events: none;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  border: 1px dashed ${cVar('colorCoreBlue500')};

  ::before {
    z-index: -1;
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    background: ${cVar('colorBackgroundOverlay')};
  }
`

export const FileSelectedOverlay = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  border: 1px solid ${cVar('colorCoreBlue500')};

  ::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    background: ${cVar('colorCoreBlue500')};
    opacity: 0.2;
  }
`

export const InnerContainer = styled.div<DragAndDropAreaProps>`
  display: flex;
  justify-content: center;
`

const dragAcceptCss = css`
  ${FileHoverOverlay} {
    visibility: visible;
  }

  ${FileSelectedOverlay} {
    visibility: hidden;
  }
`

export const DragAndDropArea = styled.div<DragAndDropAreaProps>`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 400px;
  transition: all ${cVar('animationTransitionMedium')};
  ${({ isDragAccept }) => isDragAccept && dragAcceptCss};

  ::after {
    content: '';
    pointer-events: none;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 1px dashed ${cVar('colorCoreNeutral500')};
  }

  ${media.sm} {
    height: 0;
    padding-top: 56.25%;
  }
`

export const Content = styled(animated.div, { shouldForwardProp: (prop) => prop !== 'isLoading' })<LoadingProp>`
  position: absolute;
  z-index: 1;
  top: 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  text-align: center;
  max-width: 270px;
  height: 100%;
  opacity: ${({ isLoading }) => (isLoading ? 0.1 : 1)};
  transition: opacity 400ms ease-out;

  & > svg:first-of-type {
    margin: ${sizes(2)} ${sizes(3)};
  }
`

export const Thumbnail = styled(animated.img, { shouldForwardProp: (prop) => prop !== 'isLoading' })<LoadingProp>`
  position: absolute;
  top: 0;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  display: block;
  opacity: ${({ isLoading }) => (isLoading ? 0.1 : 1)};
  transition: opacity 400ms ease-out;
  padding: 1px;
`

export const Title = styled(Text)`
  margin-top: ${sizes(2)};
`

export const ButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: ${sizes(1)};
  margin-top: ${sizes(2)};
`

export const DragDropText = styled(Text)`
  display: none;

  ${media.sm} {
    display: initial;
    margin-right: ${sizes(5)};
  }
`
