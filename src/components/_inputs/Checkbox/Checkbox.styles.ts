import { css } from '@emotion/react'
import styled from '@emotion/styled/'

import { SvgGlyphCheck } from '@/components/_icons'
import { oldColors, sizes, transitions } from '@/styles'

export const Container = styled.div<CheckboxStateProps>`
  position: relative;
  width: max-content;
  padding: ${sizes(2)};
  margin: -${sizes(2)};
  cursor: pointer;
  border-radius: 100%;
  color: ${oldColors.gray[300]};
  transition: background ${transitions.timings.loading} ${transitions.easing};

  :hover {
    background: ${({ disabled }) => !disabled && oldColors.transparentPrimary[18]};
    box-shadow: ${({ disabled }) => !disabled && oldColors.transparentPrimary[18]};
  }
`

const selectedStyles = (props: CheckboxStateProps) =>
  props.selected
    ? css`
        background-color: ${props.selected ? oldColors.blue[500] : 'transparent'};
        border: 1px solid ${oldColors.blue[500]};
      `
    : null
const disabledStyles = (props: CheckboxStateProps) =>
  props.disabled
    ? [
        css`
          cursor: not-allowed;
          opacity: 0.5;
          border: 1px solid ${oldColors.gray[300]};
          background-color: ${oldColors.gray[400]};
        `,
        props.selected &&
          css`
            background-color: ${oldColors.gray[700]};
            border: 1px solid ${oldColors.gray[700]};
            color: ${oldColors.gray[400]};
          `,
      ]
    : null
const errorStyles = (props: CheckboxStateProps) =>
  props.error
    ? [
        css`
          border: 1px solid ${oldColors.secondary.alert[100]};
        `,
        props.selected &&
          css`
            background-color: ${oldColors.secondary.alert[100]};
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
  color: ${oldColors.white};
  border: 1px solid ${oldColors.gray[300]};
  border-radius: 2px;
  ${selectedStyles};
  ${errorStyles};
  ${disabledStyles};

  &:active {
    border: 1px solid ${oldColors.gray[100]};
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
  width: 14px;
  height: 14px;
  border-radius: 1px;
`

export const StyledGlyphCheck = styled(SvgGlyphCheck)`
  position: absolute;
`
