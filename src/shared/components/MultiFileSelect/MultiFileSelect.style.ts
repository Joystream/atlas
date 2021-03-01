import { colors, sizes, transitions, typography } from '@/shared/theme'
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

type ProgressBarProps = {
  fileUploaded?: boolean
}

type StepProps = {
  active?: boolean
}

export const DragAndDropContainer = styled.div`
  width: 640px;
`

export const DragAndDropArea = styled.div<DragAndDropAreaProps>`
  position: relative;

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

export const ProgressBar = styled.div<ProgressBarProps>`
  width: 100%;
  height: 100%;
  background-color: ${colors.blue[500]};
  opacity: 0.2;
  position: absolute;
  clip-path: inset(0% ${({ fileUploaded }) => (fileUploaded ? 0 : 100)}% 0% 0%);
  transition: clip-path ${transitions.timings.loading} ${transitions.easing};
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

export const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: ${sizes(10)};
`

export const Step = styled.div<StepProps>`
  padding: ${sizes(3)} ${sizes(4)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${({ active }) => (active ? colors.blue[500] : colors.gray[600])};
`

export const StepStatus = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const StepNumber = styled.div<StepProps>`
  background-color: ${({ active }) => (active ? colors.blue[500] : colors.gray[600])};
  font-size: ${typography.sizes.subtitle2};
  color: ${colors.white};
  margin-right: 10px;
  border-radius: 100%;
  height: ${sizes(7)};
  width: ${sizes(7)};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StepDetails = styled.div`
  width: 100%;
`

export const FileType = styled(Text)`
  display: block;
  color: ${colors.gray[300]};
`

export const FileName = styled(Text)`
  display: block;
  font-family: ${typography.fonts.headers};
  font-size: ${typography.sizes.caption};
`

export const DeleteButton = styled.button`
  padding: ${sizes(2)};
  border: none;
  background: none;
  cursor: pointer;
`

export const TrashIcon = styled(Icon)`
  color: ${colors.gray[600]};
  height: ${sizes(4)};
`
export const StepDivider = styled.div`
  width: ${sizes(12)};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.gray[600]};
`

export const Thumbnail = styled.div`
  flex-shrink: 0;
  color: white;
  background: ${colors.gray[600]};
  background-size: 100% 100%;
  width: ${sizes(7)};
  height: ${sizes(6)};
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    height: 8px;
    width: 8px;
  }
  img {
    width: 100%;
    height: 100%;
  }
`
