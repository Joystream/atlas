import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { IconWrapper } from '@/components/IconWrapper'
import { cVar, media, sizes } from '@/styles'

export const GridRowWrapper = styled.div`
  display: contents;
`

export const OverviewItem = styled.div<{ divider?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${sizes(4)};
  padding-bottom: ${sizes(4)};
  margin-bottom: ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};

  ${GridRowWrapper}:last-of-type > & {
    box-shadow: none;

    ${media.sm} {
      box-shadow: ${cVar('effectDividersBottom')};
    }
  }

  /* stylelint-disable */
  ${GridRowWrapper} > &:last-of-type {
    /* stylelint-enable */
    box-shadow: none;
  }
`

export const StyledIconWrapper = styled(IconWrapper)`
  path {
    fill: ${cVar('colorText')};
  }
`

export const OverviewTextContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: ${sizes(2)};
`

export const OverviewContainer = styled.div`
  margin-top: ${sizes(6)};
  display: grid;
  grid-template-columns: 1fr 1fr;

  ${media.sm} {
    grid-template-columns: 1fr;
  }
`

export const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  transition: color ${cVar('animationTransitionFast')};

  :hover {
    color: ${cVar('colorTextPrimary')};
  }
`
