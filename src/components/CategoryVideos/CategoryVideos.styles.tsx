import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

export const Container = styled.div`
  margin: ${sizes(16)} 0 0 0;
`

export const FiltersSearchContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  grid-template-columns: 1fr auto;

  ${media.md} {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
`

export const ControlsContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[700]};

  ${media.md} {
    grid-template-columns: auto 168px 1fr 241px;
    align-items: center;
  }
`

export const SortContainer = styled.div`
  border-left: 1px solid ${colors.gray[700]};
  padding-left: ${sizes(4)};
  display: grid;
  grid-gap: 8px;
  align-items: center;
  grid-template-columns: 1fr;
  ${media.xs} {
    grid-template-columns: auto 1fr;
    grid-area: initial;
  }
`

export const FiltersContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  justify-content: space-between;
  padding: ${sizes(4)};
  background-color: ${colors.gray[900]};
`

export const FiltersInnerContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  grid-auto-flow: column;
  grid-auto-columns: max-content;
`
