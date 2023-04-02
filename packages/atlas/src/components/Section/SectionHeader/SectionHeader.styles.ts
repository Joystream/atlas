import styled from '@emotion/styled'

import { Select } from '@/components/_inputs/Select'
import { cVar, media, sizes } from '@/styles'

type SectionHeaderWrapperProps = {
  isTabs: boolean
}

export const MobileFirstRow = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
`

export const MobileSecondRow = styled.div`
  width: 100%;
  display: flex;
  gap: ${sizes(2)};
`

export const FiltersAndSortWrapper = styled.div`
  display: flex;
  gap: ${sizes(4)};
`

export const SectionHeaderWrapper = styled.header<SectionHeaderWrapperProps>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: ${sizes(4)};
  ${media.sm} {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: ${({ isTabs }) => (isTabs ? 'start' : 'center')};
    box-shadow: ${({ isTabs }) => (isTabs ? `inset 0 -1px 0 ${cVar('colorBorderMutedAlpha')}` : 'unset')};
  }
`

export const TabsMobileWrapper = styled.div`
  min-width: 0;
  overflow: hidden;
`

export const RightSideWrapper = styled.div<{ isTabs: boolean }>`
  overflow: ${({ isTabs }) => (isTabs ? 'unset' : 'hidden')};
  display: flex;
  margin-left: auto;
  gap: ${sizes(4)};
`

export const StyledSelect = styled(Select)`
  width: unset;
` as typeof Select

export const StartWrapper = styled.div<{ isTabs: boolean }>`
  overflow: ${({ isTabs }) => (isTabs ? 'hidden' : 'unset')};
  display: flex;
  gap: ${sizes(4)};
`
