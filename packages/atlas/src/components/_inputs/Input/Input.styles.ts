import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export type InputSize = 'medium' | 'large'

export const sharedInputStyles = {
  default: css`
    /* inherit from Text component font size and color */
    font-size: inherit;
    color: inherit;

    /* line height needs to be set for inputs explicitly */
    line-height: ${sizes(6)};
    border: none;
    caret-color: ${cVar('colorBackgroundPrimary')};
    background-color: ${cVar('colorBackgroundMutedAlpha')};
    transition: ${cVar('animationTransitionFast')};
    transition-property: background-color, color, box-shadow;
    box-shadow: inset 0 -1px 0 0 ${cVar('colorBorder')};

    ::placeholder {
      font: inherit;
      color: ${cVar('colorTextMuted')};
    }
  `,
  hover: css`
    background-color: ${cVar('colorBackgroundAlpha')};
  `,
  error: css`
    box-shadow: inset 0 -1px 0 0 ${cVar('colorBorderError')};
  `,
  disabled: css`
    opacity: 0.5;
    background-color: ${cVar('colorBackgroundMutedAlpha')};
  `,
  focus: css`
    background-color: ${cVar('colorBackgroundMutedAlpha')};
    box-shadow: inset 0 -1px 0 0 ${cVar('colorBorderPrimary')};
  `,
}

export const horizontalPadding = {
  medium: sizes(4),
  large: sizes(5),
} as const

export const verticalPadding = {
  medium: sizes(2),
  large: sizes(3),
} as const

type NodeWidthProps = {
  leftNodeWidth?: number
  rightNodeWidth?: number
}

const getPadding = (size: InputSize, nodeWidthProps?: NodeWidthProps) => {
  const paddingLeft = nodeWidthProps?.leftNodeWidth
    ? `${nodeWidthProps?.leftNodeWidth + sizes(2, true)}px`
    : horizontalPadding[size]

  const paddingRight = nodeWidthProps?.rightNodeWidth
    ? `${nodeWidthProps?.rightNodeWidth + sizes(2, true)}px`
    : horizontalPadding[size]

  return css`
    padding-top: ${verticalPadding[size]};
    padding-bottom: ${verticalPadding[size]};
    padding-left: ${paddingLeft};
    padding-right: ${paddingRight};
  `
}

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

  ${sharedInputStyles.default};

  ${({ inputSize, leftNodeWidth, rightNodeWidth }) => getPadding(inputSize, { leftNodeWidth, rightNodeWidth })};

  :hover:not(:disabled) {
    ${sharedInputStyles.hover};
  }

  :focus:not(:disabled) {
    ${sharedInputStyles.focus};
  }

  :disabled {
    ${sharedInputStyles.disabled};
  }

  ${({ error }) => error && sharedInputStyles.error};
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
