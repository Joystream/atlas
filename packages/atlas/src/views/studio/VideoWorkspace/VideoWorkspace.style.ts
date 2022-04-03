import styled from '@emotion/styled'

import { SvgActionWarning } from '@/components/_icons'
import { cVar } from '@/styles'

export const StyledSvgWarning = styled(SvgActionWarning)`
  path {
    fill: ${cVar('colorCoreYellow100')};
  }
`

export const YellowText = styled.span`
  color: ${cVar('colorCoreYellow100')};
`
