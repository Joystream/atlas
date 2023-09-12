import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled(FlexBox)`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  background-color: ${cVar('colorBackground')};
  box-shadow: -4px 0 0 0 ${cVar('colorBorderPrimary')};
  gap: ${sizes(4)};
  padding: ${sizes(6)};
  ${media.sm} {
    grid-template-columns: 1fr auto;
  }
`

export const InfoBox = styled.div`
  width: 100%;
  display: grid;
  gap: ${sizes(4)};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`
