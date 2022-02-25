import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

import { SizeProps, sizeObj } from './NftWidget.styles'

type OpenProps = { 'data-open': boolean }

export const NftHistoryHeader = styled.div<SizeProps>`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: ${sizes(6)};
  user-select: none;
  cursor: pointer;

  &[data-size=${sizeObj.small}] {
    padding: ${sizes(4)};
  }
`

export const StyledChevronButton = styled(Button)<OpenProps>`
  transform: rotate(0);
  transform-origin: center;
  transition: ${cVar('animationTransitionFast')};

  &[data-open='true'] {
    transform: rotate(180deg);
  }
`

type HistoryPanelProps = { width: number } & SizeProps
export const HistoryPanel = styled.div<HistoryPanelProps>`
  background-color: ${cVar('colorBackgroundMuted')};
  position: absolute;
  width: ${({ width }) => width}px;
  display: grid;
  gap: ${sizes(6)};
  height: 280px;
  padding: 0 ${sizes(6)} ${sizes(6)} ${sizes(6)};
  overflow: hidden auto;
  transition: transform ${cVar('animationTransitionMedium')}, height ${cVar('animationTransitionMedium')};
  will-change: height, transform;

  &[data-size=${sizeObj.small}] {
    gap: ${sizes(4)};
    padding: 0 ${sizes(4)} ${sizes(4)} ${sizes(4)};
  }

  &.history-enter {
    transform: translateY(-100%);
    z-index: -1;
  }

  &.history-enter-active {
    transform: translateY(0);
  }

  &.history-enter-done {
    z-index: unset;
  }

  &.history-exit {
    transform: translateY(0);
    z-index: unset;
  }

  &.history-exit-active {
    transform: translateY(-100%);
    z-index: -1;
  }
`

export const HistoryItemContainer = styled.div<SizeProps>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${sizes(4)};
  align-items: center;

  &[data-size=${sizeObj.small}] {
    gap: ${sizes(2)};
  }
`

export const TextContainer = styled.div`
  display: grid;
  gap: ${sizes(1)};
`

export const CopyContainer = styled.div`
  display: flex;
`

export const ValueContainer = styled.div`
  display: grid;
  gap: ${sizes(1)};
  grid-auto-rows: max-content;
`

export const JoyPlusIcon = styled.div`
  display: grid;
  gap: ${sizes(1)};
  align-items: center;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
`

export const DollarValue = styled(Text)`
  text-align: end;
`
