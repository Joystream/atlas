import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

import {
  InputSize,
  NodeWidthProps,
  getInputPseudoSelectorStyles,
  getPadding,
  horizontalPadding,
  sharedInputStyles,
} from '../inputs.utils'

type TextInputProps = {
  error?: boolean
  inputSize: InputSize
} & NodeWidthProps

export const TextInput = styled.input<TextInputProps>`
  width: 100%;
  padding: ${sizes(3)} ${sizes(5)};

  ::-webkit-outer-spin-button,
  ::-webkit-search-cancel-button,
  ::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type='number'],
  &[type='search'] {
    appearance: textfield;
  }

  ${({ inputSize, leftNodeWidth, rightNodeWidth }) => getPadding(inputSize, { leftNodeWidth, rightNodeWidth })};

  ${({ error }) => getInputPseudoSelectorStyles({ error })};
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
        padding-left: calc(${horizontalPadding[size]});
      `
    : css`
        right: 0;
        padding-right: calc(${horizontalPadding[size]} - ${isButton ? sizes(1) : '0px'});
      `

export const NodeContainer = styled.div<NodeContainerProps>`
  position: absolute;
  display: grid;
  cursor: pointer;
  grid-auto-flow: column;
  align-content: center;
  align-items: center;
  gap: ${sizes(2)};
  z-index: 2;
  top: 0;
  bottom: 0;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  > svg > path {
    fill: ${cVar('colorText')};
    transition: ${cVar('animationTransitionFast')};
  }

  ${nodePlacementStyles};
`

export const InputContainer = styled(Text)`
  position: relative;

  :focus-within {
    ${TextInput} {
      ${sharedInputStyles.focus};
    }
    ${NodeContainer} {
      > svg > path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
`
