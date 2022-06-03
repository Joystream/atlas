import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

import { InputSize, NodeWidthProps, getInputPseudoSelectorStyles, getPadding, horizontalPadding } from '../inputs.utils'

type TextInputProps = {
  error?: boolean
  inputSize: InputSize
} & NodeWidthProps

export const TextInput = styled.input<TextInputProps>`
  width: 100%;
  padding: ${sizes(3)} ${sizes(5)};

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type='number'] {
    appearance: textfield;
  }

  ${({ inputSize, leftNodeWidth, rightNodeWidth }) => getPadding(inputSize, { leftNodeWidth, rightNodeWidth })};

  ${({ error }) => getInputPseudoSelectorStyles({ error })};
`

export const InputContainer = styled(Text)`
  position: relative;
`

type NodeContainerProps = {
  left?: boolean
  size: InputSize
}
const nodePlacementStyles = ({ left, size }: NodeContainerProps) =>
  left
    ? css`
        left: 0;
        padding-left: ${horizontalPadding[size]};
      `
    : css`
        right: 0;
        padding-right: ${horizontalPadding[size]};
      `

export const NodeContainer = styled.div<NodeContainerProps>`
  position: absolute;
  display: grid;
  grid-auto-flow: column;
  align-content: center;
  align-items: center;
  gap: ${sizes(2)};
  z-index: 2;
  top: 0;
  bottom: 0;
  ${nodePlacementStyles};
`
