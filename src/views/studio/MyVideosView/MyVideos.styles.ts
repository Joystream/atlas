import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { DismissibleBanner } from '@/shared/components/DismissibleBanner'
import { Grid } from '@/shared/components/Grid'
import { Pagination } from '@/shared/components/Pagination'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { colors, media, sizes } from '@/shared/theme'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 120px;
`

export const StyledText = styled(Text)`
  margin: ${sizes(12)} 0;
`

export const TabsContainer = styled.div`
  margin: ${sizes(12)} 0;
  border-bottom: solid 1px ${colors.gray[800]};

  ${media.sm} {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
  }
  ${media.md} {
    gap: ${sizes(4)};
    grid-template-columns: 1fr 250px auto;
  }
`

export const StyledGrid = styled(Grid)`
  grid-auto-rows: 1fr;
`

export const StyledPagination = styled(Pagination)`
  padding-top: ${sizes(12)};
  padding-bottom: ${sizes(16)};
`

export const StyledDismissibleBanner = styled(DismissibleBanner)`
  margin-bottom: ${sizes(12)};
`

export const StyledSelect = styled(Select)`
  margin-bottom: ${sizes(4)};
  ${media.sm} {
    margin-left: auto;
    width: 250px;
  }
` as typeof Select
