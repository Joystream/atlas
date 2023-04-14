import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'
import { MaskProps, getMaskImage } from '@/utils/styles'

export const VerticalDivider = styled.div`
  width: 1px;
  background-color: ${cVar('colorBorderMutedAlpha')};
`

export const FiltersAndSortWrapper = styled.div`
  display: flex;
  gap: ${sizes(4)};
`

export const SectionFiltersWrapper = styled.div`
  display: flex;
  gap: ${sizes(2)};
  min-width: 0;
`

export const FiltersWrapper = styled.div<MaskProps>`
  display: flex;
  overflow: auto;
  width: max-content;
  gap: ${sizes(2)};
  scrollbar-width: none;
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }

  ${getMaskImage};
`

export const ChevronButtonHandler = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const ChevronButton = styled(Button)<{ direction: 'right' | 'left' }>`
  position: absolute;
  align-self: center;
  left: ${({ direction }) => (direction === 'left' ? 0 : 'unset')};
  right: ${({ direction }) => (direction === 'right' ? 0 : 'unset')};
`

export const FilterButtonWrapper = styled.div`
  width: max-content;
  flex-shrink: 0;
`
