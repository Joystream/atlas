import styled from '@emotion/styled'
import { darken } from 'polished'

import { colors, media, sizes, transitions } from '@/shared/theme'

import { IconButton } from '../IconButton'
import { Text } from '../Text'

type DragAndDropAreaProps = {
  isDragAccept?: boolean
  isFileDialogActive?: boolean
}

type ProgressBarProps = {
  isLoading?: boolean
}

export const DragAndDropArea = styled.div<DragAndDropAreaProps>`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 90%;
  display: flex;
  justify-content: center;
  transition: all ${transitions.timings.routing} ${transitions.easing};
  background: ${({ isDragAccept }) =>
    isDragAccept && `radial-gradient(55.47% 148.24% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(64, 56, 255, 0.2) 100%) ;`};
  background-color: ${darken(0.16, colors.gray[600])};

  ::after {
    content: '';
    pointer-events: none;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 1px dashed
      ${({ isDragAccept, isFileDialogActive }) =>
        isDragAccept || isFileDialogActive ? colors.blue[500] : colors.gray[500]};
  }

  :hover::after,
  :focus::after {
    border: 1px dashed ${colors.blue[500]};
  }

  ${media.small} {
    padding-top: 56.25%;
  }
`

export const InnerContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  text-align: center;
  max-width: 280px;
  height: 100%;

  ${media.small} {
    max-width: 350px;
  }
`

export const ProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 100%;
  background-color: ${colors.blue[500]};
  opacity: 0.2;
  top: 0;
  position: absolute;
  transform-origin: left;
  transform: ${({ isLoading }) => `scaleX(${isLoading ? 1 : 0}) `};
  transition: transform ${({ isLoading }) => (isLoading ? '1000ms' : '0ms')} ${transitions.easing};
`

export const ErrorContainer = styled.div`
  position: absolute;
  cursor: initial;
  bottom: 0;
  z-index: 2;
  width: 100%;
  padding: ${sizes(2)} 0;
  background-color: ${colors.transparentError};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Thumbnail = styled.img`
  position: absolute;
  top: 0;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  display: block;

  ${media.xs} {
    object-fit: initial;
  }
`

export const ErrorText = styled(Text)`
  margin-left: ${sizes(4)};
`

export const DismissButton = styled(IconButton)`
  margin-left: 10px;
`

export const Title = styled(Text)`
  margin-top: ${sizes(2)};

  ${media.small} {
    margin-top: ${sizes(4)};
  }
`

export const Paragraph = styled(Text)`
  margin-top: ${sizes(4)};

  ${media.small} {
    margin-top: ${sizes(8)};
  }
`

export const ButtonsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${sizes(4)} 0 ${sizes(2)} 0;

  ${media.small} {
    margin: ${sizes(8)} 0 ${sizes(4)} 0;
  }
`

export const DragDropText = styled(Text)`
  display: none;

  ${media.small} {
    display: initial;
    margin-right: ${sizes(5)};
    color: ${colors.gray[300]};
    text-decoration: underline;
  }
`
