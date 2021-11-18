import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { colors, media, sizes } from '@/theme'

export const TitleContainer = styled.div`
  z-index: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${sizes(21)} 0 ${sizes(12)} 0;
  padding-bottom: ${sizes(6)};
  border-bottom: 1px solid ${colors.gray[700]};
`

export const CategoriesContainer = styled(LayoutGrid)`
  margin-top: ${sizes(12)};
`

export const FallbackWrapper = styled.div`
  ${media.sm} {
    margin: 184px auto 124px auto;
  }
`
