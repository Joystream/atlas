import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as BackgroundPatternSVG } from '@/assets/bg-pattern.svg'
import { breakpoints, zIndex } from '@/shared/theme'

const PATTERN_OFFSET = {
  SMALL: '-150px',
  MEDIUM: '75px',
}

const StyledBackgroundPatternContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 90vh;
  overflow-x: hidden;
`

const StyledBackgroundPattern = styled(BackgroundPatternSVG)`
  display: none;
  position: absolute;
  z-index: ${zIndex.background};
  transform: scale(1.3);

  @media screen and (min-width: ${breakpoints.small}) {
    display: block;
    top: 73px;
    right: ${PATTERN_OFFSET.SMALL};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    right: ${PATTERN_OFFSET.MEDIUM};
  }
`

const BackgroundPattern: React.FC = () => {
  return (
    <StyledBackgroundPatternContainer>
      <StyledBackgroundPattern />
    </StyledBackgroundPatternContainer>
  )
}

export default BackgroundPattern
