import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { DismissibleBanner } from '@/shared/components/DismissibleBanner'
import { Text } from '@/shared/components/Text'
import { colors, media, sizes } from '@/shared/theme'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 120px;
`

export const StyledText = styled(Text)`
  margin: ${sizes(8)} 0;
`

export const TabsContainer = styled.div`
  padding-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};

  ${media.md} {
    display: grid;
    grid-template-columns: 1fr 250px;
  }
`

export const PaginationContainer = styled.div`
  padding-top: ${sizes(6)};
  padding-bottom: ${sizes(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledDismissibleBanner = styled(DismissibleBanner)`
  margin-bottom: ${sizes(8)};
`

export const SortContainer = styled.div`
  display: none;
  grid-gap: 8px;
  grid-template-columns: auto 1fr;
  align-items: center;
  ${media.md} {
    display: grid;
  }
`
