import React, { useEffect, useState } from 'react'

import { OverlayBackground, StyledLottie, StyledSvgPlayerLoaderFallback } from './LoadingOverlay.style'

type LoadingOverlayProps = {
  onPlay: () => void
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ onPlay }) => {
  const [loadingAnimation, setLoadingAnimation] = useState<object>()

  useEffect(() => {
    import('@/shared/animations/player-loader.json').then(setLoadingAnimation)
  }, [])

  return (
    <OverlayBackground onClick={onPlay}>
      {!loadingAnimation ? (
        <StyledSvgPlayerLoaderFallback />
      ) : (
        <StyledLottie play animationData={loadingAnimation} loop />
      )}
    </OverlayBackground>
  )
}
