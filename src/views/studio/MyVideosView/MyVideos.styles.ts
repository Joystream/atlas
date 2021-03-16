import styled from '@emotion/styled'
import { colors, sizes } from '@/shared/theme'
import { DismissibleMessage, Text } from '@/shared/components'

export const ViewContainer = styled.div`
  padding-top: ${sizes(8)};
`
export const StyledText = styled(Text)``

export const TabsContainer = styled.div`
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

export const VideosContainer = styled.div``
