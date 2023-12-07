import styled from '@emotion/styled'

import { sizes } from '@/styles'
import { Divider } from '@/views/global/NftSaleBottomDrawer/NftForm/AcceptTerms/AcceptTerms.styles'

export const ChartBox = styled.div`
  margin: 100px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${sizes(8)};

  .chart-box {
    margin: -20px 0 0 -20px;
    width: calc(100% + 125px);
    height: 300px;
  }
`

export const HDivider = styled(Divider)`
  margin: ${sizes(4)} 0;
`
