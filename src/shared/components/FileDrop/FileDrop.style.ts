import { breakpoints, colors, sizes, transitions } from '@/shared/theme'
import styled from '@emotion/styled'
import Icon from '../Icon'
import Text from '../Text'
import { darken } from 'polished'
import Button from '../Button'

type DragAndDropAreaProps = {
  isDragAccept?: boolean
  isFileDialogActive?: boolean
}

type ProgressBarProps = {
  progress?: number
}

export const DragAndDropArea = styled.div<DragAndDropAreaProps>`
  position: relative;

  background-color: ${darken(0.16, colors.gray[600])};
  cursor: pointer;
  width: 100%;
  height: calc(100vw * 0.5625);
  max-width: 640px;
  max-height: 360px;
  display: flex;
  justify-content: center;

  transition: all ${transitions.timings.routing} ${transitions.easing};
  border: 1px dashed
    ${({ isDragAccept, isFileDialogActive }) =>
      isDragAccept || isFileDialogActive ? colors.blue[500] : colors.gray[500]};
  background: ${({ isDragAccept }) =>
    isDragAccept && `radial-gradient(55.47% 148.24% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(64, 56, 255, 0.2) 100%);`};

  :hover,
  :focus {
    border: 1px dashed ${colors.blue[500]};
  }
`

export const ProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 100%;
  background-color: ${colors.blue[500]};
  opacity: 0.2;
  position: absolute;

  transition: transform 100ms ${transitions.easing};
  transform-origin: left;
  transform: ${({ progress = 0 }) => `scaleX(${progress && progress / 100})`};
`

export const ErrorContainer = styled.div`
  position: absolute;
  cursor: initial;
  bottom: 0;
  z-index: 2;

  width: 100%;
  padding: ${sizes(4)} 0;
  background-color: rgba(255, 56, 97, 0.08);

  display: flex;
  align-items: center;
  justify-content: center;
`

export const Thumbnail = styled.img`
  object-fit: cover;
  max-width: 100%;
  height: 100%;
  display: block;
`

export const ErrorIcon = styled(Icon)`
  width: ${sizes(6)};
  margin-right: ${sizes(4)};
`

export const ErrorText = styled(Text)``

export const DismissButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  color: white;
  margin-top: ${sizes(1)};
  margin-left: 10px;
`

export const InnerContainer = styled.div`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  text-align: center;
  max-width: 200px;
  height: 100%;

  @media screen and (min-width: ${breakpoints.small}) {
    display: block;
    margin-top: ${sizes(10)};
    max-width: 350px;
  }
`

export const StyledIcon = styled(Icon)`
  color: ${colors.gray[300]};
  width: ${sizes(14)};
  @media screen and (min-width: ${breakpoints.small}) {
    width: ${sizes(18)};
  }
`

export const Title = styled(Text)`
  line-height: 1.2;
  margin-top: ${sizes(2)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: ${sizes(4)};
  }
`

export const Paragraph = styled(Text)`
  margin-top: ${sizes(4)};
  line-height: ${sizes(5)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: ${sizes(8)};
  }
`

export const ButtonsGroup = styled.div`
  display: none;
  @media screen and (min-width: ${breakpoints.small}) {
    margin-top: ${sizes(8)};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
export const UploadButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    margin-right: ${sizes(2)};
    position: relative;
    top: 0.125em;
    width: ${sizes(4)};
    height: ${sizes(4)};
  }
`

export const DragDropText = styled(Text)`
  margin-right: ${sizes(5)};
  color: ${colors.gray[300]};
  text-decoration: underline;
`
