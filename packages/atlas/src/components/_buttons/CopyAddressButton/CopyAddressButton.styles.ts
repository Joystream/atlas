import styled from '@emotion/styled'

import { SvgActionCheck, SvgActionCopy } from '@/assets/icons'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const StyledText = styled(Text)`
  border: none;
  background: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`
export const StyledSvgActionCopy = styled(SvgActionCopy)`
  margin-left: ${sizes(2)};

  path {
    fill: ${cVar('colorCoreNeutral300')};
    transition: ${cVar('animationTransitionFast')};
  }

  :hover {
    path {
      fill: ${cVar('colorCoreNeutral50')};
    }
  }
`
export const StyledSvgActionCheck = styled(SvgActionCheck)`
  margin-left: ${sizes(2)};
`
