import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

import { Text } from '../Text'
import { SvgActionCopy } from '../_icons'

export const MembershipInfoContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, auto);
  justify-items: center;
  gap: ${sizes(6)};
  ${media.sm} {
    gap: ${sizes(8)};
    grid-template-columns: repeat(2, auto);
    display: inline-grid;
  }
`
export const MembershipDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${media.sm} {
    align-items: unset;
  }
`
export const StyledText = styled(Text)`
  margin-top: ${sizes(2)};
  display: flex;
  align-items: center;
`
export const StyledSvgActionCopy = styled(SvgActionCopy)`
  cursor: pointer;
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
