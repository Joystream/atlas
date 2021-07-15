import React, { useEffect, useState } from 'react'

import { OverlayBackground, StyledLottie, StyledSvgPlayerLoaderFallback } from './LoadingOverlay.style'

export const LoadingOverlay = () => {
  const [loadingAnimation, setLoadingAnimation] = useState<object>()

  useEffect(() => {
    import('@/shared/animations/player-loader.json').then(setLoadingAnimation)
  }, [])

  return (
    <OverlayBackground>
      {!loadingAnimation ? (
        <StyledSvgPlayerLoaderFallback />
      ) : (
        <StyledLottie play animationData={loadingAnimation} loop />
      )}
    </OverlayBackground>
  )
}
