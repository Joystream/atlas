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
`

export const StyledTextArea = styled(TextareaAutosize)`
  caret-color: ${cVar('colorCoreBlue500')};
  color: ${cVar('colorCoreBaseWhite')};
  background-color: transparent;
  border: none;
  width: 100%;
  resize: none;
  height: auto;
  font: ${cVar('typographyDesktopH500')};
  letter-spacing: ${cVar('typographyDesktopH500LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH500TextTransform')};
  ${media.sm} {
    font: ${cVar('typographyDesktopH700')};
    letter-spacing: ${cVar('typographyDesktopH700LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH700TextTransform')};
  }

  &:hover {
    opacity: 0.75;
  }

  ::placeholder {
    color: ${cVar('colorCoreNeutral500')};
  }

  :focus,
  :invalid {
    + ${TitleAreaInfo} {
      display: flex;
    }
  }
`

type CharactersCounterProps = {
  error?: boolean
}

export const MinMaxChars = styled(Text)`
  white-space: nowrap;
  margin-right: ${sizes(2)};
  margin-bottom: ${sizes(1)};
`

export const CharactersCounter = styled(Text)<CharactersCounterProps>`
  ${({ error }) => error && `color: ${cVar('colorCoreRed400')}`};

  font-feature-settings: 'tnum' on, 'lnum' on;
`
