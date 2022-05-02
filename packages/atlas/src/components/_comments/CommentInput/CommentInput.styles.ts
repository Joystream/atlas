import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import TextareaAutosize from 'react-textarea-autosize'

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

  ::placeholder {
    color: ${cVar('colorTextMuted')};
    font: ${cVar('typographyDesktopT200')};
    letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
    text-transform: ${cVar('typographyDesktopT200TextTransform')};
    transition: all ${cVar('animationTransitionFast')};
  }

  &[data-processing='true'] {
    color: ${cVar('colorText')};
  }
`

export const Border = styled.div<{ 'data-focused': boolean; 'data-processing': boolean }>`
  overflow-x: hidden;
  width: 100%;
  height: 1px;
  background-color: ${cVar('colorCoreNeutral800Lighten')};
  transition: ${cVar('animationTransitionFast')};

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
      transition: transform ${cVar('animationTransitionFast')};
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

  &:hover {
    ${StyledTextArea}::placeholder {
      color: ${cVar('colorText')};
    }
  }

  &[data-show='true'] {
    /* expanded component default height - textarea initial height + current textarea height */
    height: calc(128px - 40px + ${({ height }) => height}px);
  }
`

export const StyledCommentRow = styled(CommentRow)`
  &:hover {
    ${Border} {
      &[data-show='false'][data-processing='false'] {
        background-color: ${cVar('colorBorderAlpha')};
      }
    }
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  padding: ${sizes(4)} 0 0 0;

  button:nth-last-child(2) {
    margin-right: ${sizes(2)};
  }
`

export const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`
