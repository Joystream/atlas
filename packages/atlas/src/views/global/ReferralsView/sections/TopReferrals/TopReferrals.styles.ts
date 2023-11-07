import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { sizes } from '@/styles'

export const StyledTopReferrersGrid = styled(LayoutGrid)`
  display: grid;
  width: 100%;
  grid-template-rows: 1fr 1fr;
  gap: ${sizes(4)};
`
