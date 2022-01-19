import styled from '@emotion/styled'

import { SvgActionInformative } from '@/components/_icons'
import { cVar } from '@/styles'

export const StyledSvgActionInformative = styled(SvgActionInformative)`
  path {
    fill: ${cVar('colorTextMuted')};
  }
`
