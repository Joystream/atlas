import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

export const HeaderTitleWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  width: max-content;
  align-items: center;
  gap: ${sizes(3)};
`

export const HeaderTitle = styled(Text)`
  align-self: center;
`
