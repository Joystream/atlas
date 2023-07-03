import styled from '@emotion/styled'

import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { cVar, media, sizes } from '@/styles'

export const CustomNodeWrapper = styled.div`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto;
  gap: ${sizes(2)};
`

export const StyledJoyTokenIcon = styled(JoyTokenIcon)`
  position: relative;
`

export const TilesWrapper = styled.div`
  display: grid;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(4)};
  grid-template-rows: repeat(2, 1fr);

  ${media.sm} {
    grid-template-rows: auto;
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.md} {
    gap: ${sizes(6)};
    margin-bottom: ${sizes(6)};
  }
`

export const StyledSvgJoyTokenMonochrome24 = styled(SvgJoyTokenMonochrome24)`
  path {
    fill: ${cVar('colorText')};
  }
`
