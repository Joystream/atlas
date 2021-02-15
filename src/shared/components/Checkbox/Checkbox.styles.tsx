import theme from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled/'

export const Container = styled.div<CheckboxStateProps>`
  position: relative;
  width: max-content;
  padding: ${theme.sizes(2)};
  margin: -${theme.sizes(2)};
  cursor: pointer;
  border-radius: 9999px;
  color: ${theme.colors.gray[300]};
  ${({ isFocused, isHovered, selected, disabled }) =>
    (isFocused || isHovered) &&
    `background: ${theme.colors.gray[800]};
    ${selected && `background: ${theme.colors.blue[900]};`}
    ${disabled && `background: transparent;`}`}
`

const selectedStyles = (props: CheckboxStateProps) =>
  props.selected
    ? css`
        background-color: ${props.selected ? theme.colors.blue[500] : 'transparent'};
        border: 1px solid ${theme.colors.blue[500]};
      `
    : null
const disabledStyles = (props: CheckboxStateProps) =>
  props.disabled
    ? [
        css`
          cursor: not-allowed;
        `,
        props.selected &&
          css`
            background-color: ${props.disabled ? theme.colors.gray[700] : 'transparent'};
            border: 1px solid ${theme.colors.gray[700]};
            color: ${theme.colors.gray[400]};
          `,
      ]
    : null
const errorStyles = (props: CheckboxStateProps) =>
  props.error
    ? [
        css`
          border: 1px solid ${theme.colors.error};
        `,
        props.selected &&
          css`
            background-color: ${theme.colors.error};
          `,
      ]
    : null
export type CheckboxStateProps = {
  selected: boolean
  disabled: boolean
  error: boolean
  isFocused: boolean
  isHovered: boolean
}
export const InnerContainer = styled.div<CheckboxStateProps>`
  transition: all 0.125s ease;
  color: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray[300]};
  ${selectedStyles}
  ${errorStyles}
  ${disabledStyles}
  &:active {
    border: 1px solid ${theme.colors.gray[100]};
  }
`

export const Input = styled.input`
  top: 0;
  left: 0;
  margin: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: inherit;
`

export const Checkmark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 1px;
`
