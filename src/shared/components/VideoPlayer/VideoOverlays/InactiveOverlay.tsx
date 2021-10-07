import styled from '@emotion/styled'
import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Loader } from '@/shared/components/Loader'

import { InnerContainer, OverlayBackground, OverlayContent, OverlayHeading } from './VideoOverlays.style'

export const InactiveOverlay: React.FC = () => {
  const smMatch = useMediaMatch('sm')
  return (
    <OverlayBackground>
      <InnerContainer>
        <StyledLoader variant={smMatch ? 'xlarge' : 'compact'} />
        <OverlayHeading variant={smMatch ? 'h3' : 'h5'}>
          This video hasn&apos;t finished uploading yet...
        </OverlayHeading>
        <OverlayContent variant={smMatch ? 'body1' : 'body2'} secondary>
          Please try again in a few minutes
        </OverlayContent>
      </InnerContainer>
    </OverlayBackground>
  )
}

export const StyledLoader = styled(Loader)`
  margin: 0 auto;
`
