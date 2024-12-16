import styled from '@emotion/styled'
import TextareaAutosize from 'react-textarea-autosize'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes, square } from '@/styles'

export const CommentTemplateWrapper = styled.div`
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  padding: ${sizes(4)};
  display: flex;
  align-items: flex-start;
  gap: ${sizes(4)};
  border-radius: ${sizes(1)};
  border: 1px solid ${cVar('colorBackgroundMutedAlpha')};
`

export const CommentHeaderDot = styled.div`
  background-color: ${cVar('colorBackgroundStrongAlpha')};
  border-radius: 100%;
  ${square(4)};
`
export const CommentHeader = styled.header`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

export const CommentBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${sizes(2)};
`

export const TextAreaContainer = styled.div<{ active?: boolean }>`
  padding: ${sizes(4)};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  transition: all ${cVar('animationTransitionMedium')};
  ${({ active }) =>
    active
      ? `
      border-bottom: 1px solid ${cVar('colorBorderStrongAlpha')};
    `
      : `
      border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')};
      &:hover {
        border-bottom: 1px solid ${cVar('colorBorderStrongAlpha')};
      }
    `}
`

export const TextAreaWrapper = styled.div`
  position: relative;
`

export const CustomPlaceholder = styled(Text)`
  position: absolute;
  opacity: 0;
  top: 0;
  pointer-events: none;
  transition: all ${cVar('animationTransitionMedium')};
`

export const StyledTextArea = styled(TextareaAutosize)<{ 'data-processing'?: boolean }>`
  display: inline-block;
  background-color: transparent;
  width: 100%;
  min-height: 40px;
  height: auto;
  border: none;
  resize: none;
  caret-color: ${cVar('colorTextStrong')};
  color: ${cVar('colorTextStrong')};
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};

  :placeholder-shown ~ ${CustomPlaceholder} {
    opacity: 1;
  }

  ::placeholder {
    opacity: 0;
  }

  &[data-processing='true'] {
    color: ${cVar('colorText')};
  }
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${sizes(4)};
  flex-direction: column;
  ${media.xs} {
    flex-direction: row;
  }
`

export const ToggleButton = styled(Button)<{ 'active'?: boolean }>`
  display: flex;
  flex-direction: row;
  padding: ${sizes(4)};
  border-radius: ${cVar('radiusMedium')};
  color: ${({ active }) => (active ? cVar('colorTextStrong') : cVar('colorText'))};
  border: ${({ active }) => (active ? `1px solid ${cVar('colorBackgroundStrongAlpha')}` : 'none')};
  box-shadow: none;
`
