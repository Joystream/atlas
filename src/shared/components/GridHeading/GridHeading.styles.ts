import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

export const GridHeadingContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: start;
  margin-bottom: ${sizes(12)};
  padding-bottom: ${sizes(5)};
  border-bottom: 1px solid ${colors.gray[700]};
`
