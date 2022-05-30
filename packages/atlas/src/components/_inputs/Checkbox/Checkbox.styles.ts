import { css } from '@emotion/react'
import styled from '@emotion/styled/'

import { SvgActionCheck } from '@/components/_icons'
import { cVar, sizes, transitions } from '@/styles'

export const Container = styled.div<CheckboxStateProps>`
  position: relative;
  width: max-content;
  padding: ${sizes(2)};
  margin: -${sizes(2)};
  cursor: pointer;
  border-radius: 100%;
  color: ${cVar('colorCoreNeutral300')};
  transition: background ${transitions.timings.loading} ${transitions.easing};

  :hover {
    background: ${({ disabled }) => !disabled && cVar('colorCoreNeutral700Lighten')};
    box-shadow: ${({ disabled }) => !disabled && cVar('colorCoreNeutral700Lighten')};
  }
`

const selectedStyles = (props: CheckboxStateProps) =>
  props.selected
    ? css`
        background-color: ${props.selected ? cVar('colorCoreBlue500') : 'transparent'};
        border: 1px solid ${cVar('colorCoreBlue500')};
      `
    : null
const disabledStyles = (props: CheckboxStateProps) =>
  props.disabled
    ? [
        css`
          cursor: not-allowed;
          opacity: 0.5;
          border: 1px solid ${cVar('colorCoreNeutral300')};
          background-color: ${cVar('colorCoreNeutral400')};
        `,
        props.selected &&
          css`
            background-color: ${cVar('colorCoreNeutral700')};
            border: 1px solid ${cVar('colorCoreNeutral700')};
            color: ${cVar('colorCoreNeutral400')};
          `,
      ]
    : null
const errorStyles = (props: CheckboxStateProps) =>
  props.error
    ? [
        css`
          border: 1px solid ${cVar('colorCoreRed400')};
        `,
        props.selected &&
          css`
            background-color: ${cVar('colorCoreRed400')};
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
  color: white;
  border: 1px solid ${cVar('colorCoreNeutral300')};
  border-radius: 2px;
  ${selectedStyles};
  ${errorStyles};
  ${disabledStyles};

  &:active {
    border: 1px solid ${cVar('colorCoreNeutral100')};
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

export const StyledGlyphCheck = styled(SvgActionCheck)`
  position: absolute;
`
