import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar } from '@/styles'

export const SwitchLabel = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export const SwitchSlider = styled.div`
  box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  border-radius: 24px;
  transition: box-shadow ${cVar('animationTransitionFast')}, background-color ${cVar('animationTransitionFast')};

  /* slider thumb */

  ::before {
    border-radius: 999px;
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: ${cVar('colorTextMuted')};
    transition: transform ${cVar('animationTransitionFast')}, width ${cVar('animationTransitionFast')},
      background-color ${cVar('animationTransitionFast')};
  }
`

const hoverUncheckedStyles = css`
  + ${SwitchSlider} {
    background-color: ${cVar('colorBackgroundAlpha')};
    box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
  }
`

const hoverCheckedStyles = css`
  + ${SwitchSlider} {
    background-color: ${cVar('colorBackgroundPrimaryStrong')};
  }
`

export const SwitchCheckbox = styled.input`
  position: absolute;
  cursor: pointer;
  width: 40px;
  height: 24px;
  opacity: 0;
  z-index: 1;

  :checked {
    + ${SwitchSlider} {
      box-shadow: unset;
      background-color: ${cVar('colorBackgroundPrimary')};

      ::before {
        transform: translateX(16px);
        background-color: ${cVar('colorTextStrong')};
      }
    }
  }

  :disabled {
    cursor: not-allowed;

    + ${SwitchSlider} {
      background-color: ${cVar('colorBackgroundAlpha')};
      box-shadow: unset;

      ::before {
        background-color: ${cVar('colorBackgroundStrongAlpha')};
      }
    }
  }

  :active:not(:disabled) {
    + ${SwitchSlider} {
      ::before {
        width: 20px;
      }
    }
  }

  :checked:active:not(:disabled) {
    + ${SwitchSlider} {
      background-color: ${cVar('colorBackgroundPrimaryMuted')};

      ::before {
        transform: translateX(12px);
        width: 20px;
      }
    }
  }

  @supports selector(:focus-visible) {
    :focus-visible:not(:disabled):not(:checked) {
      ${hoverUncheckedStyles};
    }

    :focus-visible:checked:not(:disabled):not(:active) {
      ${hoverCheckedStyles};
    }
  }

  @supports selector(not(:focus-visible)) {
    :focus:not(:disabled):not(:checked) {
      ${hoverUncheckedStyles};
    }

    :focus:checked:not(:disabled):not(:active) {
      ${hoverCheckedStyles};
    }
  }
`

export const SwitchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;

  :hover {
    ${SwitchCheckbox}:not(:disabled):not(:checked) {
      ${hoverUncheckedStyles};
    }

    ${SwitchCheckbox}:checked:not(:disabled):not(:active) {
      ${hoverCheckedStyles};
    }
  }
`
