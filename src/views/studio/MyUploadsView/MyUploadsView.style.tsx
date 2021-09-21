import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/shared/components/Text'
import { sizes } from '@/shared/theme'

export const UploadsContainer = styled(LimitedWidthContainer)`
  padding-bottom: 120px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const StyledText = styled(Text)`
  margin: ${sizes(12)} 0;
`
