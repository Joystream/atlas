import styled from '@emotion/styled'
import TextareaAutosize from 'react-textarea-autosize'

import { Text } from '@/components/Text'
import { colors, media, sizes, typography } from '@/theme'

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
  caret-color: ${colors.blue[500]};
  color: white;
  background-color: ${colors.transparent};
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  border: none;
  width: 100%;
  resize: none;
  height: auto;
  font-size: ${typography.sizes.h4};
  line-height: ${typography.lineHeights.h4};
  ${media.sm} {
    font-size: ${typography.sizes.h2};
    line-height: ${typography.lineHeights.h2};
  }

  &:hover {
    opacity: 75%;
  }

  ::placeholder {
    color: ${colors.gray[500]};
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
  ${({ error }) => error && `color: ${colors.secondary.alert[100]}`};

  font-feature-settings: 'tnum' on, 'lnum' on;
`
