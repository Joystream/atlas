import React, { useEffect, useState } from 'react'

import { SvgPlayerLoaderFallback } from '@/shared/icons'

import { OverlayBackground, StyledLottie } from './LoadingOverlay.style'

export const LoadingOverlay = () => {
  const [loadingAnimation, setLoadingAnimation] = useState<object>()

  useEffect(() => {
    import('@/shared/animations/player-loader.json').then(setLoadingAnimation)
  }, [])

  return (
    <OverlayBackground>
      {!loadingAnimation ? <SvgPlayerLoaderFallback /> : <StyledLottie play animationData={loadingAnimation} loop />}
    </OverlayBackground>
  )
}
