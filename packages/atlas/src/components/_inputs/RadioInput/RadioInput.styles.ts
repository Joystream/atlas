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
    border: ${checked
      ? `4px solid ${cVar('colorBackgroundPrimaryStrong')}`
      : `1px solid ${cVar('colorBorderStrongAlpha')}`};

    :active {
      ${activeState(checked)}
    }

    ::before {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
    }
  `
}
export const activeState = (checked?: boolean) => {
  return css`
    border: ${checked
      ? `4px solid ${cVar('colorBackgroundPrimaryStrong')}`
      : `1px solid ${cVar('colorBorderStrongAlpha')}`};

    ::before {
      background-color: ${cVar('colorBackgroundAlpha')};
    }
  `
}

const colorFromProps = ({ error, checked, disabled }: RadioButtonStyleProps) => {
  if (disabled) {
    return css`
      background-color: ${checked ? cVar('colorTextMuted') : cVar('colorBackgroundAlpha')};
      border: ${checked
        ? `4px solid ${cVar('colorBackgroundStrongAlpha')}`
        : `1px solid ${cVar('colorBorderMutedAlpha')}`};
      background-clip: ${checked ? 'content-box' : 'unset'};

      &::after {
        content: '';
        border-radius: 50%;
        position: absolute;
        z-index: -1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: ${checked ? cVar('colorTextMuted') : 'transparent'};
      }
    `
  } else if (error) {
    return css`
      background-color: ${checked ? cVar('colorCoreNeutral50') : 'transparent'};
      border: ${checked ? `4px solid ${cVar('colorBackgroundError')}` : `1px solid ${cVar('colorBorderError')}`};
      padding: 0;

      :hover,
      :focus-within {
        border-color: ${cVar(checked ? 'colorBackgroundErrorStrong' : 'colorBorderError')};

        ::before {
          background-color: ${cVar('colorBackgroundStrongAlpha')};
        }
      }

      :active {
        border-color: ${cVar(checked ? 'colorBackgroundErrorMuted' : 'colorBorderError')};
      }
    `
  } else {
    return css`
      border: ${checked ? `4px solid ${cVar('colorBackgroundPrimary')}` : `1px solid ${cVar('colorBorderAlpha')}`};
      background-color: ${checked ? cVar('colorTextStrong') : 'transparent'};
      padding: ${checked ? 0 : '3px'};

      ::before {
        transition: background-color 200ms ${transitions.easing};
      }

      :hover,
      :focus-within {
        ${hoverState(checked)};
      }

      :focus {
        border-color: ${checked ? cVar('colorCoreBlue500') : cVar('colorCoreNeutral700')};

        &::before {
          background-color: ${checked ? cVar('colorCoreBlue200') : cVar('colorCoreNeutral50')};
        }
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
