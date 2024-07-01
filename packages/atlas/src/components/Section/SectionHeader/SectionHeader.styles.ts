import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { Select } from '@/components/_inputs/Select'
import { cVar, media, sizes } from '@/styles'

export const MobileFirstRow = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  gap: ${sizes(2)};
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
type SectionHeaderWrapperProps = {
  isTabs: boolean
  isSearchInputOpen?: boolean
}
export const SectionHeaderWrapper = styled.header<SectionHeaderWrapperProps>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: ${({ isSearchInputOpen, isTabs }) => sizes(isSearchInputOpen && isTabs ? 8 : 4)};
  ${media.sm} {
    gap: ${sizes(4)};
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: ${({ isTabs }) => (isTabs ? 'start' : 'center')};
    box-shadow: ${({ isTabs }) => (isTabs ? `inset 0 -1px 0 ${cVar('colorBorderMutedAlpha')}` : 'unset')};
  }
`

export const RightSide = styled.div`
  margin-left: auto;
  display: flex;
  gap: ${sizes(4)};
`

export const StyledButton = styled(Button)`
  align-self: flex-start;
`

export const OverflowHiddenWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-left: auto;
  gap: ${sizes(2)};
`

export const StyledSelect = styled(Select)`
  width: unset;
` as typeof Select

export const StartWrapper = styled.div<{ enableHorizonthalScrolling: boolean }>`
  overflow: ${({ enableHorizonthalScrolling }) => (enableHorizonthalScrolling ? 'hidden' : 'unset')};
  display: flex;
  gap: ${sizes(4)};
`

export const StyledArrowButton = styled(Button)`
  border-radius: unset;
`
