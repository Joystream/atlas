import styled from '@emotion/styled'
import React from 'react'

import { SvgBgPattern } from '@/shared/illustrations'
import { zIndex, transitions, media } from '@/shared/theme'

const PATTERN_OFFSET = {
  SMALL: '-150px',
  MEDIUM: '75px',
}

const StyledBackgroundPatternContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 90vh;
  overflow: hidden;
  z-index: ${zIndex.background};
  &.${transitions.names.fade}-exit-active {
    z-index: ${zIndex.farBackground};
  }
`

const StyledBackgroundPattern = styled(SvgBgPattern)`
  display: none;
  position: absolute;
  transform: scale(1.3);

  ${media.small} {
    display: block;
    top: 73px;
    right: ${PATTERN_OFFSET.SMALL};
  }

  ${media.medium} {
    right: ${PATTERN_OFFSET.MEDIUM};
  }
`

export const BackgroundPattern: React.FC = () => {
  return (
    <StyledBackgroundPatternContainer>
      <StyledBackgroundPattern />
    </StyledBackgroundPatternContainer>
  )
}
