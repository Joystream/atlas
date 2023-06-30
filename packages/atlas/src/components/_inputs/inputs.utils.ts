import { css } from '@emotion/react'

import { cVar, sizes } from '@/styles'

export type InputSize = 'medium' | 'large'

export type NodeWidthProps = {
  leftNodeWidth?: number
  rightNodeWidth?: number
}

export const inputBorderColors = {
  default: cVar('colorBorderMutedAlpha'),
  hover: cVar('colorBorderAlpha'),
  error: cVar('colorBorderError'),
  focus: cVar('colorBorderPrimary'),
}

export const getSharedInputStyles = (ignoreBoxShadow?: boolean, disabledAttributeOnly?: boolean) => ({
  default: css`
    /* inherit from Text component font size and color */
    font-size: inherit;
    color: inherit;

    /* line height needs to be set for inputs explicitly */
    line-height: ${sizes(6)};
    border: none;
    caret-color: ${cVar('colorTextStrong')};
    background-color: ${cVar('colorBackgroundMutedAlpha')};
    transition: ${cVar('animationTransitionFast')};
    transition-property: background-color, color;

    /* ios specific - fixes issue with missing box-shadow and rounded corners in input component */
    border-radius: ${cVar('radiusSmall')};
    appearance: none;

    & + span {
      transition: ${cVar('animationTransitionFast')};
      transition-property: background-color, transform;
      width: 100%;
      background-color: ${ignoreBoxShadow ? 'transparent' : inputBorderColors.default};
      position: absolute;
      height: 2px;
      left: 0;
      bottom: 0;
      transform: translateY(1px);
    }

    ::placeholder {
      font: inherit;
      color: ${cVar('colorTextMuted')};

      /* Firefox sets opacity of placeholders to less than 1, that's why we need to set this */
      opacity: 1;
    }
  `,
  hover: css`
    background-color: ${cVar('colorBackgroundAlpha')};

    & + span {
      background-color: ${ignoreBoxShadow ? 'transparent' : inputBorderColors.hover};
    }
  `,
  error: css`
    & + span {
      background-color: ${ignoreBoxShadow ? 'transparent' : inputBorderColors.error};
    }
  `,
  disabled: disabledAttributeOnly
    ? null
    : css`
        opacity: 0.5;
        background-color: ${cVar('colorBackgroundMutedAlpha')};
        cursor: not-allowed;
      `,
  focus: css`
    & + span {
      background-color: ${ignoreBoxShadow ? 'transparent' : inputBorderColors.focus};
      transform: translateY(0);
    }

    background-color: ${cVar('colorBackgroundMutedAlpha')};
  `,
})

export const horizontalPadding = {
  medium: sizes(4, true),
  large: sizes(5, true),
} as const

export const verticalPadding = {
  medium: sizes(2, true),
  large: sizes(3, true),
} as const

type GetInputPaddingParams = {
  inputSize: InputSize
} & NodeWidthProps

export const getInputPadding = ({ inputSize, leftNodeWidth, rightNodeWidth }: GetInputPaddingParams) => {
  const paddingLeft = leftNodeWidth ? leftNodeWidth + sizes(2, true) : horizontalPadding[inputSize]

  const paddingRight = rightNodeWidth ? rightNodeWidth + sizes(2, true) : horizontalPadding[inputSize]

  return css`
    padding: ${verticalPadding[inputSize]}px ${paddingRight}px ${verticalPadding[inputSize]}px ${paddingLeft}px;
  `
}

export const getBaseInputStyles = ({
  error,
  ignoreBoxShadow,
  disabledAttributeOnly,
}: {
  error?: boolean
  ignoreBoxShadow?: boolean
  disabledAttributeOnly?: boolean
}) => css`
  ${getSharedInputStyles(ignoreBoxShadow).default};

  :disabled {
    ${getSharedInputStyles(ignoreBoxShadow, disabledAttributeOnly).disabled};
  }

  :hover:not(:disabled) {
    ${getSharedInputStyles(ignoreBoxShadow).hover};
  }

  :focus:not(:disabled) {
    ${getSharedInputStyles(ignoreBoxShadow).focus};
  }

  ${error && getSharedInputStyles(ignoreBoxShadow).error};
`
