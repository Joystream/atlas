import styled from '@emotion/styled'

import { colors, media, sizes, typography } from '@/shared/theme'

import { Text } from '../Text'

export const Container = styled.div`
  position: relative;
`

type StyledInputProps = {
  touchedAndEmpty?: boolean
}

type TitleAreaInfoProps = {
  error?: boolean
}

export const TitleAreaInfo = styled.div<TitleAreaInfoProps>`
  display: grid;
  opacity: 0;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${sizes(8)};
`

export const StyledInput = styled.textarea<StyledInputProps>`
  caret-color: ${colors.blue[500]};
  font-size: ${typography.sizes.h4};
  color: white;
  background-color: ${colors.transparent};
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  border: none;
  width: 100%;
  resize: none;
  height: auto;

  &:hover {
    opacity: 75%;
  }

  ::placeholder {
    color: ${colors.gray[500]};
  }

  + ${TitleAreaInfo} {
    ${({ touchedAndEmpty }) => touchedAndEmpty && `opacity: 1`};
  }

  :focus,
  :invalid {
    + ${TitleAreaInfo} {
      opacity: 1;
    }
  }
  ${media.sm} {
    font-size: ${typography.sizes.h2};
  }
`

type CharactersCounterProps = {
  error?: boolean
}

export const MinMaxChars = styled(Text)`
  white-space: nowrap;
`

export const CharactersCounter = styled(Text)<CharactersCounterProps>`
  ${({ error }) => error && `color: ${colors.error}`};

  font-feature-settings: 'tnum' on, 'lnum' on;
`
