import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import TextareaAutosize from 'react-textarea-autosize'

import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const Container = styled.div`
  position: relative;
`

type TitleAreaInfoProps = {
  visible?: boolean
}

export const TitleAreaInfo = styled.div<TitleAreaInfoProps>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${sizes(1)};
`

export const StyledTextArea = styled(TextareaAutosize, { shouldForwardProp: isPropValid })<{ error?: boolean }>`
  caret-color: ${cVar('colorCoreBlue500')};
  color: ${({ error }) => cVar(error ? 'colorTextError' : 'colorTextStrong')};
  background-color: transparent;
  border: none;
  width: 100%;
  resize: none;
  height: auto;
  font: ${cVar('typographyDesktopH500')};
  letter-spacing: ${cVar('typographyDesktopH500LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH500TextTransform')};
  transition: opacity ${cVar('animationTransitionFast')};
  ${media.sm} {
    font: ${cVar('typographyDesktopH700')};
    letter-spacing: ${cVar('typographyDesktopH700LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH700TextTransform')};
  }

  &:hover:not(:focus) {
    opacity: 0.5;
  }

  ::placeholder {
    color: ${({ error }) => cVar(error ? 'colorTextError' : 'colorTextMuted')};
  }

  :focus,
  :invalid {
    + ${TitleAreaInfo} {
      display: flex;
    }
  }
`

type CharactersCounterProps = {
  hasValue: boolean
}

export const MinMaxChars = styled(Text)`
  white-space: nowrap;
  margin-right: ${sizes(2)};
  margin-bottom: ${sizes(1)};
  color: ${cVar('colorTextMuted')};
`

export const CounterText = styled(Text)`
  color: ${cVar('colorTextMuted')};
`

export const CharactersCounter = styled(Text)<CharactersCounterProps>`
  color: ${({ hasValue }) => cVar(hasValue ? 'colorTextStrong' : 'colorTextMuted')};
  font-feature-settings: 'tnum' on, 'lnum' on;
`
