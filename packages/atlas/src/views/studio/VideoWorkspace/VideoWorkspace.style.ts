import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgActionWarning } from '@/components/_icons'
import { cVar } from '@/styles'

export const StyledSvgWarning = styled(SvgActionWarning)`
  path {
    fill: ${cVar('colorCoreYellow100')};
  }
`

export const YellowText = styled(Text)`
  color: ${cVar('colorCoreYellow100')};
`
