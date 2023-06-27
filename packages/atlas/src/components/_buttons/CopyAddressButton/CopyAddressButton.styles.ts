import styled from '@emotion/styled'

import { SvgActionCheck, SvgActionCopy } from '@/assets/icons'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  width: fit-content;
`

export const StyledText = styled(Text)`
  min-width: 0;
  width: auto;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  background: none;
  max-height: 20px;
  cursor: pointer;
`
export const StyledSvgActionCopy = styled(SvgActionCopy)`
  margin-left: ${sizes(1)};

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
