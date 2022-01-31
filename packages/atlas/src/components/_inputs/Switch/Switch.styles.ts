import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const SwitchLabel = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export const SwitchSlider = styled.div`
  box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};
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
    background-color: ${cVar('colorCoreNeutral400')};
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
  z-index: 1;

  :disabled {
    cursor: not-allowed;
  }

  :checked {
    + ${SwitchSlider} {
      box-shadow: unset;
      background-color: ${cVar('colorCoreBlue500')};

      ::before {
        transform: translateX(16px);
        background-color: ${cVar('colorCoreNeutral50')};
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

export const SwitchWrapper = styled.div<{ disabled?: boolean }>`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;

  :hover {
    ${SwitchSlider} {
      ${({ disabled }) =>
        !disabled &&
        css`
          box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral400')};
        `};
    }
    ${SwitchCheckbox}:checked:not(:disabled) {
      + ${SwitchSlider} {
        background-color: ${cVar('colorCoreBlue700')};
      }
    }
  }
`
