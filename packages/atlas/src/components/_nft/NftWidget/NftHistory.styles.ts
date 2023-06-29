import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

import { SizeProps, sizeObj } from './NftWidget.styles'

type OpenProps = { 'data-open': boolean }

export const NftHistoryHeader = styled.div<SizeProps & OpenProps>`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: ${sizes(6)};
  user-select: none;
  cursor: pointer;

  &[data-size=${sizeObj.small}] {
    padding: ${sizes(4)};
  }

  &[data-open='true'] {
    padding-bottom: 0;
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

type FadingBlockProps = { width: number; 'data-bottom'?: boolean } & SizeProps
export const FadingBlock = styled.div<FadingBlockProps>`
  height: ${sizes(6)};
  background: linear-gradient(0deg, rgb(11 12 15 / 0) 0%, ${cVar('colorCoreNeutral900')} 100%);
  position: absolute;
  width: ${({ width }) => width}px;
  z-index: 1;

  &[data-size=${sizeObj.small}] {
    height: ${sizes(4)};
  }

  &[data-bottom] {
    transform: rotate(180deg);
    bottom: 0;
  }
`

type HistoryPanelProps = SizeProps & OpenProps
export const HistoryPanel = styled.div<HistoryPanelProps>`
  background-color: ${cVar('colorBackgroundMuted')};
  position: relative;
  display: grid;
  gap: ${sizes(6)};
  max-height: 280px;
  padding: ${sizes(6)};
  overflow: hidden auto;
  transition: transform ${cVar('animationTransitionFast')};
  will-change: transform;

  &[data-size=${sizeObj.small}] {
    gap: ${sizes(4)};
    padding: ${sizes(4)};
  }

  transform: translateY(-100%);
  z-index: -1;

  &[data-open='true'] {
    transform: translateY(0);
    z-index: unset;
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

export const HistoryPanelContainer = styled.div`
  position: relative;
`
