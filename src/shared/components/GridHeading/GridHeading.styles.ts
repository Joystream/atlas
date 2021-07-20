import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

export const GridHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${sizes(10)};
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[700]};
`
