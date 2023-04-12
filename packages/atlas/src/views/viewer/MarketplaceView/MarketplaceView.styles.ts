import styled from '@emotion/styled'

import { Grid } from '@/components/Grid'
import { cVar, media, sizes } from '@/styles'

export const HeaderWrapper = styled.div`
  position: relative;
  z-index: 50;
`

export const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${sizes(4)};
  align-items: center;
  padding: ${sizes(4)} 0;
  border-bottom: 1px solid ${cVar('colorCoreNeutral700')};
  background-color: ${cVar('colorCoreBaseBlack')};
  ${media.sm} {
    grid-template-columns: auto 1fr 180px;
  }
`

export const StyledGrid = styled(Grid)<{ isFiltersOpen: boolean }>`
  position: relative;

  ${media.sm} {
    margin-top: ${({ isFiltersOpen }) => sizes(isFiltersOpen ? 30 : 12)};
    transition: margin-top ${cVar('animationTransitionMedium')};
  }
`
