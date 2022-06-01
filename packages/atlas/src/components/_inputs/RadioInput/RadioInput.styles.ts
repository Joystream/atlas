import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, transitions } from '@/styles'

export type RadioButtonStyleProps = Partial<{
  disabled: boolean
  checked: boolean
}> &
  RadioButtonCaptionProps

type RadioButtonCaptionProps = {
  error?: boolean
}

export const Input = styled.input`
  margin: auto;
  opacity: 0;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

export type CustomRadioInputProps = {
  disabled?: boolean
  checked?: boolean
  error?: boolean
}

export const hoverState = (checked?: boolean) => {
  return css`
    border: ${checked ? `4px solid ${cVar('colorCoreBlue500')}` : `1px solid ${cVar('colorCoreNeutral200')}`};

    &::before {
      background-color: ${cVar('colorCoreNeutral700Lighten')};
    }
  `
}
export const activeState = (checked?: boolean) => {
  return css`
    border: ${checked ? `border: 4px solid ${cVar('colorCoreNeutral50')}` : `1px solid ${cVar('colorCoreNeutral50')}`};

    &::after {
      content: '';
      position: absolute;
      top: -4px;
      bottom: -4px;
      left: -4px;
      right: -4px;
      display: ${checked ? 'block' : 'none'};
      border-radius: 50%;
      border: 1px solid ${cVar('colorCoreNeutral50')};
    }

    &::before {
      background-color: ${cVar('colorCoreNeutral800Lighten')};
    }
  `
}

const colorFromProps = ({ error, checked, disabled }: RadioButtonStyleProps) => {
  if (disabled) {
    return css`
      opacity: 0.5;
      background-color: ${checked ? cVar('colorCoreNeutral50') : cVar('colorCoreNeutral400')};
      border: ${checked ? `4px solid ${cVar('colorCoreNeutral400')}` : `1px solid ${cVar('colorCoreNeutral300')}`};
      background-clip: ${checked ? 'content-box' : 'unset'};

      &::before {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: ${checked ? cVar('colorCoreNeutral50') : 'transparent'};
      }
    `
  } else if (error) {
    return css`
      background-color: ${checked ? cVar('colorCoreNeutral50') : 'transparent'};
      border: ${checked ? `4px solid ${cVar('colorCoreRed400')}` : `1px solid ${cVar('colorCoreRed400')}`};
      padding: 0;
    `
  } else {
    return css`
      border: ${checked ? `4px solid ${cVar('colorCoreBlue500')}` : `1px solid ${cVar('colorCoreNeutral300')}`};
      background-color: ${checked ? cVar('colorCoreNeutral50') : 'transparent'};
      padding: ${checked ? 0 : '3px'};

      &::before {
        transition: background-color 200ms ${transitions.easing};
      }

      &:hover {
        ${hoverState(checked)};
      }

      &:focus {
        border-color: ${checked ? cVar('colorCoreBlue500') : cVar('colorCoreNeutral700')};

        &::before {
          background-color: ${checked ? cVar('colorCoreBlue200') : cVar('colorCoreNeutral50')};
        }
      }

      &:active {
        ${activeState(checked)};
      }
    `
  }
}

export const CustomRadioInput = styled.div<CustomRadioInputProps>`
  position: relative;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-clip: content-box;
  padding: 3px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;

  &::before {
    content: '';
    top: ${({ checked }) => (checked ? '-12px' : '-9px')};
    bottom: ${({ checked }) => (checked ? '-12px' : '-9px')};
    left: ${({ checked }) => (checked ? '-12px' : '-9px')};
    right: ${({ checked }) => (checked ? '-12px' : '-9px')};
    border-radius: 50%;
    position: absolute;
    z-index: -1;
  }
  ${colorFromProps};

  & + span {
    color: ${(props) => (props.checked ? cVar('colorCoreBaseWhite') : '')};
  }

  transition: background-color 0.25s ease, border-color 0.25s ease;
`
