import styled from '@emotion/styled'

import { SvgActionCheck, SvgActionCopy } from '@/assets/icons'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { cVar, sizes } from '@/styles'

export const StyledTooltip = styled(Tooltip)`
  :hover {
    button {
      color: ${cVar('colorCoreNeutral50')};
    }

    path {
      fill: ${cVar('colorCoreNeutral50')};
    }
  }
`

export const StyledText = styled(Text)`
  border: none;
  background: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: ${cVar('animationTransitionFast')};
`
export const StyledSvgActionCopy = styled(SvgActionCopy)`
  margin-left: ${sizes(2)};

  path {
    fill: ${cVar('colorCoreNeutral300')};
    transition: ${cVar('animationTransitionFast')};
  }
`
export const StyledSvgActionCheck = styled(SvgActionCheck)`
  margin-left: ${sizes(2)};
`
