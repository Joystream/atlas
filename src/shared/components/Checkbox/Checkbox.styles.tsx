import { sizes, colors, transitions } from '@/shared/theme'
import { css } from '@emotion/react'
import styled from '@emotion/styled/'
import HelperText from '../HelperText'
import Text from '../Text'

type CheckboxLabelProps = {
  disabled?: boolean
}

export const CheckboxLabel = styled.label<CheckboxLabelProps>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin: 0;
  align-items: center;
  display: inline-flex;
  flex-wrap: wrap;
`

export const LabelText = styled(Text)`
  margin-left: ${sizes(4)};
  color: ${colors.gray[50]};
`

export const Container = styled.div<CheckboxStateProps>`
  position: relative;
  width: max-content;
  padding: ${sizes(2)};
  margin: -${sizes(2)};
  cursor: pointer;
  border-radius: 100%;
  color: ${colors.gray[300]};
  transition: background ${transitions.timings.loading} ${transitions.easing};
  :hover {
    background: ${({ disabled }) => !disabled && colors.transparentPrimary[12]};
  }
`

const selectedStyles = (props: CheckboxStateProps) =>
  props.selected
    ? css`
        background-color: ${props.selected ? colors.blue[500] : 'transparent'};
        border: 1px solid ${colors.blue[500]};
      `
    : null
const disabledStyles = (props: CheckboxStateProps) =>
  props.disabled
    ? [
        css`
          cursor: not-allowed;
          opacity: 0.5;
          border: 1px solid ${colors.gray[200]};
          background-color: ${colors.gray[400]};
        `,
        props.selected &&
          css`
            background-color: ${colors.gray[700]};
            border: 1px solid ${colors.gray[700]};
            color: ${colors.gray[400]};
          `,
      ]
    : null
const errorStyles = (props: CheckboxStateProps) =>
  props.error
    ? [
        css`
          border: 1px solid ${colors.error};
        `,
        props.selected &&
          css`
            background-color: ${colors.error};
          `,
      ]
    : null
export type CheckboxStateProps = {
  selected: boolean
  disabled: boolean
  error: boolean
  isFocused: boolean
}
export const InnerContainer = styled.div<CheckboxStateProps>`
  transition: all 0.125s ease;
  color: ${colors.white};
  border: 1px solid ${colors.gray[300]};
  border-radius: 1px;
  ${selectedStyles}
  ${errorStyles}
  ${disabledStyles}
  &:active {
    border: 1px solid ${colors.gray[100]};
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

export const StyledHelperText = styled(HelperText)`
  margin-top: ${sizes(1)};
  flex-basis: 100%;
  margin-left: 38px;
`
