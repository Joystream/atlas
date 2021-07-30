import React from 'react'

import { OverlayBackground } from './LoadingOverlay.style'

import { Loader } from '../../Loader'

type LoadingOverlayProps = {
  onPlay: () => void
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ onPlay }) => {
  return (
    <OverlayBackground onClick={onPlay}>
      <Loader variant="player" />
    </OverlayBackground>
  )
}
