import styled from '@emotion/styled'

import { colors, typography } from '@/shared/theme'

import { TitleAreaVariant } from './'

import { Text } from '../Text'

export const Container = styled.div`
  position: relative;
`

type StyledTextAreaProps = {
  touchedAndEmpty?: boolean
  variant?: TitleAreaVariant
}

type TitleAreaInfoProps = {
  error?: boolean
  visible?: boolean
}

export const TitleAreaInfo = styled.div<TitleAreaInfoProps>`
  display: none;
  justify-content: space-between;
`

export const StyledTextArea = styled.textarea<StyledTextAreaProps>`
  caret-color: ${colors.blue[500]};
  color: white;
  background-color: ${colors.transparent};
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  border: none;
  width: 100%;
  resize: none;
  height: auto;
  font-size: ${({ variant }) => {
    if (variant === 'large') {
      return typography.sizes.h4
    }
    if (variant === 'small') {
      return typography.sizes.h2
    }
  }};

  &:hover {
    opacity: 75%;
  }

  ::placeholder {
    color: ${colors.gray[500]};
  }

  + ${TitleAreaInfo} {
    ${({ touchedAndEmpty }) => touchedAndEmpty && `display: flex`};
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
`

export const CharactersCounter = styled(Text)<CharactersCounterProps>`
  ${({ error }) => error && `color: ${colors.error}`};

  font-feature-settings: 'tnum' on, 'lnum' on;
`
