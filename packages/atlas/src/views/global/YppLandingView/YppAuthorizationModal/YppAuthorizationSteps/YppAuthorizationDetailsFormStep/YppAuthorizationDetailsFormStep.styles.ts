import styled from '@emotion/styled'

import { SvgAtlasLogoShort } from '@/components/_illustrations'
import { cVar, sizes } from '@/styles'

export const StyledSvgAtlasLogoShort = styled(SvgAtlasLogoShort)`
  margin: ${sizes(6)} 0;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const FormFieldsWrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
`
