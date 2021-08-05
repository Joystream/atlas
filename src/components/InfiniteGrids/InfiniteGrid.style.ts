import styled from '@emotion/styled'

import { SkeletonLoader, Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'

export const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  margin-bottom: ${sizes(4)};
`

export const LoadMoreButtonWrapper = styled.div`
  margin-top: ${sizes(10)};
`

export const TitleWrapper = styled.div`
  display: flex;
`

export const LanguageSelectWrapper = styled.div`
  margin-left: ${sizes(6)};
  width: ${sizes(34)};
`

export const Separator = styled.div`
  height: 1px;
  background-color: ${colors.gray[700]};
  margin-top: ${sizes(12)};
  margin-bottom: ${sizes(24)};
`
