import styled from '@emotion/styled'

import { SvgAppLogoShort } from '@/assets/logos'
import { cVar, sizes } from '@/styles'

export const StyledSvgAppLogoShort = styled(SvgAppLogoShort)`
  margin: ${sizes(6)} 0;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const FormFieldsWrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
`
