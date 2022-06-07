import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, square } from '@/styles'

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
  padding: 4px;
  box-sizing: border-box;
  border: 1px solid ${({ error }) => cVar(error ? 'colorBorderError' : 'colorBorderAlpha')};
  transition: all ${cVar('animationTransitionFast')};

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
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  z-index: 999;

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
        box-shadow: inset 0 0 0 4px
          ${({ error }) => cVar(error ? 'colorBackgroundErrorMuted' : 'colorBackgroundPrimaryStrong')};
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
