import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { breakpoints, sizes, colors, typography } from '@/shared/theme'
import { Button } from '@/shared/components'

const BREAKPOINT = breakpoints.small

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

  @media screen and (min-width: ${BREAKPOINT}) {
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

  @media screen and (min-width: ${BREAKPOINT}) {
    flex-direction: row;
    align-items: center;
  }
`

export const AdditionalActionsContainer = styled.div`
  width: 100%;
  margin-bottom: ${sizes(6)};

  @media screen and (min-width: ${BREAKPOINT}) {
    margin-bottom: 0;
    margin-right: ${sizes(6)};
  }
`

const buttonColorsFromProps = ({ error, warning }: ButtonProps) => {
  let color, bgColor, borderColor, bgColorHover, borderColorHover
  if (warning) {
    color = 'var(--warning-font-color)'
    bgColor = 'var(--warning-bg-color)'
    borderColor = 'var(--warning-bg-color)'
    bgColorHover = 'var(--warning-bg-hover-color)'
    borderColorHover = 'var(--warning-border-hover-color)'
  }
  if (error) {
    color = 'var(--error-font-color)'
    bgColor = 'var(--error-bg-color)'
    borderColor = 'var(--error-bg-color)'
    bgColorHover = 'var(--error-bg-hover-color)'
    borderColorHover = 'var(--error-border-hover-color)'
  }
  return css`
    color: ${color};
    background-color: ${bgColor};
    border-color: ${borderColor};
    &:hover {
      color: ${color};
      background-color: ${bgColorHover};
      border-color: ${borderColorHover};
      box-shadow: inset 0px 0px 0px 1px ${borderColorHover};
    }
    &:active {
      color: ${color};
      background-color: ${bgColor};
      border-color: ${borderColor};
      box-shadow: none;
    }
  `
}

export const StyledPrimaryButton = styled(Button)<ButtonProps>`
  --warning-bg-color: #f49525;
  --warning-bg-hover-color: #da7b0b;
  --warning-border-hover-color: #49290440;
  --warning-font-color: #492904;

  --error-bg-color: #e53333;
  --error-bg-hover-color: #cc1a1a;
  --error-border-hover-color: #44090966;
  --error-font-color: #440909;

  font-weight: ${typography.weights.bold};
  ${buttonColorsFromProps}
`

export const StyledSecondaryButton = styled(Button)`
  background-color: ${colors.transparent};
`
