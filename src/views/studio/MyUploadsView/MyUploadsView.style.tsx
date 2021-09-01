import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopbarBase'
import { Text } from '@/shared/components/Text'
import { sizes } from '@/shared/theme'

export const UploadsContainer = styled(LimitedWidthContainer)`
  padding-bottom: 120px;
  min-height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px - ${sizes(8)});
`

export const StyledText = styled(Text)`
  margin: ${sizes(8)} 0;
`
