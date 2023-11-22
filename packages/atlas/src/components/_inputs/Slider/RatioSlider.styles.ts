import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const TRANSITION_DURATION = '100ms'

export const Track = styled.svg`
  pointer-events: none;
  overflow: visible;
  height: ${sizes(6)};
  width: calc(100% - ${sizes(5)});
  margin: 0 ${sizes(1 / 2)} ${sizes(6)};

  .rail {
    stroke-width: ${sizes(1 / 2)};
    stroke: ${cVar('colorCoreNeutral600')};
    transition: all ${TRANSITION_DURATION};

    &-left {
      stroke: ${cVar('colorBackgroundPrimary')};
    }

    .steps .active {
      stroke: ${cVar('colorBackgroundPrimary')};
    }
  }

  .knob {
    paint-order: stroke;
    stroke-width: 0;
    stroke: ${cVar('colorBackgroundPrimary')};
    fill: ${cVar('colorBackgroundPrimary')};
    transition: all ${TRANSITION_DURATION};
  }

  .cutout-mask {
    paint-order: stroke;
    stroke-width: 0;
    stroke: #000;
    fill: #000;
    transition: all ${TRANSITION_DURATION};
  }

  text {
    font-size: ${sizes(3)};
    user-select: none;

    &:nth-of-type(1) {
      fill: ${cVar('colorTextMuted')};
      text-anchor: start;
    }

    &:nth-of-type(2) {
      fill: ${cVar('colorTextStrong')};
      text-anchor: middle;
    }

    &:nth-of-type(3) {
      fill: ${cVar('colorTextMuted')};
      text-anchor: end;
    }
  }
`

export const Range = styled.input`
  position: absolute;
  width: 100%;
  left: 0;
  opacity: 0;
  height: ${sizes(8)};
  cursor: grab;

  &:active {
    cursor: grabbing;

    & + svg .knob {
      fill: ${cVar('colorTextStrong')};
    }
  }

  &:active,
  &:hover {
    & + svg .knob,
    & + svg .cutout-mask {
      stroke-width: ${sizes(2)};
    }
  }
`
