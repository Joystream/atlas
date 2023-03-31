import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

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

export const FiltersAndSortWrapper = styled.div`
  display: flex;
  gap: ${sizes(4)};
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

export const TabsMobileWrapper = styled.div`
  max-width: max-content;
`

export const TitleAndSearchWrapper = styled.div`
  display: flex;
  gap: ${sizes(4)};
  margin-right: auto;
`
