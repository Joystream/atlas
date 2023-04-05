import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
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

export const StyledButton = styled(Button)`
  margin-left: auto;
  align-self: flex-start;
  ${media.sm} {
    margin-left: unset;
  }
`

export const OverflowHiddenWrapper = styled.div`
  overflow: hidden;
  margin-left: auto;
`

export const StyledSelect = styled(Select)`
  width: unset;
` as typeof Select

export const StartWrapper = styled.div<{ enableHorizonthalScrolling: boolean }>`
  overflow: ${({ enableHorizonthalScrolling }) => (enableHorizonthalScrolling ? 'hidden' : 'unset')};
  display: flex;
  gap: ${sizes(4)};
`
