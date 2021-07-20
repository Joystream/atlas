import styled from '@emotion/styled'

import { Placeholder, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

export const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const StyledPlaceholder = styled(Placeholder)`
  margin-bottom: ${sizes(4)};
`

export const LoadMoreButtonWrapper = styled.div`
  margin-top: ${sizes(10)};
`
