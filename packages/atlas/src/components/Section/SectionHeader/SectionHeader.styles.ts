import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'
import { MaskProps, getMaskImage } from '@/utils/styles'

import { Text } from '../../Text'
import { Input } from '../../_inputs/Input'

type SectionHeaderWrapperProps = {
  isTabs: boolean
}

export const MobileFirstRow = styled.div`
  display: flex;
  width: 100%;
`

export const MobileSecondRow = styled.div`
  width: 100%;
  display: flex;
  gap: ${sizes(2)};
`

export const SectionHeaderWrapper = styled.header<SectionHeaderWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};
  ${media.sm} {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: ${({ isTabs }) => (isTabs ? 'start' : 'center')};
    box-shadow: ${({ isTabs }) => (isTabs ? `inset 0 -1px 0 ${cVar('colorBorderMutedAlpha')}` : 'unset')};
  }
`

export const SectionTitleWrapper = styled.div`
  display: flex;
  width: max-content;
  align-items: center;
  gap: ${sizes(3)};
`

export const SectionTitle = styled(Text)`
  align-self: center;
`

export const SearchInput = styled(Input)`
  max-width: 100%;
  ${media.sm} {
    width: 240px;
  }
`

export const SectionSearchWrapper = styled.div`
  width: 100%;
  ${media.sm} {
    width: unset;
  }
`

export const TabsWrapper = styled.div`
  max-width: max-content;
`

export const TitleAndSearchWrapper = styled.div`
  display: flex;
  gap: ${sizes(4)};
`

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
  margin-left: auto;
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
