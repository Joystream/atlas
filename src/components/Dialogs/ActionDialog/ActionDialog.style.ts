import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { media, sizes, colors, typography } from '@/shared/theme'
import { Button } from '@/shared/components'

type ButtonProps = {
  error?: boolean
  warning?: boolean
}

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;

  > * + * {
    margin-top: ${sizes(2)};
  }

  ${media.small} {
    flex-direction: row-reverse;
    margin-left: auto;

    > * + * {
      margin-top: 0;
      margin-right: ${sizes(2)};
    }

    * + & {
      margin-top: 0;
    }
  }
`

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding-top: ${sizes(6)};

  ${media.small} {
    flex-direction: row;
    align-items: center;
  }
`

export const AdditionalActionsContainer = styled.div`
  width: 100%;
  margin-bottom: ${sizes(6)};

  ${media.small} {
    margin-bottom: 0;
    margin-right: ${sizes(6)};
  }
`

const buttonColorsFromProps = ({ error, warning }: ButtonProps) => {
  let color, bgColor, borderColor, bgActiveColor, borderActiveColor

  if (warning) {
    color = 'var(--warning-font-color)'
    bgColor = 'var(--warning-bg-color)'
    borderColor = 'var(--warning-bg-color)'
    bgActiveColor = 'var(--warning-bg-active-color)'
    borderActiveColor = 'var(--warning-border-active-color)'
  }
  if (error) {
    color = 'var(--error-font-color)'
    bgColor = 'var(--error-bg-color)'
    borderColor = 'var(--error-bg-color)'
    bgActiveColor = 'var(--error-bg-active-color)'
    borderActiveColor = 'var(--error-border-active-color)'
  }

  const boxShadow = error || warning ? `inset 0px 0px 0px 1px ${borderActiveColor}` : 'none'

  return css`
    color: ${color};
    background-color: ${bgColor};
    border-color: ${borderColor};
    &:hover {
      color: ${color};
      background-color: ${bgColor};
      border-color: ${borderColor};
      box-shadow: none;
    }
    &:active {
      color: ${color};
      background-color: ${bgActiveColor};
      border-color: ${borderActiveColor};
      box-shadow: ${boxShadow};
    }
  `
}

export const StyledPrimaryButton = styled(Button)<ButtonProps>`
  --warning-bg-color: #f49525;
  --warning-bg-active-color: #da7b0b;
  --warning-border-active-color: #49290440;
  --warning-font-color: #492904;

  --error-bg-color: #e53333;
  --error-bg-active-color: #cc1a1a;
  --error-border-active-color: #44090966;
  --error-font-color: #440909;

  ${buttonColorsFromProps}
`
