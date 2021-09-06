import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, transitions } from '@/shared/theme'

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

const colorFromProps = ({ error, checked, disabled }: CustomRadioInputProps) => {
  if (disabled) {
    return css`
      opacity: 0.5;
      background-color: ${checked ? colors.blue[50] : colors.gray[400]};
      border: ${checked ? `2px solid ${colors.gray[400]}` : `1px solid ${colors.gray[200]}`};
      background-clip: ${checked ? 'content-box' : 'unset'};

      &::before {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: ${colors.transparent};
      }
    `
  } else if (error) {
    return css`
      background-color: ${checked ? colors.error : colors.transparent};
      border: ${checked ? `2px solid ${colors.error}` : `1px solid ${colors.error}`};
    `
  } else {
    return css`
      border: ${checked ? `2px solid ${colors.blue[500]}` : `1px solid ${colors.gray[200]}`};
      background-color: ${checked ? colors.blue[50] : colors.transparent};

      &::before {
        transition: background-color 200ms ${transitions.easing};
      }

      &:hover {
        border: ${checked ? `2px solid ${colors.blue[500]}` : `1px solid ${colors.gray[200]}`};

        &::before {
          background-color: ${colors.transparentPrimary[12]};
        }
      }

      &:focus {
        border-color: ${checked ? colors.transparent : colors.gray[700]};

        &::before {
          background-color: ${checked ? colors.blue[200] : colors.gray[50]};
        }
      }

      &:active {
        border: 1px solid ${colors.gray[50]};
        padding: ${checked && '4px'};

        &::before {
          background-color: ${colors.transparentPrimary[6]};
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
  width: 18px;
  height: 18px;

  &::before {
    content: '';
    top: -8px;
    bottom: -8px;
    left: -8px;
    right: -8px;
    border-radius: 50%;
    position: absolute;
    z-index: -1;
  }
  ${colorFromProps};

  & + span {
    color: ${(props) => (props.checked ? colors.white : '')};
  }

  transition: background-color 0.25s ease, border-color 0.25s ease;
`
