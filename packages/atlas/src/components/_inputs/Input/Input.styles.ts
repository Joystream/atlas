import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

import {
  InputSize,
  NodeWidthProps,
  getBaseInputStyles,
  getInputPadding,
  getSharedInputStyles,
  horizontalPadding,
} from '../inputs.utils'

type TextInputProps = {
  error?: boolean
  inputSize: InputSize
} & NodeWidthProps

export const TextInput = styled.input<TextInputProps>`
  width: 100%;

  ::-webkit-outer-spin-button,
  ::-webkit-search-cancel-button,
  ::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  :-webkit-autofill,
  :-webkit-autofill:hover,
  :-webkit-autofill:focus {
    -webkit-text-fill-color: ${cVar('colorTextStrong')};
    transition: background-color 9999s ease-in-out 0s;
  }

  &[type='number'],
  &[type='search'] {
    appearance: textfield;
  }

  ${getInputPadding};

  ${getBaseInputStyles};
`

type NodeContainerProps = {
  left?: boolean
  disabled?: boolean
  isButton?: boolean
  isFocused?: boolean
  size: InputSize
}
const nodePlacementStyles = ({ left, size, isButton }: NodeContainerProps) =>
  left
    ? css`
        left: 0;
        padding-left: ${horizontalPadding[size]}px;
      `
    : css`
        right: 0;
        padding-right: ${horizontalPadding[size] - (isButton ? sizes(2, true) : 0)}px;
      `

export const NodeContainer = styled.div<NodeContainerProps>`
  position: absolute;
  display: grid;
  grid-auto-flow: column;
  align-content: center;
  align-items: center;
  gap: ${sizes(2)};
  z-index: 1;
  top: 0;
  bottom: 0;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};

  > svg > path {
    fill: ${cVar('colorText')};
    transition: ${cVar('animationTransitionFast')};
  }

  ${nodePlacementStyles};
`

export const InputContainer = styled.div<{ size: InputSize }>`
  position: relative;
  height: max-content;
  font: ${({ size }) => (size === 'large' ? cVar('typographyDesktopT300') : cVar('typographyDesktopT200'))};
  overflow: hidden;
  border-radius: 0 0 ${cVar('radiusSmall')} ${cVar('radiusSmall')};

  :focus-within {
    ${TextInput} {
      ${getSharedInputStyles().focus};
    }
    ${NodeContainer} {
      > svg > path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
`
