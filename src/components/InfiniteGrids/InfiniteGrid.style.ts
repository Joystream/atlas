import styled from '@emotion/styled'

import { SkeletonLoader, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

export const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  margin-bottom: ${sizes(4)};
`

export const LoadMoreButtonWrapper = styled.div`
  margin-top: ${sizes(10)};
`
