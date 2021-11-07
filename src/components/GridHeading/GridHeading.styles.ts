import styled from '@emotion/styled'

import { colors, sizes } from '@/theme'

export const GridHeadingContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${sizes(5)};
  border-bottom: 1px solid ${colors.gray[700]};
  margin-bottom: ${sizes(12)};
`

export const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 40px;
  align-items: center;
`
