import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const SwitchLabel = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export const SwitchSlider = styled.div`
  box-shadow: inset 0 0 0 1px ${cVar('colorBorderAlpha')};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
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
    background-color: ${cVar('colorBorderAlpha')};
    transition: transform ${cVar('animationTransitionFast')}, width ${cVar('animationTransitionFast')},
      background-color ${cVar('animationTransitionFast')};
  }
`

export const SwitchCheckbox = styled.input`
  position: absolute;
  cursor: pointer;
  width: 40px;
  height: 24px;
  opacity: 0;
  visibility: hidden;
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
      background-color: ${cVar('colorBackgroundMutedAlpha')};
      box-shadow: inset 0 0 0 1px ${cVar('colorBorderMutedAlpha')};

      ::before {
        background-color: ${cVar('colorBackgroundMutedAlpha')};
      }
    }

    :checked {
      + ${SwitchSlider} {
        background-color: ${cVar('colorBackgroundStrongAlpha')};

        ::before {
          background-color: ${cVar('colorTextMuted')};
        }
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
`
export const LabelText = styled(Text)`
  margin-left: ${sizes(2)};
`

export const SwitchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;

  :hover {
    ${SwitchCheckbox}:not(:disabled):not(:checked) {
      + ${SwitchSlider} {
        box-shadow: inset 0 0 0 2px ${cVar('colorBorderStrongAlpha')};

        ::before {
          background-color: ${cVar('colorBorderStrongAlpha')};
        }
      }
    }

    ${SwitchCheckbox}:checked:not(:disabled):not(:active) {
      + ${SwitchSlider} {
        background-color: ${cVar('colorBackgroundPrimaryStrong')};
      }
    }
  }
`
