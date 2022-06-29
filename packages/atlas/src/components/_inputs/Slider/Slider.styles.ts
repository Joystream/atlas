import styled from '@emotion/styled'
import RcSlider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { cVar } from '@/styles'

const THUMB_SIZE = 24
const TRACK_HEIGHT = 4

export const StyledRcSlider = styled(RcSlider)`
  .rc-slider-rail {
    height: ${TRACK_HEIGHT}px;
    border-radius: 0;
    background-color: ${cVar('colorCoreNeutral400')};
  }

  .rc-slider-track {
    height: ${TRACK_HEIGHT}px;
    border-radius: 0;
    background-color: ${cVar('colorCoreBlue500')};
  }

  .rc-slider-handle {
    width: ${THUMB_SIZE}px;
    height: ${THUMB_SIZE}px;
    margin-top: ${THUMB_SIZE / -2 + TRACK_HEIGHT / 2}px;
    background-color: ${cVar('colorCoreBaseWhite')};
    border-radius: 0;
    border: none;
    opacity: 1;

    &:hover {
      border: 1px solid ${cVar('colorCoreBlue300')};
    }

    &:active {
      border: 1px solid ${cVar('colorCoreBlue500')};
      box-shadow: none;
    }
  }

  &.rc-slider-disabled {
    background-color: ${cVar('colorCoreNeutral700')};
    opacity: 0.1;
  }
`
