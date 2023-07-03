import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

import { SizeProps, sizeObj } from './NftWidget.styles'

export const NftHistoryHeader = styled.div<SizeProps>`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: ${sizes(6)};
  user-select: none;

  &[data-size=${sizeObj.small}] {
    padding: ${sizes(4)};
  }

  &[data-open='true'] {
    padding-bottom: 0;
  }
`

type HistoryPanelProps = SizeProps
export const HistoryPanel = styled.div<HistoryPanelProps>`
  background-color: ${cVar('colorBackgroundMuted')};
  position: relative;
  display: grid;
  gap: ${sizes(6)};
  padding: ${sizes(2)} ${sizes(6)} ${sizes(6)} ${sizes(6)};
  overflow: hidden auto;
  max-height: 376px;

  &[data-size=${sizeObj.small}] {
    max-height: 400px;
    gap: ${sizes(4)};
    padding: ${sizes(4)};
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
