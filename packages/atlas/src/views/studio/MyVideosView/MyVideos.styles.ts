import styled from '@emotion/styled'

import { Banner } from '@/components/Banner'
import { Grid } from '@/components/Grid'
import { Pagination } from '@/components/Pagination'
import { Button } from '@/components/_buttons/Button'
import { Select } from '@/components/_inputs/Select'
import { cVar, media, sizes } from '@/styles'

export const TabsContainer = styled.div`
  margin-bottom: ${sizes(12)};
  border-bottom: solid 1px ${cVar('colorCoreNeutral800')};
  ${media.sm} {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
  }
  ${media.md} {
    gap: ${sizes(4)};
    grid-template-columns: 1fr minmax(230px, 250px) max-content;
  }
`

export const StyledGrid = styled(Grid)`
  grid-auto-rows: 1fr;
`

export const StyledPagination = styled(Pagination)`
  padding-top: ${sizes(12)};
`

export const StyledBanner = styled(Banner)`
  margin-bottom: ${sizes(12)};
`

export const MobileButton = styled(Button)`
  margin-bottom: ${sizes(12)};
`

export const StyledSelect = styled(Select)`
  margin-bottom: ${sizes(4)};
  ${media.sm} {
    margin-left: auto;
    width: 250px;
  }
` as typeof Select

export const TitleBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: ${sizes(12)} 0;
  gap: ${sizes(6)};
`
