import styled from '@emotion/styled'
import { colors, media, sizes } from '@/shared/theme'
import { DismissibleMessage } from '@/shared/components'

export const ViewContainer = styled.div`
  padding-top: ${sizes(8)};
`

export const TabsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px;
  padding-top: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: solid 1px ${colors.gray[800]};
`

export const PaginationContainer = styled.div`
  padding-top: ${sizes(6)};
  padding-bottom: ${sizes(16)};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledDismissibleMessage = styled(DismissibleMessage)`
  margin-bottom: ${sizes(8)};
`

export const SortContainer = styled.div`
  display: none;
  grid-gap: 8px;
  grid-template-columns: auto 1fr;
  align-items: center;

  ${media.medium} {
    display: grid;
  }
`
