import styled from '@emotion/styled'

import { SvgAtlasLogoShort } from '@/components/_illustrations'
import { cVar, sizes } from '@/styles'

export const StyledSvgAtlasLogoShort = styled(SvgAtlasLogoShort)`
  margin: ${sizes(6)} 0;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const Content = styled.div`
  margin-top: ${sizes(6)};
`
export const AdditionalSubtitle = styled.div`
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
`

export const Img = styled.img`
  width: 100%;
`
