import { colors, sizes, transitions } from '@/shared/theme'
import styled from '@emotion/styled'
import Icon from '../Icon'
import Text from '../Text'
import { darken } from 'polished'

type DragAndDropAreaProps = {
  isFocused?: boolean
  isDragActive?: boolean
  isDragAccept?: boolean
  isDragReject?: boolean
  isFileDialogActive?: boolean
}

export const DragAndDropArea = styled.div<DragAndDropAreaProps>`
  background-color: ${darken(0.16, colors.gray[600])};
  cursor: pointer;
  width: 640px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all ${transitions.timings.routing} ${transitions.easing};
  border: 1px dashed
    ${({ isDragAccept, isFileDialogActive }) =>
      isDragAccept || isFileDialogActive ? colors.blue[500] : colors.gray[500]};
  background: ${({ isDragAccept }) =>
    isDragAccept && `radial-gradient(55.47% 148.24% at 50% 50%, rgba(0, 0, 0, 0) 0%, rgba(64, 56, 255, 0.2) 100%);`};
`

export const InnerContainer = styled.div`
  max-width: 350px;
  text-align: center;
`

export const StyledIcon = styled(Icon)`
  color: ${colors.gray[300]};
  width: 72px;
`

export const Title = styled(Text)`
  line-height: 1.2;
  margin-top: ${sizes(4)};
`

export const Paragraph = styled(Text)`
  margin-top: ${sizes(8)};
  line-height: ${sizes(5)};
`

export const ButtonsGroup = styled.div`
  margin-top: ${sizes(8)};
`
