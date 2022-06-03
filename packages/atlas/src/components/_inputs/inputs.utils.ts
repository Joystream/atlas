import { css } from '@emotion/react'

import { cVar, sizes } from '@/styles'

export type InputSize = 'medium' | 'large'

export type NodeWidthProps = {
  leftNodeWidth?: number
  rightNodeWidth?: number
}

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

export const getPadding = (size: InputSize, nodeWidthProps?: NodeWidthProps) => {
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

export const getInputPseudoSelectorStyles = ({ error }: { error?: boolean }) => css`
  ${sharedInputStyles.default};

  :hover:not(:disabled) {
    ${sharedInputStyles.hover};
  }

  :focus:not(:disabled) {
    ${sharedInputStyles.focus};
  }

  :disabled {
    ${sharedInputStyles.disabled};
  }

  ${error && sharedInputStyles.error};
`
