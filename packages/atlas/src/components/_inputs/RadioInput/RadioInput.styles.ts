import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes, square, zIndex } from '@/styles'

type StyledRadioInputProps = {
  error?: boolean
  disabled?: boolean
}

export const StyledRadioInput = styled.div<StyledRadioInputProps>`
  ${square('16px')};

  position: relative;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-clip: content-box;
  padding: ${sizes(1)};
  box-sizing: border-box;
  border: 1px solid ${({ error }) => cVar(error ? 'colorBorderError' : 'colorBorderAlpha')};
  transition: all ${cVar('animationTransitionFast')};

  /* highlight */

  ::before {
    content: '';
    display: block;
    background-color: transparent;
    top: -9px;
    bottom: -9px;
    left: -9px;
    right: -9px;
    border-radius: 50%;
    position: absolute;
    z-index: -1;
    transition: all ${cVar('animationTransitionFast')};
  }

  /* inner dot */

  ::after {
    ${square('8px')};

    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
  }
`

const hoverStyles = css`
  :checked {
    + ${StyledRadioInput} {
      background-color: ${cVar('colorBackgroundPrimaryStrong')};
    }
  }
  + ${StyledRadioInput} {
    ::before {
      background-color: ${cVar('colorBackgroundStrongAlpha')};
    }
  }
`

export const Input = styled.input<{ error?: boolean }>`
  ${square('100%')};

  position: absolute;
  top: 0;
  left: 0;
  margin: auto;
  opacity: 0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  z-index: ${zIndex.overlay};

  :disabled:not(:checked) {
    + ${StyledRadioInput} {
      padding: 0;
      background-color: ${cVar('colorBackgroundAlpha')};
      box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
      border: 0;
    }
  }

  :checked:disabled {
    + ${StyledRadioInput} {
      padding: 0;
      background-color: ${cVar('colorBackgroundStrongAlpha')};
      border: 0;

      ::after {
        background-color: ${cVar('colorTextMuted')};
      }
    }
  }

  :checked:not(:disabled) {
    + ${StyledRadioInput} {
      padding: 0;
      background-color: ${({ error }) => cVar(error ? 'colorBackgroundError' : 'colorBackgroundPrimary')};
      border: 0;

      ::before {
        top: -8px;
        bottom: -8px;
        left: -8px;
        right: -8px;
      }

      ::after {
        background-color: ${cVar('colorTextStrong')};
      }
    }
  }

  :hover:not(:disabled) {
    ${hoverStyles}
  }

  :active:not(:disabled) {
    &:not(:checked) {
      + ${StyledRadioInput} {
        border: 1px solid ${({ error }) => cVar(error ? 'colorBorderError' : 'colorBackgroundStrongAlpha')};
      }
    }

    &:checked {
      + ${StyledRadioInput} {
        background-color: ${({ error }) => cVar(error ? 'colorBackgroundErrorMuted' : 'colorBackgroundPrimaryStrong')};
      }
    }
    + ${StyledRadioInput} {
      ::before {
        background-color: ${cVar('colorBackgroundAlpha')};
      }
    }
  }

  @supports selector(:focus-visible) {
    :focus-visible:not(:disabled):not(:checked) {
      ${hoverStyles}
    }

    :focus-visible:checked:not(:disabled):not(:active) {
      ${hoverStyles}
    }
  }

  @supports selector(not(:focus-visible)) {
    :focus:not(:disabled):not(:checked) {
      ${hoverStyles}
    }

    :focus:checked:not(:disabled):not(:active) {
      ${hoverStyles}
    }
  }
`

export type CustomRadioInputProps = {
  disabled?: boolean
  checked?: boolean
  error?: boolean
}

export const RadioInputWrapper = styled.div<CustomRadioInputProps>`
  position: relative;
`
