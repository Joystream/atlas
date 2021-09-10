import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/shared/components/Text'
import { sizes } from '@/shared/theme'

export const UploadsContainer = styled(LimitedWidthContainer)`
  padding-bottom: 120px;
  height: calc(100% - ${sizes(8)});
`

export const EmptyFallbackWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const StyledText = styled(Text)`
  margin: ${sizes(8)} 0;
`
