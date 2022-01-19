import styled from '@emotion/styled'

import { cVar } from '@/styles'

export const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
`

export const SwitchSlider = styled.div`
  box-shadow: inset 0 0 0 1px ${cVar('colorCoreNeutral400')};
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  border-radius: 24px;
  transition: all 200ms;

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
    transition: all 200ms;
  }

  :hover {
    box-shadow: inset 0 0 0 2px ${cVar('colorCoreNeutral400')};
  }
`

export const SwitchCheckbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  :active {
    + ${SwitchSlider} {
      ::before {
        width: 20px;
      }
    }
  }

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

    :active {
      + ${SwitchSlider} {
        ::before {
          transform: translateX(12px);
          width: 20px;
        }
      }
    }
  }
`
