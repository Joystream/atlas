import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components'
import { Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

export const UploadsContainer = styled(LimitedWidthContainer)`
  padding-bottom: 120px;
`

export const StyledText = styled(Text)`
  margin: ${sizes(8)} 0;
`
