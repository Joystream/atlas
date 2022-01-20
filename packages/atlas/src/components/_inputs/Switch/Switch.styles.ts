import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const SwitchLabel = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

export const SwitchWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
`

export const SwitchSlider = styled.div<{ disabled?: boolean }>`
  box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  border-radius: 24px;
  transition: box-shadow ${cVar('animationTransitionFast')}, background-color ${cVar('animationTransitionFast')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  /* slider thumb */

  ::before {
    border-radius: 50%;
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

  :hover {
    box-shadow: inset 0 0 0 ${({ disabled }) => (disabled ? 1 : 2)}px ${cVar('colorCoreNeutral400')};
  }
`

export const SwitchCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  :checked {
    + ${SwitchSlider} {
      box-shadow: unset;
      background-color: ${cVar('colorCoreBlue500')};

      :hover {
        background-color: ${cVar('colorCoreBlue700')};
      }

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
