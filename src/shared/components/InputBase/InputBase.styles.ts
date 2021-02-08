import { colors, sizes, transitions, typography } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled'

type FormGroupProps = {
  error?: boolean
  disabled?: boolean
}

export const FormGroup = styled.div<FormGroupProps>`
  max-width: 300px;
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
  input,
  button {
    transition: all ${transitions.timings.regular} ${transitions.easing};
    background: none;
    padding: ${sizes(3)};
    font-size: ${typography.sizes.subtitle2};
  }

  input,
  button,
  label {
    cursor: pointer;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      input,
      button,
      label {
        pointer-events: none;
      }
    `};
`

export const LabelText = styled.span`
  position: absolute;
  top: 12px;
  left: 9px;
  padding: 1px ${sizes(1)};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  color: ${colors.gray[400]};
  background-color: none;
  font-size: ${typography.sizes.subtitle2};

  transition: all ${transitions.timings.regular} ${transitions.easing}, background-color 250ms;
`

export const labelOnTop = css`
  transform: translateY(-19px);
  background-color: ${colors.black};
  font-size: ${sizes(3)};
  color: ${colors.gray[300]};
`

export const styledinputStates = {
  default: css`
    border: 1px solid ${colors.gray[400]};
  `,
  activated: css`
    border: 1px solid ${colors.gray[200]};
    color: ${colors.gray[200]};
  `,
  focused: css`
    border: 1px solid ${colors.blue[500]};
    color: ${colors.white};
  `,
  filled: css`
    border: 1px solid ${colors.gray[300]};
    color: ${colors.gray[300]};
  `,
  disabled: css`
    border: 1px solid ${colors.gray[700]};
    color: ${colors.gray[700]};
  `,
  error: css`
    border: 1px solid ${colors.error};
    background: red;
  `,
  warning: css``,
}

type HelperTextProps = {
  helperTextVariant?: 'default' | 'error' | 'warning'
}

const helperVariants = {
  default: colors.gray[400],
  error: colors.error,
  warning: colors.warning,
}

export const HelperText = styled.p<HelperTextProps>`
  font-size: ${sizes(3)};
  margin-top: 10px;
  margin-left: 12px;
  color: ${({ helperTextVariant = 'default' }) => helperVariants[helperTextVariant]};
`
