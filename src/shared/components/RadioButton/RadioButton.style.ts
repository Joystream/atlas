import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes, transitions } from '@/shared/theme'

import { HelperText } from '../HelperText/HelperText'
import { Text } from '../Text'

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

const colorFromProps = ({ error, checked, disabled }: RadioButtonStyleProps) => {
  if (disabled) {
    return css`
      opacity: 0.5;
      background-color: ${checked ? colors.gray[50] : colors.gray[400]};
      border: ${checked ? `4px solid ${colors.gray[400]}` : `1px solid ${colors.gray[200]}`};
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
      background-color: ${checked ? colors.gray[50] : colors.transparent};
      border: ${checked ? `4px solid ${colors.secondary.alert[100]}` : `1px solid ${colors.secondary.alert[100]}`};
      padding: 0;
    `
  } else {
    return css`
      border: ${checked ? `4px solid ${colors.blue[500]}` : `1px solid ${colors.gray[300]}`};
      background-color: ${checked ? colors.gray[50] : colors.transparent};
      padding: ${checked ? 0 : '3px'};

      &::before {
        transition: background-color 200ms ${transitions.easing};
      }

      &:hover {
        border: ${checked ? `4px solid ${colors.blue[500]}` : `1px solid ${colors.gray[200]}`};

        &::before {
          background-color: ${colors.transparentPrimary[18]};
        }
      }

      &:focus {
        border-color: ${checked ? colors.blue[500] : colors.gray[700]};

        &::before {
          background-color: ${checked ? colors.blue[200] : colors.gray[50]};
        }
      }

      &:active {
        border: ${checked ? `border: 4px solid ${colors.gray[50]}` : `1px solid ${colors.gray[50]}`};

        &::after {
          content: '';
          position: absolute;
          top: -4px;
          bottom: -4px;
          left: -4px;
          right: -4px;
          display: ${checked ? 'block' : 'none'};
          border-radius: 50%;
          border: 1px solid ${colors.gray[50]};
        }

        &::before {
          background-color: ${colors.transparentPrimary[10]};
        }
      }
    `
  }
}

export const RadioButtonLabel = styled.label<RadioButtonStyleProps>`
  --radio-button-size: 16px;
  --radio-button-container-size: ${sizes(6)};

  display: inline-grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  grid-column-gap: ${sizes(1)};
  grid-row-gap: ${sizes(1)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

export const RadioButtonContainer = styled.div`
  width: var(--radio-button-container-size);
  height: var(--radio-button-container-size);
  display: flex;
  justify-content: center;
  align-items: center;
`

export const StyledInput = styled.div<RadioButtonStyleProps>`
  position: relative;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-clip: content-box;
  padding: 3px;
  box-sizing: border-box;
  width: var(--radio-button-size);
  height: var(--radio-button-size);

  &::before {
    content: '';
    border-radius: 50%;
    position: absolute;
    z-index: -1;
    ${({ checked }) => `
      top: ${checked ? '-12px' : '-9px'};
      bottom: ${checked ? '-12px' : '-9px'};
      left: ${checked ? '-12px' : '-9px'};
      right: ${checked ? '-12px' : '-9px'};
    `}
  }
  ${colorFromProps};

  & + span {
    color: ${(props) => (props.checked ? colors.white : '')};
  }

  transition: background-color 0.25s ease, border-color 0.25s ease;
`

export const StyledLabelText = styled(Text)`
  color: ${colors.gray[50]};
`

export const StyledHelperText = styled(HelperText)<RadioButtonCaptionProps>`
  margin: 0;
  grid-column-start: 2;

  span {
    ${({ error }) => !error && `color: ${colors.gray[300]}`}
  }
`
