import styled from '@emotion/styled'

import { SvgActionTrash } from '@/assets/icons'
import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div<{ columns?: string[] }>`
  display: grid;
  grid-template-columns: 6fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  width: 100%;
  min-width: 1000px;
  height: fit-content;
  padding: ${sizes(4)};
  border-top: 1px solid rgb(194 224 255 / 0.2);

  > *:last-child {
    justify-content: end;

    ::after {
      text-align: end;
    }
  }

  :hover {
    background-color: rgb(187 217 246 / 0.13);
  }

  .playlist-buttons {
    &-enter {
      opacity: 0;
      transform: translateY(100%);
    }

    &-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
    }

    &-exit,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
    }

    &-exit-active {
      opacity: 0;
      transform: translateY(100%);
      transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
    }
  }

  .playlist-info {
    &-enter {
      opacity: 0;
      transform: translateY(-100%);
    }

    &-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
    }

    &-exit,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
    }

    &-exit-active {
      opacity: 0;
      transform: translateY(-100%);
      transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
    }
  }
`

export const Cell = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
`

export const StyledSvgActionTrash = styled(SvgActionTrash)`
  path {
    fill: ${cVar('colorTextError')};
  }
`

export const Test = styled.div`
  width: 200px;
  height: 106px;
  background-color: blueviolet;
`

export const HoverContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;

  > * {
    position: absolute;
  }
`
