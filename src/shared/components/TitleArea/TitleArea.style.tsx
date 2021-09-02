import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { colors, media, sizes, typography } from '@/shared/theme'

import { Text } from '../Text'

export const Container = styled.div`
  position: relative;
  width: fit-content;
`

type StyledInputProps = {
  touchedAndEmpty?: boolean
}

export const StyledInput = styled.input<StyledInputProps>`
  --input-max-width: 60vw;

  caret-color: ${colors.blue[500]};
  ${media.sm} {
    --input-max-width: 400px;
  }

  ${media.md} {
    --input-max-width: 600px;
  }

  line-height: 1;
  padding: ${sizes(1)} 0 ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '48px' })};

  color: white;
  background-color: ${colors.transparent};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  border: none;
  min-width: 100px;
  max-width: var(--input-max-width);
  height: 52px;

  &:hover {
    opacity: 75%;
  }

  ::placeholder {
    color: ${colors.gray[500]};
  }

  + ${() => TitleAreaInfo} {
    ${({ touchedAndEmpty }) => touchedAndEmpty && `opacity: 1`};
  }

  :focus,
  :invalid {
    + ${() => TitleAreaInfo} {
      opacity: 1;
    }
  }
`

type TitleAreaInfoProps = {
  error?: boolean
}

export const TitleAreaInfo = styled.div<TitleAreaInfoProps>`
  display: grid;
  opacity: 0;
  max-width: 600px;
  padding: ${sizes(1)} 0 ${sizes(2)} ${sizes(2)};
  grid-template-columns: 1fr 1fr;
  grid-gap: ${sizes(9)};
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
