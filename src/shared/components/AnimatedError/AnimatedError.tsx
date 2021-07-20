import React from 'react'
import Lottie from 'react-lottie-player'

import errorAnimation from '../../assets/animations/error.json'

export const AnimatedError: React.FC = () => {
  return <Lottie play loop={false} animationData={errorAnimation} />
}
