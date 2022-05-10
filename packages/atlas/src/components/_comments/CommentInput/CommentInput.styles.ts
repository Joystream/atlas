import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import TextareaAutosize from 'react-textarea-autosize'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import { CommentRow } from '../CommentRow'

const reactionBarAnimation = keyframes`
  from {
    transform: translateX(-50%) scaleX(50%);
  }
  to {
    transform: translateX(100%) scaleX(50%);
  }
`

export const TextAreaWrapper = styled.div`
  position: relative;
`

export const CustomPlaceholder = styled(Text)`
  position: absolute;
  padding: 2px;
  opacity: 0;
  top: 0;
  color: ${cVar('colorTextMuted')};
  user-select: none;
  transition: all ${cVar('animationTransitionMedium')};
`
export const CustomPlaceholderHandle = styled(Text)`
  color: inherit;
`

export const StyledTextArea = styled(TextareaAutosize)<{ 'data-processing': boolean }>`
  display: inline-block;
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

export const Border = styled.div<{ 'data-focused': boolean; 'data-processing': boolean }>`
  overflow-x: hidden;
  width: 100%;
  height: 1px;
  background-color: ${cVar('colorBorderMutedAlpha')};
  transition: all ${cVar('animationTransitionMedium')};
  pointer-events: none;

  &[data-focused='true'] {
    height: 2px;
    background-color: ${cVar('colorBackgroundPrimary')} !important;
  }

  &[data-processing='true'] {
    height: 2px;
    background-color: ${cVar('colorCoreNeutral700')};

    &::after {
      display: block;
      content: '';
      height: 100%;
      top: 0;
      left: 0;
      background-color: ${cVar('colorTextStrong')};
      transform-origin: left;
      transition: transform ${cVar('animationTransitionMedium')};
      animation: ${reactionBarAnimation} 1000ms ease-in-out infinite;
    }
  }
`

export const Container = styled.label<{ 'data-show': boolean; height: number }>`
  display: grid;
  justify-content: space-between;
  grid-template-columns: 1fr;
  min-height: 72px;
  height: 72px;
  padding: ${sizes(4)};
  background-color: ${cVar('colorBackgroundMuted')};
  cursor: text;
  transition: height ${cVar('animationTransitionMedium')};
  overflow: hidden;

  &[data-show='true'] {
    /* expanded component default height - textarea initial height + current textarea height */
    height: calc(128px - 40px + ${({ height }) => height}px);
  }
`

export const StyledCommentRow = styled(CommentRow)<{ 'show': boolean; 'processing': boolean }>`
  &:hover {
    ${({ processing, show }) => !show && !processing && Border} {
      background-color: ${cVar('colorBorderAlpha')};
    }

    ${StyledTextArea} ~ ${CustomPlaceholder} {
      color: ${cVar('colorText')};
    }
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  padding: ${sizes(4)} 0 0 0;

  button:nth-last-of-type(2) {
    margin-right: ${sizes(2)};
  }
`

export const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`
