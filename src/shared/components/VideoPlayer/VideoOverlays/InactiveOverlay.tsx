import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Loader } from '@/shared/components/Loader'

import { InnerContainer, OverlayBackground, OverlayContent, OverlayHeading } from './VideoOverlays.style'

export const InactiveOverlay: React.FC = () => {
  const xsMatch = useMediaMatch('xs')
  return (
    <OverlayBackground>
      <InnerContainer>
        <Loader variant={xsMatch ? 'xlarge' : 'large'} />
        <OverlayHeading variant={xsMatch ? 'h3' : 'h5'}>This video is processing...</OverlayHeading>
        <OverlayContent variant={xsMatch ? 'body1' : 'body2'} secondary>
          Wait a few moments to play it.
        </OverlayContent>
      </InnerContainer>
    </OverlayBackground>
  )
}
