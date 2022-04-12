import styled from '@emotion/styled'
import TextareaAutosize from 'react-textarea-autosize'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const StyledTextArea = styled(TextareaAutosize)<{ 'data-show': boolean }>`
  display: none;
  background-color: ${cVar('colorBackgroundMuted')};
  width: 100%;
  min-height: 40px;
  height: auto;
  border: none;
  resize: none;
  caret-color: ${cVar('colorBackgroundPrimary')};
  color: ${cVar('colorTextStrong')};
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};

  &:focus,
  &:active {
    /* background-color: red; */
  }

  ::placeholder {
    color: ${cVar('colorTextMuted')};
    font: ${cVar('typographyDesktopT200')};
    letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200TextTransform')};
    transition: all ${cVar('animationTransitionFast')};
  }

  &[data-show='true'] {
    display: inline-block;
  }
`

export const StyledText = styled(Text)`
  user-select: none;
  transition: all ${cVar('animationTransitionFast')};
`

export const Container = styled.div`
  padding: ${sizes(4)};
  background-color: ${cVar('colorBackgroundMuted')};
  cursor: text;
  box-shadow: ${cVar('effectDividersBottom')};
  transition: all ${cVar('animationTransitionFast')};

  &:hover {
    box-shadow: inset 0 -1px 0 0 ${cVar('colorBorderAlpha')};

    ${StyledTextArea}::placeholder {
      color: ${cVar('colorText')};
    }
  }
`
